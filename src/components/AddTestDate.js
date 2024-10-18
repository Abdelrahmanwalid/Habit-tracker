import React, { useState } from 'react';
import axios from 'axios';

const AddTestDate = ({ token }) => {
  const [testDate, setTestDate] = useState('');

  const setDate = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/set-test-date', { date: testDate }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Test Date Set:', response.data);
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error('Error setting test date:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Set Test Date</h2>
      <div className="flex items-center space-x-4">
        <input
          type="date"
          value={testDate}
          onChange={(e) => setTestDate(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        />
        <button 
          onClick={setDate} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Set Test Date
        </button>
      </div>
    </div>
  );
};

export default AddTestDate;