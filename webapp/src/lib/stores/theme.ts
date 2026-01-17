import { browser } from '$app/environment';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'agents.theme';
export type Theme = 'light' | 'dark';

const getInitialTheme = (): Theme => {
	if (!browser) return 'light';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') return stored;
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const theme = writable<Theme>(getInitialTheme());

export const setTheme = (value: Theme) => theme.set(value);

export const toggleTheme = () => {
	theme.update((value) => (value === 'dark' ? 'light' : 'dark'));
};

theme.subscribe((value) => {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, value);
	document.documentElement.dataset.theme = value;
});
