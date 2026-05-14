import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Loading } from '../components/UI';
import { useSocket } from '../context/SocketContext';

export const DashboardPage = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const [stats, setStats] = useState({
    clubsJoined: 0,
    upcomingEvents: 0,
    unreadMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        clubsJoined: user?.joinedClubs?.length || 0,
        upcomingEvents: 5,
        unreadMessages: 3,
      });
      setLoading(false);
    }, 500);
  }, [user]);

  if (loading) return <Loading />;

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
        <div className="grid md:grid-cols-2 gap-6">
          {/* My Clubs */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">My Clubs</h2>
            {user?.joinedClubs && user.joinedClubs.length > 0 ? (
              <div className="space-y-3">
                {user.joinedClubs.map((club) => (
                  <div
                    key={club._id}
                    className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors"
                  >
                    {typeof club === 'object' ? club.name : club}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">
                You haven't joined any clubs yet. 
                <a href="/clubs" className="text-primary hover:underline">
                  {' '}Explore clubs
                </a>
              </p>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-center"
              >
                View My Posts
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center"
              >
                My Events
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center"
              >
                Settings
              </Button>
            </div>
          </Card>
        </div>

        {/* Admin Section */}
        {user?.role === 'admin' && (
          <Card className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full justify-center">
                Manage Users
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Moderate Reports
              </Button>
            </div>
          </Card>
        )}

        {/* Club Manager Section */}
        {user?.role === 'club_manager' && (
          <Card className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Club Manager</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full justify-center">
                Create Event
              </Button>
              <Button variant="secondary" className="w-full justify-center">
                Manage Members
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
