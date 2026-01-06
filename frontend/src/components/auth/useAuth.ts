import { useState, useEffect } from 'react';
import { loadUser, saveUser, clearUser } from '../../lib/auth';

export default function useAuth(){
  const [user,setUser] = useState<any>(null);
  useEffect(()=>{ setUser(loadUser()) },[]);
  const login = (u:any)=>{ saveUser(u); setUser(u) };
  const logout = ()=>{ clearUser(); setUser(null) };
  return { user, login, logout };
}
