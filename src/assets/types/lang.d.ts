interface Common {
	where: string;
}

interface ValidationType {
	attribute: string;
	date: string;
	digits: string;
	format: string;
	max: string;
	min: string;
	other: string;
	size: string;
	value: string;
	values: string;
}

interface LanguageProp {
	lng: string;
}

export type { Common, ValidationType, LanguageProps };
