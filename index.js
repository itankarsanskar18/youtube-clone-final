const express = require("express");
const cookieParser = require('cookie-parser'); 
const app = express();
const port = 4000;
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:3000', //Your React app's URl
  credentials:true
}))
app.use(express.json());
app.use(cookieParser()); 

require('./Connection/conn');

const AuthRoutes = require('./Routes/user');
const VideoRoutes = require('./Routes/video');
const CommentRoutes = require('./Routes/comment');

app.use('/auth', AuthRoutes);
app.use('/api', VideoRoutes);
app.use('/commentApi', CommentRoutes);

app.listen(port, () => {
  console.log("Backend running on port 4000");
});
