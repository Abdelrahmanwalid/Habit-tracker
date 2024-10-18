# Habit Tracker

A full-stack habit tracking application built with **React** on the frontend and **Node.js** on the backend. The app allows users to track their habits, visualize progress, and manage their profile.
### Viewing the Client Side

To view the client-side code, switch to the `master` branch in the repository.

## Features

- User Authentication (JWT)
- Track daily, weekly, or monthly habits
- Visualize progress with streaks and analytics
- Profile management (edit nickname and profile picture)
- Responsive UI with Tailwind CSS

## Tech Stack

- **Frontend**: React, Axios, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abdelrahmanwalid/Habit-tracker.git
   cd habit-tracker
2. Install dependencies for both client and server:

```bash
cd habit-tracker-client
npm install
cd ../habit-tracker-server
npm install
```
3.Set up environment variables:

Create a .env file in the server directory and configure the following:
```bash
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```
Run both client and server:
For client:
```bash
cd habit-tracker-client
npm start
```
For server:
```bash
cd habit-tracker-server
npm start
```
Usage
Visit http://localhost:3000 to use the app.
Users can register, log in, and track their habits.

