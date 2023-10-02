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
    page?: number;
    pageSize?: number;
}

interface ResponseType {
    data: object | any[];
    extra: object;
    messages: string | null;
    exception: string | null;
    succeeded: boolean;
}

export type { MetaType, ParamType, ResponseType };
