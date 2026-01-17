import { browser } from '$app/environment';
import { derived, writable } from 'svelte/store';

const STORAGE_KEY = 'agents.locale';

const supportedLocales = ['zh-CN', 'en'] as const;
export type Locale = (typeof supportedLocales)[number];

const translations: Record<Locale, Record<string, string>> = {
	'zh-CN': {
		'app.title': 'AGENTS · 文档库',
		'app.description': '统一索引、搜索、筛选、下载 AGENTS.md，面向多智能体协作的文档枢纽。',
		'brand.title': 'AGENTS',
		'brand.subtitle': 'AGENTS Library · Search · Download',
		'hero.heading': 'AGENTS 项目文档中心',
		'hero.subheading': '快速检索、筛选与下载标准化协作文档。',
		'controls.language': '语言',
		'controls.theme': '主题',
		'controls.themeLight': '浅色',
		'controls.themeDark': '深色',
		'controls.skipToContent': '跳转到内容',
		'locale.zh': '简体中文',
		'locale.en': 'English',
		'search.label': '搜索文档',
		'search.placeholder': '输入标题、内容或标签关键词',
		'search.submit': '搜索',
		'search.clear': '清空',
		'search.filters': '筛选条件',
		'search.filtersHint': '展开高级筛选',
		'filters.department': '部门',
		'filters.role': '角色',
		'filters.type': '类型',
		'filters.any': '全部',
		'filters.tags': '标签',
		'filters.tagsPlaceholder': '用逗号分隔多个标签',
		'filters.sort': '排序',
		'filters.pageSize': '每页数量',
		'filters.sortUpdated': '最近更新',
		'filters.sortName': '名称',
		'filters.typeSpec': '规范',
		'filters.typeTemplate': '模板',
		'filters.typeTutorial': '教程',
		'tags.popular': '热门标签',
		'suggestions.title': '标题建议',
		'suggestions.tag': '标签建议',
		'suggestions.loading': '正在加载建议...',
		'states.loadingList': '正在加载文档...',
		'states.loadingDetail': '正在加载详情...',
		'states.emptyList': '暂无匹配的文档结果。',
		'states.emptyDetail': '请选择一篇文档以查看详情。',
		'states.emptyContent': '该文档暂无正文内容。',
		'states.errorList': '文档加载失败，请稍后重试。',
		'states.errorDetail': '详情加载失败，请稍后重试。',
		'states.errorSuggestions': '建议加载失败，请稍后重试。',
		'status.results': '共 {{count}} 条结果',
		'status.pagination': '第 {{current}} / {{total}} 页 · 共 {{count}} 条',
		'status.recent': '最近更新',
		'actions.download': '下载原文',
		'actions.copyLink': '复制链接',
		'actions.copyContent': '复制内容',
		'actions.close': '关闭',
		'actions.previous': '上一页',
		'actions.next': '下一页',
		'actions.retry': '重试',
		'actions.view': '查看 {{title}}',
		'actions.openFilters': '查看筛选条件',
		'actions.openDocument': '打开文档详情',
		'detail.title': '文档详情',
		'detail.toc': '目录',
		'detail.department': '部门',
		'detail.role': '角色',
		'detail.updated': '更新时间',
		'detail.related': '相关推荐',
		'detail.tags': '标签',
		'detail.path': '路径',
		'list.title': '文档列表',
		'list.total': '共 {{count}} 篇文档',
		'feedback.copyLinkSuccess': '链接已复制。',
		'feedback.copyContentSuccess': '内容已复制。',
		'feedback.copyFailure': '复制失败。',
		'aria.searchInput': '搜索文档输入框',
		'aria.themeToggle': '切换主题',
		'aria.languageSelect': '选择语言',
		'aria.pagination': '分页导航',
		'aria.resultsRegion': '搜索结果区域',
		'aria.detailRegion': '文档详情区域'
	},
	en: {
		'app.title': 'AGENTS · Library',
		'app.description': 'Search, filter, and download AGENTS.md across teams.',
		'brand.title': 'AGENTS',
		'brand.subtitle': 'AGENTS Library · Search · Download',
		'hero.heading': 'AGENTS Document Hub',
		'hero.subheading': 'Search, filter, and download collaboration standards.',
		'controls.language': 'Language',
		'controls.theme': 'Theme',
		'controls.themeLight': 'Light',
		'controls.themeDark': 'Dark',
		'controls.skipToContent': 'Skip to content',
		'locale.zh': 'Chinese (Simplified)',
		'locale.en': 'English',
		'search.label': 'Search documents',
		'search.placeholder': 'Search by title, content, or tag',
		'search.submit': 'Search',
		'search.clear': 'Clear',
		'search.filters': 'Filters',
		'search.filtersHint': 'Open advanced filters',
		'filters.department': 'Department',
		'filters.role': 'Role',
		'filters.type': 'Type',
		'filters.any': 'All',
		'filters.tags': 'Tags',
		'filters.tagsPlaceholder': 'Comma-separated tags',
		'filters.sort': 'Sort',
		'filters.pageSize': 'Page size',
		'filters.sortUpdated': 'Recently updated',
		'filters.sortName': 'Name',
		'filters.typeSpec': 'Spec',
		'filters.typeTemplate': 'Template',
		'filters.typeTutorial': 'Tutorial',
		'tags.popular': 'Popular tags',
		'suggestions.title': 'Suggested titles',
		'suggestions.tag': 'Suggested tags',
		'suggestions.loading': 'Loading suggestions...',
		'states.loadingList': 'Loading documents...',
		'states.loadingDetail': 'Loading detail...',
		'states.emptyList': 'No matching documents found.',
		'states.emptyDetail': 'Select a document to view details.',
		'states.emptyContent': 'This document has no content.',
		'states.errorList': 'Unable to load documents. Please retry.',
		'states.errorDetail': 'Unable to load document detail.',
		'states.errorSuggestions': 'Unable to load suggestions.',
		'status.results': '{{count}} results',
		'status.pagination': 'Page {{current}} of {{total}} · {{count}} total',
		'status.recent': 'Recently updated',
		'actions.download': 'Download original',
		'actions.copyLink': 'Copy link',
		'actions.copyContent': 'Copy content',
		'actions.close': 'Close',
		'actions.previous': 'Previous',
		'actions.next': 'Next',
		'actions.retry': 'Retry',
		'actions.view': 'View {{title}}',
		'actions.openFilters': 'View filters',
		'actions.openDocument': 'Open document detail',
		'detail.title': 'Document detail',
		'detail.toc': 'Contents',
		'detail.department': 'Department',
		'detail.role': 'Role',
		'detail.updated': 'Updated',
		'detail.related': 'Related',
		'detail.tags': 'Tags',
		'detail.path': 'Path',
		'list.title': 'Documents',
		'list.total': '{{count}} documents',
		'feedback.copyLinkSuccess': 'Link copied.',
		'feedback.copyContentSuccess': 'Content copied.',
		'feedback.copyFailure': 'Copy failed.',
		'aria.searchInput': 'Search documents input',
		'aria.themeToggle': 'Toggle theme',
		'aria.languageSelect': 'Select language',
		'aria.pagination': 'Pagination',
		'aria.resultsRegion': 'Search results region',
		'aria.detailRegion': 'Document detail region'
	}
};

const normalizeLocale = (value: string): Locale => {
	if (supportedLocales.includes(value as Locale)) {
		return value as Locale;
	}
	const match = supportedLocales.find((locale) => value.startsWith(locale));
	return match ?? 'zh-CN';
};

const getInitialLocale = (): Locale => {
	if (!browser) return 'zh-CN';
	const stored = localStorage.getItem(STORAGE_KEY);
	if (stored) return normalizeLocale(stored);
	return normalizeLocale(navigator.language || 'zh-CN');
};

export const locale = writable<Locale>(getInitialLocale());

export const t = derived(locale, ($locale) => {
	const messages = translations[$locale] ?? translations['zh-CN'];
	return (key: string, vars: Record<string, string | number> = {}) => {
		const template = messages[key] ?? key;
		return template.replace(/\{\{(\w+)\}\}/g, (_match, name) => {
			const value = vars[name];
			return value === undefined ? '' : String(value);
		});
	};
});

locale.subscribe((value) => {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, value);
	document.documentElement.lang = value;
});

export const formatDateTime = (value: string, currentLocale: Locale) => {
	if (!value) return '';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return '';
	return new Intl.DateTimeFormat(currentLocale, {
		year: 'numeric',
		month: 'short',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit'
	}).format(date);
};

export const formatNumber = (value: number, currentLocale: Locale) => {
	return new Intl.NumberFormat(currentLocale).format(value);
};

export const setLocale = (value: Locale) => locale.set(value);
