import React, { useState } from 'react';
import { UserProfile, Connection } from '../types';
import {
  Search,
  Sparkles,
  UserPlus,
  CheckCircle,
  ArrowLeft,
  Users,
  X,
  Send,
  Target
} from 'lucide-react';
import { apiRequest } from '../services/api';

interface DiscoveryViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  connections: Connection[];
  onConnect: (targetUserId: string) => void;
  setActiveTab: (tab: string) => void;
}

const DiscoveryView: React.FC<DiscoveryViewProps> = ({ currentUser, allUsers, connections, onConnect, setActiveTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('All Subjects');
  const [activeSubTab, setActiveSubTab] = useState<'discover' | 'sent'>('discover');
  const [inviteUser, setInviteUser] = useState<UserProfile | null>(null);
  const [inviteMessage, setInviteMessage] = useState('');

  const subjectsList = ['All Subjects', 'Biology', 'Physics', 'Mathematics', 'English', 'Chemistry', 'History'];

  const getComplementaryLogic = (targetUser: UserProfile) => {
    const logic: { name: string; type: 'help-them' | 'help-you' }[] = [];

    targetUser.subjects.forEach(ts => {
      const mySub = currentUser.subjects.find(ms => ms.name === ts.name);
      if (mySub) {
        if (mySub.strength === 'strong' && ts.strength === 'weak') {
          logic.push({ name: ts.name, type: 'help-them' });
        } else if (mySub.strength === 'weak' && ts.strength === 'strong') {
          logic.push({ name: ts.name, type: 'help-you' });
        }
      }
    });

    return logic;
  };



  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await apiRequest(`/users/search?query=${searchTerm}&subject=${filterSubject}`, 'GET');
        // Map _id -> id and filter out current user
        const mappedUsers = users.map((u: any) => ({ ...u, id: u._id }));
        setFilteredUsers(mappedUsers.filter((u: UserProfile) => u.id !== currentUser.id));
      } catch (error) {
        console.error("Failed to search users", error);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(fetchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterSubject, currentUser.id]);

  const recommendations = filteredUsers.filter(u => getComplementaryLogic(u).length > 0).slice(0, 2);

  const getConnectionStatus = (userId: string) => {
    return connections.find(c => (c.fromUserId === currentUser.id && c.toUserId === userId) ||
      (c.toUserId === currentUser.id && c.fromUserId === userId))?.status || 'none';
  };

  const handleSendInvite = () => {
    if (!inviteUser) return;
    onConnect(inviteUser.id);
    setInviteUser(null);
    setInviteMessage('');
  };

  const getSubjectColor = (name: string) => {
    const colors: Record<string, string> = {
      Biology: 'bg-emerald-50 text-emerald-600',
      Chemistry: 'bg-teal-50 text-teal-600',
      English: 'bg-amber-50 text-amber-600',
      Mathematics: 'bg-rose-50 text-rose-600',
      Physics: 'bg-cyan-50 text-cyan-600',
      Literature: 'bg-indigo-50 text-indigo-600',
      History: 'bg-amber-50 text-amber-800'
    };
    return colors[name] || 'bg-slate-50 text-slate-600';
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 relative">
      {/* Invitation Modal */}
      {inviteUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-50">
              <h2 className="text-xl font-black text-slate-900">Invite {inviteUser.name} as a Buddy</h2>
              <button onClick={() => setInviteUser(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Complementary Box */}
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-6">
                <div className="flex items-center gap-3 text-emerald-700 font-bold mb-4">
                  <Target size={20} />
                  <span>You both can help each other with:</span>
                </div>
                <ul className="space-y-3">
                  {getComplementaryLogic(inviteUser).map((logic, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-emerald-800 font-medium">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                      <span className="font-bold">{logic.name}:</span>
                      <span>{logic.type === 'help-you' ? "They're strong, you're learning" : "You're strong, they're learning"}</span>
                    </li>
                  ))}
                  {getComplementaryLogic(inviteUser).length === 0 && (
                    <li className="text-sm text-emerald-600 italic">Exploring new subjects together!</li>
                  )}
                </ul>
              </div>

              {/* Message Input */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Add a personal message (optional)</label>
                <textarea
                  value={inviteMessage}
                  onChange={(e) => setInviteMessage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm min-h-[120px] focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all resize-none"
                  placeholder="Hi! I noticed we could help each other learn..."
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setInviteUser(null)}
                  className="flex-1 py-4 border border-slate-200 rounded-2xl text-slate-600 font-black text-sm hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendInvite}
                  className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  <Send size={18} /> Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="space-y-6">
        <div className="flex items-center gap-6">
          <button onClick={() => setActiveTab('buddy')} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Find Study Buddies</h1>
            <p className="text-slate-500 text-sm">Connect with students who complement your learning</p>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-transparent outline-none text-sm font-medium"
            />
          </div>
          <div className="h-8 w-px bg-slate-100"></div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="bg-transparent outline-none text-sm font-bold text-slate-700 px-4 cursor-pointer min-w-[150px]"
          >
            {subjectsList.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => setActiveSubTab('discover')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'discover' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Search size={14} /> Discover
          </button>
          <button
            onClick={() => setActiveSubTab('sent')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xs font-bold transition-all ${activeSubTab === 'sent' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Users size={14} className="text-slate-400" /> Sent Invitations
          </button>
        </div>
      </header>

      {activeSubTab === 'discover' && (
        <div className="space-y-12 pb-20">
          {/* Recommended Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="text-indigo-600" size={20} />
              <h2 className="text-xl font-black text-slate-900">Recommended for You <span className="text-slate-300 font-medium ml-2">— Perfect matches with complementary skills</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recommendations.map(user => {
                const status = getConnectionStatus(user.id);
                const logic = getComplementaryLogic(user);
                return (
                  <div key={user.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-black text-xl text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name}</h3>
                          <span className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase px-2 py-0.5 rounded-md truncate max-w-[150px]">
                            {user.gradeOrClass}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">{user.bio}</p>
                      </div>
                    </div>

                    <div className="bg-indigo-50/50 rounded-2xl p-5 mb-6 border border-indigo-50/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={14} className="text-indigo-600" />
                        <span className="text-xs font-black text-indigo-700 uppercase tracking-wider">{logic.length} Complementary Subjects</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {logic.map((l, i) => (
                          <span key={i} className="bg-white text-[10px] font-bold text-indigo-600 px-3 py-1.5 rounded-full border border-indigo-100 shadow-sm">
                            {l.name} — {l.type === 'help-you' ? 'They help you' : 'You help them'}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-8">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Subjects</p>
                      <div className="flex flex-wrap gap-2">
                        {user.subjects.map(sub => (
                          <span key={sub.name} className={`${getSubjectColor(sub.name)} text-[11px] font-bold px-3 py-1.5 rounded-xl`}>{sub.name}</span>
                        ))}
                        {user.subjects.length > 4 && <span className="text-xs text-slate-400 font-bold self-center">+1 more</span>}
                      </div>
                    </div>

                    <button
                      onClick={() => setInviteUser(user)}
                      disabled={status !== 'none'}
                      className={`mt-auto w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all ${status === 'none' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-50 active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                      {status === 'none' ? <><UserPlus size={18} /> Send Buddy Invitation</> : <><CheckCircle size={18} /> Request Sent</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* All Students Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <Users className="text-slate-400" size={20} />
              <h2 className="text-xl font-black text-slate-900">All Students</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map(user => {
                const status = getConnectionStatus(user.id);
                return (
                  <div key={user.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm hover:shadow-lg transition-all flex flex-col">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-indigo-500 text-white flex items-center justify-center font-black text-lg shadow-md">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-800">{user.name}</h3>
                          <span className="bg-slate-50 text-slate-400 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded truncate max-w-[100px]">
                            {user.gradeOrClass}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{user.bio}</p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Subjects</p>
                      <div className="flex flex-wrap gap-1.5">
                        {user.subjects.map(sub => (
                          <span key={sub.name} className={`${getSubjectColor(sub.name)} text-[10px] font-bold px-2 py-1 rounded-lg`}>{sub.name}</span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setInviteUser(user)}
                      disabled={status !== 'none'}
                      className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${status === 'none' ? 'bg-indigo-600 text-white shadow-md active:scale-95' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                    >
                      {status === 'none' ? <><UserPlus size={16} /> Send Buddy Invitation</> : <><CheckCircle size={16} /> Request Sent</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}


      {activeSubTab === 'sent' && (
        <div className="space-y-6 animate-in fade-in">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users size={20} className="text-slate-400" /> Sent Invitations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {connections
              .filter(c => c.fromUserId === currentUser.id && c.status === 'pending')
              .map(c => {
                // If populated, use it. If not, use ID string (though backend populates it now)
                const target = typeof c.toUserId === 'object' ? c.toUserId : allUsers.find(u => u.id === c.toUserId);
                if (!target) return null;
                // Handle populated vs found user object structure
                const name = 'name' in target ? target.name : 'Unknown';
                const department = 'department' in target ? target.department : '';
                return (
                  <div key={c.id} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900">{name}</h3>
                      <p className="text-xs text-slate-500">{department}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle size={12} /> Pending
                    </span>
                  </div>
                )
              })
            }
            {connections.filter(c => c.fromUserId === currentUser.id && c.status === 'pending').length === 0 && (
              <p className="text-slate-400 font-medium">No sent invitations pending.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryView;
