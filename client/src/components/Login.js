import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setUser }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const API_URL = process.env.REACT_APP_API_URL || '';
      const { data } = await axios.post(`${API_URL}/api/users/login`, {
        rollNumber,
        password
      });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Invalid credentials'
      );
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
      <div className="surface-card w-full max-w-md">
        <h2 className="page-title text-center">Login</h2>
        <div className="text-center mb-4">
          <a href="/register" className="text-brand-primary hover:underline text-sm">New user? Register here</a>
        </div>
        {error && (
          <div className="error-message-box">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="rollNumber" className="form-label">Roll Number</label>
            <input
              type="text"
              id="rollNumber"
              className="w-full" // Styles for bg, border, text color come from App.css
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter your roll number"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="w-full" // Styles for bg, border, text color come from App.css
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <p className="text-sm text-brand-text-secondary mt-2">
              Default password is your roll number in uppercase.
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
