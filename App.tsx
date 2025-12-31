import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProfileView from './components/ProfileView';
import DiscoveryView from './components/DiscoveryView';
import ChatSystem from './components/ChatSystem';
import ConnectionsView from './components/ConnectionsView';
import AnalyticsView from './components/AnalyticsView';
import AssignmentsView from './components/AssignmentsView';
import WellnessView from './components/WellnessView';
import CoursesView from './components/CoursesView';
import StudyRoomsView from './components/StudyRoomsView';
import AuthSystem from './components/AuthSystem';
import LandingPage from './components/LandingPage';
import RiskAssessmentView from './components/RiskAssessmentView';
import { AppState, UserProfile, Connection, Message, AppNotification, StudyRoom, RoomMessage, Assignment } from './types';
import { apiRequest } from './services/api';

const EMPTY_USER: UserProfile = {
  id: '',
  name: '',
  email: '',
  role: 'student',
  bio: '',
  avatar: '',
  skills: [],
  interests: [],
  subjects: [],
  enrolledCourses: [],
  emailVerified: false,
  gradeOrClass: '',
  department: '',
  availability: 'offline',
  completeness: 0
};

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'landing' | 'auth' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState('buddy');
  const [state, setState] = useState<AppState>({
    currentUser: EMPTY_USER,
    allUsers: [],
    connections: [],
    messages: [],
    notifications: [],
    mutedBuddies: [],
    assignments: [],
    roomMessages: [],
    studyRooms: []
  });

  // Persistent storage simulation
  useEffect(() => {
    const saved = localStorage.getItem('lms_buddy_v6_auth_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
        setViewMode('app');
      } catch (e) {
        console.error("Failed to load state", e);
      }
    }
  }, []);

  // Save state on changes to maintain user session and app data
  useEffect(() => {
    if (viewMode === 'app') {
      const fetchConnections = async () => {
        try {
          const rawConnections = await apiRequest('/connections/mine', 'GET');
          // Normalize connection data: add 'id' and ensure nested user objects have 'id'
          const connections = rawConnections.map((c: any) => ({
            ...c,
            id: c._id,
            fromUserId: typeof c.fromUserId === 'object' ? { ...c.fromUserId, id: c.fromUserId._id } : c.fromUserId,
            toUserId: typeof c.toUserId === 'object' ? { ...c.toUserId, id: c.toUserId._id } : c.toUserId
          }));
          setState(prev => ({ ...prev, connections }));
        } catch (e) {
          console.error(e);
        }
      };
      fetchConnections();

      const fetchMessages = async () => {
        try {
          const messages = await apiRequest('/messages/mine', 'GET');
          setState(prev => ({ ...prev, messages }));
        } catch (e) {
          console.error(e);
        }
      };
      fetchMessages();

      const fetchNotifications = async () => {
        try {
          const notifications = await apiRequest('/notifications/mine', 'GET');
          setState(prev => ({ ...prev, notifications }));
        } catch (e) {
          console.error(e);
        }
      };
      fetchNotifications();
    }
  }, [viewMode]);

  const handleAuthenticate = (user: UserProfile) => {
    setState(prev => ({
      ...prev,
      currentUser: user
    }));
    // Persist login
    localStorage.setItem('lms_buddy_v6_auth_v1', JSON.stringify({ currentUser: user }));
    setViewMode('app');
  };

  const handleLogout = () => {
    setViewMode('landing');
    localStorage.removeItem('lms_buddy_v6_auth_v1');
  };

  // Profile update handler to sync changes across the app state
  const handleUpdateProfile = (updatedUser: UserProfile) => {
    setState(prev => ({
      ...prev,
      currentUser: updatedUser,
      allUsers: prev.allUsers.map(u => u.id === updatedUser.id ? updatedUser : u)
    }));
  };

  // Notification management handlers
  const handleMarkNotificationRead = async (id: string) => {
    try {
      await apiRequest(`/notifications/${id}/read`, 'PUT');
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearNotifications = async () => {
    try {
      await apiRequest('/notifications/clear', 'DELETE');
      setState(prev => ({
        ...prev,
        notifications: []
      }));
    } catch (e) {
      console.error(e);
    }
  };



  // Chat and messaging handlers
  // Chat and messaging handlers
  const handleSendMessage = async (receiverId: string, content: string, type: Message['type'], metadata?: any) => {
    try {
      const newMessage = await apiRequest('/messages', 'POST', {
        receiverId,
        content,
        type,
        metadata
      });
      // Backend returns object with id. Ensure id is string if not already normalized in backend/response logic
      const messageWithId = { ...newMessage, id: newMessage.id || newMessage._id };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, messageWithId]
      }));
    } catch (e) {
      console.error(e);
      alert('Failed to send message');
    }
  };

  const handleMarkMessagesRead = async (buddyId: string) => {
    try {
      await apiRequest(`/messages/read/${buddyId}`, 'PUT');
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(m =>
          (m.senderId === buddyId && m.receiverId === state.currentUser.id) ? { ...m, read: true } : m
        )
      }));
    } catch (e) {
      console.error(e);
    }
  };

  // Peer connection management handlers
  // Peer connection management handlers
  const handleConnect = async (targetUserId: string) => {
    try {
      const result = await apiRequest('/connections/invite', 'POST', { targetUserId });
      // Normalize single connection result
      const newConnection = {
        ...result,
        id: result._id,
        // Assuming result returns strings for IDs initially unless populated, check backend
        // Usually POST returns just created document. Backend line 47: res.status(201).json(newConnection); 
        // Backend create uses strings. So no population there immediately.
      };
      setState(prev => ({
        ...prev,
        connections: [...prev.connections, newConnection]
      }));
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleAcceptConnection = async (connectionId: string) => {
    try {
      const result = await apiRequest(`/connections/accept/${connectionId}`, 'PUT');
      // Normalize result
      const updated = { ...result, id: result._id };
      // Note: Accept returns the document, likely strings for IDs unless backend re-fetches. 
      // But we might need to preserve the populated user data if we had it.

      setState(prev => ({
        ...prev,
        connections: prev.connections.map(c => {
          if (c.id === connectionId) {
            // Keep the populated user data from existing state if backend returned strings
            return { ...updated, fromUserId: c.fromUserId, toUserId: c.toUserId };
          }
          return c;
        })
      }));
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleRejectConnection = async (connectionId: string) => {
    try {
      const result = await apiRequest(`/connections/reject/${connectionId}`, 'PUT');
      const updated = { ...result, id: result._id };
      setState(prev => ({
        ...prev,
        connections: prev.connections.map(c => {
          if (c.id === connectionId) {
            return { ...updated, fromUserId: c.fromUserId, toUserId: c.toUserId };
          }
          return c;
        })
      }));
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleRemoveConnection = (buddyId: string) => {
    // TODO: Add remove API endpoint if needed, for now just local
    setState(prev => ({
      ...prev,
      connections: prev.connections.filter(c =>
        !((c.fromUserId === state.currentUser.id && c.toUserId === buddyId) ||
          (c.toUserId === state.currentUser.id && c.fromUserId === buddyId))
      )
    }));
  };

  const handleToggleMute = (buddyId: string) => {
    setState(prev => ({
      ...prev,
      mutedBuddies: prev.mutedBuddies.includes(buddyId)
        ? prev.mutedBuddies.filter(id => id !== buddyId)
        : [...prev.mutedBuddies, buddyId]
    }));
  };

  // Study room interaction handlers
  const handleCreateRoom = (roomData: Omit<StudyRoom, 'id' | 'currentParticipants' | 'creatorId' | 'status' | 'duration' | 'maxParticipants'>) => {
    const newRoom: StudyRoom = {
      ...roomData,
      id: `room-${Date.now()}`,
      creatorId: state.currentUser.id,
      currentParticipants: [state.currentUser.id],
      status: 'active',
      duration: '1h',
      maxParticipants: 10,
      startTime: Date.now()
    };
    setState(prev => ({
      ...prev,
      studyRooms: [...prev.studyRooms, newRoom]
    }));
  };

  const handleJoinRoom = (roomId: string) => {
    setState(prev => ({
      ...prev,
      studyRooms: prev.studyRooms.map(r =>
        r.id === roomId && !r.currentParticipants.includes(state.currentUser.id)
          ? { ...r, currentParticipants: [...r.currentParticipants, state.currentUser.id] }
          : r
      )
    }));
  };

  const handleLeaveRoom = (roomId: string) => {
    setState(prev => ({
      ...prev,
      studyRooms: prev.studyRooms.map(r =>
        r.id === roomId
          ? { ...r, currentParticipants: r.currentParticipants.filter(id => id !== state.currentUser.id) }
          : r
      )
    }));
  };

  const handleSendRoomMessage = (roomId: string, content: string) => {
    const newMsg: RoomMessage = {
      id: `rmsg-${Date.now()}`,
      roomId,
      senderId: state.currentUser.id,
      content,
      timestamp: Date.now()
    };
    setState(prev => ({
      ...prev,
      roomMessages: [...prev.roomMessages, newMsg]
    }));
  };

  // Assignment management handlers
  const handleAddAssignment = (assignment: Omit<Assignment, 'id' | 'userId' | 'status'>) => {
    const newAssignment: Assignment = {
      ...assignment,
      id: `a-${Date.now()}`,
      userId: state.currentUser.id,
      status: 'pending'
    };
    setState(prev => ({
      ...prev,
      assignments: [newAssignment, ...prev.assignments]
    }));
  };

  const handleUpdateAssignmentStatus = (id: string, status: 'pending' | 'completed', score?: number, userAnswers?: Record<number, number>) => {
    setState(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => a.id === id ? { ...a, status, score, userAnswers } : a)
    }));
  };

  const handleRemoveAssignment = (id: string) => {
    setState(prev => ({
      ...prev,
      assignments: prev.assignments.filter(a => a.id !== id)
    }));
  };

  const connectedBuddies = useMemo(() => {
    return state.connections
      .filter(c => c.status === 'accepted')
      .map(c => {
        // Determine partner object
        // Check if fromUserId is current user (by ID check if object, or value check if string)
        const isFromMe = (typeof c.fromUserId === 'object' && c.fromUserId.id === state.currentUser.id) || c.fromUserId === state.currentUser.id;

        const partner = isFromMe ? c.toUserId : c.fromUserId;

        if (typeof partner === 'object') {
          // It's a populated user object. 
          return {
            ...partner,
            // Ensure arrays are present
            skills: partner.skills || [],
            interests: partner.interests || [],
            subjects: partner.subjects || [],
            // Default for missing schema fields
            availability: partner.availability || 'offline',
            completeness: partner.completeness || 100,
            avatar: partner.avatar || `https://ui-avatars.com/api/?name=${partner.name}`
          } as UserProfile;
        }
        return null;
      })
      .filter((u): u is UserProfile => u !== null);
  }, [state.connections, state.currentUser.id]);

  const currentUserNotifications = useMemo(() => {
    return state.notifications.filter(n => n.userId === state.currentUser.id);
  }, [state.notifications, state.currentUser.id]);

  const unreadNotifCount = currentUserNotifications.filter(n => !n.read).length;
  const unseenMessagesCount = state.messages.filter(m => m.receiverId === state.currentUser.id && !m.read).length;

  // View state conditional returns
  if (viewMode === 'landing') return <LandingPage onStart={() => setViewMode('auth')} onLogin={() => setViewMode('auth')} />;
  if (viewMode === 'auth') return <AuthSystem onAuthenticate={handleAuthenticate} />;

  const renderContent = () => {
    switch (activeTab) {
      case 'buddy':
        return <Dashboard currentUser={state.currentUser} connections={state.connections} notifications={currentUserNotifications} setActiveTab={setActiveTab} />;
      case 'courses':
        return <CoursesView />;
      case 'study_rooms':
        return (
          <StudyRoomsView
            currentUser={state.currentUser}
            allUsers={state.allUsers}
            studyRooms={state.studyRooms}
            roomMessages={state.roomMessages}
            onCreateRoom={handleCreateRoom}
            onJoinRoom={handleJoinRoom}
            onLeaveRoom={handleLeaveRoom}
            onSendRoomMessage={handleSendRoomMessage}
          />
        );
      case 'profile':
        return <ProfileView user={state.currentUser} onUpdate={handleUpdateProfile} />;
      case 'discovery':
        return (
          <DiscoveryView
            currentUser={state.currentUser}
            allUsers={state.allUsers}
            connections={state.connections}
            onConnect={handleConnect}
            setActiveTab={setActiveTab}
          />
        );
      case 'connections':
        return (
          <ConnectionsView
            currentUser={state.currentUser}
            allUsers={state.allUsers}
            connections={state.connections}
            mutedBuddies={state.mutedBuddies}
            onAccept={handleAcceptConnection}
            onReject={handleRejectConnection}
            onRemove={handleRemoveConnection}
            onToggleMute={handleToggleMute}
            onGoToChat={() => setActiveTab('chat')}
            onGoToDiscovery={() => setActiveTab('discovery')}
          />
        );
      case 'assignments':
        return (
          <AssignmentsView
            assignments={state.assignments.filter(a => a.userId === state.currentUser.id)}
            onAddAssignment={handleAddAssignment}
            onUpdateStatus={handleUpdateAssignmentStatus}
            onRemove={handleRemoveAssignment}
          />
        );
      case 'risk_assessment':
        return <RiskAssessmentView />;
      case 'wellness':
        return <WellnessView />;
      case 'chat':
        return (
          <ChatSystem
            currentUser={state.currentUser}
            buddies={connectedBuddies}
            messages={state.messages}
            onSendMessage={handleSendMessage}
            onMarkRead={handleMarkMessagesRead}
          />
        );
      default:
        return <Dashboard currentUser={state.currentUser} connections={state.connections} notifications={currentUserNotifications} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unseenMessagesCount={unseenMessagesCount}
        notifications={currentUserNotifications}
        users={state.allUsers}
        currentUser={state.currentUser}
        onMarkRead={handleMarkNotificationRead}
        onClearAll={handleClearNotifications}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={state.currentUser}
          allUsers={state.allUsers}
          notificationCount={unreadNotifCount}
          notifications={currentUserNotifications}
          onMarkRead={handleMarkNotificationRead}
          onClearAll={handleClearNotifications}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;