import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRoute, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as timeAgo, i as formatPrice, n as cn, r as formatPct } from "./utils-grVygcbN.mjs";
import { a as ArrowUp, c as ArrowDownRight, i as Languages, n as Pause, o as ArrowUpRight, r as Minus, s as ArrowDown, t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as QueryClientProvider, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-mstKIlkg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function AppQueryProvider({ children }) {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		retry: 1,
		staleTime: 8e3,
		refetchOnWindowFocus: false
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client,
		children
	});
}
function TooltipProvider({ delayDuration = 200, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration,
		...props
	});
}
var styles_default = "/assets/styles-CoIOiRSU.css";
var APP_NAME = "Argent Pulse";
var Route$1 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Live silver direction desk. Reads DXY, 10-year yields, gold and crude every 15 seconds to call the next silver move."
			},
			{
				name: "theme-color",
				content: "#09090b"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Instrument+Serif:wght@400;600&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppQueryProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getMarketSnapshot = createServerFn({ method: "POST" }).handler(createSsrRpc("0d44222733540a970cd5dafdf67f5a661a72907882d0c9193c44f8abb504ac0b"));
var copy = {
	en: {
		brand: "Argent Pulse",
		tag: "Silver direction desk",
		live: "Live tape",
		lastPrint: "Last print",
		sessionClosed: "Session closed",
		nextRefresh: "Next scan",
		silver: "Silver",
		comex: "COMEX SI",
		spot: "Spot XAG",
		session: "Session",
		m15: "15m",
		h1: "1h",
		h4: "4h",
		direction: "Next move",
		long: "Long",
		short: "Short",
		wait: "Wait",
		buy: "Buy silver",
		sell: "Sell silver",
		standAside: "Stand aside",
		conviction: "Conviction",
		quality: "Setup quality",
		high: "High",
		actionable: "Actionable",
		watch: "Watch",
		waitQuality: "No trade",
		aligned: "Macros aligned",
		formulaLong: "Long silver when DXY ↓  ·  10Y ↓  ·  Gold ↑  ·  Crude ↓",
		formulaShort: "Short silver when DXY ↑  ·  10Y ↑  ·  Gold ↓  ·  Crude ↑",
		macros: "Macro alignment",
		helpsLong: "Votes silver up",
		helpsShort: "Votes silver down",
		flat: "No vote",
		confirms: "Silver confirming",
		diverges: "Silver diverging",
		chase: "Move already extended — wait for a pullback",
		playbook: "Trade playbook",
		thesis: "Why this side",
		invalidation: "Invalidation",
		tactical: "How to take it",
		tape: "Signal tape",
		tapeEmpty: "Tape will record each change in bias as the scan runs.",
		chart: "Silver, last 5 sessions",
		ratio: "Gold / silver",
		ratioHint: "Falling ratio = silver outperforming gold",
		disclaimer: "Information desk, not a broker and not financial advice. Macros can stay mixed. Size small, define invalidation, never chase a finished move.",
		lang: "HI",
		ny: "New York",
		dxy: "DXY",
		dxyFull: "US Dollar Index",
		yield10y: "10Y",
		yield10yFull: "US 10-year yield",
		gold: "Gold",
		goldFull: "COMEX Gold",
		crude: "Crude",
		crudeFull: "WTI Crude",
		rule: "Playbook rule",
		scanEvery: "Scan every 15s",
		mcxNote: "MCX silver tracks COMEX + the rupee. This desk reads the global COMEX, dollar, yield and energy tape.",
		loading: "Reading the metals tape…",
		retry: "Scan again",
		error: "Live quotes are unreachable right now.",
		asOf: "As of",
		votes: "votes",
		of4: "of 4"
	},
	hi: {
		brand: "Argent Pulse",
		tag: "चांदी डायरेक्शन डेस्क",
		live: "लाइव टेप",
		lastPrint: "आखिरी प्रिंट",
		sessionClosed: "सेशन बंद",
		nextRefresh: "अगला स्कैन",
		silver: "चांदी",
		comex: "COMEX SI",
		spot: "स्पॉट XAG",
		session: "सेशन",
		m15: "15मि",
		h1: "1घं",
		h4: "4घं",
		direction: "अगला मूव",
		long: "लॉन्ग",
		short: "शॉर्ट",
		wait: "वेट",
		buy: "चांदी खरीदें",
		sell: "चांदी बेचें",
		standAside: "बाहर रहें",
		conviction: "कन्विक्शन",
		quality: "सेटअप क्वालिटी",
		high: "उच्च",
		actionable: "एक्शनेबल",
		watch: "वॉच",
		waitQuality: "कोई ट्रेड नहीं",
		aligned: "मैक्रो अलाइन्ड",
		formulaLong: "चांदी लॉन्ग जब DXY ↓  ·  10Y ↓  ·  सोना ↑  ·  क्रूड ↓",
		formulaShort: "चांदी शॉर्ट जब DXY ↑  ·  10Y ↑  ·  सोना ↓  ·  क्रूड ↑",
		macros: "मैक्रो अलाइनमेंट",
		helpsLong: "चांदी ऊपर",
		helpsShort: "चांदी नीचे",
		flat: "वोट नहीं",
		confirms: "चांदी कन्फर्म कर रही है",
		diverges: "चांदी डाइवर्ज कर रही है",
		chase: "मूव पहले ही चल चुका है — पुलबैक का इंतज़ार करें",
		playbook: "ट्रेड प्लेबुक",
		thesis: "यह साइड क्यों",
		invalidation: "अमान्यता",
		tactical: "कैसे लें",
		tape: "सिग्नल टेप",
		tapeEmpty: "स्कैन चलते ही बायस बदलने पर टेप रिकॉर्ड होगा।",
		chart: "चांदी, पिछले 5 सेशन",
		ratio: "सोना / चांदी",
		ratioHint: "अनुपात गिरे तो चांदी सोने से बेहतर चल रही है",
		disclaimer: "यह जानकारी डेस्क है, ब्रोकर नहीं, निवेश सलाह नहीं। मैक्रो मिक्स रह सकते हैं। छोटा साइज़, अमान्यता तय, पूरे हो चुके मूव के पीछे न भागें।",
		lang: "EN",
		ny: "न्यूयॉर्क",
		dxy: "DXY",
		dxyFull: "यूएस डॉलर इंडेक्स",
		yield10y: "10Y",
		yield10yFull: "यूएस 10-वर्ष यील्ड",
		gold: "सोना",
		goldFull: "COMEX गोल्ड",
		crude: "क्रूड",
		crudeFull: "WTI क्रूड",
		rule: "प्लेबुक नियम",
		scanEvery: "हर 15 सेकंड स्कैन",
		mcxNote: "MCX चांदी COMEX और रुपये को फॉलो करती है। यह डेस्क ग्लोबल COMEX, डॉलर, यील्ड और एनर्जी टेप पढ़ता है।",
		loading: "मेटल्स टेप पढ़ा जा रहा है…",
		retry: "फिर स्कैन करें",
		error: "लाइव कोट्स अभी नहीं मिल पा रहे।",
		asOf: "समय",
		votes: "वोट",
		of4: "में से 4"
	}
};
var lastSignature = "";
var useDesk = create()(persist((set, get) => ({
	locale: "en",
	setLocale: (locale) => set({ locale }),
	tape: [],
	record: (item) => {
		const signature = `${item.direction}:${item.quality}:${item.alignedCount}`;
		const prev = get().tape[0];
		const prevSig = prev ? `${prev.direction}:${prev.quality}:${prev.alignedCount}` : "";
		if (signature === lastSignature || signature === prevSig) return;
		lastSignature = signature;
		set({ tape: [{
			...item,
			id: `${item.at}-${item.direction}-${item.alignedCount}`
		}, ...get().tape].slice(0, 24) });
	}
}), { name: "argent-pulse-desk" }));
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0 transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			ghost: "text-fg hover:bg-surface-2",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
			subtle: "bg-surface-2 text-fg hover:bg-surface-2/80"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-lg bg-surface-2", className),
		...props
	});
}
var badgeVariants = cva("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium tracking-wide", {
	variants: { tone: {
		quiet: "bg-surface-2 text-muted",
		live: "bg-long/15 text-long",
		long: "bg-long/15 text-long",
		short: "bg-short/15 text-short",
		wait: "bg-caution/15 text-caution",
		accent: "bg-accent/12 text-accent"
	} },
	defaultVariants: { tone: "quiet" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
function DeskHeader({ locale, onToggleLocale, session, live, countdown }) {
	const t = copy[locale];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "border-b border-border px-4 py-3 sm:px-6 sm:py-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl tracking-tight text-fg sm:text-3xl",
					children: t.brand
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "truncate text-xs text-muted sm:text-sm",
					children: t.tag
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: live ? "live" : "quiet",
						children: [live ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "live-dot" }) : null, live ? t.live : t.lastPrint]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						tone: "quiet",
						className: "hidden tabular-nums sm:inline-flex",
						children: [
							t.nextRefresh,
							" ",
							countdown,
							"s"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "default",
						onClick: onToggleLocale,
						"aria-label": locale === "en" ? "हिंदी" : "English",
						className: "h-11",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Languages, {}), t.lang]
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-2 text-xs text-subtle",
			children: [
				session.nyTime,
				" · ",
				locale === "hi" ? session.labelHi : session.labelEn,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "tabular-nums sm:hidden",
					children: [
						" · ",
						countdown,
						"s"
					]
				})
			]
		})]
	});
}
function Sparkline({ series, className, tone = "accent" }) {
	if (series.length < 2) return null;
	const w = 120;
	const h = 36;
	const values = series.map((p) => p.v);
	const min = Math.min(...values);
	const span = Math.max(...values) - min || 1;
	const d = series.map((p, i) => {
		const x = i / (series.length - 1) * w;
		const y = h - (p.v - min) / span * 32 - 2;
		return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
	}).join(" ");
	const color = tone === "long" ? "var(--color-long)" : tone === "short" ? "var(--color-short)" : "var(--color-accent)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		viewBox: `0 0 ${w} ${h}`,
		className: cn("h-9 w-28 overflow-visible", className),
		"aria-hidden": true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
			d,
			fill: "none",
			stroke: color,
			strokeWidth: "1.6",
			strokeLinecap: "round"
		})
	});
}
function SilverHero({ locale, data }) {
	const t = copy[locale];
	const { silver, silverSpot, analysis } = data;
	const up = silver.sessionChangePct >= 0;
	const tone = analysis.direction === "wait" ? "accent" : analysis.direction === "long" ? "long" : "short";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
					children: t.comex
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-xl text-fg",
					children: t.silver
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
					series: silver.series,
					tone,
					className: "hidden sm:block"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-end gap-x-4 gap-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-4xl font-medium tabular-nums tracking-tight text-fg sm:text-5xl",
					children: ["$", formatPrice(silver.last, 3)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `pb-1 font-mono text-lg tabular-nums ${up ? "text-long" : "text-short"}`,
					children: formatPct(silver.sessionChangePct)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t.session,
						value: formatPct(silver.sessionChangePct),
						positive: silver.sessionChangePct >= 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t.m15,
						value: pctOrDash(silver.change15mPct),
						positive: (silver.change15mPct ?? 0) >= 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t.h1,
						value: pctOrDash(silver.change1hPct),
						positive: (silver.change1hPct ?? 0) >= 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: t.spot,
						value: silverSpot ? `$${formatPrice(silverSpot.last, 3)}` : "—"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs leading-relaxed text-subtle",
				children: t.mcxNote
			})
		]
	});
}
function pctOrDash(value) {
	if (value === null) return "—";
	return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
}
function Stat({ label, value, positive }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg bg-surface-2 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs uppercase tracking-wider text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: `mt-0.5 font-mono text-sm tabular-nums ${positive === void 0 ? "text-fg" : positive ? "text-long" : "text-short"}`,
			children: value
		})]
	});
}
function DirectionCall({ locale, data }) {
	const t = copy[locale];
	const { analysis } = data;
	const isLong = analysis.direction === "long";
	const isShort = analysis.direction === "short";
	const label = isLong ? t.long : isShort ? t.short : t.wait;
	const action = isLong ? t.buy : isShort ? t.sell : t.standAside;
	const Icon = isLong ? ArrowUpRight : isShort ? ArrowDownRight : Pause;
	const tone = isLong ? "long" : isShort ? "short" : "wait";
	const qualityLabel = analysis.quality === "high" ? t.high : analysis.quality === "actionable" ? t.actionable : analysis.quality === "watch" ? t.watch : t.waitQuality;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `rounded-xl p-5 shadow-[var(--shadow-border)] sm:p-6 ${isLong ? "bg-long/8" : isShort ? "bg-short/8" : "bg-surface"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
					children: t.direction
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone,
					children: qualityLabel
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `flex size-11 items-center justify-center rounded-lg ${isLong ? "bg-long/15 text-long" : isShort ? "bg-short/15 text-short" : "bg-surface-2 text-muted"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `font-display text-4xl tracking-tight sm:text-5xl ${isLong ? "text-long" : isShort ? "text-short" : "text-fg"}`,
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: action
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1.5 flex items-center justify-between text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.conviction }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono tabular-nums text-fg",
						children: [analysis.conviction, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 overflow-hidden rounded-full bg-surface-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `h-full rounded-full ${isLong ? "bg-long" : isShort ? "bg-short" : "bg-caution"}`,
						style: { width: `${analysis.conviction}%` }
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm text-muted",
				children: [
					analysis.alignedCount,
					" ",
					t.of4,
					" ",
					t.votes,
					analysis.silverConfirms ? ` · ${t.confirms}` : ` · ${t.diverges}`
				]
			}),
			analysis.chaseWarning ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-caution",
				children: t.chase
			}) : null
		]
	});
}
var ORDER = [
	"dxy",
	"yield10y",
	"gold",
	"crude"
];
function MacroGrid({ locale, data }) {
	const t = copy[locale];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-xl text-fg",
			children: t.macros
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted",
			children: t.rule
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: data.analysis.direction === "short" ? t.formulaShort : t.formulaLong
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4",
		children: ORDER.map((id) => {
			const inst = data.instruments[id];
			const signal = data.analysis.macros.find((m) => m.id === id);
			const name = id === "dxy" ? t.dxy : id === "yield10y" ? t.yield10y : id === "gold" ? t.gold : t.crude;
			const full = id === "dxy" ? t.dxyFull : id === "yield10y" ? t.yield10yFull : id === "gold" ? t.goldFull : t.crudeFull;
			const isYield = id === "yield10y";
			const vote = signal.silverVote;
			const MoveIcon = signal.instrumentMove === "up" ? ArrowUp : signal.instrumentMove === "down" ? ArrowDown : Minus;
			const price = isYield ? `${formatPrice(inst.last, 3)}%` : formatPrice(inst.last, id === "dxy" ? 3 : 2);
			const changeLabel = isYield ? `${inst.sessionChange >= 0 ? "+" : ""}${(inst.sessionChange * 100).toFixed(1)} bp` : formatPct(signal.changePct);
			const reason = locale === "hi" ? signal.reasonHi : signal.reasonEn;
			const voteLabel = vote === "long" ? t.helpsLong : vote === "short" ? t.helpsShort : t.flat;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.14em] text-muted",
							children: name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: full
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							tone: vote === "long" ? "long" : vote === "short" ? "short" : "quiet",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveIcon, { className: "size-3" }), signal.timeframe]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-end justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-2xl tabular-nums text-fg",
							children: isYield ? price : id === "gold" || id === "crude" ? `$${price}` : price
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkline, {
							series: inst.series,
							tone: vote === "long" ? "long" : vote === "short" ? "short" : "accent",
							className: "h-8 w-20"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: `mt-1 font-mono text-sm tabular-nums ${signal.changePct > 0 ? "text-long" : signal.changePct < 0 ? "text-short" : "text-muted"}`,
						children: [
							changeLabel,
							" · ",
							signal.timeframe
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs font-medium text-fg",
						children: voteLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted",
						children: reason
					})
				]
			}, id);
		})
	})] });
}
function SilverChart({ locale, data }) {
	const t = copy[locale];
	const rows = (0, import_react.useMemo)(() => data.silver.series.map((p) => ({
		t: p.t,
		v: Number(p.v.toFixed(3))
	})), [data.silver.series]);
	const stroke = data.analysis.direction === "short" ? "var(--color-short)" : data.analysis.direction === "long" ? "var(--color-long)" : "var(--color-accent)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-3 font-display text-xl text-fg",
			children: t.chart
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-56 w-full sm:h-72",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data: rows,
					margin: {
						top: 8,
						right: 8,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "silverFill",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: stroke,
								stopOpacity: .28
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: stroke,
								stopOpacity: 0
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							stroke: "var(--color-border)",
							vertical: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "t",
							tickFormatter: formatTick,
							tick: {
								fill: "var(--color-subtle)",
								fontSize: 11
							},
							axisLine: false,
							tickLine: false,
							minTickGap: 28
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							domain: ["auto", "auto"],
							tickFormatter: (v) => formatPrice(v, 2),
							tick: {
								fill: "var(--color-subtle)",
								fontSize: 11
							},
							axisLine: false,
							tickLine: false,
							width: 56
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTip, {}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "v",
							stroke,
							fill: "url(#silverFill)",
							strokeWidth: 1.6,
							isAnimationActive: false
						})
					]
				})
			})
		})]
	});
}
function formatTick(t) {
	return new Intl.DateTimeFormat("en-US", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23"
	}).format(t);
}
function ChartTip({ active, payload }) {
	if (!active || !payload?.[0]) return null;
	const row = payload[0].payload;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface-2 px-3 py-2 text-xs text-fg shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-mono tabular-nums",
			children: ["$", formatPrice(row.v, 3)]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-subtle",
			children: formatTick(row.t)
		})]
	});
}
function Playbook({ locale, data }) {
	const t = copy[locale];
	const { analysis, goldSilverRatio } = data;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "grid gap-3 lg:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: t.thesis,
				children: locale === "hi" ? analysis.thesisHi : analysis.thesisEn
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: t.invalidation,
				children: locale === "hi" ? analysis.invalidationHi : analysis.invalidationEn
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: t.tactical,
				children: [locale === "hi" ? analysis.tacticalHi : analysis.tacticalEn, goldSilverRatio ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "mt-3 block text-xs text-subtle",
					children: [
						t.ratio,
						":",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono tabular-nums text-fg",
							children: formatPrice(goldSilverRatio, 2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block",
							children: t.ratioHint
						})
					]
				}) : null]
			})
		]
	});
}
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm leading-relaxed text-fg",
			children
		})]
	});
}
function SignalTape({ locale, tape }) {
	const t = copy[locale];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-xl text-fg",
			children: t.tape
		}), tape.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: t.tapeEmpty
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-3 divide-y divide-border",
			children: tape.map((item) => {
				const dir = item.direction === "long" ? t.long : item.direction === "short" ? t.short : t.wait;
				const color = item.direction === "long" ? "text-long" : item.direction === "short" ? "text-short" : "text-caution";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 py-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `font-medium ${color}`,
						children: dir
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-subtle",
						children: [
							item.alignedCount,
							"/4 · ",
							item.conviction,
							"% · $",
							formatPrice(item.silverLast, 3)
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "shrink-0 font-mono text-xs tabular-nums text-muted",
						children: timeAgo(item.at)
					})]
				}, item.id);
			})
		})]
	});
}
var INTERVAL = 15e3;
function DeskApp({ initial }) {
	const locale = useDesk((s) => s.locale);
	const setLocale = useDesk((s) => s.setLocale);
	const tape = useDesk((s) => s.tape);
	const record = useDesk((s) => s.record);
	const t = copy[locale];
	const [countdown, setCountdown] = (0, import_react.useState)(15);
	const query = useQuery({
		queryKey: ["market-snapshot"],
		queryFn: () => getMarketSnapshot(),
		initialData: initial,
		refetchInterval: INTERVAL,
		refetchIntervalInBackground: true
	});
	const data = query.data;
	(0, import_react.useEffect)(() => {
		if (!data || !data.ok) return;
		record({
			at: data.fetchedAt,
			direction: data.analysis.direction,
			quality: data.analysis.quality,
			conviction: data.analysis.conviction,
			alignedCount: data.analysis.alignedCount,
			silverLast: data.silver.last
		});
	}, [data, record]);
	(0, import_react.useEffect)(() => {
		setCountdown(15);
		const id = window.setInterval(() => {
			setCountdown((n) => n <= 1 ? 15 : n - 1);
		}, 1e3);
		return () => window.clearInterval(id);
	}, [data?.fetchedAt]);
	if (query.isLoading && !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskSkeleton, {});
	if (!data || !data.ok) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center gap-4 px-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: t.brand
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: data && !data.ok ? data.error : t.error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => query.refetch(),
				children: t.retry
			})
		]
	});
	const live = data.session.metalsOpen && data.silver.staleMs < 9e5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskHeader, {
			locale,
			onToggleLocale: () => setLocale(locale === "en" ? "hi" : "en"),
			session: data.session,
			live,
			countdown
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto flex max-w-6xl flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6 stagger-in",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SilverHero, {
						locale,
						data
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectionCall, {
						locale,
						data
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroGrid, {
					locale,
					data
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SilverChart, {
					locale,
					data
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Playbook, {
					locale,
					data
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalTape, {
					locale,
					tape
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "pb-8 text-center text-xs leading-relaxed text-subtle",
					children: t.disclaimer
				})
			]
		})]
	});
}
function DeskSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mb-4 h-16 w-full rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto grid max-w-6xl gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 rounded-xl" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-4 grid max-w-6xl grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" })
				]
			})
		]
	});
}
var $$splitComponentImporter = () => import("./routes-B27osN4p.mjs");
var Route = createFileRoute("/")({
	loader: () => getMarketSnapshot(),
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	pendingComponent: DeskSkeleton
});
var rootRouteChildren = { IndexRoute: Route.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$1
}) };
var routeTree = Route$1._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route as n, DeskApp as r, router_exports as t };
