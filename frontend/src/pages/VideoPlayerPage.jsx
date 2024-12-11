import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaThumbsUp, FaThumbsDown, FaShare, FaUserCircle } from 'react-icons/fa';
import API from '../services/api';
import Header from '../components/Header';
import '../VideoPlayerPage.css';

const VideoPlayerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [userInteraction, setUserInteraction] = useState({
    liked: false,
    disliked: false
  });

  useEffect(() => {
    fetchVideo();
    if (localStorage.getItem('token')) {
      checkUserInteraction();
    }
  }, [id]);

  const getEmbedUrl = (url) => {
    try {
      let videoId = '';
      if (url.includes('youtube.com/watch?v=')) {
        videoId = url.split('v=')[1];
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1];
      }
      videoId = videoId.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error('Error processing YouTube URL:', error);
      return url;
    }
  };

  const checkUserInteraction = async () => {
    try {
      const { data } = await API.get(`/videos/${id}/interaction`);
      setUserInteraction(data);
    } catch (error) {
      console.error('Error checking user interaction:', error);
    }
  };

  const fetchVideo = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data } = await API.get(`/videos/${id}`);
      if (!data) {
        throw new Error('Video not found');
      }
      setVideo(data);
      
      try {
        const commentsResponse = await API.get(`/videos/${id}/comments`);
        setComments(commentsResponse.data || []);
      } catch (commentsError) {
        console.error('Error fetching comments:', commentsError);
        setComments([]);
      }

      try {
        const relatedResponse = await API.get('/videos');
        const filtered = relatedResponse.data
          .filter(v => v._id !== id)
          .slice(0, 8);
        setRelatedVideos(filtered);
      } catch (relatedError) {
        console.error('Error fetching related videos:', relatedError);
        setRelatedVideos([]);
      }

    } catch (error) {
      console.error('Error fetching video:', error);
      setError(error.message || 'Failed to load video');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    try {
      await API.put(`/videos/${id}/like`);
      setVideo(prev => ({
        ...prev,
        likes: userInteraction.liked ? prev.likes - 1 : prev.likes + 1
      }));
      setUserInteraction(prev => ({
        liked: !prev.liked,
        disliked: false
      }));
    } catch (error) {
      console.error('Error liking video:', error);
    }
  };

  const handleDislike = async () => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    try {
      await API.put(`/videos/${id}/dislike`);
      setVideo(prev => ({
        ...prev,
        dislikes: userInteraction.disliked ? prev.dislikes - 1 : prev.dislikes + 1
      }));
      setUserInteraction(prev => ({
        liked: false,
        disliked: !prev.disliked
      }));
    } catch (error) {
      console.error('Error disliking video:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!localStorage.getItem('token')) {
      navigate('/login');
      return;
    }
    try {
      const { data } = await API.post('/comments', {
        videoId: id,
        text: newComment
      });
      setComments(prev => [data, ...prev]);
      setNewComment('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add comment');
    }
  };

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  if (isLoading) {
    return (
      <div className="video-player-page">
        <Header />
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-player-page">
        <Header />
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-player-page">
      <Header />
      <div className="content-container">
        <div className="main-content">
          <div className="video-container">
            <iframe
              src={getEmbedUrl(video.videoUrl)}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="video-info">
            <h1>{video.title}</h1>
            <div className="video-stats">
              <span>{video.views || 0} views</span>
              <span>•</span>
              <span>{new Date(video.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="video-actions">
              <button 
                onClick={handleLike} 
                className={`action-button ${userInteraction.liked ? 'active' : ''}`}
              >
                <FaThumbsUp /> {video.likes || 0}
              </button>
              <button 
                onClick={handleDislike} 
                className={`action-button ${userInteraction.disliked ? 'active' : ''}`}
              >
                <FaThumbsDown /> {video.dislikes || 0}
              </button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Video link copied to clipboard!');
                }} 
                className="action-button"
              >
                <FaShare /> Share
              </button>
            </div>

            <div className="video-description">
              <p>{video.description}</p>
            </div>
          </div>

          <div className="comments-section">
            <h3>{comments.length} Comments</h3>
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <FaUserCircle className="comment-avatar" />
              <div className="comment-input-container">
                <input
                  type="text"
                  placeholder="Add a public comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <div className="comment-buttons">
                  <button type="button" onClick={() => setNewComment('')}>Cancel</button>
                  <button type="submit">Comment</button>
                </div>
              </div>
            </form>

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <FaUserCircle className="comment-avatar" />
                  <div className="comment-content">
                    <div className="comment-header">
                      <strong>{comment.userName}</strong>
                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="related-videos">
          <h3>Related Videos</h3>
          {relatedVideos.map((relatedVideo) => (
            <div 
              key={relatedVideo._id} 
              className="related-video-card"
              onClick={() => handleVideoClick(relatedVideo._id)}
            >
              <img 
                src={relatedVideo.thumbnailUrl} 
                alt={relatedVideo.title} 
              />
              <div className="related-video-info">
                <h4>{relatedVideo.title}</h4>
                <p>{relatedVideo.channelName}</p>
                <p>{relatedVideo.views || 0} views</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayerPage;