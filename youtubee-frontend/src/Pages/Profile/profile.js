import React, { useState, useEffect } from 'react';
import './profile.css';
import SideNavbar from '../../Component/SideNavbar/sideNavbar';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ sideNavbar }) => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/${id}/channel`);
      console.log("User fetched:", response.data.video[0]?.user);
       console.log("API response:", response.data); // ADD THIS LINE

      setData(response.data.video);
      setUser(response.data.video[0]?.user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  return (
    <div className='profile'>
      <SideNavbar sideNavbar={sideNavbar} />

      <div className={sideNavbar ? "profile_page" : "profile_page_inactive"}>
        <div className="profile_top_section">
          <div className="profile_top_section_profile">
            <img
              className='profile_top_section_img'
              src={user?.profilePic || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
              alt=""
            />
          </div>

          <div className="profile_top_section_About">
            <div className="profile_top_section_About_Name">{user?.channelName}</div>
            <div className="profile_top_section_info">{user?.userName} · {data.length} videos</div>
            <div className="profile_top_section_info">About: {user?.about || "No description provided"}</div>
          </div>
        </div>

        <div className="profile_videos">
          <div className="profile_videos_title">
            Videos &nbsp; <ArrowRightIcon />
          </div>

          <div className="profileVideos">
            {data.map((item) => (
              <Link to={`/watch/${item._id}`} className="profileVideo_block" key={item._id}>
                <div className="profileVideo_block_thumbnail">
                  <img
                    className="profileVideo_block_thumbnail_img"
                    src={item.thumbnail || "https://cdn-icons-png.flaticon.com/512/1055/1055687.png"}
                    alt=""
                  />
                </div>
                <div className="profile_block_detail">
                  <div className="profileVideo_block_detail_name">{item.title}</div>
                  <div className="profileVideo_block_detail_about">
                    Created at {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;




