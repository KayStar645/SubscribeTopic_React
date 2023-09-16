const ISSERVER = typeof window === 'undefined';

const exists = (key: string): boolean => {
	let result = false;

	if (!ISSERVER) {
		let item = localStorage.getItem(key);

		result = item ? true : false;
	}

	return result;
};

const get = <T>(key: string) => {
	if (!exists(key)) {
		return undefined;
	}

	let result = localStorage.getItem(key);

	if (typeof result !== 'string') {
		result = JSON.parse(result!);
	}

	return result;
};

const set = (key: string, value: any): void => {
	if (typeof value !== 'string') {
		localStorage.setItem(key, JSON.stringify(value));
	} else {
		localStorage.setItem(key, value);
	}
};

const remove = (key: string): void => {
	localStorage.removeItem(key);
};

const clear = (): void => {
	localStorage.clear();
};

export { exists, get, set, remove, clear };
