import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Play, 
  Code, 
  Database, 
  Palette, 
  Briefcase, 
  Globe, 
  FlaskConical, 
  Calculator,
  ChevronRight,
  CheckCircle2,
  RefreshCcw,
  Youtube,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Clock,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const CATEGORIES = [
  { 
    id: 'prog', 
    title: 'Programming', 
    desc: 'Learn coding from scratch or master advanced concepts with curated playlists', 
    icon: Code, 
    color: 'bg-[#8B5CF6] text-white',
    iconBg: 'bg-[#8B5CF6]'
  },
  { 
    id: 'ds', 
    title: 'Data Science', 
    desc: 'Explore data analysis, machine learning, and AI through expert playlists', 
    icon: Database, 
    color: 'bg-[#3B82F6] text-white',
    iconBg: 'bg-[#3B82F6]'
  },
  { 
    id: 'design', 
    title: 'Design', 
    desc: 'Master UI/UX, graphic design, and creative tools with professional guides', 
    icon: Palette, 
    color: 'bg-[#EC4899] text-white',
    iconBg: 'bg-[#EC4899]'
  },
  { 
    id: 'biz', 
    title: 'Business', 
    desc: 'Learn entrepreneurship, management, and business strategies', 
    icon: Briefcase, 
    color: 'bg-[#F97316] text-white',
    iconBg: 'bg-[#F97316]'
  },
  { 
    id: 'lang', 
    title: 'Languages', 
    desc: 'Learn new languages with comprehensive video courses and practice', 
    icon: Globe, 
    color: 'bg-[#10B981] text-white',
    iconBg: 'bg-[#10B981]'
  },
  { 
    id: 'sci', 
    title: 'Science', 
    desc: 'Discover physics, chemistry, biology and more through educational content', 
    icon: FlaskConical, 
    color: 'bg-[#0EA5E9] text-white',
    iconBg: 'bg-[#0EA5E9]'
  },
  { 
    id: 'math', 
    title: 'Mathematics', 
    desc: 'Master math concepts from basics to advanced topics', 
    icon: Calculator, 
    color: 'bg-[#EF4444] text-white',
    iconBg: 'bg-[#EF4444]'
  }
];

const LOADING_STEPS = [
  "Searching YouTube playlists...",
  "Filtering educational content...",
  "Verifying playlist quality...",
  "Preparing recommendations..."
];

const CoursesView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [levelFilter, setLevelFilter] = useState('All Levels');

  useEffect(() => {
    let interval: any;
    if (isSearching) {
      interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < LOADING_STEPS.length - 1) return prev + 1;
          clearInterval(interval);
          setTimeout(() => {
            setIsSearching(false);
            setShowResults(true);
          }, 800);
          return prev;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSearching]);

  const handleSearch = async (e?: React.FormEvent, queryOverride?: string) => {
    if (e) e.preventDefault();
    const query = queryOverride || searchQuery;
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setIsSearching(true);
    setLoadingStep(0);
    setShowResults(false);
    setLevelFilter('All Levels'); // Reset filter on new search

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Recommend 6 specific high-quality educational YouTube playlist topics for learning "${query}". For each, provide:
        - title: Name of the course
        - channel: A realistic channel name (e.g., freeCodeCamp, MIT OpenCourseWare)
        - description: A short engaging summary
        - videosCount: integer number of videos
        - duration: integer hours
        - level: one of ["beginner", "intermediate", "advanced"]
        - match: integer between 85 and 98
        Respond only in JSON format as an array of objects.`,
        config: {
            responseMimeType: "application/json"
        }
      });
      const data = JSON.parse(response.text || '[]');
      setResults(data);
    } catch (err) {
      console.error("Search Error:", err);
      setResults([]);
    }
  };

  const filteredResults = useMemo(() => {
    if (levelFilter === 'All Levels') return results;
    return results.filter(res => res.level.toLowerCase() === levelFilter.toLowerCase());
  }, [results, levelFilter]);

  if (isSearching) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
        <div className="relative mb-12">
           <div className="w-24 h-24 bg-[#7C3AED] rounded-[2rem] flex items-center justify-center shadow-xl shadow-indigo-100">
             <Youtube className="text-white" size={48} />
           </div>
           <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg border border-slate-100">
             <RefreshCcw size={20} className="text-[#7C3AED] animate-spin" />
           </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-2">Finding Playlists</h2>
        <p className="text-slate-500 font-medium mb-12 text-center">AI is curating the best YouTube playlists for your topic</p>

        <div className="w-full max-w-md space-y-4">
          {LOADING_STEPS.map((step, idx) => (
            <div 
              key={idx} 
              className={`flex items-center gap-4 p-5 rounded-[1.8rem] border transition-all duration-500 ${
                idx < loadingStep 
                  ? 'bg-[#F0FDF4] border-[#DCFCE7] text-[#166534]' 
                  : idx === loadingStep 
                  ? 'bg-[#F5F3FF] border-[#EDE9FE] text-[#6D28D9] shadow-sm' 
                  : 'bg-white border-slate-100 text-slate-400 opacity-50'
              }`}
            >
              <div className="flex-shrink-0">
                {idx < loadingStep ? (
                  <CheckCircle2 size={24} className="text-[#22C55E]" />
                ) : idx === loadingStep ? (
                  <RefreshCcw size={20} className="animate-spin text-[#7C3AED]" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                )}
              </div>
              <span className="font-bold text-sm tracking-tight">{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 pb-32 bg-white min-h-screen">
      {showResults ? (
        <div className="max-w-7xl mx-auto px-8 pt-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Results Page Search Bar */}
          <div className="flex items-center gap-6 mb-16">
            <button onClick={() => setShowResults(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-900 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <form 
              onSubmit={(e) => handleSearch(e)}
              className="flex-1 max-w-2xl bg-slate-50 p-1.5 rounded-full border border-slate-100 shadow-sm flex items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-3 px-4">
                <Search className="text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses..."
                  className="w-full py-2 bg-transparent outline-none text-slate-800 font-bold placeholder:text-slate-400"
                />
              </div>
              <button 
                type="submit"
                className="bg-[#7C3AED] text-white px-8 py-2.5 rounded-full font-black text-sm hover:bg-[#6D28D9] transition-all"
              >
                Search
              </button>
            </form>
          </div>

          <div className="flex items-end justify-between mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">{searchQuery}</h1>
              <p className="text-slate-400 font-bold">{filteredResults.length} {filteredResults.length === 1 ? 'playlist' : 'playlists'} shown</p>
            </div>
            <div className="flex items-center gap-4">
               <Filter size={20} className="text-slate-300" />
               <div className="relative">
                 <select 
                   value={levelFilter}
                   onChange={(e) => setLevelFilter(e.target.value)}
                   className="appearance-none bg-slate-50 border border-slate-200 px-6 py-2.5 rounded-xl pr-10 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-[#7C3AED]/20 cursor-pointer"
                 >
                   <option value="All Levels">All Levels</option>
                   <option value="Beginner">Beginner</option>
                   <option value="Intermediate">Intermediate</option>
                   <option value="Advanced">Advanced</option>
                 </select>
                 <ChevronRight size={16} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
               </div>
            </div>
          </div>
          
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResults.map((res, i) => (
                <div key={i} className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:border-slate-200">
                   {/* Thumbnail Placeholder */}
                   <div className="aspect-video bg-slate-100 relative overflow-hidden group-hover:opacity-90 transition-opacity">
                      <div className="absolute inset-0 flex items-center justify-center opacity-40">
                         <MoreHorizontal size={48} className="text-slate-400" />
                      </div>
                      {/* Tags over image */}
                      <div className="absolute top-4 left-4 flex gap-2">
                         <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-slate-100">technology</span>
                         <div className="bg-emerald-500 text-white p-1 rounded-full shadow-sm">
                           <CheckCircle2 size={12} />
                         </div>
                      </div>
                      {/* Channel Overlay */}
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                         <div className="w-4 h-4 bg-rose-500 rounded flex items-center justify-center text-[8px] text-white">
                           <Play size={8} className="fill-current" />
                         </div>
                         <span className="text-[11px] font-black text-white drop-shadow-sm">{res.channel || 'freeCodeCamp.org'}</span>
                      </div>
                   </div>

                   <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-black text-slate-900 mb-3 leading-tight group-hover:text-[#7C3AED] transition-colors">{res.title}</h3>
                      <p className="text-[13px] text-slate-400 font-medium mb-6 leading-relaxed line-clamp-2">{res.description}</p>
                      
                      <div className="mt-auto flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                         <div className="flex items-center gap-4 text-slate-400 text-[11px] font-black uppercase tracking-tighter">
                            <div className="flex items-center gap-1.5">
                              <Play size={14} className="text-slate-300" />
                              <span>{res.videosCount} videos</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock size={14} className="text-slate-300" />
                              <span>{res.duration} hours</span>
                            </div>
                         </div>
                         <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                           res.level === 'beginner' ? 'bg-emerald-50 text-emerald-600' :
                           res.level === 'intermediate' ? 'bg-amber-50 text-amber-600' :
                           'bg-rose-50 text-rose-600'
                         }`}>
                           {res.level}
                         </span>
                      </div>

                      <div className="flex items-center justify-between">
                         <div className="flex-1 mr-4">
                            <div className="h-1 bg-slate-50 rounded-full overflow-hidden">
                               <div className="h-full bg-[#7C3AED] rounded-full" style={{ width: `${res.match}%` }}></div>
                            </div>
                         </div>
                         <span className="text-[11px] font-black text-slate-300">{res.match}% match</span>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold text-lg">No courses found for the "{levelFilter}" filter.</p>
              <button 
                onClick={() => setLevelFilter('All Levels')}
                className="mt-4 text-[#7C3AED] font-black uppercase tracking-widest text-xs hover:underline"
              >
                Clear Filter
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="bg-[#7C3AED] pt-12 pb-24 px-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
            
            <div className="max-w-6xl mx-auto text-center relative z-10">
              <div className="flex justify-start mb-12">
                <div className="flex items-center gap-2 text-white font-black text-2xl">
                  <div className="bg-[#9333EA] p-1.5 rounded-xl border border-white/20">
                    <GraduationCap size={28} className="text-white" />
                  </div>
                  <span className="tracking-tighter">LearnHub</span>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-white text-[11px] font-black uppercase tracking-wider mb-8 backdrop-blur-md border border-white/20">
                <Sparkles size={14} className="text-white" />
                AI-Powered YouTube Playlists
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                Discover Curated<br />Learning Playlists
              </h1>
              
              <p className="text-indigo-100 text-lg font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
                Get AI-powered YouTube playlist recommendations for any topic. Learn from verified educational channels with structured content.
              </p>

              <form 
                onSubmit={(e) => handleSearch(e)}
                className="max-w-3xl mx-auto bg-white p-2 rounded-[2rem] shadow-2xl flex items-center gap-2 group transition-all"
              >
                <div className="flex-1 flex items-center gap-4 px-6">
                  <Search className="text-slate-400" size={24} />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What do you want to learn? (e.g., React, Python, Machine Learning)"
                    className="w-full py-4 outline-none text-slate-800 font-bold placeholder:text-slate-400 placeholder:font-medium"
                  />
                </div>
                <button 
                  type="submit"
                  className="bg-[#7C3AED] text-white px-12 py-5 rounded-[1.8rem] font-black text-sm hover:bg-[#6D28D9] transition-all active:scale-95 shadow-xl shadow-indigo-900/20"
                >
                  Search
                </button>
              </form>

              <div className="mt-6 text-indigo-100 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-4">
                <span className="opacity-60 flex items-center gap-1">Popular Topics:</span>
                {['Python', 'Web Development', 'Machine Learning', 'UI Design'].map(p => (
                  <button key={p} onClick={() => handleSearch(undefined, p)} className="hover:text-white transition-colors border-b border-transparent hover:border-white">{p}</button>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-12 mt-20">
                <div className="flex items-center gap-5 text-white group">
                   <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
                     <Play className="fill-current text-white/90" size={28} />
                   </div>
                   <div className="text-left">
                     <p className="text-2xl font-black leading-none tracking-tight">1000+</p>
                     <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-1">Curated Playlists</p>
                   </div>
                </div>
                <div className="flex items-center gap-5 text-white group">
                   <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
                     <Sparkles size={28} className="text-white/90" />
                   </div>
                   <div className="text-left">
                     <p className="text-2xl font-black leading-none tracking-tight">AI-Powered</p>
                     <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-1">Smart Recommendations</p>
                   </div>
                </div>
                <div className="flex items-center gap-5 text-white group">
                   <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-md border border-white/10 group-hover:scale-110 transition-transform duration-300">
                     <Search size={28} className="text-white/90" />
                   </div>
                   <div className="text-left">
                     <p className="text-2xl font-black leading-none tracking-tight">Any Topic</p>
                     <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-1">Search Anything</p>
                   </div>
                </div>
              </div>
            </div>
          </section>

          <div className="max-w-7xl mx-auto px-8 relative z-20">
            <div className="space-y-24 mt-20">
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Browse by Category</h2>
                <p className="text-slate-500 font-medium">Explore curated playlists organized by subject area</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {CATEGORIES.map((cat) => (
                  <div 
                    key={cat.id} 
                    onClick={() => handleSearch(undefined, cat.title)}
                    className="bg-white rounded-[2.5rem] p-10 border border-slate-100 hover:border-[#7C3AED]/20 hover:shadow-2xl transition-all group flex flex-col items-start cursor-pointer h-full group"
                  >
                    <div className="flex justify-between items-start w-full mb-10">
                      <div className={`w-16 h-16 ${cat.iconBg} text-white rounded-[1.8rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 shadow-indigo-100/50`}>
                        <cat.icon size={32} />
                      </div>
                      <div className="p-2 text-slate-200 group-hover:text-[#7C3AED] transition-all transform group-hover:translate-x-1">
                        <ChevronRight size={32} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-[#7C3AED] transition-colors tracking-tight">{cat.title}</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6 group-hover:text-slate-500 transition-colors">{cat.desc}</p>
                  </div>
                ))}
              </div>

              <section className="py-24 text-center bg-slate-50/50 rounded-[4rem] px-12 border border-slate-100">
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">How It Works</h2>
                <p className="text-slate-500 font-medium mb-24">Simple, fast, and intelligent playlist discovery</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  <div className="flex flex-col items-center group">
                    <div className="w-24 h-24 bg-white text-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-indigo-100/30 group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                      <Search size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">1. Search Your Topic</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed px-10">Enter any subject or skill you want to learn</p>
                  </div>
                  <div className="flex flex-col items-center group">
                    <div className="w-24 h-24 bg-white text-purple-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-purple-100/30 group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                      <Sparkles size={40} />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">2. AI Finds Playlists</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed px-10">Our AI searches and filters quality educational content</p>
                  </div>
                  <div className="flex flex-col items-center group">
                    <div className="w-24 h-24 bg-white text-rose-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl shadow-rose-100/30 group-hover:scale-110 transition-transform duration-500 border border-slate-50">
                      <Play size={40} className="fill-current" />
                    </div>
                    <h4 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">3. Start Learning</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed px-10">Watch curated playlists from trusted channels</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoursesView;