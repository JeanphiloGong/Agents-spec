<script lang="ts">
	type DocItem = {
		id: string;
		title: string;
		path: string;
		dept: string;
		role: string;
		type: string;
		tags: string[];
		updated_at: string;
		excerpt: string;
	};

	type Props = {
		items: DocItem[];
		error: string;
		isLoading: boolean;
		onSelect: (doc: DocItem) => void;
	};

	let { items, error, isLoading, onSelect } = $props<Props>();
</script>

<div class="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
	{#if error}
		<div class="card p-4 text-sm text-red-700">
			{error}
		</div>
	{:else if isLoading}
		<div class="card grid gap-3 p-4">
			<div class="skeleton-line h-4 w-3/5"></div>
			<div class="skeleton-line h-3"></div>
			<div class="skeleton-line h-3 w-4/5"></div>
		</div>
		<div class="card grid gap-3 p-4">
			<div class="skeleton-line h-4 w-1/2"></div>
			<div class="skeleton-line h-3"></div>
			<div class="skeleton-line h-3 w-3/4"></div>
		</div>
	{:else if items?.length}
		{#each items as item, index}
			<button
				class="card card-hover fade-up grid cursor-pointer gap-3 p-5 text-left"
				type="button"
				style={`animation-delay:${index * 60}ms;`}
				onclick={() => onSelect(item)}
				aria-label={`查看 ${item.title}`}
			>
				<div class="flex items-start justify-between gap-3">
					<div>
						<div class="text-base font-semibold text-slate-900">{item.title}</div>
						<div class="text-xs text-slate-500">{item.path}</div>
					</div>
					<span class="tag">{item.type}</span>
				</div>
				<p class="m-0 text-sm text-slate-600 leading-relaxed">
					{@html item.excerpt}
				</p>
				<div class="flex flex-wrap gap-2">
					<span class="tag">{item.dept}</span>
					<span class="tag">{item.role}</span>
					{#each item.tags?.slice(0, 3) ?? [] as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
			</button>
		{/each}
	{:else}
		<div class="card p-4 text-sm text-slate-500">
			暂无匹配的 AGENTS.md 结果。
		</div>
	{/if}
</div>
