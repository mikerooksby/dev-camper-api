const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  uploadPhoto,
} = require('../controllers/bootcampControllers');

const Bootcamp = require('../models/bootcampModel');

const advancedResults = require('../middleware/advancedResults');
const { protect } = require('../middleware/auth');

// Include other resource routers
const courseRouter = require('./courseRoutes');

const router = express.Router();

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance/:units').get(getBootcampsInRadius);
router.route('/:id/photo').put(protect, uploadPhoto);
router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;
