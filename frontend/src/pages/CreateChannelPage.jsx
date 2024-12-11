import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

const CreateChannelPage = () => {
  const [formData, setFormData] = useState({ channelName: '', description: '', channelBanner: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/channels', formData);
      alert('Channel created successfully!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create channel');
    }
  };

  return (
    <div className="create-channel-page">
      <h2>Create Channel</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="channelName"
          placeholder="Channel Name"
          value={formData.channelName}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Channel Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="channelBanner"
          placeholder="Channel Banner URL"
          value={formData.channelBanner}
          onChange={handleChange}
        />
        {error && <p className="error">{error}</p>}
        <button type="submit">Create Channel</button>
      </form>
    </div>
  );
};

export default CreateChannelPage;
