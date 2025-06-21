const express = require('express');
const mongoose = require('mongoose');
const app = express();
const studentRoutes = require('./api/routes/student'); 
const userRoutes = require('./api/routes/user'); 
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');

// ✅ MongoDB connection
mongoose.connect(
  'mongodb+srv://RaviMangal:RaviMangal@cluster0.irzsuib.mongodb.net/testdb?retryWrites=true&w=majority&appName=Cluster0',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);      
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected successfully');
});

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp' // No trailing slash is fine
}));

// ✅ Routes
app.use("/student", studentRoutes);
app.use("/user", userRoutes);

// ✅ Fallback route
app.use((req, res, next) => {
  res.status(404).json({ error: 'URL NOT FOUND' });
});

module.exports = app;
