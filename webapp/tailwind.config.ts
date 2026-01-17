import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
				surface: 'rgb(var(--color-surface) / <alpha-value>)',
				ink: 'rgb(var(--color-ink) / <alpha-value>)',
				muted: 'rgb(var(--color-muted) / <alpha-value>)',
				border: 'rgb(var(--color-border) / <alpha-value>)',
				accent: 'rgb(var(--color-accent) / <alpha-value>)',
				'accent-strong': 'rgb(var(--color-accent-strong) / <alpha-value>)',
				'accent-soft': 'rgb(var(--color-accent-soft) / <alpha-value>)',
				danger: 'rgb(var(--color-danger) / <alpha-value>)',
				overlay: 'rgb(var(--color-overlay) / <alpha-value>)'
			},
			fontFamily: {
				display: ['Fraunces', 'serif'],
				body: ['Space Grotesk', 'system-ui', 'sans-serif']
			},
			boxShadow: {
				soft: '0 20px 40px -24px rgba(15, 23, 42, 0.35)',
				lift: '0 30px 70px -30px rgba(15, 23, 42, 0.45)'
			},
			borderRadius: {
				xl: '1.25rem',
				'2xl': '1.5rem'
			},
			spacing: {
				section: '4.5rem',
				gutter: '1.5rem',
				card: '1.25rem'
			},
			maxWidth: {
				content: '72rem',
				prose: '65ch'
			}
		}
	}
};

export default config;
