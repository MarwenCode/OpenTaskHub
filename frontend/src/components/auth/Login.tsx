import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Icons
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEye, FaEyeSlash, FaArrowRight, FaEnvelope } from 'react-icons/fa';

// Redux
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { login, reset } from '../../redux/authSlice/authSlice';

// UI
import Input from '../ui/Input';
import Button from '../ui/Button';
import Loader from '../loader/Loader';

// Styles & Assets
import './login.scss';
import loginLogo from '../../assets/logo.png';
import dashboardImg from '../../assets/logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  //Même logique que Register
  const role: 'admin' | 'user' =
    location.pathname.includes('admin') ? 'admin' : 'user';

  const { isLoading, isError, isSuccess, message } =
    useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) navigate('/');
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, navigate, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      dispatch(
        login({
          userData: { email, password },
          role,
        })
      );
    }
  };

  return (
    <div className="auth-page">
      {isLoading && <Loader />}

      {/* LEFT */}
      <div className="auth-form-side">
        <div className="auth-container">
          <header className="auth-header">
            <div className="brand">
              <img src={loginLogo} alt="Logo" className="auth-logo" />
              <span>OpenTaskHub</span>
            </div>

            <h1>{role === 'admin' ? 'Admin Login' : 'Welcome back'}</h1>
            <p>
              {role === 'admin'
                ? 'Enter your credentials to access the admin panel.'
                : 'Please enter your details to access your tasks.'}
            </p>
          </header>

          <div className="social-login">
            <button type="button" className="social-btn">
              <FcGoogle size={20} /> Google
            </button>
            <button type="button" className="social-btn">
              <FaGithub size={20} /> GitHub
            </button>
          </div>

          <div className="auth-divider">
            <span>Or continue with</span>
          </div>

          <form onSubmit={handleSubmit} className="form">
            {isError && <div className="error-banner">{message}</div>}

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FaEnvelope className="field-icon" />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-wrapper">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <Button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? 'Loading...' : <>Log In <FaArrowRight /></>}
            </Button>
          </form>

          <footer className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to={role === 'admin' ? '/admin/register' : '/register'}>
                Sign up
              </Link>
            </p>
          </footer>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-hero-side">
        <div className="hero-content">
          <div className="illustration-wrapper">
            <img src={dashboardImg} alt="App Preview" className="hero-image" />
          </div>
          <h2>
            {role === 'admin'
              ? 'Control your workspace.'
              : 'Manage projects effortlessly.'}
          </h2>
          <p>
            Collaborate in real-time and streamline your team's workflow with
            OpenTaskHub.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
