import React from 'react';
import { 
  Bot, 
  Users, 
  Heart, 
  UserCircle, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, onLogin }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <nav className="bg-[#7C3AED] px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-white text-2xl font-black tracking-tight">SmartLearn AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-indigo-100 hover:text-white font-bold text-sm transition-colors">Home</a>
          <a href="#" className="text-indigo-100 hover:text-white font-bold text-sm transition-colors">Features</a>
          <a href="#" className="text-indigo-100 hover:text-white font-bold text-sm transition-colors">Profile</a>
          <button 
            onClick={onLogin}
            className="bg-[#FFD700] text-slate-900 px-6 py-2 rounded-xl font-black text-sm hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-black/10"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-32 px-8 overflow-hidden bg-gradient-to-b from-[#F5F3FF] to-white">
        {/* Background Decorative Shapes */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-20 left-1/4 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-6xl font-black text-slate-800 tracking-tight leading-tight">
            Empowering Minds. Achieving Excellence. Together.
          </h1>
          <p className="text-slate-500 text-lg md:text-xl font-medium max-w-3xl mx-auto leading-relaxed">
            A RAG-based intelligent platform that monitors progress, supports collaborative peer mentoring, and promotes student well-being through AI-driven insights for smarter learning.
          </p>
          <div className="pt-4">
            <button 
              onClick={onStart}
              className="bg-[#5D5CFF] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-8 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-100/50 border border-slate-50 hover:border-indigo-100 transition-all group">
            <div className="w-16 h-16 bg-indigo-50 text-[#5D5CFF] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bot size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-4">Intelligent AI Assistant</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              RAG-powered assistant ensures accurate, context-aware academic guidance tailored to learner needs.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-100/50 border border-slate-50 hover:border-indigo-100 transition-all group">
            <div className="w-16 h-16 bg-purple-50 text-[#7C3AED] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-4">Collaborative Peer Mentoring</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Share knowledge, support peers, and grow together in a vibrant learning community.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-slate-100/50 border border-slate-50 hover:border-indigo-100 transition-all group">
            <div className="w-16 h-16 bg-pink-50 text-[#EC4899] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-4">Well-being & Outcomes</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Track engagement, predict risks, and promote student well-being while celebrating academic milestones.
            </p>
          </div>
        </div>
      </section>

      {/* User Profile Banner */}
      <section className="px-8 pb-32">
        <div className="max-w-7xl mx-auto bg-[#8B5CF6] rounded-[3rem] p-16 text-center text-white relative overflow-hidden group">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full -translate-x-12 -translate-y-12 blur-2xl transition-transform group-hover:scale-125"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-black/10 rounded-full translate-x-24 translate-y-24 blur-3xl transition-transform group-hover:scale-110"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 bg-[#FFD700] text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-black/20">
              <UserCircle size={60} className="text-white" />
            </div>
            <h2 className="text-4xl font-black tracking-tight">User Profile</h2>
            <p className="text-indigo-100 text-lg font-medium max-w-xl mx-auto">
              Access your personalized dashboard and track learning progress.
            </p>
            <div className="pt-4">
              <button 
                onClick={onLogin}
                className="bg-[#FFD700] text-slate-900 px-10 py-4 rounded-[1.5rem] font-black text-lg hover:bg-yellow-400 transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-8 pb-32">
        <div className="max-w-7xl mx-auto bg-[#F5F3FF] rounded-[3rem] p-24 text-center space-y-10 relative overflow-hidden">
          {/* Soft bubble decoration */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 w-40 h-40 bg-slate-200/50 rounded-full"></div>
          <div className="absolute right-10 top-1/2 -translate-y-1/2 w-48 h-24 bg-indigo-100 rounded-full"></div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight relative z-10">
            Ready to Transform Your Learning Journey?
          </h2>
          <div className="relative z-10">
            <button 
              onClick={onStart}
              className="bg-[#5D5CFF] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-100 active:scale-95 inline-flex items-center gap-3"
            >
              Get Started <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center">
        <p className="text-slate-400 font-bold text-sm tracking-wide">
          © 2025 SmartLearn AI | All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;