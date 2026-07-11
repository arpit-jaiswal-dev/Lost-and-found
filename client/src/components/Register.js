import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setUser }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      setLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || '';
      const { data } = await axios.post(`${API_URL}/api/users/register`, {
        rollNumber
      });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setSuccess(true);
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Registration failed'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
      <div className="surface-card w-full max-w-md">
        <h2 className="page-title text-center">Register</h2>
        {error && <div className="error-message-box">{error}</div>}
        {success && (
          <div className="text-green-500 text-center mb-4">Registration successful! Redirecting...</div>
        )}
        <form onSubmit={handleRegister}>
          <div className="mb-6">
            <label htmlFor="rollNumber" className="form-label">Roll Number</label>
            <input
              type="text"
              id="rollNumber"
              className="w-full"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              placeholder="Enter your roll number"
              required
            />
            <p className="text-sm text-brand-text-secondary mt-2">
              Default password will be your roll number in uppercase.
            </p>
          </div>
          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
