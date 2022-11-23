const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');

// Load Env Vars
require('dotenv').config({ path: './config/.env' });

// Load Models
const Bootcamp = require('./models/bootcampModel');
const Course = require('./models/courseModel');
const User = require('./models/userModel');
const Review = require('./models/reviewModel');

// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON Files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/reviews.json`, 'utf-8')
);

// Seed DB
const seedDB = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

// Purge DB
const purgeDB = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  seedDB();
} else if (process.argv[2] === '-d') {
  purgeDB();
}
