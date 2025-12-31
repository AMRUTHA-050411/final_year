
import React from 'react';
import { UserProfile, Connection } from '../types';
import { Check, X, UserMinus, MessageCircle, Volume2, VolumeX, Search } from 'lucide-react';

interface ConnectionsViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  connections: Connection[];
  mutedBuddies: string[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onRemove: (buddyId: string) => void;
  onToggleMute: (buddyId: string) => void;
  onGoToChat: () => void;
  onGoToDiscovery: () => void;
}

const ConnectionsView: React.FC<ConnectionsViewProps> = ({
  currentUser, allUsers, connections, mutedBuddies, onAccept, onReject, onRemove, onToggleMute, onGoToChat, onGoToDiscovery
}) => {
  const pendingRequests = connections.filter(c => {
    const toId = typeof c.toUserId === 'string' ? c.toUserId : c.toUserId.id;
    return toId === currentUser.id && c.status === 'pending';
  });

  const activeConnections = connections.filter(c => {
    const fromId = typeof c.fromUserId === 'string' ? c.fromUserId : c.fromUserId.id;
    const toId = typeof c.toUserId === 'string' ? c.toUserId : c.toUserId.id;
    return (fromId === currentUser.id || toId === currentUser.id) && c.status === 'accepted';
  });

  const getUser = (userOrId: string | UserProfile) => {
    if (typeof userOrId === 'object') return userOrId;
    return allUsers.find(u => u.id === userOrId);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Buddies</h1>
          <p className="text-slate-500">Manage your learning network and collaboration preferences</p>
        </div>
        <button
          onClick={onGoToDiscovery}
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"
        >
          <Search size={18} /> Discover New
        </button>
      </header>

      {/* Requests */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Pending Requests
            {pendingRequests.length > 0 && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">{pendingRequests.length}</span>}
          </h2>
        </div>
        {pendingRequests.length > 0 ? (
          <div className="grid gap-4">
            {pendingRequests.map(req => {
              const sender = getUser(req.fromUserId);
              if (!sender) return null;
              return (
                <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-left-4">
                  <div className="flex items-center gap-4">
                    <img src={sender.avatar || `https://ui-avatars.com/api/?name=${sender.name}`} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <p className="font-bold text-slate-900">{sender.name}</p>
                      <p className="text-xs text-slate-500">{sender.department}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onAccept(req.id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition-colors flex items-center gap-1.5"
                    >
                      <Check size={14} /> Accept
                    </button>
                    <button
                      onClick={() => onReject(req.id)}
                      className="bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-12 text-center">
            <p className="text-slate-400 font-medium">No new requests at the moment</p>
          </div>
        )}
      </section>

      {/* Active Buddies */}
      <section>
        <h2 className="text-lg font-bold text-slate-800 mb-4">My Buddy List</h2>
        {activeConnections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeConnections.map(conn => {
              const buddyId = conn.fromUserId === currentUser.id ? conn.toUserId : conn.fromUserId;
              const buddy = getUser(buddyId);
              if (!buddy) return null;
              const isMuted = mutedBuddies.includes(buddy.id);

              return (
                <div key={conn.id} className="bg-white border border-slate-200 rounded-2xl p-5 group hover:border-indigo-200 transition-all shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img src={buddy.avatar} className="w-14 h-14 rounded-2xl object-cover" />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${buddy.availability === 'online' ? 'bg-green-500' : buddy.availability === 'away' ? 'bg-amber-400' : 'bg-slate-300'
                        }`} title={buddy.availability}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900">{buddy.name}</h3>
                      <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                        {buddy.department}
                        <span className={`w-1.5 h-1.5 rounded-full ${buddy.availability === 'online' ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                      </p>
                    </div>
                    <button
                      onClick={() => onToggleMute(buddy.id)}
                      className={`p-2 rounded-lg transition-colors ${isMuted ? 'bg-amber-50 text-amber-600' : 'text-slate-400 hover:bg-slate-50'}`}
                      title={isMuted ? "Unmute Notifications" : "Mute Notifications"}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={onGoToChat}
                      className="flex-1 bg-indigo-50 text-indigo-600 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={16} /> Chat
                    </button>
                    <button
                      onClick={() => onRemove(buddy.id)}
                      className="px-3 bg-slate-50 text-slate-400 py-2.5 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-500 transition-all"
                      title="Remove Buddy"
                    >
                      <UserMinus size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl py-12 text-center">
            <p className="text-slate-400 font-medium">You haven't connected with anyone yet.</p>
            <button
              onClick={onGoToDiscovery}
              className="mt-4 text-indigo-600 font-bold text-sm hover:underline"
            >
              Discover students with similar goals
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ConnectionsView;
