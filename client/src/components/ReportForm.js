import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ReportForm = ({ user }) => {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('lost'); // 'lost' or 'found'
  const [contactPreference, setContactPreference] = useState(false); // Only for 'found'
  
  const navigate = useNavigate();
  
  // Handle image preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5 MB limit
      setError('Image size must be less than 5 MB');
      return;
    }
    
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
    setError(''); // Clear error on new file selection
  };
  
  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!photo) {
      setError('Please upload an image');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      const formData = new FormData();
      formData.append('itemName', itemName);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('photo', photo);
      formData.append('contactInfo', JSON.stringify({ email, phone }));
      formData.append('reportedBy', user.rollNumber);
      formData.append('category', category);
      if (category === 'found') {
        formData.append('contactPreference', contactPreference ? 'true' : 'false');
      }
      const API_URL = process.env.REACT_APP_API_URL || '';
      await axios.post(`${API_URL}/api/items`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      });
      navigate('/items');
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to submit report'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card p-6 sm:p-8 max-w-2xl mx-auto my-8 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-brand-border">
        <h2 className="page-title">Report Lost/Found Item</h2>
        <Link to="/dashboard" className="link-style">
          Back to Dashboard
        </Link>
      </div>
      
      {error && (
        <div className="error-message mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category selection */}
        <div>
          <label className="form-label">Category*</label>
          <div className="flex gap-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="category"
                value="lost"
                checked={category === 'lost'}
                onChange={() => setCategory('lost')}
                className="form-radio mr-2"
              />
              I Lost This
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="category"
                value="found"
                checked={category === 'found'}
                onChange={() => setCategory('found')}
                className="form-radio mr-2"
              />
              I Found This
            </label>
          </div>
        </div>
        <div>
          <label htmlFor="itemName" className="form-label">Item Name*</label>
          <input
            type="text"
            id="itemName"
            className="form-input"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            placeholder="e.g., Black Wallet"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="form-label">Description*</label>
          <textarea
            id="description"
            rows="4"
            className="form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Detailed description of the item"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="location" className="form-label">Location Found/Lost*</label>
          <input
            type="text"
            id="location"
            className="form-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="e.g., Library, Block 1 Canteen"
          />
        </div>
        
        <div>
          <label htmlFor="photo" className="form-label">Photo*</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            className="form-input file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-brand-primary file:text-brand-button-text hover:file:bg-brand-primary-dark"
            onChange={handlePhotoChange}
            required
          />
          {preview && (
            <div className="mt-4 border border-brand-border p-2 rounded-md inline-block">
              <img src={preview} alt="Preview" className="max-w-xs h-auto rounded" />
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="form-label">Contact Email (Optional)</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="form-label">Contact Phone (Optional)</label>
            <input
              type="tel"
              id="phone"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g., 9876543210"
            />
          </div>
        </div>
        
        {/* Contact preference for found items */}
        {category === 'found' && (
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox mr-2"
                checked={contactPreference}
                onChange={e => setContactPreference(e.target.checked)}
              />
              Allow your contact info to be shown if someone claims this item
            </label>
          </div>
        )}
        <div className="flex justify-center pt-4">
          <button
            type="submit"
            className="btn btn-primary w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : null}
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
