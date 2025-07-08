import React, { useState } from 'react';
import educationImg from '../images/education.jpg';

interface LoginFormProps {
  onLogin?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');
    setFormError('');
    let isValid = true;

    if (!email || !validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }
    if (!password || password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      isValid = false;
    }
    if (!isValid) return;

    setIsSubmitting(true);
    // Dummy credentials for demo
    setTimeout(() => {
      setIsSubmitting(false);
      if (email === 'admin@example.com' && password === 'password123') {
        if (onLogin) onLogin();
      } else {
        setFormError('Invalid email or password');
      }
    }, 900);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Blurred background image */}
      <img
        src={educationImg}
        alt="Education background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 blur-md scale-105"
        aria-hidden="true"
      />
      {/* Overlay for darkening effect */}
      <div className="absolute inset-0 bg-slate-900/60 z-10" aria-hidden="true" />
      {/* Login card */}
      <div className="relative z-20 w-full max-w-md p-8 bg-slate-800/90 rounded-2xl shadow-2xl border border-slate-700">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Student Performance Tracking</h1>
          <p className="text-slate-300 text-sm mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                className={`w-full px-4 py-3 border ${emailError ? 'border-red-400' : 'border-slate-700'} rounded-lg bg-slate-900/80 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"></span>
            </div>
            {emailError && <div className="text-xs text-red-400 mt-1">{emailError}</div>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-1">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-3 border ${passwordError ? 'border-red-400' : 'border-slate-700'} rounded-lg bg-slate-900/80 text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Password"
            />
            {passwordError && <div className="text-xs text-red-400 mt-1">{passwordError}</div>}
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                className="rounded border-slate-600 text-blue-500 focus:ring-blue-500"
              />
              Remember me
            </label>
            <a href="#" className="text-blue-400 hover:underline">Forgot password?</a>
          </div>
          {formError && <div className="text-sm text-red-400 text-center">{formError}</div>}
          <button
            type="submit"
            className="w-full py-3 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition-colors disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div className="flex justify-between mt-6 text-xs text-slate-400">
          <a href="#" className="hover:underline">Don&apos;t have an account?</a>
          <a href="#" className="hover:underline">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;