// placeholder workspace store
export type Workspace = { id:string; name:string; description?:string }
let workspaces: Workspace[] = []
export const list = () => workspaces
export const add = (w:Workspace) => workspaces.push(w)
