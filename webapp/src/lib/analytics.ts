import { browser } from '$app/environment';

const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;

type AnalyticsEvent = 'search_submitted' | 'doc_opened' | 'doc_downloaded';

type AnalyticsPayload = Record<string, string | number | boolean | null>;

export const trackEvent = async (name: AnalyticsEvent, payload: AnalyticsPayload = {}) => {
	if (!browser || !endpoint) return;
	try {
		await fetch(endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, payload, ts: Date.now() }),
			keepalive: true
		});
	} catch {
	}
};
