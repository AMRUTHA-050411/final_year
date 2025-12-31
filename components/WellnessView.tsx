import React, { useState } from 'react';
import { 
  Heart, 
  Shield, 
  RefreshCcw, 
  Info, 
  Activity, 
  Clock, 
  LogIn, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Phone,
  ExternalLink,
  MessageCircle,
  Compass,
  BookOpen,
  Dumbbell,
  ArrowLeft,
  // Added missing Users icon import
  Users
} from 'lucide-react';

const WellnessView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            <div className="lg:col-span-2 bg-white border-2 border-emerald-500 rounded-[2rem] p-10 shadow-lg shadow-emerald-50">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      Wellness Score <Info size={14} className="text-slate-300" />
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">Your learning patterns look healthy and balanced!</p>
                  </div>
                </div>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase px-3 py-1 rounded-full">Doing Well</span>
              </div>

              <div className="space-y-6 mb-10">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-slate-900">85</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-800 w-[85%] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-500">✨</span>
                  <span className="text-xs font-black text-emerald-700 uppercase tracking-widest">What's Going Well:</span>
                </div>
                <p className="text-xs text-emerald-600 font-medium">• You're taking your first steps in your learning journey!</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm space-y-8">
              <h3 className="text-lg font-bold text-slate-800">Key Metrics</h3>
              <div className="space-y-6">
                {[
                  { label: 'Avg. Daily Logins', value: '0', icon: LogIn },
                  { label: 'Avg. Study Time', value: '0h', icon: Clock },
                  { label: 'Assignment Rate', value: '100%', icon: TrendingUp },
                  { label: 'Activity Consistency', value: '100%', icon: Activity },
                ].map((m, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <m.icon size={14} className="text-slate-400" />
                      <span className="text-xs text-slate-500 font-bold">{m.label}</span>
                    </div>
                    <span className="text-sm font-black text-slate-800">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Activity Patterns':
        return (
          <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm space-y-8 animate-in fade-in duration-500 min-h-[400px]">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
               <Activity size={20} className="text-indigo-600" /> Activity Patterns (Last 7 Days)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-indigo-50/30 p-8 rounded-3xl border border-indigo-50">
                <div className="flex items-center gap-3 text-indigo-600 mb-2">
                  <Clock size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">Avg. Study Time</span>
                </div>
                <p className="text-4xl font-black text-slate-900">0h</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">per day</p>
              </div>
              <div className="bg-blue-50/30 p-8 rounded-3xl border border-blue-50">
                <div className="flex items-center gap-3 text-blue-600 mb-2">
                  <TrendingUp size={20} />
                  <span className="text-xs font-bold uppercase tracking-wider">Avg. Logins</span>
                </div>
                <p className="text-4xl font-black text-slate-900">0</p>
                <p className="text-xs text-slate-400 mt-1 font-medium">per day</p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center pt-20 text-slate-300">
               <p className="text-sm font-medium">Not enough data yet. Keep studying!</p>
            </div>
          </div>
        );
      case 'Recommendations':
        return (
          <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm animate-in fade-in duration-500 min-h-[400px]">
             <div className="p-6 bg-white border border-slate-100 border-l-4 border-l-emerald-500 rounded-2xl flex items-center gap-6 shadow-sm">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Compass size={24} />
                </div>
                <div>
                   <h4 className="font-black text-slate-900 leading-none">Just Getting Started!</h4>
                   <p className="text-sm text-slate-500 mt-2">Keep using the platform regularly so we can provide personalized insights.</p>
                </div>
             </div>
          </div>
        );
      case 'Support Resources':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Emergency Support */}
            <div className="bg-rose-50 border border-rose-100 rounded-[2rem] p-8 shadow-sm">
               <div className="flex items-center gap-3 text-rose-600 mb-6 font-black">
                 <AlertCircle size={20} />
                 <h3 className="text-lg">Emergency Support</h3>
               </div>
               <div className="bg-white p-6 rounded-2xl border border-rose-100 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                      <Phone size={24} />
                    </div>
                    <div>
                       <h4 className="font-black text-slate-900">24/7 Crisis Hotline</h4>
                       <p className="text-xs text-slate-500 mt-1 max-w-lg leading-relaxed">National crisis support available 24/7. Trained counselors provide immediate support for anyone in emotional distress or crisis.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                     <button className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 shadow-lg shadow-rose-100">
                        <Phone size={16} /> 988
                     </button>
                     <button className="bg-white border border-slate-200 text-slate-700 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50">
                        <ExternalLink size={16} /> Visit Website
                     </button>
                  </div>
               </div>
            </div>

            {/* Support Resources List */}
            <div className="bg-white border border-slate-200 rounded-[2rem] p-10 shadow-sm space-y-6">
               <div className="flex items-center gap-3 text-indigo-600 mb-4 font-black">
                 <Heart size={20} />
                 <h3 className="text-lg">Support Resources</h3>
               </div>
               <div className="grid grid-cols-1 gap-6">
                  {[
                    { title: 'Campus Counseling Services', desc: 'Free, confidential counseling services for all students. Professional counselors available for individual sessions, group therapy, and crisis intervention.', icon: Users, type: 'School Resource' },
                    { title: 'Meditation & Mindfulness App', desc: 'Free access to Headspace for all students. Guided meditations, sleep sounds, and mindfulness exercises to reduce stress and improve focus.', icon: Activity, type: 'School Resource' },
                    { title: 'Academic Success Workshops', desc: 'Weekly workshops on time management, stress reduction, study techniques, and work-life balance. Open to all students.', icon: BookOpen, type: 'School Resource' },
                    { title: 'Peer Support Groups', desc: 'Student-led support groups meeting weekly. Share experiences, coping strategies, and build community with fellow students facing similar challenges.', icon: Users, type: 'School Resource' },
                    { title: 'Understanding Academic Stress', desc: 'Comprehensive guide on recognizing and managing academic stress, including practical strategies and self-care tips.', icon: BookOpen, type: 'School Resource' },
                    { title: 'Campus Recreation & Fitness', desc: 'Free access to fitness center, yoga classes, and recreational sports. Physical activity is proven to reduce stress and improve mental well-being.', icon: Dumbbell, type: 'School Resource' },
                  ].map((resource, i) => (
                    <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-100 transition-all group">
                       <div className="flex items-start gap-6">
                          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <resource.icon size={24} />
                          </div>
                          <div className="flex-1">
                             <div className="flex items-center gap-3">
                                <h4 className="font-black text-slate-900">{resource.title}</h4>
                                <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">{resource.type}</span>
                             </div>
                             <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-2xl">{resource.desc}</p>
                             <div className="flex gap-4 mt-4">
                                {resource.title.includes('Counseling') ? (
                                   <>
                                      <button className="text-xs font-bold text-slate-600 flex items-center gap-2 hover:text-indigo-600"><LogIn size={14} /> Email</button>
                                      <button className="text-xs font-bold text-slate-600 flex items-center gap-2 hover:text-indigo-600"><Phone size={14} /> Call</button>
                                   </>
                                ) : resource.title.includes('Workshops') ? (
                                   <button className="text-xs font-bold text-slate-600 flex items-center gap-2 hover:text-indigo-600"><LogIn size={14} /> Email</button>
                                ) : (
                                   <button className="text-xs font-bold text-slate-600 flex items-center gap-2 hover:text-indigo-600"><ExternalLink size={14} /> Learn More</button>
                                )}
                             </div>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex justify-between items-start">
        <div className="flex items-center gap-6">
           <button className="p-2 hover:bg-slate-100 rounded-full text-rose-500"><Heart size={20} /></button>
           <div>
             <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
               <Heart className="fill-rose-500 text-rose-500" size={24} /> Wellness Dashboard
             </h1>
             <p className="text-sm text-slate-500">Understanding your learning patterns to support your success</p>
           </div>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50">
          <RefreshCcw size={16} /> Refresh Analysis
        </button>
      </header>

      <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 flex gap-6">
         <Shield className="text-indigo-500 shrink-0" size={24} />
         <div>
            <h4 className="text-sm font-bold text-indigo-900">Privacy & Ethics</h4>
            <p className="text-xs text-indigo-700/80 mt-1 leading-relaxed">
              This dashboard analyzes your learning activity patterns to provide supportive insights. It does not diagnose medical or psychological conditions and is not a substitute for professional mental health support. All data is used solely to help you succeed academically.
            </p>
         </div>
      </div>

      <nav className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
         {['Overview', 'Activity Patterns', 'Recommendations', 'Support Resources'].map((tab) => (
           <button 
            key={tab} 
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             {tab === 'Overview' && <Heart size={14} className={activeTab === 'Overview' ? 'text-rose-500 fill-rose-500' : 'text-slate-400'} />}
             {tab === 'Activity Patterns' && <Activity size={14} className={activeTab === tab ? 'text-indigo-500' : 'text-slate-400'} />}
             {tab === 'Recommendations' && <Compass size={14} className={activeTab === tab ? 'text-emerald-500' : 'text-slate-400'} />}
             {tab === 'Support Resources' && <BookOpen size={14} className={activeTab === tab ? 'text-blue-500' : 'text-slate-400'} />}
             {tab}
           </button>
         ))}
      </nav>

      {renderTabContent()}

      {activeTab === 'Overview' && (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] p-20 shadow-sm text-center flex flex-col items-center">
          <CheckCircle size={48} className="text-emerald-500 mb-6" />
          <p className="text-sm font-bold text-slate-700">No concerning patterns detected. Keep up the good work!</p>
        </div>
      )}
    </div>
  );
};

export default WellnessView;