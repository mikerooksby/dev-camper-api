const express = require('express');
const {
  register,
  login,
  getMe,
  forgotPassword,
} = require('../controllers/authControllers');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/me', protect, getMe);
router.post('/register', register);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);

module.exports = router;
