import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const HabitAnalytics = ({ token }) => {
  const [habitData, setHabitData] = useState([]);

  useEffect(() => {
    const fetchHabitData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/habits', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHabitData(response.data);
      } catch (error) {
        console.error('Error fetching habit data:', error);
      }
    };

    fetchHabitData();
  }, [token]);

  const transformDataForStreaksOverTime = (data) => {
    const labels = data.flatMap(habit => habit.logs.map(log => new Date(log.date).toLocaleDateString()));
    const uniqueLabels = Array.from(new Set(labels)).sort((a, b) => new Date(a) - new Date(b));

    const datasets = data.map(habit => {
      const habitLogs = habit.logs.reduce((acc, log) => {
        const date = new Date(log.date).toLocaleDateString();
        acc[date] = (acc[date] || 0) + log.completedCount;
        return acc;
      }, {});

      return {
        label: habit.name,
        data: uniqueLabels.map(date => habitLogs[date] || 0),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      };
    });

    return {
      labels: uniqueLabels,
      datasets
    };
  };

  const transformDataForCompletionCounts = (data) => {
    const labels = data.map(habit => habit.name);
    const completionCounts = data.map(habit => habit.logs.reduce((sum, log) => sum + log.completedCount, 0));

    return {
      labels,
      datasets: [
        {
          label: 'Completion Counts',
          data: completionCounts,
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        },
      ],
    };
  };

  const transformDataForCategoryDistribution = (data) => {
    const categoryCounts = data.reduce((acc, habit) => {
      acc[habit.category] = (acc[habit.category] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(categoryCounts),
      datasets: [
        {
          label: 'Category Distribution',
          data: Object.values(categoryCounts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
        },
      ],
    };
  };

  const transformDataForTagUsage = (data) => {
    const tagCounts = data.reduce((acc, habit) => {
      habit.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    return {
      labels: Object.keys(tagCounts),
      datasets: [
        {
          label: 'Tag Usage',
          data: Object.values(tagCounts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)'
          ],
        },
      ],
    };
  };

  return (
    <div className="container mx-auto p-6">
     <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600 mb-8 text-center">
  <span className="inline-block mb-2">
    Habit Analytics
  </span>
  <span className="block text-lg font-medium text-gray-500">
    Track your progress and performance over time
  </span>
</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Streaks Over Time</h3>
          <div className="h-64">
            <Line data={transformDataForStreaksOverTime(habitData)} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Completion Counts</h3>
          <div className="h-64">
            <Bar data={transformDataForCompletionCounts(habitData)} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Category Distribution</h3>
          <div className="h-64">
            <Pie data={transformDataForCategoryDistribution(habitData)} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Tag Usage</h3>
          <div className="h-64">
            <Pie data={transformDataForTagUsage(habitData)} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitAnalytics;
