import moment from 'moment';

const AUTH_TOKEN = 'auth_token';
const FACULTY_TOKEN = 'faculty_token';
const USER = 'user';
const LANGUAGE_EXPIRE = moment().add({ days: 30 }).toDate();
const TOKEN_EXPIRE = moment().add({ minute: 600 }).toDate();
const ROWS_PER_PAGE = [10, 20, 30];

export { AUTH_TOKEN, USER, LANGUAGE_EXPIRE, TOKEN_EXPIRE, ROWS_PER_PAGE, FACULTY_TOKEN };
