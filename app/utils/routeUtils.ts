// 定義不需要使用 Layout 的路由路徑
const noLayoutRoutes = ["/login", "/register"];

/**
 * 判斷當前路徑是否需要使用 Layout
 * @param pathname 當前路徑
 * @returns {boolean} 如果不需要 Layout 返回 true，否則返回 false
 */
export const isNoLayoutRoute = (pathname: string): boolean => {
  return noLayoutRoutes.includes(pathname);
};
