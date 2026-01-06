// placeholder task store
export type Task = { id:string; title:string; status:string }
let tasks:Task[] = []
export const listTasks = ()=>tasks
