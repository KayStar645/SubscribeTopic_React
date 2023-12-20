interface AuthType {
    aud: string;
    customer: {
        Id: number;
        Name: string;
    };
    exp: number;
    facultyId: number;
    faculty: {
        Id: number;
    };
    permission: string[];
    type: string;
    uid: number;
    userName: string;
}

export type { AuthType };
