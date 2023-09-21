import moment from 'moment';

const AUTH_TOKEN = 'auth_token';
const USER = 'user';
const LANGUAGE_EXPIRE = moment().add({ days: 30 }).toDate();
const TOKEN_EXPIRE = moment().add({ minute: 600 }).toDate();

export { AUTH_TOKEN, USER, LANGUAGE_EXPIRE, TOKEN_EXPIRE };
