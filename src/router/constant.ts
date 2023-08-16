export const LOGIN_NAME = 'login';

export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

// 路由白名单
export const whiteNameList = [LOGIN_NAME, 'icons', 'error', 'error-404', 'notFound'] as const; // no redirect whitelist

export const whitePathList = ['/login', '/notFound'] as const; // no redirect whitelist

export type WhiteNameList = typeof whiteNameList;

export type WhitePathList = typeof whitePathList;
