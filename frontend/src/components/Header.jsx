import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { FaYoutube, FaSearch, FaUserCircle } from 'react-icons/fa';
import '../Header.css';

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [hasChannel, setHasChannel] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (username) {
      checkChannel();
    }
  }, [username]);

  const checkChannel = async () => {
    try {
      const { data } = await API.get('/channels/mine');
      setHasChannel(!!data);
    } catch (error) {
      setHasChannel(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <header className="header">
      <div className="header-left">
        <FaYoutube className="youtube-icon" onClick={() => navigate('/')} />
        <h1 className="logo" onClick={() => navigate('/')}>YouTube Clone</h1>
      </div>
      
      <div className="header-center">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search videos..."
            onChange={(e) => onSearch(e.target.value)}
          />
          <button className="search-button">
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="header-right">
        {username ? (
          <div className="profile-section">
            <FaUserCircle 
              className="profile-icon" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            />
            {showProfileMenu && (
              <div className="profile-menu">
                <span className="username">{username}</span>
                {hasChannel ? (
                  <button onClick={() => navigate('/my-channel')}>My Channel</button>
                ) : (
                  <button onClick={() => navigate('/create-channel')}>Create Channel</button>
                )}
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className="signin-button" onClick={() => navigate('/login')}>
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;