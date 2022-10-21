const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const colors = require('colors');
require('dotenv').config({ path: './config/.env' });

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());
app.use(cors());
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} mode at http://${HOST}:${PORT}`
      .brightWhite.bold.underline
  );
});
