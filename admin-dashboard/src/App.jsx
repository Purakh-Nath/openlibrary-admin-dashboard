
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Dashboard from './components/Dashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

const PrivateRoute = ({ element }) => {
  const { auth } = useAuth();
  return auth ? element : <Navigate to="/signin" />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        <Route path="/" element={<SignUp />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
