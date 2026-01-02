export const saveUser = (user: any) => localStorage.setItem('user', JSON.stringify(user));
export const loadUser = () => { try { return JSON.parse(localStorage.getItem('user')||'null') } catch { return null } };
export const clearUser = () => localStorage.removeItem('user');
