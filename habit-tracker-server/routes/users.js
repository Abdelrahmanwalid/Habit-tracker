const express = require('express');
const { getUserProfile, updateUserProfile, loginUser, registerUser } = require('../controllers/userController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Initial destination, files will be moved later
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getUserProfile);
router.put('/profile', auth, upload.single('profilePicture'), updateUserProfile);

module.exports = router;