import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Clock, 
  Users, 
  X, 
  BookOpen, 
  FileText, 
  GraduationCap,
  Calendar,
  History,
  Sparkles,
  ArrowRight,
  RefreshCcw,
  LogOut,
  LayoutGrid,
  Send,
  MessageSquare
} from 'lucide-react';
import { StudyRoom, StudySessionType, StudyRoomStatus, UserProfile, RoomMessage } from '../types';
import { getStudySummary } from '../services/geminiService';

interface StudyRoomsViewProps {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  studyRooms: StudyRoom[];
  roomMessages: RoomMessage[];
  onCreateRoom: (room: Omit<StudyRoom, 'id' | 'currentParticipants' | 'creatorId' | 'status' | 'duration' | 'maxParticipants'>) => void;
  onJoinRoom: (roomId: string) => void;
  onLeaveRoom: (roomId: string) => void;
  onSendRoomMessage: (roomId: string, content: string) => void;
}

const StudyRoomsView: React.FC<StudyRoomsViewProps> = ({ 
  currentUser, 
  allUsers, 
  studyRooms, 
  roomMessages,
  onCreateRoom, 
  onJoinRoom,
  onLeaveRoom,
  onSendRoomMessage
}) => {
  const [activeFilter, setActiveFilter] = useState<StudyRoomStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingRoomChat, setViewingRoomChat] = useState<StudyRoom | null>(null);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [roomInput, setRoomInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (viewingRoomChat) {
      scrollToBottom();
    }
  }, [roomMessages, viewingRoomChat]);

  const filteredRooms = studyRooms.filter(room => {
    const matchesFilter = activeFilter === 'all' || room.status === activeFilter;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const [newRoom, setNewRoom] = useState({
    name: '',
    type: 'General Study' as StudySessionType,
    subject: '',
    topic: '',
    description: '',
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateRoom(newRoom);
    setIsModalOpen(false);
    setNewRoom({
      name: '',
      type: 'General Study',
      subject: '',
      topic: '',
      description: '',
    });
  };

  const getTypeIcon = (type: StudySessionType) => {
    switch (type) {
      case 'Exam Preparation': return <GraduationCap size={18} />;
      case 'Assignment Discussion': return <FileText size={18} />;
      default: return <BookOpen size={18} />;
    }
  };

  const getStatusColor = (type: StudySessionType) => {
    switch (type) {
      case 'Exam Preparation': return 'bg-rose-500';
      case 'Assignment Discussion': return 'bg-amber-500';
      default: return 'bg-[#7C3AED]';
    }
  };

  const getBadgeColor = (type: StudySessionType) => {
    switch (type) {
      case 'Exam Preparation': return 'bg-rose-50 text-rose-600';
      case 'Assignment Discussion': return 'bg-amber-50 text-amber-600';
      default: return 'bg-indigo-50 text-[#7C3AED]';
    }
  };

  const handleOpenRoomChat = async (room: StudyRoom) => {
    setViewingRoomChat(room);
    setAiSummary('');
    const roomChat = roomMessages.filter(m => m.roomId === room.id);
    if (roomChat.length > 0) {
      setLoadingSummary(true);
      const content = roomChat.map(m => {
        const sender = allUsers.find(u => u.id === m.senderId)?.name || 'Unknown';
        return `${sender}: ${m.content}`;
      });
      const summary = await getStudySummary(content);
      setAiSummary(summary);
      setLoadingSummary(false);
    }
  };

  const handleSendMessage = () => {
    if (!roomInput.trim() || !viewingRoomChat) return;
    onSendRoomMessage(viewingRoomChat.id, roomInput);
    setRoomInput('');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-1">
             <div className="bg-[#7C3AED] p-2 rounded-xl text-white shadow-lg shadow-indigo-100">
               <Users size={24} />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Peer Hub</h1>
          </div>
          <p className="text-slate-500 font-medium ml-11">Real-time collaborative study environments</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#7C3AED] text-white px-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 flex items-center gap-2 hover:bg-[#6D28D9] transition-all active:scale-95 group"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Start a New Room
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-full md:max-w-md relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#7C3AED] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search active or past sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#7C3AED]/10 text-sm font-medium transition-all"
          />
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          {(['active', 'completed', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeFilter === filter ? 'bg-white text-[#7C3AED] shadow-md' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Room Listing */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map((room) => {
            const isParticipant = room.currentParticipants.includes(currentUser.id);
            return (
              <div key={room.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col group transition-all hover:shadow-2xl hover:-translate-y-1">
                <div className={`h-2 ${getStatusColor(room.type)}`}></div>
                <div className="p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 ${getBadgeColor(room.type)}`}>
                        {getTypeIcon(room.type)} {room.type}
                      </span>
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                        room.status === 'completed' ? 'bg-slate-50 text-slate-400 border-slate-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {room.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover:text-[#7C3AED] transition-colors">{room.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                      {room.subject} • {room.topic}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-4 text-slate-400 text-[11px] font-black uppercase tracking-tighter">
                        <div className="flex items-center gap-2">
                          <Users size={16} className="text-[#7C3AED]" />
                          <span className="text-slate-700">{room.currentParticipants.length} Participants</span>
                        </div>
                      </div>
                      
                      {/* Participant Initials */}
                      <div className="flex -space-x-3">
                        {room.currentParticipants.slice(0, 4).map((pid, idx) => (
                          <img 
                            key={idx} 
                            src={allUsers.find(u => u.id === pid)?.avatar} 
                            className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                            alt="avatar"
                          />
                        ))}
                        {room.currentParticipants.length > 4 && (
                          <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                            +{room.currentParticipants.length - 4}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {room.status === 'completed' ? (
                        <button 
                          onClick={() => handleOpenRoomChat(room)}
                          className="w-full py-3.5 bg-slate-50 text-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest border border-slate-200 flex items-center justify-center gap-2 hover:bg-[#7C3AED] hover:text-white hover:border-[#7C3AED] transition-all shadow-sm"
                        >
                          <History size={16} /> View Chat History
                        </button>
                      ) : isParticipant ? (
                        <>
                          <button 
                            onClick={() => handleOpenRoomChat(room)}
                            className="flex-[2] py-3.5 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
                          >
                             Go to Chat <ArrowRight size={16} />
                          </button>
                          <button 
                            onClick={() => onLeaveRoom(room.id)}
                            className="flex-1 py-3.5 bg-white text-rose-500 border border-rose-100 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-rose-50 transition-all"
                            title="Leave Room"
                          >
                            <LogOut size={16} />
                          </button>
                        </>
                      ) : (
                        <button 
                          onClick={() => onJoinRoom(room.id)}
                          className="w-full py-3.5 bg-[#7C3AED] text-white rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#6D28D9] transition-all shadow-lg shadow-indigo-100"
                        >
                          Join Study Group <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <LayoutGrid size={40} className="text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2">No active study sessions</h3>
          <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto">Start a new room to invite your buddies and begin collaborating in real-time.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-3 bg-[#7C3AED] text-white px-10 py-5 rounded-2xl font-black text-sm hover:bg-[#6D28D9] transition-all shadow-xl shadow-indigo-100"
          >
            <Plus size={20} /> Create Your First Room
          </button>
        </div>
      )}

      {/* Room Chat Modal */}
      {viewingRoomChat && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500">
            {/* Header */}
            <header className="p-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-[1.25rem] ${getStatusColor(viewingRoomChat.type)} text-white shadow-xl`}>
                  {viewingRoomChat.status === 'completed' ? <History size={28} /> : <MessageSquare size={28} />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 leading-tight">{viewingRoomChat.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      viewingRoomChat.status === 'completed' ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-600'
                    }`}>
                      {viewingRoomChat.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>}
                      {viewingRoomChat.status === 'completed' ? 'History Archive' : 'Live Session'}
                    </div>
                    <span className="text-slate-300 font-medium">•</span>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                      {viewingRoomChat.subject} • {viewingRoomChat.topic}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setViewingRoomChat(null)} 
                className="p-3 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <X size={28} />
              </button>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row bg-slate-50 overflow-hidden">
              
              {/* Left Side: Chat Interface */}
              <div className="flex-[2] flex flex-col min-h-0 overflow-hidden bg-white border-r border-slate-100">
                {/* Message List */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
                  {roomMessages.filter(m => m.roomId === viewingRoomChat.id).length > 0 ? (
                    roomMessages.filter(m => m.roomId === viewingRoomChat.id).map((msg) => {
                      const sender = allUsers.find(u => u.id === msg.senderId);
                      const isMe = msg.senderId === currentUser.id;
                      return (
                        <div key={msg.id} className={`flex gap-4 animate-in slide-in-from-bottom-2 duration-300 ${isMe ? 'flex-row-reverse' : ''}`}>
                          <img 
                            src={sender?.avatar} 
                            className="w-10 h-10 rounded-xl object-cover shadow-sm shrink-0 border border-slate-100" 
                            alt="" 
                          />
                          <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                            <div className="flex items-center gap-2 mb-1 px-1">
                              {!isMe && <span className="font-black text-slate-900 text-xs tracking-tight">{sender?.name}</span>}
                              <span className="text-[10px] text-slate-400 font-bold">
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed border shadow-sm ${
                              isMe 
                                ? 'bg-[#7C3AED] text-white border-[#7C3AED] rounded-tr-none' 
                                : 'bg-slate-50 border-slate-100 text-slate-700 rounded-tl-none'
                            }`}>
                              {msg.content}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                      <MessageSquare size={64} className="text-slate-200 mb-6" />
                      <p className="font-black text-slate-400 uppercase tracking-widest text-sm">Welcome to the study group!</p>
                      <p className="text-xs text-slate-400 mt-2">Start the conversation by typing below.</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Live Input Field (Only for Active Room) */}
                {viewingRoomChat.status === 'active' && (
                  <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                    <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-[#7C3AED]/10 focus-within:border-[#7C3AED] transition-all">
                      <input 
                        type="text"
                        value={roomInput}
                        onChange={(e) => setRoomInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type a message to the group..."
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-4 font-medium"
                      />
                      <button 
                        onClick={handleSendMessage}
                        disabled={!roomInput.trim()}
                        className={`p-3 rounded-xl transition-all ${
                          roomInput.trim() ? 'bg-[#7C3AED] text-white shadow-lg active:scale-95' : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side: Sidebar Info */}
              <div className="flex-1 lg:max-w-sm p-8 space-y-10 bg-slate-50/50 overflow-y-auto flex flex-col shadow-inner">
                {/* AI Summary Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[#7C3AED] font-black text-xs uppercase tracking-widest px-1">
                    <Sparkles size={18} /> Smart Insights
                  </div>
                  <div className="p-6 bg-white rounded-3xl border border-slate-100 relative min-h-[140px] shadow-sm flex flex-col items-center justify-center text-center">
                    {loadingSummary ? (
                      <>
                        <RefreshCcw size={24} className="animate-spin text-[#7C3AED] mb-3" />
                        <p className="text-[10px] font-black text-[#7C3AED] uppercase tracking-widest">Analyzing Session...</p>
                      </>
                    ) : aiSummary ? (
                      <p className="text-sm text-slate-700 leading-relaxed font-semibold italic">"{aiSummary}"</p>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Historical data is too sparse for an AI summary.</p>
                    )}
                  </div>
                </div>

                {/* Participants Roster */}
                <div className="space-y-5 flex-1 min-h-0">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Participant Roster</p>
                  <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2 scrollbar-hide">
                    {viewingRoomChat.currentParticipants.length > 0 ? (
                      viewingRoomChat.currentParticipants.map(pid => {
                        const user = allUsers.find(u => u.id === pid);
                        return (
                          <div key={pid} className="flex items-center gap-4 p-2 rounded-2xl bg-white border border-slate-100 hover:border-[#7C3AED]/20 transition-all group">
                            <img src={user?.avatar} className="w-10 h-10 rounded-xl group-hover:scale-110 transition-transform shadow-sm object-cover" alt="" />
                            <div className="min-w-0">
                              <span className="text-sm font-black text-slate-800 block truncate">{user?.name}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate block">{user?.department}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 italic px-1">Waiting for participants...</p>
                    )}
                  </div>
                </div>

                {/* Status indicator */}
                <div className="pt-6 border-t border-slate-200 mt-auto">
                  <div className="bg-white rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Session Status</span>
                    </div>
                    <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-[9px] font-black uppercase ${viewingRoomChat.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                       <span className={`w-1.5 h-1.5 rounded-full ${viewingRoomChat.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                       {viewingRoomChat.status}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Global Footer */}
            <footer className="p-6 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Session Date: {new Date(viewingRoomChat.startTime || Date.now()).toLocaleDateString(undefined, { dateStyle: 'long' })}
              </p>
              <button 
                onClick={() => setViewingRoomChat(null)} 
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200"
              >
                Close View
              </button>
            </footer>
          </div>
        </div>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in slide-in-from-bottom-8 duration-500 flex flex-col md:flex-row">
            
            {/* Left Sidebar decorative */}
            <div className="md:w-72 bg-[#7C3AED] p-10 text-white flex flex-col justify-between overflow-hidden relative shrink-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-10 backdrop-blur-xl">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-4xl font-black leading-tight mb-4 tracking-tight">Launch a Room</h2>
                <p className="text-indigo-100 font-medium leading-relaxed opacity-90">Start a dedicated space for real-time peer collaboration.</p>
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 text-sm font-bold opacity-60">
                   <div className="w-2 h-2 rounded-full bg-white"></div>
                   <span>Live Chat</span>
                </div>
                <div className="flex items-center gap-3 text-sm font-bold opacity-60">
                   <div className="w-2 h-2 rounded-full bg-white"></div>
                   <span>AI Summaries</span>
                </div>
              </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 p-12 bg-white max-h-[90vh] overflow-y-auto">
              <div className="flex justify-end mb-8">
                 <button onClick={() => setIsModalOpen(false)} className="p-3 text-slate-300 hover:text-slate-900 transition-colors">
                   <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-10">
                {/* Session Type */}
                <div className="space-y-5">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Objective</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {(['Exam Preparation', 'Assignment Discussion', 'General Study'] as StudySessionType[]).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setNewRoom({...newRoom, type})}
                        className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-2 transition-all gap-3 ${
                          newRoom.type === type 
                            ? 'border-[#7C3AED] bg-indigo-50 text-[#7C3AED] shadow-lg shadow-indigo-100 scale-[1.02]' 
                            : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <div className={`p-3 rounded-xl ${newRoom.type === type ? 'bg-[#7C3AED] text-white' : 'bg-slate-50 text-slate-400'}`}>
                          {getTypeIcon(type)}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tight text-center">{type}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Room Identity */}
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Identity</label>
                    <input
                      type="text"
                      required
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({...newRoom, name: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-8 py-5 text-sm font-black text-slate-800 outline-none focus:ring-4 focus:ring-[#7C3AED]/5 focus:border-[#7C3AED] transition-all"
                      placeholder="e.g., Advanced Calculus Session"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={newRoom.subject}
                        onChange={(e) => setNewRoom({...newRoom, subject: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-8 py-5 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-[#7C3AED]/5"
                        placeholder="e.g., Mathematics"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Topic</label>
                      <input
                        type="text"
                        required
                        value={newRoom.topic}
                        onChange={(e) => setNewRoom({...newRoom, topic: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-8 py-5 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-[#7C3AED]/5"
                        placeholder="e.g., Integration"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Context</label>
                    <textarea
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-8 py-5 text-sm font-medium text-slate-800 outline-none min-h-[120px] resize-none focus:ring-4 focus:ring-[#7C3AED]/5"
                      placeholder="Share what the group will focus on..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-5 border-2 border-slate-100 rounded-2xl text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="flex-[2] py-5 bg-[#7C3AED] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3"
                  >
                    Go Live Now <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyRoomsView;