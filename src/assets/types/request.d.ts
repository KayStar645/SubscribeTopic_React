interface MetaType {
    currentPage?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
    messages?: string[];
    pageSize?: number;
    totalCount?: number;
    totalPages?: number;
}

interface ParamType {
    id?: number | string;
    filters?: string;
    sorts?: string;
    page?: number;
    pageSize?: number;
    isAllDetail?: boolean;
    facultyId?: string | number;
    IsGetFaculty?: boolean;
    removeFacultyId?: boolean;
}

interface ResponseType<dataType = any> {
    data: dataType | null;
    extra?: MetaType;
    messages: string[] | null;
    message: string | null;
    exception: string | null;
    succeeded?: boolean;
    code?: number;
}

export type { MetaType, ParamType, ResponseType };
