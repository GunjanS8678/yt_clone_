const express = require('express');
const Video = require('../models/Video');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch all videos
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('channelId', 'channelName').sort({ uploadDate: -1 });
    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate('channelId', 'channelName');
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload a new video (Authenticated)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, thumbnailUrl, videoUrl, channelId } = req.body;
  try {
    const video = new Video({ title, description, thumbnailUrl, videoUrl, channelId });
    await video.save();
    res.status(201).json({ message: 'Video uploaded successfully', video });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update video details (Authenticated)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.status(200).json({ message: 'Video updated successfully', video });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a video (Authenticated)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video not found' });
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
