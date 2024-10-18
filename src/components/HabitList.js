import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import HabitCalendar from './HabitCalendar';

const HabitList = ({ token, habits, setHabits }) => {
  const [logs, setLogs] = useState([]);
  const [selectedHabit, setSelectedHabit] = useState(null); // Tracks selected habit for calendar view
  const [progress, setProgress] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date()); // Default to real date initially

  const fetchHabits = useCallback(async () => {
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
  }, [token, setHabits]);

  const fetchCurrentDate = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/current-date', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedDate = new Date(response.data.currentDate);
      setCurrentDate(fetchedDate);
      updateAllProgress(fetchedDate);
    } catch (error) {
      console.error('Error fetching current date:', error);
    }
  }, [token]);

  const completeHabit = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/habits/${id}/log`,
        { date: currentDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit._id === id ? response.data : habit
        )
      );
      updateProgress(response.data); // Update progress after logging the habit
    } catch (error) {
      console.error('Error logging habit:', error);
    }
  };

  const deleteHabit = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/habits/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHabits(prevHabits => prevHabits.filter(habit => habit._id !== id));
      setProgress(prevProgress => {
        const newProgress = { ...prevProgress };
        delete newProgress[id];
        return newProgress;
      });
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const fetchLogs = async (id) => {
    try {
      await axios.get(`http://localhost:5000/api/habits/${id}/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedHabit(id);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  useEffect(() => {
    fetchCurrentDate();
    fetchHabits();
  }, [fetchCurrentDate, fetchHabits]);

  useEffect(() => {
    if (habits.length > 0) {
      updateAllProgress(currentDate);
    }
  }, [habits, currentDate]);

  const updateAllProgress = (date) => {
    const newProgress = {};
    habits.forEach(habit => {
      newProgress[habit._id] = calculateProgress(habit, date);
    });
    setProgress(newProgress);
  };

  const calculateProgress = (habit, date) => {
    let periodStart = new Date(date);

    if (habit.frequency === 'daily') {
      periodStart.setHours(0, 0, 0, 0);
    } else if (habit.frequency === 'weekly') {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      periodStart.setDate(diff);
      periodStart.setHours(0, 0, 0, 0);
    } else if (habit.frequency === 'monthly') {
      periodStart.setDate(1);
      periodStart.setHours(0, 0, 0, 0);
    }

    const logsInPeriod = habit.logs.filter(log => new Date(log.date) >= periodStart);
    const totalCompletions = logsInPeriod.reduce((sum, log) => sum + log.completedCount, 0);
    const progress = (totalCompletions / habit.targetCount) * 100;

    return progress > 100 ? 100 : progress;
  };

  const updateProgress = (updatedHabit) => {
    setProgress(prevProgress => ({
      ...prevProgress,
      [updatedHabit._id]: calculateProgress(updatedHabit, currentDate),
    }));
  };

  const setTestDate = async (date) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/set-test-date',
        { date },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error('Error setting test date:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
  <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600 mb-8 text-center">
    Your Habits
  </h1>

  <ul className="space-y-6">
    {habits.map((habit) => (
      <li
        key={habit._id}
        className="p-6 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
      >
        <div>
          {/* Habit Name and Streak */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
              {habit.name}
              <span className="text-lg text-yellow-500 font-semibold flex items-center">
                🔥 {habit.streak}
              </span>
            </h2>
            <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-full">
              {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
            </span>
          </div>

          {/* Habit Description */}
          <p className="text-base text-gray-700 mt-4 mb-4 bg-gray-50 p-3 rounded-lg">
            {habit.description}
          </p>

          {/* Habit Details */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-sm text-gray-600 flex items-center">
              <strong className="text-gray-800 font-medium w-24">Target:</strong>
              <span className="ml-2">{habit.targetCount} times</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <strong className="text-gray-800 font-medium w-24">Category:</strong>
              <span className="ml-2">{habit.category}</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <strong className="text-gray-800 font-medium w-24">Tags:</strong>
              <span className="ml-2">{habit.tags.join(', ')}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="my-4">
  <div className="w-full bg-gray-200 h-2 rounded-full">
    <div
      className="bg-green-500 h-2 rounded-full transition-all duration-500"
      style={{ width: `${Math.round(progress[habit._id] || 0)}%` }}
    />
  </div>
  <div className="text-sm text-gray-600 mt-1">
    <strong className="font-medium">{Math.round(progress[habit._id] || 0)}%</strong> completed
  </div>
</div>

          {/* Buttons */}
          <div className="space-y-4 mt-4">
  {/* Buttons Section */}
  <div className="flex space-x-4">
    <button
      onClick={() => completeHabit(habit._id)}
      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-300"
    >
      Complete
    </button>
    <button
      onClick={() => deleteHabit(habit._id)}
      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition duration-300"
    >
      Delete
    </button>
  </div>

  {/* Render HabitCalendar Component Directly */}
  <div className="mt-6">
    <HabitCalendar logs={logs} />
  </div>
</div>
</div>

        {/* Habit Logs */}
        <ul className="mt-4 space-y-1 border-t border-gray-200 pt-4">
          {habit.logs.map((log, index) => (
            <li key={`${log._id}-${index}`} className="text-sm text-gray-600">
              <span className="font-medium">{new Date(log.date).toLocaleDateString()}</span>: {log.completedCount} completions
            </li>
          ))}
        </ul>
      </li>
    ))}
  </ul>

  <button
    onClick={() => setTestDate(new Date().toISOString())}
    className="mb-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
  >
    Set Test Date to Now
  </button>

  {selectedHabit && <HabitCalendar logs={logs} />}
</div>


  );
};

export default HabitList;