import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { clubService, messageService } from '../services/api';
import { useSocket } from '../context/SocketContext';

export const ChatPage = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [clubs, setClubs] = useState([]);
  const [activeClub, setActiveClub] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await clubService.getClubs();
        if (response?.success) {
          const next = Array.isArray(response.data) ? response.data : response.data?.clubs || [];
          setClubs(next);
        } else {
          setClubs([]);
        }
      } catch (error) {
        console.error('Error fetching clubs:', error);
        setClubs([]);
      }
    };

    fetchClubs();
  }, []);

  // Fetch messages when active club changes
  useEffect(() => {
    if (!activeClub) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await messageService.getClubMessages(activeClub._id);
        if (res?.success) {
          const msgs = Array.isArray(res.data) ? res.data : res.data?.messages || [];
          setMessages(msgs);
        } else {
          setMessages([]);
        }
      } catch (err) {
        console.error('Error loading club messages:', err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [activeClub]);

  // Listen for incoming club messages via socket
  useEffect(() => {
    if (!socket) return;

    const handleReceive = (msg) => {
      // Only append messages for the active club
      if (!msg) return;
      const clubId = msg.clubId || msg.club || msg.clubId === undefined ? msg.clubId : null;
      if (activeClub && String(clubId) !== String(activeClub._id)) return;
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive-club-message', handleReceive);
    return () => socket.off('receive-club-message', handleReceive);
  }, [socket, activeClub]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!messageText.trim() || !activeClub) return;

    const payload = {
      club: activeClub._id,
      content: messageText.trim(),
      messageType: 'group',
    };

    try {
      // Emit via socket for real-time delivery
      socket?.emit('club-message', { clubId: activeClub._id, content: payload.content });

      // Persist message via API
      try {
        await messageService.sendMessage(payload);
      } catch (err) {
        console.warn('Failed to persist message via API', err);
      }

      // Optimistically append to UI
      setMessages((prev) => [...prev, { ...payload, sender: { _id: user?._id, firstName: user?.firstName, lastName: user?.lastName }, createdAt: new Date().toISOString() }]);
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-custom">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Messages</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName}. Use this space to connect with your clubs and peers.
          </p>
        </div>

        <div className="w-full min-h-[calc(100vh-80px)] bg-gray-50 flex">
          {/* Sidebar */}
          <aside className="w-80 bg-white border-r border-gray-200 p-4">
            <h2 className="text-xl font-semibold mb-4">Club Rooms</h2>
            <div className="space-y-3">
              {clubs.length > 0 ? (
                clubs.map((club) => (
                  <div key={club._id} className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 ${activeClub?._id === club._id ? 'bg-gray-50 border border-indigo-100' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center font-bold">#</div>
                      <div className="text-sm font-medium">{club.name}</div>
                    </div>
                    <Button size="sm" variant={activeClub?._id === club._id ? 'primary' : 'outline'} onClick={() => {
                      try { socket?.emit('join-club-chat', club._id); } catch (e) { console.warn('Socket not available', e); }
                      setActiveClub(club);
                    }}>{activeClub?._id === club._id ? 'Entered' : 'Enter'}</Button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">Loading clubs...</p>
              )}
            </div>
          </aside>

          {/* Chat window */}
          <main className="flex-1 flex flex-col bg-slate-50">
            {activeClub ? (
              <>
                <div className="bg-white border-b border-gray-200 p-4 flex items-center shadow-sm">
                  <div className="text-2xl font-extrabold text-indigo-600 mr-3">#</div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold">{activeClub.name}</div>
                    <div className="text-sm text-gray-500">Club chat</div>
                  </div>
                  <div className="text-sm text-gray-400">Members: {activeClub.memberCount || activeClub.members?.length || 0}</div>
                </div>

                <div className="flex-1 p-6 overflow-auto" id="chat-messages">
                  <div className="max-w-3xl mx-auto space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-400 mt-24">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8S3 16.418 3 12 7.03 4 12 4s9 3.582 9 8z" />
                        </svg>
                        <div className="mt-4 text-lg text-gray-600">Select a club room from the sidebar to start chatting!</div>
                      </div>
                    ) : (
                      messages.map((m, idx) => {
                        const senderId = m.sender?._id || m.sender || m.senderId;
                        const isMine = String(senderId) === String(user?._id);
                        const content = m.content || m.text || m.message || m.body;
                        return (
                          <div key={idx} className={`${isMine ? 'flex justify-end' : 'flex justify-start'}`}>
                            <div className={`${isMine ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none max-w-md p-3 shadow-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-none max-w-md p-3 shadow-sm'}`}>
                              <div className="text-sm font-semibold">{isMine ? 'You' : (m.sender?.firstName ? `${m.sender.firstName} ${m.sender.lastName || ''}` : 'Member')}</div>
                              <div className="mt-1 text-sm">{content}</div>
                              <span className="text-[10px] opacity-75 mt-1 block text-right">{new Date(m.createdAt || m.timestamp || Date.now()).toLocaleString()}</span>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); sendMessage(); } }}
                      placeholder={`Message #${activeClub.name}`}
                      className="flex-1 rounded-full bg-gray-100 border-none focus:ring-2 focus:ring-indigo-500 px-5 py-3"
                    />
                    <button onClick={sendMessage} disabled={!messageText.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full transition-all disabled:opacity-50 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.94 10.94a.75.75 0 011.06 0l3.95 3.95a.75.75 0 001.28-.53v-2.13a.75.75 0 01.75-.75h2.5a.75.75 0 00.6-1.2L7.97 4.72a.75.75 0 011.03-1.08l8.35 7.11a.75.75 0 01.06 1.18l-8.35 7.87a.75.75 0 01-1.16-.64v-2.69a.75.75 0 00-1.28-.53L4 11.69a.75.75 0 01-.06-1.06z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8S3 16.418 3 12 7.03 4 12 4s9 3.582 9 8z" />
                  </svg>
                  <h3 className="mt-6 text-xl font-semibold text-gray-700">Select a club room from the sidebar to start chatting!</h3>
                  <p className="mt-2 text-gray-500">Rooms are listed on the left. Click Enter to join.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
