import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function Register(){
  const [username,setUsername]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  return (
    <div className="auth-page">
      <h2>Register</h2>
      <Input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
      <Input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <Input placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
      <Button>Create account</Button>
    </div>
  )
}
