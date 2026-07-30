import React, { useState } from 'react';
import authStore from '../store/authStore';

export default function Auth({ onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [phone, setPhone] = useState('+44 7700 900000');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      const user = authStore.signup({ name: name || 'New User', phone, password });
      if (onLoginSuccess) onLoginSuccess(user);
    } else {
      const user = authStore.login({ phone, password });
      if (onLoginSuccess) onLoginSuccess(user);
    }
  };

  const handleSocialLogin = (provider) => {
    const user = authStore.login({
      name: `${provider} User`,
      phone: '+44 7700 900000',
    });
    if (onLoginSuccess) onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center p-4 overflow-hidden select-none" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background Image / Moody Dusk Mountains */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center filter brightness-90 scale-105 transition-all duration-700"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 z-0 bg-[#0B0D1A]/60 backdrop-blur-md" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center space-y-6 py-6">
        
        {/* ── Brand Logo & Tagline ── */}
        <div className="text-center space-y-1.5">
          <div className="flex items-center justify-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#7C3AED] shadow-[0_0_14px_#7C3AED]" />
            <h1 className="font-display font-extrabold text-4xl text-white tracking-tight">
              NowNot
            </h1>
          </div>
          <p className="text-xs font-medium text-slate-300 tracking-wide">
            Your calls, intelligently handled.
          </p>
        </div>

        {/* ── Dark Glassmorphic Login Card ── */}
        <div
          className="w-full rounded-[28px] p-7 shadow-2xl flex flex-col space-y-5 border"
          style={{
            background: 'rgba(20, 24, 45, 0.78)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.55)',
          }}
        >
          {/* Card Title Header */}
          <div className="text-center space-y-1">
            <h2 className="font-display font-bold text-2xl text-white tracking-tight">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-xs text-slate-400">
              {isSignUp
                ? 'Join NowNot to handle missed calls intelligently'
                : 'Please enter your details to sign in'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name Input (Sign Up mode only) */}
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Full Name
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-medium text-white bg-[#131627]/80 border border-white/10 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            {/* Phone Number Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Phone Number
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                  call
                </span>
                <input
                  type="text"
                  required
                  placeholder="+44 7700 900000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm font-mono font-medium text-white bg-[#131627]/80 border border-white/10 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 rounded-2xl text-sm font-medium text-white bg-[#131627]/80 border border-white/10 focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/30 transition-all placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Primary Log In / Sign Up Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-lg transition-all duration-200 active:scale-98 cursor-pointer mt-2"
              style={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.45)',
              }}
            >
              <span>{isSignUp ? 'Sign Up' : 'Log In'}</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </form>

          {/* ── Divider ── */}
          <div className="relative flex items-center justify-center my-1.5 font-sans">
            <div className="w-full h-px bg-white/10" />
            <span className="absolute px-3.5 py-0.5 bg-[#131627] text-[10px] font-bold text-slate-400 tracking-wider uppercase rounded-full border border-white/10">
              OR CONTINUE WITH
            </span>
          </div>

          {/* ── Social Logins ── */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#131627]/90 border border-white/15 text-xs font-semibold text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            {/* GitHub Button */}
            <button
              type="button"
              onClick={() => handleSocialLogin('GitHub')}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#131627]/90 border border-white/15 text-xs font-semibold text-white hover:bg-white/10 transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                />
              </svg>
              <span>Github</span>
            </button>
          </div>
        </div>

        {/* ── Footer Switch Link ── */}
        <p className="text-xs text-slate-300 font-medium">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-white font-bold underline hover:text-[#D2BBFF] transition-colors cursor-pointer"
              >
                Log In
              </button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-white font-bold underline hover:text-[#D2BBFF] transition-colors cursor-pointer"
              >
                Sign Up
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  );
}
