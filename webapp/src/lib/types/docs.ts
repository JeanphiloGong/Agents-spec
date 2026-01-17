export type DocItem = {
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

export type RawDoc = Partial<DocItem> & {
	ID?: string;
	Title?: string;
	Path?: string;
	Dept?: string;
	Role?: string;
	Type?: string;
	Tags?: string[];
	UpdatedAt?: string;
	Excerpt?: string;
	Content?: string;
};
