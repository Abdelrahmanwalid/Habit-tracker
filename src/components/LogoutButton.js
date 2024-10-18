import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logout button clicked');
    logout();
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="text-white bg-red-500 px-3 py-1 rounded">
      Logout
    </button>
  );
};

export default LogoutButton;