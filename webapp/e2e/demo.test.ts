import { expect, test } from '@playwright/test';

const docItem = {
	id: 'doc-1',
	title: 'Frontend Spec',
	path: 'agent-specs/engineering/frontend/AGENTS.md',
	dept: 'engineering',
	role: 'frontend',
	type: 'spec',
	tags: ['frontend', 'svelte'],
	updated_at: '2026-01-16T09:00:00+08:00',
	excerpt: 'A <mark>spec</mark> for frontend workflows.'
};

test('search and open detail flow', async ({ page }) => {
	await page.route('**/api/docs?*', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ total: 1, items: [docItem] })
		});
	});

	await page.route('**/api/tags', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ tags: { frontend: 8, svelte: 5 } })
		});
	});

	await page.route('**/api/stats', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ total: 1, recent: [docItem] })
		});
	});

	await page.route('**/api/suggestions*', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ titles: ['Frontend Spec'], tags: ['frontend'] })
		});
	});

	await page.route('**/api/docs/doc-1', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				doc: {
					...docItem,
					content: '# Frontend Spec\n\n## Overview\nContent body.'
				},
				toc: [
					{ level: 1, text: 'Frontend Spec' },
					{ level: 2, text: 'Overview' }
				]
			})
		});
	});

	await page.route('**/api/related?id=doc-1', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				items: [
					{
						id: 'doc-2',
						title: 'UI Designer',
						path: 'agent-specs/design/ui-designer/AGENTS.md',
						dept: 'design',
						role: 'ui-designer',
						type: 'spec',
						tags: ['design'],
						updated_at: '2026-01-12T09:00:00+08:00',
						excerpt: '...'
					}
				]
			})
		});
	});

	await page.goto('/');
	await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

	await page.getByTestId('search-input').fill('frontend');
	await page.getByTestId('search-submit').click();

	await expect(page.getByTestId('doc-list')).toBeVisible();
	await page.getByTestId('doc-card').first().click();

	await expect(page.getByTestId('detail-dialog')).toBeVisible();
	await expect(page.getByRole('heading', { level: 2 })).toContainText('Frontend Spec');
});
