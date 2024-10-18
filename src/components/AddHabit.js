import React, { useState } from 'react';
import axios from 'axios';

const AddHabit = ({ token, habit, refreshHabits }) => {
  const [name, setName] = useState(habit ? habit.name : '');
  const [description, setDescription] = useState(habit ? habit.description : '');
  const [frequency, setFrequency] = useState(habit ? habit.frequency : 'daily');
  const [targetCount, setTargetCount] = useState(habit ? habit.targetCount : 1);
  const [category, setCategory] = useState(habit ? habit.category : '');
  const [tags, setTags] = useState(habit ? habit.tags.join(', ') : '');

  const presetCategories = ['Health', 'Fitness', 'Productivity', 'Learning', 'Hobby', 'Finance', 'Relationship', 'Other'];

  const resetForm = () => {
    setName('');
    setDescription('');
    setFrequency('daily');
    setTargetCount(1);
    setCategory('');
    setTags('');
  };

  const saveHabit = async () => {
    const habitData = {
      name,
      description,
      frequency,
      targetCount,
      category,
      tags: tags.split(',').map(tag => tag.trim()),
    };

    try {
      const response = habit
        ? await axios.put(`http://localhost:5000/api/habits/${habit._id}`, habitData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        : await axios.post('http://localhost:5000/api/habits', habitData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

      refreshHabits();
      resetForm();
    } catch (error) {
      console.error('Error saving habit:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-800 text-center">
        {habit ? 'Edit Habit' : 'Add New Habit'}
      </h2>
      <form>
        <div className="flex flex-wrap -mx-4 mb-6">
          <div className="w-full lg:w-1/2 px-4 mb-6 lg:mb-0">
            <label className="block text-lg font-semibold text-gray-700 mb-3">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              placeholder="Enter habit name"
            />
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <label className="block text-lg font-semibold text-gray-700 mb-3">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              placeholder="Enter habit description"
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-4 mb-6">
          <div className="w-full lg:w-1/3 px-4 mb-6 lg:mb-0">
            <label className="block text-lg font-semibold text-gray-700 mb-3">Frequency</label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="w-full lg:w-1/3 px-4 mb-6 lg:mb-0">
            <label className="block text-lg font-semibold text-gray-700 mb-3">Target Count</label>
            <input
              type="number"
              value={targetCount}
              onChange={(e) => setTargetCount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              placeholder="Enter target count"
            />
          </div>
          <div className="w-full lg:w-1/3 px-4">
            <label className="block text-lg font-semibold text-gray-700 mb-3">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
            >
              <option value="">Select Category</option>
              {presetCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap -mx-4 mb-6">
          <div className="w-full lg:w-2/3 px-4 mb-6 lg:mb-0">
            <label className="block text-lg font-semibold text-gray-700 mb-3">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-300"
              placeholder="Enter tags, separated by commas"
            />
          </div>
          <div className="w-full lg:w-1/3 px-4 flex items-end">
            <button
              type="button"
              onClick={saveHabit}
              className="w-full px-4 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddHabit;
