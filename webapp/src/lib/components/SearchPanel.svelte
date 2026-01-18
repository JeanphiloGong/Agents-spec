<script lang="ts">
	import { formatNumber, locale, t } from '$lib/i18n';

	type QueryState = {
		q: string;
		dept: string;
		role: string;
		type: string;
		tags: string;
		sort: string;
		page: string;
		size: string;
		id: string;
	};

	type Props = {
		query: QueryState;
		tagEntries: [string, number][];
		suggestionTitles: string[];
		suggestionTags: string[];
		suggestionLoading: boolean;
		suggestionError: string;
		deptOptions: string[];
		roleOptions: string[];
		isSearching: boolean;
		onSubmit: (event: SubmitEvent) => void;
		onClear: () => void;
		onSuggest: (value: string) => void;
		onSelectTitle: (value: string) => void;
		onSelectTag: (value: string) => void;
	};

	let {
		query,
		tagEntries,
		suggestionTitles,
		suggestionTags,
		suggestionLoading,
		suggestionError,
		deptOptions,
		roleOptions,
		isSearching,
		onSubmit,
		onClear,
		onSuggest,
		onSelectTitle,
		onSelectTag
	} = $props<Props>();

	let filtersOpen = $state(false);
	let autoOpened = $state(false);

	$effect(() => {
		const hasFilters = Boolean(query.dept || query.role || query.type || query.tags);
		if (!hasFilters) {
			filtersOpen = false;
			autoOpened = false;
			return;
		}
		if (!autoOpened) {
			filtersOpen = true;
			autoOpened = true;
		}
	});
</script>

<form class="grid gap-4" onsubmit={onSubmit} role="search">
	<div class="grid gap-2">
		<label class="text-sm font-semibold text-ink" for="search-input">
			{$t('search.label')}
		</label>
		<div class="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
			<input
				id="search-input"
				name="q"
				type="search"
				value={query.q}
				placeholder={$t('search.placeholder')}
				class="input-field"
				aria-label={$t('aria.searchInput')}
				data-testid="search-input"
				oninput={(event) => onSuggest((event.target as HTMLInputElement).value)}
			/>
			<div class="flex flex-wrap gap-2">
				<button class="btn btn-primary" type="submit" disabled={isSearching} data-testid="search-submit">
					{$t('search.submit')}
				</button>
				<button class="btn btn-ghost" type="button" onclick={onClear} data-testid="search-clear">
					{$t('search.clear')}
				</button>
			</div>
		</div>
	</div>

	<details class="rounded-2xl border border-border/70 bg-surface/70 p-4" bind:open={filtersOpen}>
		<summary class="cursor-pointer text-sm font-semibold text-ink">
			{$t('search.filters')}
		</summary>
		<div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<label class="grid gap-2 text-sm font-semibold text-ink">
				{$t('filters.department')}
				<input
					name="dept"
					value={query.dept}
					list="dept-options"
					class="input-field"
				/>
			</label>
			<label class="grid gap-2 text-sm font-semibold text-ink">
				{$t('filters.role')}
				<input name="role" value={query.role} list="role-options" class="input-field" />
			</label>
			<label class="grid gap-2 text-sm font-semibold text-ink">
				{$t('filters.type')}
				<select name="type" value={query.type} class="input-field">
					<option value="">{$t('filters.any')}</option>
					<option value="spec">{$t('filters.typeSpec')}</option>
					<option value="template">{$t('filters.typeTemplate')}</option>
					<option value="tutorial">{$t('filters.typeTutorial')}</option>
				</select>
			</label>
			<label class="grid gap-2 text-sm font-semibold text-ink">
				{$t('filters.tags')}
				<input
					name="tags"
					value={query.tags}
					placeholder={$t('filters.tagsPlaceholder')}
					class="input-field"
				/>
			</label>
			<label class="grid gap-2 text-sm font-semibold text-ink">
				{$t('filters.sort')}
				<select name="sort" value={query.sort} class="input-field">
					<option value="updated">{$t('filters.sortUpdated')}</option>
					<option value="name">{$t('filters.sortName')}</option>
				</select>
			</label>
			<label class="grid gap-2 text-sm font-semibold text-ink">
				{$t('filters.pageSize')}
				<select name="size" value={query.size} class="input-field">
					<option value="10">10</option>
					<option value="20">20</option>
					<option value="50">50</option>
				</select>
			</label>
		</div>
	</details>

	<datalist id="dept-options">
		{#each deptOptions as dept}
			<option value={dept} />
		{/each}
	</datalist>
	<datalist id="role-options">
		{#each roleOptions as role}
			<option value={role} />
		{/each}
	</datalist>

	{#if tagEntries.length}
		<div class="grid gap-2">
			<div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
				{$t('tags.popular')}
			</div>
			<div class="flex flex-wrap gap-2">
				{#each tagEntries as [tag, count]}
					<button
						class="chip"
						type="button"
						onclick={() => onSelectTag(tag)}
						aria-label={`${tag} (${formatNumber(count, $locale)})`}
					>
						<span>{tag}</span>
						<span class="text-xs text-muted">{formatNumber(count, $locale)}</span>
					</button>
				{/each}
			</div>
		</div>
	{/if}

	{#if suggestionLoading}
		<div class="text-sm text-muted" role="status" aria-live="polite">
			{$t('suggestions.loading')}
		</div>
	{:else if suggestionError}
		<div class="flex items-center gap-2 text-sm font-semibold text-danger" role="alert">
			<span aria-hidden="true">!</span>
			<span>{$t('states.errorSuggestions')}</span>
		</div>
	{:else if suggestionTitles.length || suggestionTags.length}
		<div class="grid gap-3">
			{#if suggestionTitles.length}
				<div class="grid gap-2">
					<div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
						{$t('suggestions.title')}
					</div>
					<div class="grid max-h-48 gap-2 overflow-auto pr-1">
						{#each suggestionTitles as title}
							<button
								class="w-full rounded-xl border border-border/70 bg-surface/80 px-3 py-2 text-left text-sm text-ink transition hover:-translate-y-0.5 hover:border-border"
								type="button"
								onclick={() => onSelectTitle(title)}
							>
								{title}
							</button>
						{/each}
					</div>
				</div>
			{/if}
			{#if suggestionTags.length}
				<div class="grid gap-2">
					<div class="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
						{$t('suggestions.tag')}
					</div>
					<div class="flex flex-wrap gap-2">
						{#each suggestionTags as tag}
							<button class="chip" type="button" onclick={() => onSelectTag(tag)}>
								{tag}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}
</form>
