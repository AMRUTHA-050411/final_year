
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Message } from '../types';
import { Send, Link as LinkIcon, FileText, Sparkles, Smile, MessageSquare as MessageSquareIcon } from 'lucide-react';
import { getStudySummary } from '../services/geminiService';

interface ChatSystemProps {
  currentUser: UserProfile;
  buddies: UserProfile[];
  messages: Message[];
  onSendMessage: (receiverId: string, content: string, type: Message['type'], metadata?: any) => void;
  onMarkRead: (buddyId: string) => void;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ currentUser, buddies, messages, onSendMessage, onMarkRead }) => {
  const [selectedBuddy, setSelectedBuddy] = useState<UserProfile | null>(buddies[0] || null);
  const [inputText, setInputText] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedBuddy) {
      onMarkRead(selectedBuddy.id);
    }
  }, [selectedBuddy, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedBuddy]);

  const activeMessages = messages.filter(m =>
    (m.senderId === currentUser.id && m.receiverId === selectedBuddy?.id) ||
    (m.senderId === selectedBuddy?.id && m.receiverId === currentUser.id)
  );

  const handleSend = () => {
    if (!inputText.trim() || !selectedBuddy) return;
    onSendMessage(selectedBuddy.id, inputText, 'text');
    setInputText('');
  };

  const handleShareLink = () => {
    const url = prompt('Enter a study resource URL:');
    if (url && selectedBuddy) {
      onSendMessage(selectedBuddy.id, `Shared a resource: ${url}`, 'resource', { link: url });
    }
  }

  const generateSummary = async () => {
    if (!selectedBuddy) return;
    setLoadingSummary(true);
    setShowSummary(true);
    const content = activeMessages.map(m => `${m.senderId === currentUser.id ? 'Me' : selectedBuddy.name}: ${m.content}`);
    const res = await getStudySummary(content);
    setSummary(res);
    setLoadingSummary(false);
  }

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-white rounded-3xl overflow-hidden shadow-2xl m-4 border border-slate-200">
      {/* Buddies List */}
      <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-6 border-b border-slate-100 bg-white">
          <h2 className="text-xl font-bold text-slate-800">Messages</h2>
          <p className="text-xs text-slate-500 font-medium">Collaborate with your buddies</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {buddies.length > 0 ? (
            buddies.map((buddy) => {
              const unreadCount = messages.filter(m => m.senderId === buddy.id && m.receiverId === currentUser.id && !m.read).length;
              return (
                <button
                  key={buddy.id}
                  onClick={() => setSelectedBuddy(buddy)}
                  className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all relative group ${selectedBuddy?.id === buddy.id ? 'bg-white shadow-md border border-slate-200' : 'hover:bg-white/60'
                    }`}
                >
                  <div className="relative">
                    <img src={buddy.avatar} className="w-12 h-12 rounded-xl object-cover" />
                    <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${buddy.availability === 'online' ? 'bg-green-500' : buddy.availability === 'away' ? 'bg-amber-400' : 'bg-slate-300'}`}></div>
                  </div>
                  <div className="text-left flex-1 overflow-hidden">
                    <p className="font-bold text-sm text-slate-900 truncate">{buddy.name}</p>
                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter truncate">{buddy.department}</p>
                  </div>
                  {unreadCount > 0 && (
                    <div className="bg-indigo-600 text-white text-[10px] min-w-[20px] h-[20px] flex items-center justify-center rounded-full font-bold px-1.5 animate-in zoom-in">
                      {unreadCount}
                    </div>
                  )}
                </button>
              );
            })
          ) : (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-slate-400 font-medium">No active buddies yet.<br />Go to Discovery to find some!</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedBuddy ? (
        <div className="flex-1 flex flex-col bg-white relative">
          {/* Chat Header */}
          <header className="p-4 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <img src={selectedBuddy.avatar} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <h3 className="font-bold text-slate-900 leading-none">{selectedBuddy.name}</h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${selectedBuddy.availability === 'online' ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedBuddy.availability === 'online' ? 'text-green-500' : 'text-slate-400'}`}>
                    {selectedBuddy.availability === 'online' ? 'Active now' : selectedBuddy.availability}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={generateSummary}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
              >
                <Sparkles size={14} /> AI Summary
              </button>
            </div>
          </header>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            {showSummary && (
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg relative animate-in zoom-in duration-300 mb-6">
                <button onClick={() => setShowSummary(false)} className="absolute top-3 right-3 text-white/60 hover:text-white"><Smile size={18} /></button>
                <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                  <Sparkles size={16} /> Learning Summary
                </div>
                <div className="text-sm text-indigo-50/90 whitespace-pre-line leading-relaxed">
                  {loadingSummary ? 'AI is analyzing your conversation...' : summary}
                </div>
              </div>
            )}

            {activeMessages.length > 0 ? (
              activeMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] group ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className={`p-4 rounded-3xl text-sm shadow-sm ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                        }`}>
                        {msg.type === 'resource' ? (
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-lg ${isMe ? 'bg-white/10 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                              <LinkIcon size={18} />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="font-semibold mb-1 text-xs">Shared Resource</p>
                              <p className="text-xs opacity-90 truncate underline break-all">{msg.metadata?.link}</p>
                            </div>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                      <p className={`text-[10px] mt-1 text-slate-400 font-medium px-2 ${isMe ? 'text-right' : 'text-left'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <div className="p-6 bg-slate-100 rounded-full mb-4">
                  <MessageSquareIcon size={32} className="text-slate-300" />
                </div>
                <p className="font-bold text-slate-500">No messages yet.</p>
                <p className="text-xs text-slate-400">Collaborate by asking a question or sharing resources!</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <footer className="p-4 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
              <div className="flex gap-1 px-2 border-r border-slate-200">
                <button onClick={handleShareLink} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors" title="Share Resource">
                  <LinkIcon size={20} />
                </button>

              </div>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                placeholder="Ask a question or share a note..."
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim()}
                className={`p-2.5 rounded-xl transition-all ${inputText.trim() ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-slate-200 text-slate-400'
                  }`}
              >
                <Send size={20} />
              </button>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">End-to-End Secure LMS Collaboration</p>
            </div>
          </footer>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50">
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-6">
              <MessageSquareIcon size={48} className="text-indigo-600" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">Select a Buddy</h3>
            <p className="text-slate-400 text-center max-w-[280px] text-sm leading-relaxed">Choose a connected peer from the sidebar to start sharing resources and clarifying concepts.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatSystem;
