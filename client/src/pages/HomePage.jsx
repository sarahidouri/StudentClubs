import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { Users, Zap, Bell, MessageSquare } from 'lucide-react';

export const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-purple-500 to-secondary text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to StudentClubs 🎓
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Connect with students, join clubs, and experience campus life like never before
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {user ? (
              <>
                <Link to="/clubs">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                    Explore Clubs
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="secondary" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-light">
        <div className="container-custom">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why StudentClubs?
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Connect with Peers</h3>
              <p className="text-gray-600">
                Find like-minded students and build lasting connections
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Real-time Chat</h3>
              <p className="text-gray-600">
                Communicate instantly with club members and friends
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Smart Notifications</h3>
              <p className="text-gray-600">
                Never miss important club updates and event reminders
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-green-500" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Share Updates</h3>
              <p className="text-gray-600">
                Post updates, photos, and announcements with your club
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className="bg-primary text-white py-16">
          <div className="container-custom text-center">
            <h2 className="text-4xl font-bold mb-4">
              Ready to join the community?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Create your account today and start connecting
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Sign Up Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
