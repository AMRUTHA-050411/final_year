import React, { useState } from 'react';
import { UserProfile, SubjectStrength } from '../types';
import { Sparkles, Plus, X, Save } from 'lucide-react';

interface ProfileSetupProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [newSubject, setNewSubject] = useState('');
  const [newStrength, setNewStrength] = useState<SubjectStrength>('moderate');

  const handleSave = () => onUpdate(formData);

  const addSubject = () => {
    const trimmedSubject = newSubject.trim();
    if (!trimmedSubject || formData.subjects.find(s => s.name.toLowerCase() === trimmedSubject.toLowerCase())) return;
    setFormData({
      ...formData,
      subjects: [...formData.subjects, { name: trimmedSubject, strength: newStrength }]
    });
    setNewSubject('');
  };

  const removeSubject = (name: string) => {
    setFormData({ ...formData, subjects: formData.subjects.filter(s => s.name !== name) });
  };

  const getStrengthBadge = (strength: SubjectStrength) => {
    switch(strength) {
      case 'strong': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'moderate': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'weak': return 'bg-rose-50 text-rose-600 border-rose-100';
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
        <div className="flex items-center gap-2 mb-2">
           <Sparkles className="text-indigo-600" size={20} />
           <h2 className="text-2xl font-extrabold text-slate-900">Setup Your Profile</h2>
        </div>
        <p className="text-sm text-slate-500">Help us find the best study buddies for you</p>

        <div className="grid grid-cols-1 gap-6">
           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Display Name</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Grade/Class</label>
                <input 
                  type="text" 
                  value={formData.gradeOrClass} 
                  onChange={e => setFormData({...formData, gradeOrClass: e.target.value})}
                  placeholder="e.g. Year 12, Class 4B"
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">Department</label>
                <input 
                  type="text" 
                  value={formData.department} 
                  onChange={e => setFormData({...formData, department: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
             </div>
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">About You</label>
           <textarea 
             value={formData.bio} 
             onChange={e => setFormData({...formData, bio: e.target.value})}
             className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-4 text-sm min-h-[120px] focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
             placeholder="Tell us a bit about your learning journey..."
           />
        </div>
      </section>

      <section className="bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm space-y-8">
         <div>
            <h3 className="text-xl font-bold text-slate-900 mb-1">Your Subjects</h3>
            <p className="text-xs text-slate-500">Enter subjects you study and rate your strength to find complementary buddies</p>
         </div>

         <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject Name</label>
               <input 
                 type="text"
                 value={newSubject} 
                 onChange={e => setNewSubject(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && addSubject()}
                 placeholder="e.g. Quantum Physics, History..."
                 className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>
            <div className="w-32 space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Strength</label>
               <select 
                 value={newStrength} 
                 onChange={e => setNewStrength(e.target.value as any)}
                 className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
               >
                 <option value="weak">Weak 😭</option>
                 <option value="moderate">Moderate 🤨</option>
                 <option value="strong">Strong 😎</option>
               </select>
            </div>
            <button 
              onClick={addSubject}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              <Plus size={18} />
            </button>
         </div>

         <div className="space-y-2">
            {formData.subjects.length > 0 ? (
              formData.subjects.map((sub, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-800">{sub.name}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStrengthBadge(sub.strength)}`}>
                        {sub.strength === 'weak' ? 'weak' : sub.strength === 'moderate' ? 'moderate' : 'strong'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                       <select 
                         value={sub.strength}
                         onChange={e => {
                           const subs = [...formData.subjects];
                           subs[i].strength = e.target.value as any;
                           setFormData({...formData, subjects: subs});
                         }}
                         className="text-xs font-bold text-slate-500 bg-transparent border-none outline-none cursor-pointer"
                       >
                          <option value="weak">Need Help</option>
                          <option value="moderate">Moderate</option>
                          <option value="strong">Strong</option>
                       </select>
                       <button onClick={() => removeSubject(sub.name)} className="text-slate-300 hover:text-red-500 transition-colors">
                         <X size={16} />
                       </button>
                    </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100">
                <p className="text-xs text-slate-400 font-medium italic">No subjects added yet. Add some to find better matches!</p>
              </div>
            )}
         </div>
      </section>

      <button 
        onClick={handleSave}
        className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all"
      >
        Save Profile
      </button>
    </div>
  );
};

export default ProfileSetup;