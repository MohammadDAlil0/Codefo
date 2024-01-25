const express = require('express');

const hintController = require('../controllers/hintController');
const authController = require('../controllers/authControlller');

const router = express.Router();

router.route('/')
.post(authController.protect, hintController.createHint)
.get(authController.protect, hintController.getHintsProblem);

module.exports = router;