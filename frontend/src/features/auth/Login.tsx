import React, { useState } from 'react';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import './login.scss';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('login', { email, password });
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Sign in to your account</h2>
        <p>Enter your email and password to continue.</p>

        <form onSubmit={handleSubmit} className="form">
          <Input
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <div className="helper-row">
            <label className="remember-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a className="link-muted" href="#">Forgot password?</a>
          </div>

          <Button type="submit">Sign in</Button>
        </form>
      </div>
    </div>
  );
}
