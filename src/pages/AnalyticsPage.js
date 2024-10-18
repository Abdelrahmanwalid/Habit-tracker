import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import HabitAnalytics from '../components/HabitAnalytics';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const AnalyticsPage = () => {
  const { token } = useAuth();

  return (
    <div>
      <Navbar />
      
      <HabitAnalytics token={token} />
    </div>
  );
};

export default AnalyticsPage;