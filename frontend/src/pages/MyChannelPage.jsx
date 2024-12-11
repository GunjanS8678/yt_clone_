import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import VideoCard from '../components/VideoCard';
import { extractYoutubeVideoId, generateEmbedUrl, generateThumbnailUrl } from '../utils/youtubeUtils';
import '../MyChannelPage.css';

const MyChannelPage = () => {
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [newVideo, setNewVideo] = useState({ 
    title: '', 
    description: '', 
    videoUrl: '', 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyChannel();
  }, []);

  const fetchMyChannel = async () => {
    try {
      const { data } = await API.get('/channels/mine');
      setChannel(data);
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching channel:', error);
      setError('Failed to load channel');
    }
  };

  const handleChange = (e) => {
    setNewVideo({ ...newVideo, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!channel) {
      setError('You must create a channel first.');
      return;
    }

    try {
      const videoId = extractYoutubeVideoId(newVideo.videoUrl);
      
      if (!videoId) {
        setError('Invalid YouTube URL');
        return;
      }

      const videoData = {
        ...newVideo,
        videoUrl: generateEmbedUrl(videoId),
        thumbnailUrl: generateThumbnailUrl(videoId),
        channelId: channel._id
      };

      const { data } = await API.post('/videos', videoData);
      setVideos((prev) => [...prev, data]);
      setNewVideo({ title: '', description: '', videoUrl: '' });
      setError('');
    } catch (err) {
      setError('Failed to upload video');
    }
  };

  return (
    <div className="my-channel-page">
      {channel ? (
        <>
          <div className="channel-header">
            <img src={channel.channelBanner} alt={`${channel.channelName} banner`} />
            <div className="channel-info">
              <h1>{channel.channelName}</h1>
              <p>{channel.description}</p>
              <p className="subscribers">Subscribers: {channel.subscribers}</p>
            </div>
          </div>

          <div className="upload-section">
            <h2>Upload Video</h2>
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label>Video Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter video title"
                  value={newVideo.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter video description"
                  value={newVideo.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>YouTube Video URL</label>
                <input
                  type="text"
                  name="videoUrl"
                  placeholder="Enter YouTube video URL (e.g., https://www.youtube.com/watch?v=...)"
                  value={newVideo.videoUrl}
                  onChange={handleChange}
                  required
                />
              </div>

              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="upload-button">Upload Video</button>
            </form>
          </div>

          <div className="my-videos-section">
            <h2>My Videos</h2>
            {videos.length === 0 ? (
              <p className="no-videos">No videos uploaded yet.</p>
            ) : (
              <div className="video-grid">
                {videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="create-channel-prompt">
          <p>You don't have a channel yet.</p>
          <button onClick={() => navigate('/create-channel')}>Create Channel</button>
        </div>
      )}
    </div>
  );
};

export default MyChannelPage;