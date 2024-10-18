import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const HabitCalendar = ({ logs }) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const toggleCalendarVisibility = () => {
    setIsCalendarVisible(!isCalendarVisible);
  };

  // Helper function to compare dates, ignoring the time
  const isSameDay = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Add content to the calendar tiles based on the logs
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const log = logs.find(log => isSameDay(new Date(log.date), date));
      return log ? (
        <div className="text-xs text-green-600">
          {log.completedCount} completions
        </div>
      ) : null;
    }
  };

  return (
    <div>
      {/* Button to toggle calendar visibility */}
      <button
        onClick={toggleCalendarVisibility}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md"
      >
        {isCalendarVisible ? 'Hide Calendar' : 'View Calendar'}
      </button>

      {/* Conditionally render the calendar */}
      {isCalendarVisible && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Habit Logs</h2>
          <Calendar tileContent={tileContent} />
        </div>
      )}
    </div>
  );
};

export default HabitCalendar;
