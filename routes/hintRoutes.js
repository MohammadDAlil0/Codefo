const express = require('express');

const hintController = require('../controllers/hintController');
const authController = require('../controllers/authControlller');

const router = express.Router();

router.route('/me')
.post(authController.protect, hintController.createHint)    
.get(authController.protect, hintController.getMyHints);

router.route('/me/:id')
.patch(authController.protect, hintController.updateHint)
.delete(authController.protect, hintController.deleteHint);

// router.get('/getAvailableHints/:problemId', authController.protect, hintController.getAvailableHints);
router.put('/buyHint/:hintId', authController.protect, hintController.buyHint);

module.exports = router;