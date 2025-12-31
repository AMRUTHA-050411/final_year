import React, { useState } from 'react';
import { 
  ShieldAlert, 
  BarChart3, 
  User, 
  Calendar, 
  Activity, 
  TrendingUp, 
  Info, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  RefreshCcw,
  GraduationCap,
  Percent
} from 'lucide-react';
import { getAcademicRiskAssessment } from '../services/geminiService';

interface RiskResult {
  studentName: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  dropoutProbability: number;
  factors: string[];
  recommendations: string[];
  reviewIntervalDays: number;
}

const RiskAssessmentView: React.FC = () => {
  // Using strings for numeric inputs in state allows them to be empty/cleared easily 
  // without a default '0' getting in the way.
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    attendance: '85',
    assignmentScore: '75',
    internalsScore: '70',
    extraActivitiesScore: '5',
    previousGPA: '7.5'
  });

  const [isAssessing, setIsAssessing] = useState(false);
  const [result, setResult] = useState<RiskResult | null>(null);

  const handleAssess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    setIsAssessing(true);
    try {
      // Cast string inputs back to numbers for the API call
      const payload = {
        name: formData.name,
        studentId: formData.studentId,
        attendance: Number(formData.attendance),
        assignmentScore: Number(formData.assignmentScore),
        internalsScore: Number(formData.internalsScore),
        extraActivitiesScore: Number(formData.extraActivitiesScore),
        previousGPA: Number(formData.previousGPA),
      };

      const assessment = await getAcademicRiskAssessment(payload);
      setResult(assessment);
    } catch (err) {
      alert("Assessment failed. Please try again.");
    } finally {
      setIsAssessing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'Moderate': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'High': return 'text-rose-500 bg-rose-50 border-rose-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'Low': return <CheckCircle2 size={24} />;
      case 'Moderate': return <AlertTriangle size={24} />;
      case 'High': return <XCircle size={24} />;
      default: return <Info size={24} />;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-32">
      <header className="flex justify-between items-start">
        <div className="flex items-center gap-6">
           <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl">
             <ShieldAlert size={28} />
           </div>
           <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Academic Risk Predictor</h1>
             <p className="text-sm text-slate-500 font-medium">Predictive performance analytics for academic success</p>
           </div>
        </div>
      </header>

      <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] p-6 flex gap-6 items-start">
         <div className="p-2 bg-indigo-600 text-white rounded-xl">
           <Info size={20} />
         </div>
         <div>
            <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Ethics & Privacy Compliance</h4>
            <p className="text-xs text-indigo-700/80 mt-1 leading-relaxed">
              This module evaluates academic performance risk using <b>strictly academic inputs</b>. It does not access social, peer, or behavioral data. No behavioral or mental health diagnosis is performed. Assessments are based on performance consistency and trends.
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Form Section */}
        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-sm space-y-8">
           <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
             <BarChart3 className="text-indigo-600" size={24} />
             <h3 className="text-xl font-black text-slate-900">Academic Indicators</h3>
           </div>

           <form onSubmit={handleAssess} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                      placeholder="e.g. Bhavana"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Student ID (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.studentId}
                    onChange={e => setFormData({...formData, studentId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="ID-2025-01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attendance Percentage (%)</label>
                  <input 
                    type="number" min="0" max="100" 
                    value={formData.attendance}
                    onChange={e => setFormData({...formData, attendance: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assignments Score (/100)</label>
                  <input 
                    type="number" min="0" max="100" 
                    value={formData.assignmentScore}
                    onChange={e => setFormData({...formData, assignmentScore: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Internals Score (/100)</label>
                  <input 
                    type="number" min="0" max="100" 
                    value={formData.internalsScore}
                    onChange={e => setFormData({...formData, internalsScore: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Previous GPA (0-10)</label>
                    <div className="relative">
                      <TrendingUp className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        type="number" step="0.01" min="0" max="10"
                        value={formData.previousGPA}
                        onChange={e => setFormData({...formData, previousGPA: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        placeholder="0.00"
                      />
                    </div>
                 </div>
              </div>

              <div className="space-y-2 pt-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Extra Activities (0-10)</label>
                  <div className="relative">
                    <Activity className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="number" step="0.5" min="0" max="10"
                      value={formData.extraActivitiesScore}
                      onChange={e => setFormData({...formData, extraActivitiesScore: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      placeholder="0"
                    />
                  </div>
              </div>

              <button 
                type="submit"
                disabled={isAssessing || !formData.name}
                className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isAssessing ? <RefreshCcw className="animate-spin" size={20} /> : <Sparkles size={20} />}
                {isAssessing ? "Analyzing Metrics..." : "Run Assessment"}
              </button>
           </form>
        </div>

        {/* Results Section */}
        <div className="space-y-8">
           {result ? (
             <div className="space-y-8 animate-in slide-in-from-right-8 duration-700">
               {/* Risk Level & Dropout Prob Hero */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className={`bg-white border rounded-[3rem] p-10 shadow-sm flex flex-col items-center text-center space-y-4 ${getRiskColor(result.riskLevel).split(' ')[2]}`}>
                    <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-lg mb-2 ${getRiskColor(result.riskLevel).split(' ').slice(0, 2).join(' ')}`}>
                      {getRiskIcon(result.riskLevel)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Level</p>
                      <h2 className={`text-2xl font-black ${getRiskColor(result.riskLevel).split(' ')[0]}`}>{result.riskLevel}</h2>
                    </div>
                 </div>

                 <div className={`bg-white border rounded-[3rem] p-10 shadow-sm flex flex-col items-center text-center space-y-4 ${result.dropoutProbability > 60 ? 'border-rose-100 bg-rose-50/50' : 'border-emerald-100 bg-emerald-50/50'}`}>
                    <div className={`w-16 h-16 rounded-[1.25rem] flex items-center justify-center shadow-lg mb-2 ${result.dropoutProbability > 60 ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                      <Percent size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dropout Probability</p>
                      <h2 className={`text-2xl font-black ${result.dropoutProbability > 60 ? 'text-rose-500' : 'text-emerald-500'}`}>{result.dropoutProbability}%</h2>
                    </div>
                 </div>
               </div>

               {/* Factors Card */}
               <div className="bg-white border border-slate-200 rounded-[3rem] p-8 shadow-sm space-y-6">
                 <div className="flex items-center gap-3">
                   <div className="p-2 bg-slate-100 rounded-xl text-slate-500">
                     <Activity size={18} />
                   </div>
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Key Academic Factors</h4>
                 </div>
                 <div className="space-y-3">
                    {result.factors.map((f, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 animate-in fade-in duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                        <p className="text-xs font-bold text-slate-700 leading-relaxed">{f}</p>
                      </div>
                    ))}
                 </div>
               </div>

               {/* Recommendations Card - LIGHT COLOR SCHEME UPDATED HERE */}
               <div className="bg-indigo-50 border border-indigo-100 rounded-[3rem] p-10 shadow-sm space-y-8 text-indigo-900">
                 <div className="flex items-center gap-3">
                    <Sparkles size={24} className="text-indigo-600" />
                    <h4 className="text-lg font-black tracking-tight">AI Improvement Strategy</h4>
                 </div>
                 <div className="grid grid-cols-1 gap-4">
                    {result.recommendations.map((r, i) => (
                      <div key={i} className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-indigo-100 hover:border-indigo-300 transition-colors shadow-sm">
                        <ArrowRight size={18} className="text-indigo-600" />
                        <p className="text-sm font-bold text-indigo-800">{r}</p>
                      </div>
                    ))}
                 </div>
                 <div className="pt-6 border-t border-indigo-200 flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Suggested Review</span>
                    <span className="text-sm font-black text-indigo-700">In {result.reviewIntervalDays} Days</span>
                 </div>
               </div>
             </div>
           ) : (
             <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] p-20 flex flex-col items-center justify-center text-center space-y-6 opacity-60">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm">
                   <ShieldAlert size={48} className="text-slate-200" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-400">Ready for Predictor</h3>
                  <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">Enter the student's academic metrics and click "Run Assessment" to generate an AI-powered risk report.</p>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default RiskAssessmentView;