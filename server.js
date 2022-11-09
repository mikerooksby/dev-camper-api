const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const colors = require('colors');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

// Load Env Vars
require('dotenv').config({ path: './config/.env' });
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8000;

// Connect to Database
connectDB();

// Route Files
const bootcampRoutes = require('./routes/bootcampRoutes');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(fileUpload());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/bootcamps', bootcampRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode at http://${HOST}:${PORT}`
      .brightWhite.bold.underline
  );
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red.underline.bold);
  server.close(() => {
    process.exit(1);
  });
});
