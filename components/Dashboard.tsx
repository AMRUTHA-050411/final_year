import React from 'react';
import { UserProfile, Connection, AppNotification } from '../types';
import { Users, UserPlus, HelpCircle, Bell, Search, Calendar, Heart, ArrowRight, ShieldAlert } from 'lucide-react';

interface DashboardProps {
  currentUser: UserProfile;
  connections: Connection[];
  notifications: AppNotification[];
  setActiveTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ currentUser, connections, notifications, setActiveTab }) => {
  const activeBuddies = connections.filter(c => c.status === 'accepted').length;
  const pendingRequests = connections.filter(c => c.status === 'pending').length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Verification Reminder Banner */}
      {!currentUser.emailVerified && (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex items-center justify-between shadow-sm shadow-rose-100/50 animate-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h4 className="font-black text-rose-900 leading-none">Action Required: Verify Your Email</h4>
              <p className="text-xs text-rose-700 mt-1 font-medium">Verify your email address to unlock all Buddy System features and receive study notifications.</p>
            </div>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-rose-700 transition-all shadow-md shadow-rose-100"
          >
            Verify Now
          </button>
        </div>
      )}

      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome back, {currentUser.name}!</h1>
          <p className="text-slate-500 mt-1">{activeBuddies} active buddies • {pendingRequests} pending invitations</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setActiveTab('discovery')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 flex items-center gap-2 transition-all active:scale-95">
            <Search size={18} /> Find Buddies
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-xl shadow-indigo-100 flex items-center gap-5 group cursor-pointer hover:scale-[1.02] transition-transform">
           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
             <Users size={24} />
           </div>
           <div>
             <p className="text-4xl font-black">{activeBuddies}</p>
             <p className="text-xs font-bold uppercase tracking-wider opacity-80">Active Buddies</p>
           </div>
        </div>
        <div className="bg-amber-500 p-6 rounded-3xl text-white shadow-xl shadow-amber-100 flex items-center gap-5 group cursor-pointer hover:scale-[1.02] transition-transform">
           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
             <UserPlus size={24} />
           </div>
           <div>
             <p className="text-4xl font-black">{pendingRequests}</p>
             <p className="text-xs font-bold uppercase tracking-wider opacity-80">Pending</p>
           </div>
        </div>
        <div className="bg-rose-500 p-6 rounded-3xl text-white shadow-xl shadow-rose-100 flex items-center gap-5 group cursor-pointer hover:scale-[1.02] transition-transform">
           <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
             <Bell size={24} />
           </div>
           <div>
             <p className="text-4xl font-black">{unreadNotifs}</p>
             <p className="text-xs font-bold uppercase tracking-wider opacity-80">Unread</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <section className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                  <Users size={22} className="text-indigo-600" /> Your Buddies
                </h3>
                <button onClick={() => setActiveTab('discovery')} className="text-xs font-bold text-indigo-600 hover:underline">Find More</button>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                    <Users size={32} className="text-slate-300" />
                 </div>
                 <p className="font-bold text-slate-800">No buddies yet</p>
                 <p className="text-sm text-slate-400 mt-1 max-w-[250px]">Find students with complementary skills to start collaborating.</p>
                 <button onClick={() => setActiveTab('discovery')} className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95">
                   Find Buddies
                 </button>
              </div>
           </section>
        </div>

        <div className="space-y-6">
           <section className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
             <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h3>
             <div className="space-y-3">
               {[
                 { label: 'Find Study Buddies', tab: 'discovery', icon: Search },
                 { label: 'Manage Assignments', tab: 'assignments', icon: Calendar },
                 { label: 'Wellness Dashboard', tab: 'wellness', icon: Heart },
                 { label: 'View Notifications', tab: 'notifications', icon: Bell },
               ].map((action, i) => (
                 <button 
                   key={i} 
                   onClick={() => setActiveTab(action.tab)}
                   className="w-full flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors group"
                 >
                   <div className="flex items-center gap-4">
                     <action.icon size={18} className="text-slate-400 group-hover:text-indigo-600" />
                     <span className="text-sm font-bold text-slate-700">{action.label}</span>
                   </div>
                   <ArrowRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-all" />
                 </button>
               ))}
             </div>
           </section>

           <section className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-3">
                  <Calendar size={18} className="text-indigo-600" /> Upcoming
                </h3>
                <button onClick={() => setActiveTab('assignments')} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600">View All</button>
              </div>
              <div className="py-6 text-center">
                 <p className="text-xs text-slate-400 font-medium italic">No upcoming assignments</p>
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;