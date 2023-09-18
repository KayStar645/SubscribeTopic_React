type Common = {
	where: string;
};

type ValidationType = {
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
};

interface LanguageProps {
	lng: string;
}

export type { Common, ValidationType, LanguageProps };
