import React, { useState, useRef, useMemo } from 'react';
import { UserProfile } from '../types';
import { 
  Save, 
  Plus, 
  X, 
  User, 
  Mail, 
  Camera, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  RefreshCcw,
  BadgeCheck,
  Trash2,
  Upload,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Circle,
  Check
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [activeTab, setActiveTab] = useState<'public' | 'account' | 'security'>('public');
  const [newSkill, setNewSkill] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // Password states
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Validation Logic
  const validationRules = useMemo(() => {
    return {
      length: passwords.new.length >= 8,
      uppercase: /[A-Z]/.test(passwords.new),
      number: /[0-9]/.test(passwords.new),
      special: /[^A-Za-z0-9]/.test(passwords.new),
      match: passwords.new !== '' && passwords.new === passwords.confirm
    };
  }, [passwords.new, passwords.confirm]);

  const passwordStrength = useMemo(() => {
    const metCount = Object.values(validationRules).filter(v => v).length;
    if (metCount <= 1) return { label: 'Very Weak', color: 'bg-rose-500', width: '20%' };
    if (metCount === 2) return { label: 'Weak', color: 'bg-orange-500', width: '40%' };
    if (metCount === 3) return { label: 'Moderate', color: 'bg-amber-500', width: '60%' };
    if (metCount === 4) return { label: 'Strong', color: 'bg-emerald-500', width: '80%' };
    return { label: 'Excellent', color: 'bg-indigo-600', width: '100%' };
  }, [validationRules]);

  const isPasswordValid = validationRules.length && validationRules.uppercase && validationRules.number && validationRules.special && validationRules.match;

  const calculateCompleteness = (data: UserProfile) => {
    let score = 0;
    if (data.name) score += 10;
    if (data.avatar && !data.avatar.includes('dicebear')) score += 20;
    if (data.bio && data.bio.length > 20) score += 20;
    if (data.skills.length > 0) score += 15;
    if (data.subjects.length > 0) score += 15;
    if (data.emailVerified) score += 20;
    return Math.min(score, 100);
  };

  const handleSave = () => {
    const completeness = calculateCompleteness(formData);
    const updated = { ...formData, completeness };
    onUpdate(updated);
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size must be less than 2MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    const defaultAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(formData.name)}`;
    setFormData({ ...formData, avatar: defaultAvatar });
    setMessage({ type: 'success', text: 'Profile photo removed' });
    setTimeout(() => setMessage(null), 2000);
  };

  const addItem = (field: 'skills', value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    if (formData[field].includes(value.trim())) return;
    setFormData({
      ...formData,
      [field]: [...formData[field], value.trim()]
    });
    setter('');
  };

  const removeItem = (field: 'skills', index: number) => {
    const updated = [...formData[field]];
    updated.splice(index, 1);
    setFormData({ ...formData, [field]: updated });
  };

  const handleVerifyEmail = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setFormData({ ...formData, emailVerified: true });
      setIsVerifying(false);
      setMessage({ type: 'success', text: 'Email verified successfully!' });
    }, 2000);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) return;
    setIsUpdatingPassword(true);

    // Simulate backend verification
    setTimeout(() => {
      // Logic for demonstration: "password123" is the dummy current password
      const MOCK_CURRENT_PASSWORD = "password123";

      if (passwords.current !== MOCK_CURRENT_PASSWORD) {
        setMessage({ type: 'error', text: 'Incorrect current password' });
        setIsUpdatingPassword(false);
        return;
      }

      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswords({ current: '', new: '', confirm: '' });
      setIsUpdatingPassword(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {message && (
        <div className={`fixed top-20 right-8 z-[100] p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-4 duration-300 ${
          message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
          <span className="font-bold text-sm">{message.text}</span>
        </div>
      )}

      {/* Profile Summary Card */}
      <section className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700"></div>
        <div className="px-10 pb-8 -mt-12 flex flex-col md:flex-row items-end gap-6 border-b border-slate-100">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-slate-100">
              <img src={formData.avatar} className="w-full h-full object-cover" alt="Profile" />
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-all rounded-[2rem]"
            >
              <Camera size={24} />
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
          
          <div className="flex-1 pb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900">{formData.name}</h1>
              {formData.emailVerified && <BadgeCheck className="text-indigo-500" size={24} />}
            </div>
            <p className="text-slate-500 font-medium">{formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} • {formData.department}</p>
          </div>

          <div className="w-full md:w-64 space-y-2 pb-2">
            <div className="flex justify-between items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Completion</span>
              <span className="text-sm font-black text-indigo-600">{formData.completeness}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
                style={{ width: `${formData.completeness}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-10 flex gap-8 overflow-x-auto">
          {[
            { id: 'public', label: 'Public Profile', icon: User },
            { id: 'account', label: 'Account Settings', icon: Mail },
            { id: 'security', label: 'Security', icon: Lock }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-6 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {activeTab === 'public' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 space-y-10 animate-in fade-in duration-300">
              
              {/* Profile Photo Section */}
              <div className="space-y-6">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Profile Photo</span>
                <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                    <img src={formData.avatar} className="w-full h-full object-cover" alt="Current Preview" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-sm"
                      >
                        <Upload size={14} /> Upload New
                      </button>
                      <button 
                        onClick={handleRemovePhoto}
                        className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-slate-100 transition-all"
                      >
                        <Trash2 size={14} /> Remove
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Recommended: Square JPG or PNG, max 2MB.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">About My Learning Journey</span>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="mt-3 block w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm min-h-[150px] focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none leading-relaxed"
                    placeholder="Describe what you are currently studying and how you'd like to collaborate..."
                  />
                </label>
              </div>

              <div className="space-y-6">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Key Expertise & Academic Skills</span>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs px-4 py-2 rounded-xl flex items-center gap-2 font-bold group border border-indigo-100">
                      {skill}
                      <button onClick={() => removeItem('skills', idx)} className="hover:text-rose-500 transition-colors">
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem('skills', newSkill, setNewSkill)}
                    className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Add a skill (e.g. Calculus, Python, Lab Research)"
                  />
                  <button 
                    onClick={() => addItem('skills', newSkill, setNewSkill)}
                    className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 space-y-8 animate-in fade-in duration-300">
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${formData.emailVerified ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {formData.emailVerified ? <ShieldCheck size={24} /> : <ShieldAlert size={24} />}
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Verification Status</p>
                      <p className={`text-sm font-bold ${formData.emailVerified ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {formData.emailVerified ? 'Your email is verified' : 'Email verification required'}
                      </p>
                    </div>
                  </div>
                  {!formData.emailVerified && (
                    <button 
                      onClick={handleVerifyEmail}
                      disabled={isVerifying}
                      className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-indigo-700 transition-all disabled:opacity-50"
                    >
                      {isVerifying ? <RefreshCcw size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
                      Verify Now
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Institutional Email</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      readOnly
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-medium text-slate-400 cursor-not-allowed" 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Display Name</label>
                      <input 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Grade/Class Year</label>
                      <input 
                        type="text" 
                        value={formData.gradeOrClass} 
                        onChange={e => setFormData({...formData, gradeOrClass: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 space-y-10 animate-in fade-in duration-300">
               <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                       <KeyRound size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 leading-none">Password Update</h3>
                      <p className="text-xs text-slate-400 mt-1">Protect your account with a secure password</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordChange} className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Current Password</label>
                        <div className="relative">
                           <input 
                             type={showPasswords ? "text" : "password"} 
                             required
                             placeholder="Verify current password"
                             value={passwords.current}
                             onChange={e => setPasswords({...passwords, current: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-12 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                           />
                           <button 
                             type="button"
                             onClick={() => setShowPasswords(!showPasswords)}
                             className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                           >
                              {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest">New Password</label>
                           <input 
                             type={showPasswords ? "text" : "password"} 
                             required
                             placeholder="Min 8 characters"
                             value={passwords.new}
                             onChange={e => setPasswords({...passwords, new: e.target.value})}
                             className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                           <input 
                             type={showPasswords ? "text" : "password"} 
                             required
                             placeholder="Repeat new password"
                             value={passwords.confirm}
                             onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                             className={`w-full bg-slate-50 border rounded-xl px-4 py-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                               passwords.confirm !== '' && !validationRules.match ? 'border-rose-300 ring-rose-50' : 'border-slate-100'
                             }`} 
                           />
                        </div>
                     </div>

                     {/* Strength Meter and Checklist */}
                     <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="space-y-2">
                           <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <span>Password Strength</span>
                              <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${passwordStrength.color}`}
                                style={{ width: passwordStrength.width }}
                              ></div>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                           {[
                              { label: 'At least 8 characters', met: validationRules.length },
                              { label: 'Contains uppercase', met: validationRules.uppercase },
                              { label: 'Contains a number', met: validationRules.number },
                              { label: 'Special character', met: validationRules.special },
                              { label: 'Passwords match', met: validationRules.match }
                           ].map((rule, idx) => (
                              <div key={idx} className={`flex items-center gap-2 text-[11px] font-bold transition-colors ${rule.met ? 'text-emerald-600' : 'text-slate-400'}`}>
                                 {rule.met ? <CheckCircle2 size={14} /> : <Circle size={14} className="opacity-40" />}
                                 {rule.label}
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="pt-4">
                        <button 
                          type="submit"
                          disabled={isUpdatingPassword || !isPasswordValid}
                          className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isUpdatingPassword ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />}
                          Update Password
                        </button>
                     </div>
                  </form>
               </div>

               <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                  <div className="flex items-center gap-3 text-amber-700 mb-2">
                    <ShieldCheck size={20} />
                    <p className="text-xs font-black uppercase tracking-widest">Security Advice</p>
                  </div>
                  <p className="text-[11px] text-amber-800/80 leading-relaxed">
                    A strong password should include at least one uppercase letter, one number, and one special character. Avoid using common phrases or personal information.
                  </p>
               </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white space-y-4">
             <h4 className="font-bold text-sm">Pro Tip 💡</h4>
             <p className="text-[10px] text-slate-400 leading-relaxed">
               Profiles with clear <b>Photos</b> and listed <b>Expertise</b> receive 3x higher engagement from peers.
             </p>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 sticky bottom-8"
          >
            <Save size={24} />
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;