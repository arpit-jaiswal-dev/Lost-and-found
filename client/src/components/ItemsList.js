import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ItemsList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('open');
  const [sortBy, setSortBy] = useState('latest');
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchItems = async () => {
      if (!userInfo || !userInfo.token) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const API_URL = process.env.REACT_APP_API_URL || '';
        let url = `${API_URL}/api/items?`;
        if (categoryFilter !== 'all') url += `category=${categoryFilter}&`;
        if (statusFilter !== 'all') url += `status=${statusFilter}&`;
        if (sortBy === 'latest') url += 'sortBy=createdAt&order=desc';
        else if (sortBy === 'oldest') url += 'sortBy=createdAt&order=asc';

        const { data } = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        });
        setItems(data);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to fetch items'
        );
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [userInfo, categoryFilter, statusFilter, sortBy]);
  
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 mb-6 md:mb-0">
          <div className="surface-card p-4 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold mb-4">Filter Items</h3>
            <div className="mb-4">
              <label className="form-label block mb-1">Category</label>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="form-input w-full">
                <option value="all">All</option>
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label block mb-1">Status</label>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="form-input w-full">
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="returned">Returned</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="form-label block mb-1">Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="form-input w-full">
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
            <Link to="/dashboard" className="link-style block mt-4">&larr; Back to Dashboard</Link>
          </div>
        </aside>
        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-brand-border gap-4">
            <h2 className="page-title mb-4 sm:mb-0">Reported Items</h2>
          </div>
          {error && (
            <div className="error-message mb-4">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center py-10 text-brand-text-secondary">Loading items...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-10 text-brand-text-secondary">No items reported yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map((item) => (
                <Link 
                  to={`/items/${item._id}`} 
                  key={item._id}
                  className="surface-card rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 flex flex-col"
                >
                  <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden">
                    <img 
                      src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`} 
                      alt={item.itemName}
                      className="object-cover w-full h-48 duration-300 ease-in-out group-hover:scale-105" 
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.category === 'found' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>{item.category === 'found' ? 'Found' : 'Lost'}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.status === 'returned' ? 'bg-gray-500 text-white' : 'bg-yellow-500 text-black'}`}>{item.status === 'returned' ? 'Returned' : 'Open'}</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-brand-text-primary truncate" title={item.itemName}>{item.itemName}</h3>
                    <p className="text-sm text-brand-text-secondary mb-1">
                      <span className="font-medium">Location:</span> {item.location}
                    </p>
                    <p className="text-xs text-brand-text-tertiary mt-auto">
                      Reported by: {item.reportedBy} on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ItemsList;
