const express = require('express');
const Comment = require('../models/Comment');
const Video = require('../models/Video');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Add a new comment
router.post('/', authMiddleware, async (req, res) => {
  const { videoId, text } = req.body;
  try {
    const comment = new Comment({
      videoId,
      userId: req.user,
      text,
    });
    await comment.save();

    // Add comment to video
    const video = await Video.findById(videoId);
    video.comments.push(comment._id);
    await video.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get comments for a video
router.get('/:videoId', async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId }).populate('userId', 'username');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
