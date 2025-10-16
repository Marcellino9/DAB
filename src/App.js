import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Withdraw from './pages/Withdraw';
import Confirm from './pages/Confirm';
import { useSession } from './session/SessionContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function PrivateRoute({ children }) {
  const { authenticated } = useSession();
  if (!authenticated) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
               </PrivateRoute>
            }
          />
          <Route
            path="/withdraw"
            element={
               <PrivateRoute>
                <Withdraw />
               </PrivateRoute>
            }
          />
          <Route
            path="/confirm"
            element={
               <PrivateRoute>
                <Confirm />
               </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
