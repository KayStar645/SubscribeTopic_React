import moment from 'moment';

const AUTH_TOKEN = 'auth_token';
const AUTH_RAW_TOKEN = 'auth_raw_token';
const LANGUAGE_EXPIRE = moment().add({ days: 365 }).toDate().getDay();
const TOKEN_EXPIRE = moment().add({ minute: 600 }).toDate().getMinutes();
const ROWS_PER_PAGE = [10, 20, 30];

export { AUTH_TOKEN, LANGUAGE_EXPIRE, TOKEN_EXPIRE, ROWS_PER_PAGE, AUTH_RAW_TOKEN };
