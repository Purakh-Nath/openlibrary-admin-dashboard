import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(username, password);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-[75%] bg-slate-300 p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl mb-4">Sign Up to access your dashboard</h1>
        <div className="mb-4">
          <label className="block text-gray-700">Username</label>
          <input
          required
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">
          Sign Up
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Already have an account? <Link to="/signin" className="text-blue-500">Login</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
