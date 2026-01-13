import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Ajout de useLocation

// Icônes
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEye, FaEyeSlash, FaArrowRight, FaEnvelope } from 'react-icons/fa';

// Redux & Types
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { register, reset } from '../../redux/authSlice/authSlice';

// Composants UI
import Input from '../ui/Input';
import Button from '../ui/Button';
import Loader from '../loader/Loader';

// Assets & Styles
import './login.scss';
import loginLogo from '../../assets/logo.png';
import dashboardImg from '../../assets/logo.png'; 

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation(); // Pour lire l'URL actuelle

  // LOGIQUE DYNAMIQUE : On détecte le rôle via l'URL
  // Si l'URL contient "admin", on passe 'admin', sinon 'user'
  const role: 'admin' | 'user' = location.pathname.includes('admin') ? 'admin' : 'user';

  const { isLoading, isError, isSuccess, message } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isSuccess) navigate('/');
    return () => { dispatch(reset()); };
  }, [isSuccess, navigate, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password && username) {
      // On envoie l'objet structuré { userData, role } au Slice
      dispatch(register({ 
        userData: { username, email, password }, 
        role: role 
      })); 
    }
  };

  return (
    <div className="auth-page">
      {isLoading && <Loader />}

      {/* SECTION GAUCHE : FORMULAIRE */}
      <div className="auth-form-side">
        <div className="auth-container">
          <header className="auth-header">
            <div className="brand">
              <img src={loginLogo} alt="Logo" className="auth-logo" />
              <span>OpenTaskHub</span>
            </div>
            {/* Titre dynamique selon le rôle détecté */}
            <h1>{role === 'admin' ? 'Admin Registration' : 'Create Account'}</h1>
            <p>Please enter your details to {role === 'admin' ? 'setup admin access' : 'access your tasks'}.</p>
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
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FaEnvelope className="field-icon" />
              </div>
            </div>

            <div className="input-group">
              <label>Username</label>
              <div className="input-wrapper">
                <Input
                  placeholder="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
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

            <div className="helper-row">
              <label className="remember-label">
                <input type="checkbox" id="remember" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" title="Coming soon" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={isLoading} className="submit-btn">
              {isLoading ? 'Loading...' : (
                <>{role === 'admin' ? 'Register as Admin' : 'Register'}</>
              )}
            </Button>
          </form>

          <footer className="auth-footer">
            <p>Do you have an account? <Link to="/login">Sign in</Link></p>
          </footer>
        </div>
      </div>

      {/* SECTION DROITE : HERO */}
      <div className="auth-hero-side">
        <div className="hero-content">
          <div className="illustration-wrapper">
             <img src={dashboardImg} alt="App Preview" className="hero-image" />
          </div>
          <h2>{role === 'admin' ? 'Control your workspace.' : 'Manage projects effortlessly.'}</h2>
          <p>Collaborate in real-time and streamline your team's workflow with OpenTaskHub.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;