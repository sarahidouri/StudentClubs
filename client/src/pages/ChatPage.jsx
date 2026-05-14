import React from 'react';
import { Card, Button } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export const ChatPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container-custom">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Campus Chat</h1>
          <p className="text-gray-600">
            Welcome back, {user?.firstName}. Use this space to connect with your clubs and peers.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <h2 className="text-2xl font-bold mb-4">Direct Messaging</h2>
            <p className="text-gray-600 mb-6">
              Send private messages to friends or club members. Stay connected with people you collaborate with most.
            </p>
            <Button variant="primary">Open Direct Chats</Button>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold mb-4">Club Conversations</h2>
            <p className="text-gray-600 mb-6">
              Join your club rooms and stay up to date with event announcements, updates, and collaboration.
            </p>
            <Button variant="secondary">Join Club Rooms</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
