import React, { useState, useEffect } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import YouTubeIcon from '@mui/icons-material/YouTube';
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PersonIcon from '@mui/icons-material/Person'; 
import SideNavbar from '../SideNavbar/sideNavbar';
import Login from '../Login/login';
import axios from 'axios'; // ✅ FIXED: Added import

const Navbar = ({ setSideNavbarFunc, sideNavbar }) => {
  const [userPic, setuserPic] = useState("https://th.bing.com/th/id/OIP.Wy2uo_y-ttULYs4chLmqSAAAAA?rs=1&pid=ImgDetMain");
  const [navbarModal, setNavbarModal] = useState(false);
  const [login, setLogin] = useState(false);
  const [isLogedIn, setIsLogedIn] = useState(false);
  const navigate = useNavigate();

  const handleClickModal = () => {
    setNavbarModal(prev => !prev);
  }

  const sideNavbarFunc = () => {
    setSideNavbarFunc(!sideNavbar);
  }

  const handleprofile = () => {
    let userId = localStorage.getItem("userId");
    navigate(`/user/${userId}`);
    setNavbarModal(false);
  }

  const setLoginModal = () => {
    setLogin(false);
    setIsLogedIn(true);
    let userProfilePic = localStorage.getItem("userProfilePic");
    if (userProfilePic) setuserPic(userProfilePic);
  }

  const onclickOfPopUpOption = (button) => {
    setNavbarModal(false);

    if (button === "login") {
      setLogin(true);
    } else {
      localStorage.clear();
      getLogoutFun();
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 1000);
    }
  }

  const getLogoutFun = async () => {
    // ✅ FIXED: Correct URL and option key spelling
    axios.post("http://localhost:4000/auth/logout", {}, { withCredentials: true })
      .then((res) => {
        console.log("Logout");
      })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    let userProfilePic = localStorage.getItem("userProfilePic");
    setIsLogedIn(localStorage.getItem("userId") !== null ? true : false);
    if (userProfilePic !== null) {
      setuserPic(userProfilePic);
    }
  }, []);

  return (
    <div className='navbar'>
      {/* Left Section */}
      <div className="navbar-left">
        <div className="navbarHamberger" onClick={sideNavbarFunc}>
          <MenuIcon sx={{ color: "white" }} />
        </div>
        <Link to={'/'} className="navbar_youtubeImg">
          <YouTubeIcon sx={{ fontSize: "34px" }} className='navbar_youtubeImage' />
          <div className='navbar_utubeTitle'>YouTube</div>
        </Link>
      </div>

      {/* Middle Section */}
      <div className="navbar-middle">
        <div className="navbar_searchBox">
          <input
            type='text'
            placeholder='Search'
            className='navbar_searchBoxInput'
          />
          <div className='navbar_searchIconBox'>
            <SearchIcon sx={{ fontSize: "28px", color: "white" }} />
          </div>
        </div>
        <div className="navbar_mike">
          <KeyboardVoiceIcon sx={{ color: "white" }} />
        </div>
      </div>

      {/* Right Section */}
      <div className="navbar-right">
        <Link to={'/5667/upload'}>
          <VideoCallIcon sx={{ fontSize: "30px", cursor: "pointer", color: "white" }} />
        </Link>

        <NotificationsIcon sx={{ fontSize: "30px", cursor: "pointer", color: "white" }} />
        <img onClick={handleClickModal} src={userPic} className='navbar-right-logo' alt='Logo' />

        {navbarModal && (
          <div className='navbar-modal'>
            {isLogedIn && <div className="navbar-modal-option" onClick={handleprofile}>Profile</div>}
            {isLogedIn && <div className="navbar-modal-option" onClick={() => onclickOfPopUpOption("logout")}>Logout</div>}
            {!isLogedIn && <div className="navbar-modal-option" onClick={() => onclickOfPopUpOption("login")}>Login</div>}
          </div>
        )}
      </div>

      {login && <Login setLoginModal={setLoginModal} />}
    </div>
  );
};

export default Navbar;
