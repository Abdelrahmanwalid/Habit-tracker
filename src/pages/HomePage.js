import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HabitList from '../components/HabitList';
import AddHabit from '../components/AddHabit';
import AddTestDate from '../components/AddTestDate';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Routes, Route } from 'react-router-dom';
import HabitAnalytics from '../components/HabitAnalytics';
import UserProfile from '../components/UserProfile';

const HomePage = () => {
  const { token } = useAuth();
  const [habits, setHabits] = useState([]);

  const fetchHabits = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/habits', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <Routes>
          <Route
            path="/"
            element={
              <> 
              
                <div className="mb-8">
                  <AddHabit token={token} refreshHabits={fetchHabits} />
                </div>
                <div className="mb-8">
                  <AddTestDate token={token} />
                </div>
                <div className="mb-8">
                  <HabitList token={token} habits={habits} setHabits={setHabits} />
                </div>
               
              </>
            }
          />
          <Route path="/analytics" element={<HabitAnalytics token={token} />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </div>
    </div>
  );
};

export default HomePage;