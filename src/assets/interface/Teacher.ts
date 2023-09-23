import { Default } from './Default';

interface TeacherType extends Default {
	departmentId: number;
	gender: string;
	dateOfBirth: Date;
	phoneNumber: string;
	email: string;
	academicTitle: string;
	degree: string;
	type: string;
}

export type { TeacherType };
