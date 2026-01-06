import axios from '../../lib/axios';
export const getWorkspaces = () => axios.get('/workspaces');
