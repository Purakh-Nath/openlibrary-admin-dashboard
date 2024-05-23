import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid username or password. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <form onSubmit={handleSubmit} className="w-[75%] bg-slate-300 p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl mb-4">Sign In to access your dashboard</h1>
        {error && <div className="mb-4 text-red-500 font-semibold">{error}</div>}
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
          Sign In
        </button>
        <div className="mt-4 text-center">
          <p className="text-gray-700">
            Don't have an account? <Link to="/signup" className="text-blue-500">Sign-Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
