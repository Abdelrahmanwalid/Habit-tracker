import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from './LogoutButton';
import axios from 'axios';

const Navbar = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('Failed to fetch profile');
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Profile Section */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <span className="text-white font-semibold animate-pulse">Loading...</span>
          ) : error ? (
            <span className="text-red-300 font-semibold">{error}</span>
          ) : (
            <Link
              to="/profile"
              className="flex items-center space-x-3 hover:bg-white hover:bg-opacity-20 px-4 py-2 rounded-full transition-all duration-300"
            >
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold">
                  <span>{profile.username ? profile.username[0] : 'U'}</span>
                </div>
              )}
              <span className="text-white text-lg font-semibold">{profile.nickname || profile.username}</span>
            </Link>
          )}
        </div>

        {/* Links and Logout Button */}
        <div className="flex items-center space-x-6">
          <Link
            className="text-white font-medium hover:text-gray-300 transition duration-200"
            to="/home"
          >
            Home
          </Link>
          <Link
            className="text-white font-medium hover:text-gray-300 transition duration-200"
            to="/analytics"
          >
            Analytics
          </Link>

          <LogoutButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;