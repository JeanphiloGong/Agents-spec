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
		content?: string;
	};

	type TocItem = { level: number; text: string };
	type Props = {
		doc: DocItem | null;
		html: string;
		toc: TocItem[];
		related: DocItem[];
		isLoading: boolean;
	};

	let { doc, html, toc, related, isLoading } = $props<Props>();
</script>

<div class="grid gap-5 lg:grid-cols-3">
	<div class="card min-h-[300px] p-6 lg:col-span-2">
		{#if isLoading}
			<div class="grid gap-3">
				<div class="skeleton-line h-5 w-1/2"></div>
				<div class="skeleton-line h-3"></div>
				<div class="skeleton-line h-3 w-4/5"></div>
			</div>
		{:else if doc}
			<h2 class="mb-3 mt-0 text-2xl font-semibold text-slate-900">{doc.title}</h2>
			{#if html}
				<article
					class="prose prose-stone max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-p:leading-7 prose-a:text-orange-600 prose-a:no-underline prose-code:rounded prose-code:bg-orange-50 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-2xl prose-pre:bg-orange-50"
				>
					{@html html}
				</article>
			{:else}
				<p class="m-0 text-sm text-slate-500">该文档暂无正文内容。</p>
			{/if}
		{:else}
			<h2 class="mb-3 mt-0 text-2xl font-semibold text-slate-900">选择一篇文档</h2>
			<p class="m-0 text-sm text-slate-500 leading-relaxed">
				点击列表中的 AGENTS.md 查看详细内容与下载入口。
			</p>
		{/if}
	</div>
	<aside class="card grid gap-4 p-5 lg:col-span-1">
		{#if isLoading}
			<div class="grid gap-2">
				<div class="skeleton-line h-3 w-2/5"></div>
				<div class="skeleton-line h-3 w-3/5"></div>
				<div class="skeleton-line h-3 w-1/2"></div>
			</div>
		{:else if doc}
			{#if toc?.length}
				<div class="grid gap-2">
					<div class="text-xs uppercase tracking-[0.2em] text-slate-500">目录</div>
					<div class="space-y-1 text-xs text-slate-500">
						{#each toc as item}
							<a
								class="block transition hover:text-slate-700"
								href={`#${item.text.replace(/\s+/g, '-').toLowerCase()}`}
							>
								{'·'.repeat(Math.max(0, item.level - 1))} {item.text}
							</a>
						{/each}
					</div>
				</div>
			{/if}
			<div>
				<div class="text-xs uppercase tracking-[0.2em] text-slate-500">部门</div>
				<div class="text-sm font-semibold text-slate-900">{doc.dept}</div>
			</div>
			<div>
				<div class="text-xs uppercase tracking-[0.2em] text-slate-500">角色</div>
				<div class="text-sm font-semibold text-slate-900">{doc.role}</div>
			</div>
			<div>
				<div class="text-xs uppercase tracking-[0.2em] text-slate-500">更新时间</div>
				{#if doc.updated_at}
					<div class="text-sm font-semibold text-slate-900">
						{new Date(doc.updated_at).toLocaleString()}
					</div>
				{:else}
					<div class="text-sm text-slate-500">-</div>
				{/if}
			</div>
			<div class="flex flex-wrap gap-2">
				<span class="tag">{doc.type}</span>
				{#each doc.tags ?? [] as tag}
					<span class="tag">{tag}</span>
				{/each}
			</div>
			<a
				class="btn btn-primary"
				id="download"
				href={`http://localhost:7070/api/docs/${doc.id}/download`}
			>
				下载原文
			</a>
			<div class="flex flex-wrap gap-2">
				<button
					class="btn btn-ghost"
					type="button"
					onclick={() => navigator.clipboard?.writeText(location.href)}
				>
					复制链接
				</button>
				<button
					class="btn btn-ghost"
					type="button"
					onclick={() => navigator.clipboard?.writeText(doc.content ?? '')}
				>
					复制内容
				</button>
			</div>
			{#if related?.length}
				<div class="grid gap-2">
					<div class="text-xs uppercase tracking-[0.2em] text-slate-500">相关推荐</div>
					<div class="grid gap-2">
						{#each related as item}
							<div class="rounded-xl border border-black/10 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700">
								{item.title}
							</div>
						{/each}
					</div>
				</div>
			{/if}
		{:else}
			<div class="text-sm text-slate-500">请选择一篇文档以查看元信息。</div>
		{/if}
	</aside>
</div>
