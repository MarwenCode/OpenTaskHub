import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Icônes
import { FcGoogle } from 'react-icons/fc';
import { FaGithub, FaEye, FaEyeSlash } from 'react-icons/fa';

// Redux & Types
import { AppDispatch, RootState } from '../../redux/store';
import { login, reset } from '../../redux/authSlice/authSlice';

// Composants UI
import Input from '../ui/Input';
import Button from '../ui/Button';
import Loader from '../loader/Loader';

// Assets & Styles
import './login.scss';
import loginLogo from '../../assets/logo.png';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Extraction de l'état global avec typage RootState
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Redirection si la connexion est réussie
    if (isSuccess) {
      navigate('/workspaces');
    }

    // Nettoyage de l'état (messages d'erreur/succès) au démontage du composant
    return () => {
      dispatch(reset());
    };
  }, [isSuccess, navigate, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      dispatch(login({ email, password }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="auth-page">
      {/* Affiche le loader par-dessus tout pendant l'appel API */}
      {isLoading && <Loader />}

      <div className={`auth-card ${isLoading ? 'is-loading' : ''}`}>
        <header className="auth-header">
          <div className="logo-container">
            <img src={loginLogo} alt="OpenTaskHub Logo" className="auth-logo" />
            <h1>OpenTaskHub</h1>
          </div>
          <h2>Welcome Back</h2>
          <p>Please enter your details to sign in.</p>
        </header>

        <form onSubmit={handleSubmit} className="form">
          {/* Bannière d'erreur stylisée */}
          {isError && (
            <div className="error-banner" role="alert">
              {message || "Identifiants invalides. Veuillez réessayer."}
            </div>
          )}

          <div className="input-field">
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="input-field password-wrapper">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
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
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <div className="social-login">
          <button type="button" className="social-btn google-btn">
            <FcGoogle size={20} />
            <span>Google</span>
          </button>
          <button type="button" className="social-btn github-btn">
            <FaGithub size={20} />
            <span>GitHub</span>
          </button>
        </div>

        <footer className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="register-link">
              Register now
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Login;