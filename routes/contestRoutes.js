const express = require('express');

const contestController = require('../controllers/contestController');

const router = express.Router();

router.get('/topUsers/:contestNumber', contestController.topUser);


module.exports = router;