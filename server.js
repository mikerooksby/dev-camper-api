const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
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
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(fileUpload());
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(xss());
app.use(hpp());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount Routers
app.use('/api/v1/bootcamps', bootcampRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/reviews', reviewRoutes);

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
