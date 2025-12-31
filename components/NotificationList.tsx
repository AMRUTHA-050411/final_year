
import React from 'react';
import { AppNotification, UserProfile } from '../types';
import { Bell, X, UserPlus, CheckCircle, MessageSquare, Share2, AlertCircle } from 'lucide-react';

interface NotificationListProps {
  notifications: AppNotification[];
  users: UserProfile[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications, users, onMarkRead, onClearAll, onClose }) => {
  const getUser = (id: string) => users.find(u => u.id === id);

  const getIcon = (type: string) => {
    switch (type) {
      case 'invitation': return <UserPlus size={16} className="text-blue-500" />;
      case 'acceptance': return <CheckCircle size={16} className="text-green-500" />;
      case 'rejection': return <X size={16} className="text-red-500" />;
      case 'message': return <MessageSquare size={16} className="text-indigo-500" />;
      case 'resource': return <Share2 size={16} className="text-emerald-500" />;
      default: return <AlertCircle size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="absolute right-0 top-16 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <Bell size={18} />
          <span>Notifications</span>
        </div>
        <div className="flex gap-2">
          <button onClick={onClearAll} className="text-[10px] text-indigo-600 hover:underline font-semibold">Clear All</button>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            const fromUser = typeof notif.fromUserId === 'object'
              ? notif.fromUserId
              : users.find(u => u.id === notif.fromUserId);
            return (
              <div
                key={notif.id}
                className={`p-4 border-b border-slate-50 flex gap-3 items-start transition-colors hover:bg-slate-50 ${!notif.read ? 'bg-indigo-50/30' : ''}`}
                onClick={() => onMarkRead(notif.id)}
              >
                <div className="mt-1">{getIcon(notif.type)}</div>
                <div className="flex-1">
                  <p className="text-xs text-slate-800 leading-relaxed">
                    <span className="font-bold">{fromUser?.name}</span> {notif.content}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {!notif.read && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-slate-400">
            <Bell size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">All caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationList;
