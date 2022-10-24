const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
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

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Mount Routers
app.use('/api/v1/bootcamps', bootcampRoutes);

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
