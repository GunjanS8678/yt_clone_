import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import '../VideoCard.css';

const VideoCard = ({ video }) => {
  return (
    <div className="video-card">
      <Link to={`/video/${video._id}`} className="video-link">
        <div className="thumbnail-container">
          <img 
            src={video.thumbnailUrl || 'default-thumbnail.jpg'} 
            alt={video.title || 'Video thumbnail'} 
          />
          {/* Optional: Add video duration */}
        </div>
        <div className="video-info">
          <div className="channel-avatar">
            {video.channelAvatar ? (
              <img src={video.channelAvatar} alt={video.channelName || 'Channel'} />
            ) : (
              <FaUser />
            )}
          </div>
          <div className="video-details">
            <h3 className="video-title">{video.title || 'Untitled Video'}</h3>
            <p className="channel-name">{video.channelName || 'Unknown Channel'}</p>
            <div className="video-stats">
              <span>{video.views || 0} views</span>
              <span>•</span>
              <span>{video.uploadDate || 'Recently'}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default VideoCard;