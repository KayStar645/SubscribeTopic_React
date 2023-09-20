interface MetaType {
	currentPage: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	messages: string | null;
	pageSize: number;
	totalCount: number;
	totalPages: number;
}

interface ParamType {
	filters?: string;
	sorts?: string;
	page: number;
	pageSize: number;
}

export type { MetaType, ParamType };
