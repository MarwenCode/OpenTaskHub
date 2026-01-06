// minimal store placeholder
export type User = { id:string; username:string; email:string; role:string } | null;
let currentUser: User = null;
export const setUser = (u: User) => { currentUser = u };
export const getUser = (): User => currentUser;
