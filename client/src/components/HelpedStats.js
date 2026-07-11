import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HelpedStats = () => {
  const [helpedUsers, setHelpedUsers] = useState(0);
  const [itemsRecovered, setItemsRecovered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const token = JSON.parse(localStorage.getItem('userInfo'))?.token;
        const API_URL = process.env.REACT_APP_API_URL || '';
        
        // Fetch stats from dedicated stats endpoint
        const { data } = await axios.get(`${API_URL}/api/users/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setItemsRecovered(data.itemsRecovered);
        setHelpedUsers(data.helpedUsers);
      } catch (err) {
        setError('Failed to fetch stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="surface-card max-w-md mx-auto my-12 p-8 rounded-lg shadow-xl text-center">
      <h2 className="page-title mb-6">Till Now Helped</h2>
      {loading ? (
        <div className="text-brand-text-secondary">Loading...</div>
      ) : error ? (
        <div className="error-message mb-4">{error}</div>
      ) : (
        <>
          <div className="mb-6">
            <div className="text-4xl font-bold text-brand-primary mb-2">{itemsRecovered}</div>
            <div className="text-brand-text-secondary text-lg">Items Found / Recovered</div>
          </div>
          <div>
            <div className="text-2xl font-semibold text-brand-secondary mb-2">{helpedUsers}</div>
            <div className="text-brand-text-secondary text-lg">Helped Users</div>
          </div>
        </>
      )}
      <div className="mt-8 flex justify-center">
        <a
          href="/dashboard"
          className="btn btn-primary px-6 py-2 text-lg font-semibold rounded"
        >
          &larr; Back to Dashboard
        </a>
      </div>
    </div>
  );
};

export default HelpedStats;
