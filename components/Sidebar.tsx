import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  UserCircle, 
  BookOpen,
  Bell,
  LayoutDashboard,
  Calendar,
  Heart,
  Library,
  GraduationCap,
  MonitorPlay,
  ShieldAlert
} from 'lucide-react';
import NotificationList from './NotificationList';
import { AppNotification, UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unseenMessagesCount: number;
  notifications: AppNotification[];
  users: UserProfile[];
  currentUser: UserProfile;
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  unseenMessagesCount, 
  notifications, 
  users, 
  currentUser,
  onMarkRead, 
  onClearAll
}) => {
  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'buddy', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: Library },
    { id: 'study_rooms', label: 'Study Rooms', icon: MonitorPlay },
    { id: 'connections', label: 'My Buddies', icon: Users },
    { id: 'chat', label: 'Messages', icon: MessageSquare, badge: unseenMessagesCount },
    { id: 'assignments', label: 'Assignments', icon: Calendar },
    { id: 'risk_assessment', label: 'Academic Risk Predictor', icon: ShieldAlert },
    { id: 'wellness', label: 'Wellness', icon: Heart },
    { id: 'profile', label: 'Account Settings', icon: UserCircle },
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col sticky top-0 z-50">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 text-[#7C3AED] font-bold text-xl cursor-pointer"
          onClick={() => setActiveTab('buddy')}
        >
          <div className="bg-[#7C3AED] text-white p-1.5 rounded-xl shadow-lg shadow-indigo-100">
            <GraduationCap size={24} />
          </div>
          <span className="tracking-tight font-black">LearnHub</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Navigation</p>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all group ${
              activeTab === item.id 
                ? 'bg-[#F5F3FF] text-[#7C3AED] shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-[#7C3AED]' : 'text-slate-400 group-hover:text-slate-600'} />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <span className="bg-[#7C3AED] text-white text-[10px] min-w-[20px] h-[20px] flex items-center justify-center rounded-full font-bold px-1.5 shadow-sm">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 bg-slate-50/50">
        <button 
          onClick={() => setActiveTab('profile')}
          className="w-full flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-200 shadow-sm hover:border-indigo-200 transition-all text-left"
        >
          <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-bold text-slate-700 truncate">{currentUser.name}</p>
            <p className="text-[10px] text-slate-400 font-bold truncate uppercase tracking-wider">{currentUser.department}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;