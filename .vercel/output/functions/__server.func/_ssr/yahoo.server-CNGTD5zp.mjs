//#region node_modules/.nitro/vite/services/ssr/assets/yahoo.server-CNGTD5zp.js
var UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
var SYMBOLS = {
	silver: {
		symbol: "SI=F",
		name: "COMEX Silver",
		digits: 3
	},
	gold: {
		symbol: "GC=F",
		name: "COMEX Gold",
		digits: 2
	},
	crude: {
		symbol: "CL=F",
		name: "WTI Crude",
		digits: 2
	},
	dxy: {
		symbol: "DX-Y.NYB",
		name: "US Dollar Index",
		digits: 3
	},
	yield10y: {
		symbol: "^TNX",
		name: "US 10-year yield",
		digits: 3
	}
};
async function fetchJson(url, timeoutMs) {
	const res = await fetch(url, {
		headers: {
			"User-Agent": UA,
			Accept: "application/json"
		},
		signal: AbortSignal.timeout(timeoutMs)
	});
	if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
	return res.json();
}
async function fetchYahooInstrument(id) {
	const { symbol, name } = SYMBOLS[id];
	const encoded = encodeURIComponent(symbol);
	const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?interval=5m&range=5d&includePrePost=true`;
	let data;
	try {
		data = await fetchJson(url, 8e3);
	} catch {
		data = await fetchJson(`https://query2.finance.yahoo.com/v8/finance/chart/${encoded}?interval=5m&range=5d&includePrePost=true`, 8e3);
	}
	const result = data.chart?.result?.[0];
	if (!result) throw new Error(`No chart for ${symbol}`);
	const closes = result.indicators?.quote?.[0]?.close ?? [];
	const stamps = result.timestamp ?? [];
	const series = [];
	for (let i = 0; i < stamps.length; i++) {
		const v = closes[i];
		const t = stamps[i];
		if (typeof v === "number" && Number.isFinite(v) && typeof t === "number") series.push({
			t: t * 1e3,
			v
		});
	}
	if (series.length < 4) throw new Error(`Sparse series for ${symbol}`);
	const meta = result.meta ?? {};
	const lastFromMeta = meta.regularMarketPrice;
	const lastBar = series[series.length - 1];
	const last = typeof lastFromMeta === "number" && Number.isFinite(lastFromMeta) ? lastFromMeta : lastBar.v;
	const asOf = typeof lastFromMeta === "number" && last !== lastBar.v ? Date.now() : lastBar.t;
	if (Math.abs(last - lastBar.v) / lastBar.v > 5e-5) series.push({
		t: asOf,
		v: last
	});
	const previousClose = meta.previousClose ?? meta.chartPreviousClose ?? series[0].v;
	const sessionChange = last - previousClose;
	return {
		id,
		symbol,
		name,
		last,
		previousClose,
		sessionChange,
		sessionChangePct: previousClose !== 0 ? sessionChange / previousClose * 100 : 0,
		change15mPct: pctSince(series, last, 9e5),
		change1hPct: pctSince(series, last, 36e5),
		change4hPct: pctSince(series, last, 144e5),
		series: downsample(series, 180),
		asOf,
		staleMs: Math.max(0, Date.now() - asOf)
	};
}
function pctSince(series, last, windowMs) {
	const cutoff = (series[series.length - 1]?.t ?? Date.now()) - windowMs;
	let ref;
	for (let i = series.length - 1; i >= 0; i--) {
		const p = series[i];
		if (p.t <= cutoff) {
			ref = p;
			break;
		}
	}
	if (!ref) ref = series[0];
	if (!ref || ref.v === 0) return null;
	if ((series[series.length - 1]?.t ?? 0) - ref.t < windowMs * .55) return null;
	return (last - ref.v) / ref.v * 100;
}
function downsample(series, max) {
	if (series.length <= max) return series;
	const out = [];
	const step = (series.length - 1) / (max - 1);
	for (let i = 0; i < max; i++) {
		const idx = Math.round(i * step);
		out.push(series[idx]);
	}
	return out;
}
async function fetchSpotMetals() {
	const read = async (path) => {
		try {
			const data = await fetchJson(`https://api.gold-api.com/price/${path}`, 6e3);
			if (typeof data.price !== "number") return null;
			const asOf = data.updatedAt ? Date.parse(data.updatedAt) : Date.now();
			return {
				last: data.price,
				asOf: Number.isFinite(asOf) ? asOf : Date.now(),
				source: "spot"
			};
		} catch {
			return null;
		}
	};
	const [silver, gold] = await Promise.all([read("XAG"), read("XAU")]);
	return {
		silver,
		gold
	};
}
function nyClock(now = /* @__PURE__ */ new Date()) {
	const fmt = new Intl.DateTimeFormat("en-US", {
		timeZone: "America/New_York",
		weekday: "short",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
		timeZoneName: "short"
	});
	const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]));
	const weekday = parts.weekday ?? "";
	const hour = Number(parts.hour ?? "0");
	const minute = Number(parts.minute ?? "0");
	const minutes = hour * 60 + minute;
	const metalsOpen = !(weekday === "Sat" || weekday === "Sun" && minutes < 1080) && !(weekday === "Fri" && minutes >= 1020) && !(minutes >= 1020 && minutes < 1080);
	return {
		metalsOpen,
		nyTime: `${weekday} ${parts.hour}:${parts.minute} ${parts.timeZoneName ?? "ET"}`,
		labelEn: metalsOpen ? "COMEX session open" : "COMEX session closed",
		labelHi: metalsOpen ? "COMEX सेशन खुला" : "COMEX सेशन बंद"
	};
}
//#endregion
export { fetchSpotMetals, fetchYahooInstrument, nyClock };
