type signInType = {
	account: string;
	password: string;
	remember_password: boolean;
	token?: string;
	status: 'idle' | 'checking' | 'success' | 'failed';
};

export { signInType };
