import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/utils-grVygcbN.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function clamp(n, min, max) {
	return Math.min(max, Math.max(min, n));
}
function formatPrice(value, digits) {
	return value.toLocaleString("en-US", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	});
}
function formatPct(value, digits = 2) {
	return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
}
function timeAgo(ms, now = Date.now()) {
	const s = Math.max(0, Math.round((now - ms) / 1e3));
	if (s < 5) return "just now";
	if (s < 60) return `${s}s ago`;
	const m = Math.round(s / 60);
	if (m < 60) return `${m}m ago`;
	const h = Math.round(m / 60);
	if (h < 48) return `${h}h ago`;
	return `${Math.round(h / 24)}d ago`;
}
//#endregion
export { timeAgo as a, formatPrice as i, cn as n, formatPct as r, clamp as t };
