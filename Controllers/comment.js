// Controllers/comment.js
const Comment = require('../Modals/comment');

exports.addComment = async (req, res) => {
  try {
    let { video, message } = req.body;

    if (!video || !message) {
      return res.status(400).json({ error: "Video and message are required." });
    }

    const comment = new Comment({
      user: req.user._id,
      video,
      message
    });

    await comment.save();

    res.status(201).json({
      message: "Comment added successfully",
      comment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCommentByVideoId = async (req, res) => {
  try {
    let { videoId } = req.params;

    const comments = await Comment.find({ video: videoId }).populate('user', 'channelName userName profilePic createdAt');

    res.status(200).json({
      success: true,
      comments
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
