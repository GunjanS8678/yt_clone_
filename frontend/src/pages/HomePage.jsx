
import React, { useEffect, useState } from 'react';
import API from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import VideoCard from '../components/VideoCard';
import '../HomePage.css';

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/videos');
      setVideos(data);
      setFilteredVideos(data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredVideos(videos);
      return;
    }

    const searchQuery = query.toLowerCase();
    const results = videos.filter((video) => {
      const titleMatch = video.title?.toLowerCase().includes(searchQuery);
      const channelMatch = video.channelName?.toLowerCase().includes(searchQuery);
      const descriptionMatch = video.description?.toLowerCase().includes(searchQuery);
      return titleMatch || channelMatch || descriptionMatch;
    });
    
    setFilteredVideos(results);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setFilteredVideos(videos);
    } else {
      const filtered = videos.filter(video => video.category === category);
      setFilteredVideos(filtered);
    }
  };

  if (loading) {
    return (
      <div className="home-page">
        <Header onSearch={handleSearch} />
        <div className="content">
          <Sidebar onSelectCategory={handleCategorySelect} />
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading videos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
     <div className="home-page">
       <Header onSearch={handleSearch} />
       <div className="content">
         <Sidebar onSelectCategory={handleCategorySelect} />
         <main className="main-content">
           <h2 className="category-title">{selectedCategory}</h2>
           {error ? (
             <div className="error-message">{error}</div>
           ) : (
             <div className="video-grid">
               {filteredVideos.length > 0 ? (
                 filteredVideos.map((video) => (
                   <VideoCard key={video._id} video={video} />
                 ))
               ) : (
                 <div className="no-results">
                   <p>No videos found</p>
                 </div>
               )}
             </div>
           )}
         </main>
       </div>
     </div>
   );
 };
 
 export default HomePage;