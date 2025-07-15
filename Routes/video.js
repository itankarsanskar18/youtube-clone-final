const express = require('express');
const router = express.Router();
const videoController = require('../Controllers/video');
const auth = require('../middleware/authentication');

// @route   POST /api/video/video
// @desc    Upload a new video (authenticated)
router.post('/video', auth, videoController.uploadVideo);

// @route   GET /api/video/allVideo
// @desc    Get all uploaded videos
router.get('/allVideo', videoController.getAllVideo);

// @route   GET /api/video/getVideoById/:id
// @desc    Get video by ID
router.get('/getVideoById/:id', videoController.getVideoById);

// @route   GET /api/video/:userId/channel
// @desc    Get all videos uploaded by a specific user
router.get('/:userId/channel', videoController.getAllVideoByUserID);

module.exports = router;
