import { Default } from './Default';

interface FacultyType extends Default {
	address?: string;
	phoneNumber?: string;
	email?: string;
	dean_TeacherId?: string;
}

export type { FacultyType };
