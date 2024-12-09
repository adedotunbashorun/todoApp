// Utility functions for handling cookies in TypeScript

type CookieOptions = {
  expires?: Date;
  secure?: boolean;
};

export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

export const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
  let cookieString = `${name}=${value}; path=/; samesite=strict`;

  if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  if (options.secure) {
    cookieString += `; secure`;
  }

  document.cookie = cookieString;
};

export const deleteCookie = (name: string) => {
  setCookie(name, '', { expires: new Date(0) });
};
