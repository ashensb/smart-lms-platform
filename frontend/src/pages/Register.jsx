import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, Mail, Lock, Loader2, GraduationCap } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      alert('Registration Successful! 🎉 Now you can Login.');
      navigate('/login'); 
    } catch (error) {
      console.error("Register error:", error);
      alert(error.response?.data?.message || "Registration Failed! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Sign In
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 flex items-center justify-center p-4 font-sans selection:bg-blue-500/20 text-slate-800">
      
      {/* kl */}
      <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-blue-400/20 relative overflow-hidden space-y-6">
        
        {/* Decorative Light Blue Circles (Consistent Image Style) */}
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-400/10 rounded-full pointer-events-none"></div>
        <div className="absolute -top-10 -left-10 w-20 h-20 bg-blue-500/5 rounded-full pointer-events-none"></div>

        {/* LOGO & TITLE */}
        <div className="text-center relative z-10">
          {/* Icon  */}
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl text-blue-600 mb-4 border border-blue-100">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">
            Sign up
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-2">Join our Smart LMS platform today</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          
          {/* Name Field (Soft Grey Input Style) */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                required 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
                className="w-full bg-[#F1F3F6] border border-transparent focus:border-blue-500 focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 font-medium" 
                placeholder="John Doe" 
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                required 
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                className="w-full bg-[#F1F3F6] border border-transparent focus:border-blue-500 focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 font-medium" 
                placeholder="name@example.com" 
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                required 
                type="password" 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                className="w-full bg-[#F1F3F6] border border-transparent focus:border-blue-500 focus:bg-white rounded-xl pl-11 pr-4 py-3 text-sm text-slate-800 outline-none transition-all placeholder-slate-400 font-medium" 
                placeholder="••••••••" 
              />
            </div>
          </div>

          {/*  Submit Button (Deep Navy Blue `bg-[#0B457F]`) */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#0B457F] hover:bg-[#083562] disabled:bg-[#0B457F]/70 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-900/10 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-3 text-sm uppercase tracking-wider"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" /> Creating Account...
              </>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-xs font-medium text-slate-400 mt-6 pt-2 relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold underline underline-offset-4 transition-all">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}