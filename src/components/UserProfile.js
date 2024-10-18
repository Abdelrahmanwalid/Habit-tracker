import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [token]);

  return (
    <div className="max-w-md mx-auto bg-gradient-to-b from-blue-100 to-white shadow-lg rounded-lg p-6 mt-10 transform hover:scale-105 transition-transform duration-300 ease-in-out">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">User Profile</h2>
      <div className="flex flex-col items-center space-y-4">
        {profile.profilePicture ? (
          <img
            src={profile.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover shadow-lg ring-4 ring-blue-200"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-lg">
            <span className="text-2xl text-gray-400">No Image</span>
          </div>
        )}
        <div className="w-full text-center space-y-2">
          <p className="text-xl font-semibold text-gray-700">
            Nickname: <span className="font-normal text-gray-800">{profile.nickname || 'N/A'}</span>
          </p>
          <p className="text-lg text-gray-600">
            Username: <span className="font-normal text-gray-700">{profile.username || 'N/A'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;