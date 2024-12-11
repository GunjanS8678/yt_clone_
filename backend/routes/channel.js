const express = require('express');
const Channel = require('../models/Channel');
const Video = require('../models/Video');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Fetch all channels
router.get('/', async (req, res) => {
  try {
    const channels = await Channel.find().populate('owner', 'username').sort({ channelName: 1 });
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Get the logged-in user's channel
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user })
      .populate('videos')
      .exec();
    if (!channel) return res.status(404).json({ error: 'No channel found' });
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Fetch a single channel by ID
router.get('/:id', async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate('videos');
    if (!channel) return res.status(404).json({ error: 'Channel not found' });
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new channel (Authenticated)
router.post('/', authMiddleware, async (req, res) => {
  const { channelName, description, channelBanner } = req.body;
  try {
    const newChannel = new Channel({
      channelName,
      description,
      channelBanner,
      owner: req.user
    });
    await newChannel.save();
    res.status(201).json({ message: 'Channel created successfully', channel: newChannel });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a channel (Authenticated)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const channel = await Channel.findOneAndUpdate(
      { _id: req.params.id, owner: req.user },
      req.body,
      { new: true }
    );
    if (!channel) return res.status(404).json({ error: 'Channel not found or unauthorized' });
    res.status(200).json({ message: 'Channel updated successfully', channel });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a channel (Authenticated)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const channel = await Channel.findOneAndDelete({ _id: req.params.id, owner: req.user });
    if (!channel) return res.status(404).json({ error: 'Channel not found or unauthorized' });

    // Optionally delete associated videos
    await Video.deleteMany({ _id: { $in: channel.videos } });

    res.status(200).json({ message: 'Channel deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
