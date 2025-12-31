import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Circle,
  Chrome
} from 'lucide-react';
import { apiRequest } from '../services/api';

interface AuthSystemProps {
  onAuthenticate: (userData: any) => void;
}

type AuthView = 'login' | 'signup';

const AuthSystem: React.FC<AuthSystemProps> = ({ onAuthenticate }) => {
  const [view, setView] = useState<AuthView>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');


  // Password Validation
  const validationRules = useMemo(() => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  }), [password]);

  const strength = useMemo(() => {
    const met = Object.values(validationRules).filter(Boolean).length;
    if (password.length === 0) return { label: '', color: 'bg-slate-200', text: '', width: '0%' };
    if (met <= 1) return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500', width: '25%', tip: 'Weak. Add symbols and numbers for better security.' };
    if (met === 2) return { label: 'Moderate', color: 'bg-amber-500', text: 'text-amber-500', width: '50%', tip: 'Moderate choice. Try a bit more variety.' };
    if (met === 3) return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500', width: '75%', tip: 'Strong password! Almost there.' };
    return { label: 'Excellent', color: 'bg-indigo-600', text: 'text-indigo-600', width: '100%', tip: 'AI Tip: Excellent choice!' };
  }, [validationRules, password]);



  const handleSwitchView = (newView: AuthView) => {
    setView(newView);
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setShowPassword(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { result, token } = await apiRequest('/auth/login', 'POST', { email, password });
      localStorage.setItem('token', token);
      onAuthenticate({ ...result, id: result._id });
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { result, token } = await apiRequest('/auth/signup', 'POST', {
        name: `${firstName} ${lastName}`,
        email,
        password
      });
      localStorage.setItem('token', token);
      onAuthenticate({ ...result, id: result._id });
    } catch (error: any) {
      alert(error.message);
    }
  };



  const LeftPanel = () => (
    <div className="hidden lg:flex lg:w-1/2 bg-[#5D5CFF] p-16 text-white flex-col justify-between relative overflow-hidden">
      {/* Decorative background circle */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-16">
          <div className="bg-white text-[#5D5CFF] p-2 rounded-xl shadow-lg">
            <GraduationCap size={32} />
          </div>
          <span className="text-2xl font-black tracking-tight">ScholarLMS</span>
        </div>

        <h1 className="text-6xl font-black leading-[1.1] mb-8">
          Empower Your<br />Future Through<br />Knowledge.
        </h1>

        <p className="text-xl text-indigo-100 font-medium max-w-md leading-relaxed">
          Join thousands of learners worldwide and unlock your potential with our expert-led courses.
        </p>
      </div>

      <div className="relative z-10">
        <div className="flex items-center -space-x-3 mb-4">
          {[1, 2, 3, 4].map(i => (
            <img
              key={i}
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
              className="w-10 h-10 rounded-full border-2 border-[#5D5CFF] bg-white"
              alt="student"
            />
          ))}
          <div className="w-10 h-10 rounded-full border-2 border-[#5D5CFF] bg-indigo-400 flex items-center justify-center text-[10px] font-bold">
            +2k
          </div>
        </div>
        <p className="text-sm font-bold text-indigo-100/60 uppercase tracking-widest">Trusted by students from 150+ universities.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-0">
      <div className="bg-white w-full max-w-[1100px] h-auto lg:h-[750px] rounded-[2.5rem] shadow-2xl flex overflow-hidden border border-slate-200 animate-in fade-in zoom-in duration-500">
        <LeftPanel />

        <div className="w-full lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative bg-white">
          {view === 'login' && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-4xl font-black text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500 font-medium mb-10">Start your learning session today.</p>

              <form onSubmit={handleLogin} className="space-y-6" autoComplete="on">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="name@university.edu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#333333] border-none text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#5D5CFF] outline-none transition-all placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                    <button type="button" className="text-xs font-bold text-[#5D5CFF] hover:underline">Forgot Password?</button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full bg-[#333333] border-none text-white rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#5D5CFF] outline-none transition-all placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-[#5D5CFF] focus:ring-[#5D5CFF]" />
                  <label htmlFor="remember" className="text-sm font-medium text-slate-600">Remember me</label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#5D5CFF] text-white py-4 rounded-xl font-black text-sm shadow-xl shadow-indigo-100 hover:bg-[#4A49D1] transition-all transform active:scale-[0.98]"
                >
                  Sign In
                </button>

                <div className="relative flex items-center gap-4 my-8">
                  <div className="flex-1 h-px bg-slate-100"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Or continue with</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>

                <button
                  type="button"
                  className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
                >
                  <Chrome size={20} className="text-blue-500" /> Continue with Google
                </button>

                <p className="text-center mt-8 text-sm font-medium text-slate-600">
                  New to the platform? <button onClick={() => handleSwitchView('signup')} className="text-[#5D5CFF] font-bold hover:underline">Create an account</button>
                </p>
              </form>
            </div>
          )}

          {view === 'signup' && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-4xl font-black text-slate-900 mb-2">Join ScholarLMS</h2>
              <p className="text-slate-500 font-medium mb-8">Create your learner profile in seconds.</p>

              <form onSubmit={handleSignUp} className="space-y-6" autoComplete="off">
                <input type="password" style={{ display: 'none' }} /> {/* Anti-autofill hack */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">First Name</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="jane"
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className="w-full border-slate-200 border rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#5D5CFF] outline-none transition-all placeholder:text-slate-300 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Last Name</label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      placeholder="deo"
                      value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className="w-full border-slate-200 border rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#5D5CFF] outline-none transition-all placeholder:text-slate-300 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    placeholder="fdgfhg@gmail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`w-full border rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#5D5CFF] outline-none transition-all font-medium ${email && !email.includes('@') ? 'border-rose-300' : 'border-slate-200'}`}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                    <span className="text-[10px] font-black text-slate-400">{password.length}/8+</span>
                  </div>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="Choose a strong password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#5D5CFF] outline-none transition-all font-medium"
                  />
                  {password && (
                    <div className="space-y-3 pt-1 animate-in slide-in-from-top-2 duration-300">
                      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }}></div>
                      </div>
                      <p className={`text-[10px] font-black uppercase tracking-wider ${strength.text}`}>{strength.tip}</p>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!validationRules.length}
                  className="w-full bg-[#E2E8F0] text-slate-400 py-4 rounded-xl font-black text-sm transition-all transform enabled:bg-[#5D5CFF] enabled:text-white enabled:shadow-xl enabled:shadow-indigo-100"
                >
                  Create Account
                </button>

                <p className="text-center mt-4 text-sm font-medium text-slate-600">
                  Already have an account? <button onClick={() => handleSwitchView('login')} className="text-[#5D5CFF] font-bold hover:underline">Sign In</button>
                </p>
              </form>
            </div>
          )}

          {/* AI Quote Panel */}
          <div className="mt-16 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50 flex gap-4 animate-in fade-in duration-700">
            <div className="w-10 h-10 bg-[#5D5CFF] rounded-xl flex items-center justify-center text-white shadow-lg shrink-0">
              <Sparkles size={20} />
            </div>
            <p className="text-sm font-semibold text-indigo-900/80 italic leading-relaxed">
              {view === 'login' ? '"Welcome back, Learner; step inside to transform your curiosity into knowledge and unlock the next chapter of your potential today."' :
                view === 'signup' ? '"Welcome, Learner—take the first step today to unlock your potential and transform your curiosity into the knowledge that will shape your future."' :
                  '"Your journey to greatness begins with this simple step, Learner—verify your email to unlock the door to endless knowledge and discovery."'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;