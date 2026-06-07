import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/Navbar';
import { PrivateRoute } from './components/PrivateRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { ClubDetailsPage, ClubsPage, EventsPage, EventDetailsPage } from './pages/ClubsEventsPages';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { ManageUsersPage } from './pages/ManageUsersPage';
import { ModerateReportsPage } from './pages/ModerateReportsPage';
import { Loading } from './components/UI';
import './styles/index.css';

const AppContent = () => {
  const { loading, token, user } = useAuth();

  if (loading) return <Loading />;
  
  // If we have a token but no user, it means we are still fetching profile
  // This prevents the white screen desync
  if (token && !user) return <Loading />;

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/clubs" element={<ClubsPage />} />
        <Route path="/clubs/:id" element={<ClubDetailsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute requiredRole={['admin']}>
              <ManageUsersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <PrivateRoute requiredRole={['admin']}>
              <ModerateReportsPage />
            </PrivateRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
