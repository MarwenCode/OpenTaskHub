import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'; // Google Icon
import { FaEye, FaEyeSlash, FaGithub } from 'react-icons/fa'; // GitHub Icon
import Input from '../ui/Input';
import Button from '../ui/Button';
import useAuth from './useAuth';
import axios from '../../lib/axios';
import './register.scss';
import loginLogo from '../../assets/logo.png';


const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/register', {
        username,
        email,
        password,
      });

      // Assuming the response includes user data
      login(response.data.user);
      navigate('/workspaces');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <header className="auth-header">
          <div className='logo-container'>
            <img src={loginLogo} alt="OpenTaskHub Logo" className="auth-logo" />
            <h1>OpenTaskHub</h1>
          </div>
          <h2>Create Account</h2>
          <p>Please enter your details to create an account.</p>
        </header>

        <form onSubmit={handleSubmit} className="form">
          <input
            placeholder="Username"
            type="text"   
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />

          <div className="input-group">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          

          <Button type="submit">Sign in</Button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn">
            <FcGoogle size={20} />
            Google
          </button>
          <button type="button" className="social-btn">
            <FaGithub size={20} />
            GitHub
          </button>
        </div>
<footer className="auth-footer">
          <p>Already have an account ? <Link to="/login" className="login-link">Sign in</Link>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Register;


