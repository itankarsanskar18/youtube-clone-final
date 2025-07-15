import React, { useState } from 'react';
import './signUp.css';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import {toast,ToastContainer} from 'react-toastify'
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const SignUp = () => {
  const [signUpField, setSignUpField] = useState({
    channelName: "",
    userName: "",
    password: "",
    about: "",
    profilePic: ""
  });

   const [progressBar,setProgressBar] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(
    "https://th.bing.com/th/id/OIP.Wy2uo_y-ttULYs4chLmqSAAAAA?rs=1&pid=ImgDetMain"
  );
  const Navigate= useNavigate();



  const uploadImage = async (e) => {
    console.log("Uploading...");
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file); // ✅ Corrected
    data.append('upload_preset', 'youtubeclone'); // ✅ Your Cloudinary preset

    try {
      setProgressBar(true)
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dxxyeevhe/image/upload",
        data
      )
      setProgressBar(false)
      const imageUrl = response.data.url;
      setUploadedImageUrl(imageUrl)
      setSignUpField({
        ...signUpField,"profilePic":imageUrl
      })

      console.log("Uploaded Image:", response.data);
      setUploadedImageUrl(response.data.secure_url); // ✅ Update preview
      setSignUpField(prev => ({ ...prev, profilePic: response.data.secure_url })); // ✅ Set in form state
    } catch (err) {
      console.error("Image Upload Failed:", err.response?.data || err.message);
    }
  };
  const handleSignup = async()=>{
    setProgressBar(true);
     axios.post ('http://localhost:4000/auth/signUp',signUpField).then((res)=>{

      toast.success(res.data.message)
      setProgressBar(false);

      Navigate('/')
     }).catch(err=>{
      toast.error(err)
      setProgressBar(false);
     })
  }

  const handleInputField = (event, name) => {
    setSignUpField({
      ...signUpField,
      [name]: event.target.value
    });
  };
  console.log(signUpField)

  return (
    <div className='signUp'>

      <div className="signup_card">
        <div className="signUp_title">
          <YouTubeIcon sx={{ fontSize: "54px" }} className='login_youtubeImage' />
          SignUp
        </div>

        <div className="signUp_Inputs">
          <input
            type='text'
            className='signUp_Inputs_inp'
            value={signUpField.channelName}
            onChange={(e) => handleInputField(e, "channelName")}
            placeholder='Channel Name'
          />
          <input
            type='text'
            className='signUp_Inputs_inp'
            value={signUpField.userName}
            onChange={(e) => handleInputField(e, "userName")}
            placeholder='User Name'
          />
          <input
            type='password'
            className='signUp_Inputs_inp'
            value={signUpField.password}
            onChange={(e) => handleInputField(e, "password")}
            placeholder='Password'
          />
          <input
            type='text'
            className='signUp_Inputs_inp'
            value={signUpField.about}
            onChange={(e) => handleInputField(e, "about")}
            placeholder='About Your Channel'
          />

          <div className="image_upload_signup">
            <input type='file' onChange={uploadImage} />
            <div className='image_upload_signup_div'>
              <img
                className='image_default_signUp'
                src={uploadedImageUrl}
                alt="Profile Preview"
              />
            </div>
          </div>

          <div className="signUpBtns">
            <div className="signUpBtn" onClick={handleSignup}>SignUp</div>
            <Link to='/' className="signUpBtn">Home Page</Link>
          </div>
          {progressBar &&  <Box sx={{width:'100%'}}>
          <LinearProgress/>
          </Box>}
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default SignUp;
