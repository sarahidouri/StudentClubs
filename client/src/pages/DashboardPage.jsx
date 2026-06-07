import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Loading, EmptyState } from '../components/UI';
import { useSocket } from '../context/SocketContext';
import { chatService, eventService, postService, clubService } from '../services/api';
import { Calendar, Activity, MessageSquare } from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [userEvents, setUserEvents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [postContent, setPostContent] = useState(''); //  فيكس: زدت الـ State لي كانت ناقصة
  const [stats, setStats] = useState({
    clubsJoined: 0,
    upcomingEvents: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showClubModal, setShowClubModal] = useState(false);

  const [eventForm, setEventForm] = useState({ title: '', description: '', startDate: '', location: '', clubId: '' });
  const [clubForm, setClubForm] = useState({ name: '', description: '', category: '' });

  const getClubId = (club) => (typeof club === 'object' ? club?._id : club);
  const getClubName = (club) =>
    typeof club === 'object' && club?.name ? club.name : 'Club';
  const getEventId = (event) => (typeof event === 'object' ? event?._id : event);
  const getEventTitle = (event) =>
    typeof event === 'object' && event?.title ? event.title : 'Event';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const unreadRes = await chatService.getUnreadCount().catch(() => null);

        const unreadMessages = unreadRes?.success
          ? unreadRes.data?.unreadCount || 0
          : 0;

        const registeredEvents = user?.registeredEvents || [];
        const hasEventObjects = registeredEvents.some(
          (event) => typeof event === 'object' && !!event?.title
        );

        if (registeredEvents.length > 0 && hasEventObjects) {
          setUserEvents(registeredEvents);
          setStats({
            clubsJoined: user?.joinedClubs?.length || 0,
            upcomingEvents: registeredEvents.length,
            unreadMessages,
          });
        } else {
          const eventRes = await eventService.getEvents().catch(() => null);

          if (eventRes?.success && eventRes.data?.events) {
            const attending = eventRes.data.events.filter((e) => {
              return e.attendees?.some((att) => {
                const attId = att?.user?._id || att?.user?.id || att?.user || att;
                const userId = user?._id || user?.id;
                return String(attId) === String(userId);
              });
            });
            setUserEvents(attending);
            setStats({
              clubsJoined: user?.joinedClubs?.length || 0,
              upcomingEvents: attending.length,
              unreadMessages,
            });
          } else {
            setStats((prev) => ({
              ...prev,
              clubsJoined: user?.joinedClubs?.length || 0,
              unreadMessages,
            }));
          }
        }

        // Fetch activities (latest posts from user clubs)
        if (user?.joinedClubs?.length > 0) {
          const allPosts = [];
          const clubList = user.joinedClubs.slice(0, 5);
          for (const club of clubList) {
            const clubId = getClubId(club);
            const postRes = await postService.getClubPosts(clubId).catch(() => null);
            if (postRes?.success && postRes.data?.posts && Array.isArray(postRes.data.posts)) {
              allPosts.push(...postRes.data.posts);
            }
          }

          setRecentActivity(
            allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
          );
        }
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboardData();
    } else {
      setLoading(false);
      console.log("User not available yet for dashboard data fetch.");
    }
  }, [user?._id, user?.joinedClubs?.length, user?.registeredEvents?.length]);

  //  فيكس: زدت الدالة لي كاتصيفط البوست السريع باش ما تبقاش undefined
  const handleQuickPost = async () => {
    if (!postContent.trim() || !user?.joinedClubs?.length) return;
    
    const firstClub = user.joinedClubs[0];
    const clubId = getClubId(firstClub);

    try {
      const res = await postService.createPost({ clubId, content: postContent });
      if (res?.success) {
        const createdPost = res.data?.post || res.data;
        // زيد البوست الجديد هو الأول ف الـ list وخوي الـ textarea
        setRecentActivity(prev => [createdPost, ...prev].slice(0, 5));
        setPostContent('');
      }
    } catch (err) {
      console.error("Error creating quick post:", err);
    }
  };

  if (loading) return <Loading />;

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user?.firstName}! 👋
          </h1>
          <p className="text-sm uppercase tracking-wide text-primary font-semibold mb-2">
            {user?.role === 'admin' && 'Admin Dashboard'}
            {user?.role === 'club_manager' && 'Club Manager Dashboard'}
            {user?.role === 'student' && 'Student Dashboard'}
          </p>
          <p className="text-gray-600">
            Here's what's happening in your campus community
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {stats.clubsJoined}
              </div>
              <p className="text-gray-600">Clubs Joined</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-secondary mb-2">
                {stats.upcomingEvents}
              </div>
              <p className="text-gray-600">Upcoming Events</p>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-accent mb-2">
                {stats.unreadMessages}
              </div>
              <p className="text-gray-600">Unread Messages</p>
            </div>
          </Card>
        </div>

        {/* Role-based sections */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* My Clubs */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">My Clubs</h2>
            {user?.joinedClubs && user.joinedClubs.length > 0 ? (
              <div className="space-y-3">
                {user.joinedClubs.map((club) => (
                  <Link
                    to={`/clubs/${getClubId(club)}`}
                    key={getClubId(club)}
                    className="block p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    {getClubName(club)}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                You haven't joined any clubs yet. 
                <Link to="/clubs" className="text-primary hover:underline">
                  {' '}Explore clubs
                </Link>
              </p>
            )}
          </Card>

          {/* My Registered Events */}
          <Card id="my-events-section">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar size={24} className="text-secondary" /> My Events
            </h2>
            {userEvents.length > 0 ? (
              <div className="space-y-3">
                {userEvents.map((event) => (
                  <Link
                    to={`/events/${getEventId(event)}`}
                    key={getEventId(event)}
                    className="block p-3 border-l-4 border-secondary bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors"
                  >
                    <p className="font-bold text-sm">{getEventTitle(event)}</p>
                    <p className="text-xs text-gray-500">
                      {event?.startDate ? new Date(event.startDate).toLocaleDateString() : 'Date TBD'}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">No registered events yet.</p>
            )}
          </Card>

          {/* Recent Activity */}
          <Card id="activity-section">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Activity size={24} className="text-accent" /> Recent Activity
            </h2>
            
            {/* Quick Post Input */}
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
              <textarea 
                className="w-full p-2 text-sm border rounded-md focus:ring-1 focus:ring-primary outline-none"
                placeholder="Share something with your club..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <Button size="sm" className="mt-2 w-full" onClick={handleQuickPost} disabled={!user?.joinedClubs?.length}>
                Post to {getClubName(user?.joinedClubs?.[0])}
              </Button>
            </div>

            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.map(post => (
                  <div key={post._id} className="text-sm border-b pb-2 last:border-0">
                    <p className="text-gray-800 line-clamp-2">{post.content}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] text-primary font-bold">New Post</span>
                      <span className="text-[10px] text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic text-sm">No recent activity.</p>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="outline"
                className="justify-center"
                onClick={() => scrollToSection('activity-section')}
              >
                My Activity
              </Button>
              <Link to="/events">
                <Button variant="outline" className="justify-center">Explore Events</Button>
              </Link>
              <Button
                variant="outline"
                className="justify-center"
                onClick={() => scrollToSection('my-events-section')}
              >
                My Registered Events
              </Button>
              <Link to="/chat">
                <Button
                  variant="outline"
                  className="justify-center"
                >
                  Messages
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <Card className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/admin/users">
                <Button variant="secondary" className="w-full justify-center">
                  Manage Users
                </Button>
              </Link>
              <Link to="/admin/reports">
                <Button variant="secondary" className="w-full justify-center">
                  Moderate Reports
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Club Manager Section */}
        {user?.role === 'club_manager' && (
          <Card className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Club Manager</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={() => setShowEventModal(true)}
              >
                Create Event
              </Button>

              <Button
                variant="secondary"
                className="w-full justify-center"
                onClick={() => setShowClubModal(true)}
              >
                Create Club
              </Button>
            </div>
          </Card>
        )}
      </div>
      {/* Modals */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-xl p-6">
            <h3 className="text-xl font-bold mb-4">Create Event</h3>
            <div className="space-y-3">
              <input className="w-full p-2 border rounded" placeholder="Title" value={eventForm.title} onChange={(e)=>setEventForm({...eventForm, title: e.target.value})} />
              <textarea className="w-full p-2 border rounded" placeholder="Description" value={eventForm.description} onChange={(e)=>setEventForm({...eventForm, description: e.target.value})} />
              <input type="date" className="w-full p-2 border rounded" value={eventForm.startDate} onChange={(e)=>setEventForm({...eventForm, startDate: e.target.value})} />
              <input className="w-full p-2 border rounded" placeholder="Location" value={eventForm.location} onChange={(e)=>setEventForm({...eventForm, location: e.target.value})} />
              <select className="w-full p-2 border rounded" value={eventForm.clubId} onChange={(e)=>setEventForm({...eventForm, clubId: e.target.value})}>
                <option value="">Select Club</option>
                {(user?.managedClubs || user?.joinedClubs || []).map(club=> (
                  <option key={getClubId(club)} value={getClubId(club)}>{getClubName(club)}</option>
                ))}
              </select>
              <div className="flex gap-3">
                <Button onClick={async ()=>{
                  try{
                    if(!eventForm.clubId) return alert('Please select a club');
                    const payload = {
                      title: eventForm.title,
                      description: eventForm.description,
                      startDate: eventForm.startDate,
                      location: eventForm.location,
                    };
                    const res = await eventService.createEvent(eventForm.clubId, payload);
                    if(res?.success){
                      alert('Event created successfully');
                      setShowEventModal(false);
                      window.location.reload();
                    }
                  }catch(err){
                    console.error('Create event failed', err);
                    alert(err.response?.data?.message || err.message || 'Create event failed');
                  }
                }}>Create</Button>
                <Button variant="outline" onClick={()=>setShowEventModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showClubModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h3 className="text-xl font-bold mb-4">Create Club</h3>
            <div className="space-y-3">
              <input className="w-full p-2 border rounded" placeholder="Club Name" value={clubForm.name} onChange={(e)=>setClubForm({...clubForm, name: e.target.value})} />
              <textarea className="w-full p-2 border rounded" placeholder="Description" value={clubForm.description} onChange={(e)=>setClubForm({...clubForm, description: e.target.value})} />
              <select className="w-full p-2 border rounded" value={clubForm.category} onChange={(e)=>setClubForm({...clubForm, category: e.target.value})}>
                <option value="">Select Category</option>
                <option value="Academic">Academic</option>
                <option value="Sports">Sports</option>
                <option value="Social">Social</option>
                <option value="Technical">Technical</option>
                <option value="Cultural">Cultural</option>
                <option value="Hobby">Hobby</option>
                <option value="Volunteer">Volunteer</option>
              </select>
              <div className="flex gap-3">
                <Button onClick={async ()=>{
                  try{
                    if(!clubForm.name) return alert('Club name required');
                    const payload = {
                      name: clubForm.name,
                      description: clubForm.description,
                      category: clubForm.category || 'social'
                    };
                    const res = await clubService.createClub(payload);
                    if(res?.success){
                      alert('Club created successfully');
                      setShowClubModal(false);
                      window.location.reload();
                    }
                  }catch(err){
                    console.error('Create club failed', err);
                    alert(err.response?.data?.message || err.message || 'Create club failed');
                  }
                }}>Create</Button>
                <Button variant="outline" onClick={()=>setShowClubModal(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
