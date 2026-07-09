import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import { GraduationCap, Lock, Mail, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isBtnLoading, setIsBtnLoading] = useState(false); 
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsBtnLoading(true);

    const result = await login(email, password, role); 

    setIsBtnLoading(false);

    if (result.success) {
        if (result.role === 'admin') {
            navigate('/admin', { replace: true });
        } else {
            navigate('/dashboard', { replace: true });
        }
    } else {
        setErrorMsg(result.message);
    }
  };

  return (
    //  Image
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4 font-sans selection:bg-blue-500/20">
      
      {/* kk */}
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-blue-400/20 p-8 md:p-10 relative overflow-hidden">
        
        {/* Decorative ) */}
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-400/10 rounded-full pointer-events-none"></div>
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/5 rounded-full pointer-events-none"></div>

        {/* Logo & Header */}
        <div className="text-center mb-8 relative z-10">
          {/* Icon  */}
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl text-blue-600 mb-4 border border-blue-100">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Sign in</h2>
          <p className="text-xs text-slate-400 font-medium mt-2">Sign in to access your dashboard</p>
        </div>

        {/*  Error Message Display */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-100 text-rose-600 text-sm font-semibold rounded-xl text-center relative z-10">
            {errorMsg}
          </div>
        )}

        {/* Role Selector (Image style soft tabs) */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100/80 rounded-xl mb-6 relative z-10">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'student' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Student
          </button>
          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              role === 'admin' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Administrator
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          
          {/* Email Input  */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F1F3F6] border border-transparent rounded-xl py-3 pl-11 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                placeholder="name@university.com"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F1F3F6] border border-transparent rounded-xl py-3 pl-11 pr-16 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-wider"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* loo */}
          <button
            type="submit"
            disabled={isBtnLoading}
            className="w-full bg-[#0B457F] hover:bg-[#083562] disabled:bg-[#0B457F]/70 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.99] mt-3 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
          >
            {isBtnLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              `Sign In`
            )}
          </button>

          {/* 🔗 Sign Up Link */}
          <p className="text-center text-xs font-medium text-slate-400 mt-6 pt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 transition-all">
              Sign Up
            </Link>
          </p>
        </form>

      </div>
    </div>
  );
}