
import React, { useState, useEffect } from 'react';
import './video.css';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import{toast,ToastContainer}from  'react-toastify'
const Video = () => {
  const [data, setData] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");

  const { id } = useParams();

  const fetchVideoById = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/getVideoById/${id}`);
      console.log(response.data.video);
      setData(response.data.video);
      setVideoUrl(response?.data?.video?.videoLink);
    } catch (err) {
      console.log(err);
    }
  };

  const getCommentByVideoId = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/commentApi/comment/${id}`);
      console.log(response);
      setComments(response.data.comments);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchVideoById();
    getCommentByVideoId();
  }, []);

  const handleVideoPlay = () => {
    const filterBar = document.getElementById('filterBar');
    if (filterBar) {
      filterBar.style.display = 'none';
    }
  };

  const handleComment = async()=>{
    const body= {
      "message": message,
      "video":id
    }
    await axios.post ('http://localhost:4000/commentApi/comment',body,{withCredentials:true}).then((resp)=>{
      console.log (resp)
      const newComment =  resp.data.comment;
      setComments([newComment,...comments]);
      setMessage("")
    }).catch(err=>{
      toast.error("Please Login First comment")
    })
  }

  return (
    <div className='video'>
      {/* Left Section - Main Video */}
      <div className="videoPostSection">
        <div className="video_youtube">
          {data && (
            <video
              width='400'
              controls
              autoPlay
              className='video_youtube_video'
              onPlay={handleVideoPlay}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type='video/webm' />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        <div className="video_youtubeAbout">
          <div className="video_uTubeTitle">{data?.title}</div>

          <div className='youtube_video_ProfileBlock'>
            <div className="youtube_video_ProfileBlock_left">
              <Link to={`/user/${data?.user?._id}`} className="youtube_video_ProfileBlock_left_img">
                <img
                  src={data?.user?.profilePic}
                  className="youtube_video_ProfileBlock_left_image"
                  alt="Uploader Profile"
                />
              </Link>

              <div className='youtubeVideo_subsView'>
                <div className="youtubePostProfileName">{data?.user?.channelName}</div>
                <div className="youtubePostProfileSubs">{data?.user?.createdAt?.slice(0, 10)}</div>
              </div>

              <div className="subscribeBtnYoutube">Subscribe</div>
            </div>

            <div className="youtube_video_likeBlock">
              <div className="youtube_video_likeBlock_Like">
                <ThumbUpOutlinedIcon />
                <div className="youtube_video_likeBlock_noOfLikes">{data?.like}</div>
              </div>

              <div className="youtubeVideoDivider"></div>

              <div className="youtube_video_likeBlock_Like">
                <ThumbDownAltOutlinedIcon />
              </div>
            </div>
          </div>

          <div className="youtube_video_About">
            <div>{data?.createdAt?.slice(0, 10)}</div>
            <div>{data?.description} this is the cool video</div>
          </div>

          {/* Comments Section */}
          <div className="youtubeCommentSection">
            <div className="youtubeCommentSectionTitle">{comments.length} Comments</div>

            {/* Add Comment */}
            <div className="youtubeSelfComment">
              <img
                className="video_youtubeSelfCommentProfile"
                src='https://th.bing.com/th/id/OIP.8gLtXrl4KYPfPA6QyMnlUwHaEK'
                alt='Your Profile'
              />
              <div className="addAComment">
                <input
                  type='text'
                  value={message}
                  onChange={(e) => { setMessage(e.target.value) }}
                  className='addACommentInput'
                  placeholder='Add a comment'
                />
                <div className="cancelSubmitComment">
                  <div className="cancelComment">Cancel</div>
                  <div className="cancelComment"onClick={handleComment}>Comment</div>
                </div>
              </div>
            </div>

            {/* Render Comments Dynamically */}
            {comments.map((item, index) => (
              <div className="youtubeSelfComment" key={index}>
                <img
                  className="video_youtubeSelfCommentProfile"
                  src={item?.user?.profilePic || data?.user?.profilePic}
                  alt='User Profile'
                />
                <div className="others_commentSection">
                  <div className="others_commentSectionHeader">
                    <div className="channelName_comment">{item?.user?.channelName || "User"}</div>
                    <div className="commentTimingOthers">{item?.createdAt?.slice(0, 10)}</div>
                  </div>
                  <div className="otherCommentSectionComment">
                    {item?.message || "No comment"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section - Video Suggestions */}
      <div className="videoSuggestions">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <div className="videoSuggestionsBlock" key={index}>
            <div className="video_suggetion_thumbnail">
              <img
                src="https://th.bing.com/th/id/OIP.8gLtXrl4KYPfPA6QyMnlUwHaEK"
                className='video_suggetion_thumbnail_img'
                alt="Video Thumbnail"
              />
            </div>
            <div className="video_suggetions_About">
              <div className="video_suggetions_About_title">
                T20 2024 Worldcup Final IND vs SA Last 5 overs #cricket #india
              </div>
              <div className="video_suggetions_About_Profile">Cricket 320</div>
              <div className="video_suggetions_About_Profile">136K views · 1 day ago</div>
            </div>
          </div>
        ))}
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Video;
