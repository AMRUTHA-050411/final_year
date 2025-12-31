import React, { useState } from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { UserProfile, AppNotification } from '../types';
import NotificationList from './NotificationList';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  allUsers: UserProfile[];
  notificationCount: number;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  allUsers, 
  notificationCount, 
  notifications,
  onMarkRead,
  onClearAll,
  onLogout
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-8 h-16 flex items-center justify-end">
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className={`p-2 rounded-full transition-colors relative ${showNotifs ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-50'}`}
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold border-2 border-white">
                {notificationCount}
              </span>
            )}
          </button>
          
          {showNotifs && (
            <div className="absolute right-0 mt-2">
              <NotificationList 
                notifications={notifications} 
                users={allUsers} 
                onMarkRead={(id) => { onMarkRead(id); }} 
                onClearAll={onClearAll}
                onClose={() => setShowNotifs(false)}
              />
            </div>
          )}
        </div>
        
        <div className="h-6 w-px bg-slate-200 mx-2"></div>

        <div className="relative">
          <button 
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifs(false); }}
            className="flex items-center gap-3 p-1 pr-3 rounded-full hover:bg-slate-50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shadow-sm border-2 border-white overflow-hidden">
              {currentUser.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-700 leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">Online</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-slate-50">
                <p className="text-sm font-bold text-slate-800">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
              </div>
              <button onClick={() => { setActiveTab('profile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50">
                <User size={16} /> My Profile
              </button>
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;