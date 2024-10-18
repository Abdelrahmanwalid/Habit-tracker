const Habit = require('../models/Habit');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

// Function to set the test date
exports.setTestDate = (req, res) => {
  const { date } = req.body;
  console.log(`Setting test date to: ${date}`);
  process.env.TEST_DATE = date;
  res.status(200).send({ message: 'Test date set' });
};

// Function to get the current date
exports.getCurrentDate = (req, res) => {
  const currentDate = process.env.TEST_DATE || new Date().toISOString();
  res.status(200).send({ currentDate });
};

// Helper function to get the current date value
const getCurrentDateValue = () => {
  return process.env.TEST_DATE ? new Date(process.env.TEST_DATE) : new Date();
};

// Function to create a new habit
exports.createHabit = async (req, res) => {
  const { name, description, frequency, targetCount, category, tags } = req.body;

  // Validate the required properties
  if (!name || !description || !frequency || !targetCount) {
    return res.status(400).json({ message: 'Missing required properties' });
  }

  try {
    const newHabit = new Habit({
      user: req.user.id,
      name,
      description,
      frequency,
      targetCount,
      category, // Add category
      tags      // Add tags
    });
    const habit = await newHabit.save();
    res.status(201).json(habit);
  } catch (error) {
    console.error('Error creating habit:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to calculate the streak
const calculateStreak = (logs, frequency, targetCount, currentDate) => {
  const sortedLogs = logs.sort((a, b) => new Date(a.date) - new Date(b.date));
  let streak = 0;
  let currentStreak = 0;
  let lastDate = null;
  let currentCount = 0;

  console.log('Using current date:', currentDate);
  console.log('Calculating streak with logs:', JSON.stringify(sortedLogs, null, 2));

  for (let log of sortedLogs) {
    const logDate = new Date(log.date);
    let isNewPeriod = false;

    if (!lastDate) {
      currentCount = log.completedCount;
      isNewPeriod = true;
    } else {
      const diffTime = Math.abs(logDate - lastDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      console.log(`diffDays: ${diffDays}, frequency: ${frequency}, currentCount: ${currentCount}`);

      if (frequency === 'daily') {
        if (diffDays >= 1) {
          isNewPeriod = true;
          if (diffDays > 1) {
            currentStreak = -1; // Reset streak if a day is skipped
            console.log('Day skipped, resetting current streak.');
          }
        }
      } else if (frequency === 'weekly') {
        const lastMonday = new Date(lastDate);
        lastMonday.setDate(lastMonday.getDate() - ((lastMonday.getDay() + 6) % 7));
        const logMonday = new Date(logDate);
        logMonday.setDate(logMonday.getDate() - ((logMonday.getDay() + 6) % 7));
        const diffWeeks = Math.floor((logMonday - lastMonday) / (1000 * 60 * 60 * 24 * 7));

        if (diffWeeks >= 1) {
          isNewPeriod = true;
          if (diffWeeks > 1) {
            currentStreak = -1; // Reset streak if two weeks are skipped
            console.log('Two weeks skipped, resetting current streak.');
          }
        }
      } else if (frequency === 'monthly') {
        const diffMonths = (logDate.getFullYear() - lastDate.getFullYear()) * 12 + (logDate.getMonth() - lastDate.getMonth());
        if (diffMonths >= 1) {
          isNewPeriod = true;
          if (diffMonths > 1) {
            currentStreak = -1; // Reset streak if two months are skipped
            console.log('Two months skipped, resetting current streak.');
          }
        }
      }

      // If the period changes and the target is met, increment streak
      if (isNewPeriod) {
        console.log(`Period changed: currentCount = ${currentCount}, targetCount = ${targetCount}`);
        if (currentCount >= targetCount) {
          currentStreak++;
        } else {
          currentStreak = 0;
        }
        currentCount = log.completedCount;
      } else {
        currentCount += log.completedCount;
      }
    }

    console.log(`currentStreak: ${currentStreak}, streak: ${streak}`);
    streak = Math.max(streak, currentStreak);
    lastDate = logDate;
  }

  // Ensure the last period's target is considered
  if (currentCount >= targetCount) {
    streak = currentStreak + 1;
  }
  else if (currentCount < targetCount) {
    streak = currentStreak;
  }

  // Check if the streak should be reset based on the current date
  if (lastDate) {
    const today = new Date(currentDate);
    const diffTime = Math.abs(today - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (frequency === 'daily' && diffDays > 1) {
      streak = 0; // Reset streak if a day is missed
    } else if (frequency === 'weekly') {
      const lastMonday = new Date(lastDate);
      lastMonday.setDate(lastMonday.getDate() - ((lastMonday.getDay() + 6) % 7));
      const todayMonday = new Date(today);
      todayMonday.setDate(todayMonday.getDate() - ((todayMonday.getDay() + 6) % 7));
      const diffWeeks = Math.floor((todayMonday - lastMonday) / (1000 * 60 * 60 * 24 * 7));
      if (diffWeeks > 1) {
        streak = 0; // Reset streak if two weeks are missed
      }
    } else if (frequency === 'monthly') {
      const diffMonths = (today.getFullYear() - lastDate.getFullYear()) * 12 + (today.getMonth() - lastDate.getMonth());
      if (diffMonths > 1) {
        streak = 0; // Reset streak if two months are missed
      }
    }
  }

  console.log('Final streak value:', streak);
  return streak;
};


// Function to get habits
exports.getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id });

    const updatedHabits = await Promise.all(
      habits.map(async (habit) => {
        const streak = calculateStreak(habit.logs, habit.frequency, habit.targetCount, getCurrentDateValue());

        // Only update the habit if the streak has changed
        if (habit.streak !== streak) {
          habit.streak = streak;
          await habit.save();
        }

        return {
          ...habit._doc,
          streak,
        };
      })
    );

    res.json(updatedHabits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to log a habit
exports.logHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const currentDate = getCurrentDateValue().toISOString().split('T')[0];
    let log = habit.logs.find(log => log.date.toISOString().split('T')[0] === currentDate);

    if (!log) {
      log = { date: getCurrentDateValue(), completedCount: 1 }; // Initialize with 1 instead of 0
      habit.logs.push(log);
    } else {
      log.completedCount += 1;
    }

    // Recalculate the streak after updating the logs
    const streak = calculateStreak(habit.logs, habit.frequency, habit.targetCount, getCurrentDateValue());

    // Update the habit's streak
    habit.streak = streak;

    // Save the habit with the updated logs and streak
    await habit.save();

    console.log('Updated Habit with new streak:', JSON.stringify(habit, null, 2));

    res.status(200).json(habit);
  } catch (error) {
    console.error('Error logging habit:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to delete a habit
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);
    if (!habit) {
      console.error('Habit not found');
      return res.status(404).json({ error: 'Habit not found' });
    }
    if (habit.user.toString() !== req.user._id.toString()) {
      console.error('Not authorized to delete this habit');
      return res.status(401).json({ error: 'Not authorized' });
    }
    await Habit.deleteOne({ _id: req.params.habitId });
    console.log('Habit deleted successfully');
    res.status(200).json({ message: 'Habit deleted' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Function to get habit logs
exports.getHabitLogs = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.habitId);
    if (habit.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    res.status(200).json(habit.logs);
  } catch (error) {
    console.error('Error fetching habit logs:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};