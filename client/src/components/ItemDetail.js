import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ItemDetail = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  // Helper: is current user the reporter?
  const isReporter = item && userInfo && item.reportedBy === userInfo.rollNumber;

  // Mark as returned handler
  const handleMarkReturned = async () => {
    if (!item || !userInfo) return;
    setStatusLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || '';
      await axios.put(`${API_URL}/api/items/${item._id}/status`, { status: 'returned' }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setItem({ ...item, status: 'returned' });
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setStatusLoading(false);
    }
  };
  
  // (removed duplicate userInfo declaration)
  
  useEffect(() => {
    const fetchItemDetails = async () => {
      if (!userInfo || !userInfo.token) {
        setError('User not authenticated. Please log in.');
        setLoading(false);
        return;
      }
      try {
        const API_URL = process.env.REACT_APP_API_URL || '';
        const { data } = await axios.get(`${API_URL}/api/items/${id}`, {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        });
        setItem(data);
      } catch (error) {
        setError(
          error.response && error.response.data.message
            ? error.response.data.message
            : 'Failed to fetch item details'
        );
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchItemDetails();
    }
  }, [id, userInfo]);
  
  if (loading) return <div className="text-center py-10 text-brand-text-secondary">Loading item details...</div>;
  
  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="error-message mb-4">
          {error}
        </div>
        <Link to="/items" className="link-style">
          &larr; Back to Items List
        </Link>
      </div>
    );
  }
  
  if (!item) return <div className="text-center py-10 text-brand-text-secondary">Item not found.</div>;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="surface-card p-6 sm:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-4 border-b border-brand-border">
          <div>
            <h2 className="page-title mb-2 sm:mb-0">{item.itemName}</h2>
            <div className="flex gap-2 mt-2">
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.category === 'found' ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'}`}>{item.category === 'found' ? 'Found' : 'Lost'}</span>
              <span className={`px-2 py-0.5 rounded text-xs font-semibold ${item.status === 'returned' ? 'bg-gray-500 text-white' : 'bg-yellow-500 text-black'}`}>{item.status === 'returned' ? 'Returned' : 'Open'}</span>
            </div>
          </div>
          <Link to="/items" className="link-style self-start sm:self-center">
            &larr; Back to Items List
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          <div className="w-full">
            <div 
              className="relative group cursor-pointer border border-brand-border rounded-lg overflow-hidden shadow-md"
              onClick={() => setImageModalOpen(true)}
            >
              <img 
                src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`} 
                alt={item.itemName}
                className="w-full h-auto object-cover aspect-[4/3] transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-opacity duration-300">
                <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">Click to enlarge</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-5 text-brand-text-primary">
            {/* Mark as returned button for reporter */}
            {isReporter && item.status === 'open' && (
              <button
                className="btn btn-primary mb-2"
                onClick={handleMarkReturned}
                disabled={statusLoading}
              >
                {statusLoading ? 'Updating...' : (item.category === 'found' ? 'Mark as Returned to Owner' : 'Mark as Recovered')}
              </button>
            )}
            <div>
              <h3 className="text-lg font-semibold text-brand-primary mb-1">Description</h3>
              <p className="text-brand-text-secondary whitespace-pre-wrap">{item.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-brand-primary mb-1">Location</h3>
              <p className="text-brand-text-secondary">{item.location}</p>
            </div>
            
            {/* Contact logic */}
            {item.category === 'found' && item.status === 'open' && !isReporter && item.contactPreference && (
              <div>
                <button
                  className="btn btn-primary mb-2"
                  onClick={() => setShowContact(true)}
                  disabled={showContact}
                >
                  {showContact ? 'Contact Info Shown Below' : 'Claim This Item'}
                </button>
                {showContact && (
                  <div className="mt-2">
                    <h3 className="text-lg font-semibold text-brand-primary mb-1">Contact Information</h3>
                    {item.contactInfo?.email && (
                      <p className="text-brand-text-secondary"><span className="font-medium">Email:</span> {item.contactInfo.email}</p>
                    )}
                    {item.contactInfo?.phone && (
                      <p className="text-brand-text-secondary"><span className="font-medium">Phone:</span> {item.contactInfo.phone}</p>
                    )}
                  </div>
                )}
                {!showContact && (
                  <p className="text-xs text-brand-text-secondary mt-1">The reporter allowed their contact info to be shared. Click above to view.</p>
                )}
              </div>
            )}
            {/* For found items, if not allowed, show info */}
            {item.category === 'found' && item.status === 'open' && !isReporter && !item.contactPreference && (
              <div className="text-sm text-brand-text-secondary">The reporter did not allow their contact info to be shared. Please contact the admin or wait for further instructions.</div>
            )}
            {/* For lost items, show contact info to all if open */}
            {item.category === 'lost' && item.status === 'open' && (
              <div>
                <h3 className="text-lg font-semibold text-brand-primary mb-1">Contact Information</h3>
                {item.contactInfo?.email && (
                  <p className="text-brand-text-secondary"><span className="font-medium">Email:</span> {item.contactInfo.email}</p>
                )}
                {item.contactInfo?.phone && (
                  <p className="text-brand-text-secondary"><span className="font-medium">Phone:</span> {item.contactInfo.phone}</p>
                )}
                {!isReporter && (
                  <p className="text-xs text-brand-text-secondary mt-1">If you have found this item, please use the contact info above to reach out to the owner.</p>
                )}
              </div>
            )}
            {/* If returned, show contact info only to reporter */}
            {item.status === 'returned' && isReporter && (
              <div>
                <h3 className="text-lg font-semibold text-brand-primary mb-1">Contact Information</h3>
                {item.contactInfo?.email && (
                  <p className="text-brand-text-secondary"><span className="font-medium">Email:</span> {item.contactInfo.email}</p>
                )}
                {item.contactInfo?.phone && (
                  <p className="text-brand-text-secondary"><span className="font-medium">Phone:</span> {item.contactInfo.phone}</p>
                )}
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-semibold text-brand-primary mb-1">Report Details</h3>
              <p className="text-brand-text-secondary">
                <span className="font-medium">Reported by:</span> {item.reportedBy}
              </p>
              <p className="text-brand-text-secondary">
                <span className="font-medium">Date Reported:</span> {new Date(item.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}, {new Date(item.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Modal */}
      {imageModalOpen && (
        <div 
          className="fixed inset-0 bg-brand-background bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setImageModalOpen(false)}
        >
          <div 
            className="bg-brand-surface p-2 rounded-lg shadow-2xl max-w-3xl max-h-[90vh] w-full relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking on image/container
          >
            <button 
              onClick={() => setImageModalOpen(false)} 
              className="absolute -top-3 -right-3 bg-brand-primary text-brand-button-text rounded-full p-1.5 shadow-lg hover:bg-brand-primary-dark transition-colors z-10"
              aria-label="Close image viewer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <img 
              src={item.photo.startsWith('http') ? item.photo : `${process.env.REACT_APP_API_URL || ''}${item.photo}`} 
              alt={`${item.itemName} - enlarged`} 
              className="w-full h-auto object-contain max-h-[calc(90vh-2rem)] rounded-md"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;
