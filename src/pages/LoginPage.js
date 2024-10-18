import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = ({ setToken }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-indigo-600">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <LoginForm setToken={setToken} />
      </div>
    </div>
  );
};

export default LoginPage;