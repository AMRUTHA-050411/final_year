import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Trash2, 
  ListOrdered, 
  Eye,
  Check,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RefreshCcw,
  Zap,
  Target,
  Trophy,
  Award,
  AlertCircle
} from 'lucide-react';
import { Assignment, Question } from '../types';
import { generateMCQAssignment } from '../services/geminiService';

interface AssignmentsViewProps {
  assignments: Assignment[];
  onAddAssignment: (assignment: Omit<Assignment, 'id' | 'userId' | 'status'>) => void;
  onUpdateStatus: (id: string, status: 'pending' | 'completed', score?: number, userAnswers?: Record<number, number>) => void;
  onRemove: (id: string) => void;
}

const AssignmentsView: React.FC<AssignmentsViewProps> = ({ 
  assignments, 
  onAddAssignment,
  onUpdateStatus, 
  onRemove 
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [activeQuiz, setActiveQuiz] = useState<Assignment | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewingResult, setViewingResult] = useState<Assignment | null>(null);
  
  // Generator State
  const [genSubject, setGenSubject] = useState('');
  const [genComplexity, setGenComplexity] = useState('Intermediate');
  const genCount = 20;

  const now = Date.now();
  const pendingAssignments = assignments.filter(a => a.status === 'pending');
  const completedAssignments = assignments.filter(a => a.status === 'completed');

  const handleGenerate = async () => {
    if (!genSubject.trim()) return;
    setIsGenerating(true);
    try {
      const data = await generateMCQAssignment(genSubject, genComplexity, genCount);
      onAddAssignment({
        title: data.title,
        subject: data.subject,
        deadline: Date.now() + 86400000 * 7,
        priority: genComplexity === 'Advanced' ? 'high' : genComplexity === 'Intermediate' ? 'medium' : 'low',
        type: 'mcq',
        questions: data.questions
      });
      setIsGeneratorOpen(false);
      setGenSubject('');
    } catch (error) {
      alert("Failed to generate assignment. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartQuiz = (assignment: Assignment) => {
    setActiveQuiz(assignment);
    setQuizAnswers({});
    setCurrentQuestionIdx(0);
  };

  const handleSelectAnswer = (questionIdx: number, answerIdx: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionIdx]: answerIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activeQuiz || !activeQuiz.questions) return;
    
    let correctCount = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / activeQuiz.questions.length) * 100);
    onUpdateStatus(activeQuiz.id, 'completed', score, quizAnswers);
    setActiveQuiz(null);
    setViewingResult({ ...activeQuiz, score, userAnswers: quizAnswers, status: 'completed' });
  };

  const getPriorityColor = (priority: Assignment['priority']) => {
    switch (priority) {
      case 'high': return 'text-rose-500 bg-rose-50 border-rose-100';
      case 'medium': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'low': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const displayList = activeTab === 'pending' ? pendingAssignments : completedAssignments;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <header className="flex justify-between items-start">
        <div className="flex items-center gap-6">
           <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm border border-indigo-100">
             <Calendar size={24} />
           </div>
           <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Assignments</h1>
             <p className="text-sm text-slate-500 font-medium">Challenge yourself with AI-generated assessments</p>
           </div>
        </div>
        <button 
          onClick={() => setIsGeneratorOpen(true)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Sparkles size={18} /> Smart Generate
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="md:col-span-3 bg-white border border-slate-200 rounded-[2.5rem] p-8 flex items-center gap-6 shadow-sm transition-all hover:shadow-md">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-100"><Trophy size={32} /></div>
            <div>
              <p className="text-4xl font-black text-slate-800 leading-none">{completedAssignments.length}</p>
              <p className="text-[11px] text-slate-400 font-black uppercase tracking-widest mt-2">Total Completed Assignments</p>
            </div>
         </div>
      </div>

      <div className="space-y-6">
        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
           <button 
             onClick={() => setActiveTab('pending')}
             className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Pending ({pendingAssignments.length})
           </button>
           <button 
             onClick={() => setActiveTab('completed')}
             className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'completed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
           >
             Completed ({completedAssignments.length})
           </button>
        </div>

        {displayList.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {displayList.map(a => {
              const isOverdue = a.status === 'pending' && a.deadline < now;
              return (
                <div key={a.id} className={`bg-white border p-6 rounded-[2rem] shadow-sm flex items-center justify-between group transition-all hover:shadow-md ${isOverdue ? 'border-rose-100 bg-rose-50/10' : 'border-slate-100'}`}>
                  <div className="flex items-center gap-6 flex-1 min-w-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                        a.status === 'completed' 
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-500' 
                          : 'bg-slate-50 border-slate-100 text-slate-400'
                      }`}>
                      {a.status === 'completed' ? <Award size={28} /> : <Zap size={28} />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className={`font-black text-lg truncate ${a.status === 'completed' ? 'text-slate-800' : 'text-slate-800'}`}>
                          {a.title}
                        </h4>
                        {a.status === 'completed' && a.score !== undefined && (
                          <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg">
                            Score: {a.score}%
                          </span>
                        )}
                        {a.type === 'mcq' && (
                          <span className="bg-amber-100 text-amber-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0">
                            <ListOrdered size={10} /> MCQ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2.5 py-1 rounded-lg">
                          {a.subject}
                        </span>
                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`}>
                          <Clock size={12} />
                          {new Date(a.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </div>
                        <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getPriorityColor(a.priority)}`}>
                          {a.priority} Priority
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {a.status === 'pending' && a.type === 'mcq' ? (
                      <button 
                        onClick={() => handleStartQuiz(a)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                      >
                        Start Quiz
                      </button>
                    ) : a.status === 'completed' && a.type === 'mcq' ? (
                      <button 
                        onClick={() => setViewingResult(a)}
                        className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                      >
                        Review Result
                      </button>
                    ) : null}
                    <button 
                      onClick={() => onRemove(a.id)}
                      className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <section className="bg-white border border-slate-200 rounded-[3rem] p-24 shadow-sm text-center flex flex-col items-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100">
                <Calendar size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No {activeTab} assignments</h3>
            <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">Use the Smart Generate tool to create personalized MCQ assessments based on your study topics.</p>
          </section>
        )}
      </div>

      {/* Quiz Modal */}
      {activeQuiz && activeQuiz.questions && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 h-[85vh]">
            <header className="p-10 pb-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
                   <Target size={24} />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activeQuiz.title}</h2>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}</p>
                 </div>
               </div>
               <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Progress</p>
                     <p className="text-sm font-black text-indigo-600">{Math.round(((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100)}%</p>
                  </div>
                  <button onClick={() => { if(confirm("Are you sure you want to exit the quiz? Progress will be lost.")) setActiveQuiz(null); }} className="p-3 text-slate-300 hover:text-slate-900 transition-colors">
                    <X size={24} />
                  </button>
               </div>
            </header>

            {/* Progress Bar */}
            <div className="h-1.5 bg-slate-100 w-full overflow-hidden shrink-0">
               <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${((currentQuestionIdx + 1) / activeQuiz.questions.length) * 100}%` }}></div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
               <div className="max-w-2xl mx-auto space-y-10">
                 <div className="space-y-4">
                    <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">Topic: {activeQuiz.subject}</span>
                    <h3 className="text-2xl font-bold text-slate-800 leading-snug">
                       {activeQuiz.questions[currentQuestionIdx].text}
                    </h3>
                 </div>

                 <div className="grid grid-cols-1 gap-4">
                    {activeQuiz.questions[currentQuestionIdx].options.map((option, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectAnswer(currentQuestionIdx, oIdx)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-5 ${
                          quizAnswers[currentQuestionIdx] === oIdx 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg' 
                            : 'border-white bg-white text-slate-600 hover:border-slate-100 shadow-sm'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 border-2 ${
                          quizAnswers[currentQuestionIdx] === oIdx ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-100 text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </div>
                        <span className="font-bold text-sm">{option}</span>
                      </button>
                    ))}
                 </div>
               </div>
            </div>

            <footer className="p-8 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
               <button 
                 disabled={currentQuestionIdx === 0}
                 onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                 className="px-8 py-3 border border-slate-200 rounded-xl text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-30 flex items-center gap-2"
               >
                 <ChevronLeft size={18} /> Previous
               </button>

               {currentQuestionIdx === activeQuiz.questions.length - 1 ? (
                 <button 
                   onClick={handleSubmitQuiz}
                   disabled={Object.keys(quizAnswers).length < activeQuiz.questions.length}
                   className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 disabled:opacity-50"
                 >
                   Submit Assessment
                 </button>
               ) : (
                 <button 
                   onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                   className="px-10 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
                 >
                   Next Question <ChevronRight size={18} />
                 </button>
               )}
            </footer>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {viewingResult && viewingResult.questions && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[160] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 max-h-[90vh]">
            <header className="p-10 pb-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
               <div className="flex items-center gap-4">
                 <div className={`p-3 rounded-2xl shadow-lg text-white ${viewingResult.score && viewingResult.score >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`}>
                   <Trophy size={24} />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assessment Report</h2>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{viewingResult.title}</p>
                 </div>
               </div>
               <button onClick={() => setViewingResult(null)} className="p-3 text-slate-300 hover:text-slate-900 transition-colors">
                 <X size={24} />
               </button>
            </header>

            <div className="flex-1 overflow-y-auto p-10 space-y-12 bg-slate-50/50">
               {/* Score Hero */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-10">
                    <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                       <svg className="w-full h-full -rotate-90">
                          <circle cx="64" cy="64" r="60" fill="transparent" stroke="#f1f5f9" strokeWidth="8" />
                          <circle cx="64" cy="64" r="60" fill="transparent" stroke={viewingResult.score && viewingResult.score >= 70 ? '#10b981' : '#f59e0b'} strokeWidth="8" strokeDasharray={377} strokeDashoffset={377 - (377 * (viewingResult.score || 0)) / 100} strokeLinecap="round" />
                       </svg>
                       <span className="absolute text-3xl font-black text-slate-800">{viewingResult.score}%</span>
                    </div>
                    <div>
                       <h3 className="text-2xl font-black text-slate-900">Great effort!</h3>
                       <p className="text-sm text-slate-500 mt-2">You've successfully completed the {viewingResult.subject} assessment. Review the breakdown below to identify areas for improvement.</p>
                    </div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center space-y-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Grade</p>
                     <div className={`text-6xl font-black ${viewingResult.score && viewingResult.score >= 90 ? 'text-emerald-500' : viewingResult.score && viewingResult.score >= 70 ? 'text-indigo-600' : 'text-amber-500'}`}>
                        {viewingResult.score && viewingResult.score >= 90 ? 'A+' : viewingResult.score && viewingResult.score >= 80 ? 'A' : viewingResult.score && viewingResult.score >= 70 ? 'B' : 'C'}
                     </div>
                  </div>
               </div>

               {/* Detailed Review */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 px-1">
                     <AlertCircle size={20} className="text-slate-400" />
                     <h3 className="text-lg font-black text-slate-800">Detailed Question Review</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {viewingResult.questions.map((q, idx) => {
                      const userAns = viewingResult.userAnswers?.[idx];
                      const isCorrect = userAns === q.correctAnswer;
                      return (
                        <div key={idx} className={`p-6 rounded-[2rem] border-2 bg-white transition-all ${isCorrect ? 'border-emerald-100' : 'border-rose-100'}`}>
                           <div className="flex items-start gap-5 mb-6">
                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${isCorrect ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                {idx + 1}
                              </span>
                              <p className="font-bold text-slate-800">{q.text}</p>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-12">
                             {q.options.map((opt, oIdx) => (
                               <div key={oIdx} className={`p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
                                 oIdx === q.correctAnswer 
                                   ? 'bg-emerald-50 border-emerald-500 text-emerald-700' 
                                   : oIdx === userAns 
                                   ? 'bg-rose-50 border-rose-500 text-rose-700'
                                   : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                               }`}>
                                 {oIdx === q.correctAnswer ? <CheckCircle size={16} /> : oIdx === userAns ? <X size={16} /> : <div className="w-4 h-4" />}
                                 {opt}
                               </div>
                             ))}
                           </div>
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>

            <footer className="p-8 bg-white border-t border-slate-100 flex justify-end">
               <button 
                 onClick={() => setViewingResult(null)}
                 className="bg-slate-900 text-white px-10 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
               >
                 Close Report
               </button>
            </footer>
          </div>
        </div>
      )}

      {/* AI Generator Modal (Simplified Trigger) */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
            <header className="p-10 pb-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg">
                   <Sparkles size={24} />
                 </div>
                 <div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI Quiz Generator</h2>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Generate high-quality MCQ assignments instantly</p>
                 </div>
               </div>
               {!isGenerating && (
                 <button onClick={() => setIsGeneratorOpen(false)} className="p-3 text-slate-300 hover:text-slate-900 transition-colors">
                   <X size={24} />
                 </button>
               )}
            </header>

            <div className="p-10 space-y-8">
              {isGenerating ? (
                <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                   <div className="relative">
                      <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center">
                        <RefreshCcw size={40} className="text-indigo-600 animate-spin" />
                      </div>
                      <Sparkles className="absolute -top-2 -right-2 text-amber-500 animate-pulse" size={24} />
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-slate-800">Constructing Your Quiz...</h3>
                     <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">Gemini is researching high-quality questions for {genSubject} at {genComplexity} level.</p>
                   </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Knowledge Domain (Subject)</label>
                    <div className="relative">
                      <Zap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        value={genSubject}
                        onChange={e => setGenSubject(e.target.value)}
                        placeholder="e.g., Quantum Physics, Ancient History, React Hooks..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Complexity Level</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                        <button
                          key={level}
                          onClick={() => setGenComplexity(level)}
                          className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 transition-all ${
                            genComplexity === level 
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-600 shadow-sm' 
                              : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                          }`}
                        >
                          <Target size={18} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{level}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100 flex gap-4">
                     <div className="w-10 h-10 bg-amber-500 text-white rounded-xl flex items-center justify-center shrink-0">
                       <Sparkles size={20} />
                     </div>
                     <div>
                       <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">AI Confirmation</h4>
                       <p className="text-[11px] text-amber-800/80 leading-relaxed mt-1">
                         Generating <span className="font-black">20 unique questions</span> with high-quality distractors tailored to your selected level. This may take a moment.
                       </p>
                     </div>
                  </div>
                </>
              )}
            </div>

            {!isGenerating && (
              <footer className="p-8 bg-white border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => setIsGeneratorOpen(false)}
                  className="flex-1 py-4 border border-slate-200 rounded-2xl text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={!genSubject.trim()}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  Generate 20 Questions <ChevronRight size={18} />
                </button>
              </footer>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentsView;