import React, { useState, useEffect } from 'react';
import './videoUpload.css';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const VideoUpload = () => {
  const [inputField, setInputField] = useState({
    title: "",
    description: "",
    videoLink: "",
    thumbnail: "",
    videoType: ""
  });

  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  const handleOnChangeInput = (event, name) => {
    setInputField({
      ...inputField,
      [name]: event.target.value
    });
  };

  const uploadImage = async (e, type) => {
    setLoader(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'youtubeclone');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dxxyeevhe/${type}/upload`,
        data
      );
      const url = response.data.secure_url;
      setLoader(false);
      const key = type === "image" ? "thumbnail" : "videoLink";
      setInputField((prev) => ({
        ...prev,
        [key]: url
      }));
    } catch (err) {
      console.error("Cloudinary Upload Failed:", err.message);
      setLoader(false);
    }
  };

  const handleSubmitFunc = async () => {
    setLoader (true)
    try {
      const token = localStorage.getItem("token");

      const resp = await axios.post(
        'http://localhost:4000/api/video',
        inputField,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      );

      console.log("Video uploaded ✅", resp.data);
      alert("Video uploaded successfully!");
      navigate('/');
    } catch (err) {
      console.error("Upload failed ❌", err);
      alert("Failed to upload video. Make sure you're logged in.");
    }
  };

  useEffect(() => {
    const isLogin = localStorage.getItem("userId");
    if (isLogin === null) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className='videoUpload'>
      <div className="uploadBox">
        <div className="uploadVideoTitle">
          <YouTubeIcon sx={{ fontSize: "54px", color: "red" }} />
          Upload Video
        </div>

        <div className="uploadForm">
          <input
            type='text'
            value={inputField.title}
            onChange={(e) => handleOnChangeInput(e, "title")}
            placeholder='Title of Video'
            className='uploadFormInputs'
          />
          <input
            type='text'
            value={inputField.description}
            onChange={(e) => handleOnChangeInput(e, "description")}
            placeholder='Description'
            className='uploadFormInputs'
          />
          <input
            type='text'
            value={inputField.videoType}
            onChange={(e) => handleOnChangeInput(e, "videoType")}
            placeholder='Category'
            className='uploadFormInputs'
          />

          <div>
            Thumbnail:
            <input type='file' accept="image/*" onChange={(e) => uploadImage(e, "image")} />
          </div>

          <div>
            Video:
            <input type='file' accept="video/*" onChange={(e) => uploadImage(e, "video")} />
          </div>

          {loader && (
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          )}
        </div>

        <div className="uploadBtns">
          <div className="uploadBtn-form" onClick={handleSubmitFunc}>Upload</div>
          <Link to='/' className="uploadBtn-form">Home</Link>
        </div>
      </div>
    </div>
  );
};

export default VideoUpload;
