export const PORT = process.env.PORT || 4004;
export const IS_DEVELOP = process.env.NODE_ENV === 'development';
export const DB_NAME = process.env.DB_NAME || 'sandbox';
export const DB_HOST = process.env.DB_HOST || `mongodb://localhost:27017/${DB_NAME}`;
export const AUTH_TOKEN_COOKIE_NAME = process.env.AUTH_TOKEN_COOKIE_NAME || 'authToken';
export const REFRESH_TOKEN_COOKIE_NAME = process.env.REFRESH_TOKEN_COOKIE_NAME || 'refreshToken';