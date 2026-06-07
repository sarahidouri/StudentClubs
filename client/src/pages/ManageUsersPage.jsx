import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Users } from 'lucide-react';
import { Button, Card } from '../components/UI';

export const ManageUsersPage = () => (
  <div className="min-h-screen bg-light py-12">
    <div className="container-custom">
      <div className="mb-8">
        <div className="flex items-center gap-3 text-primary mb-2">
          <Users size={28} />
          <span className="text-sm font-semibold uppercase tracking-wide">
            Admin
          </span>
        </div>
        <h1 className="text-4xl font-bold mb-2">Manage Users</h1>
        <p className="text-gray-600">
          User management tools will appear here when the admin API is ready.
        </p>
      </div>

      <Card>
        <div className="flex items-start gap-4">
          <Shield className="text-secondary mt-1" size={28} />
          <div>
            <h2 className="text-2xl font-bold mb-2">Admin-only workspace</h2>
            <p className="text-gray-600 mb-6">
              This route is protected and available only to administrators.
            </p>
            <Link to="/dashboard">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  </div>
);
