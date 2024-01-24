const express = require('express');

const problemController = require('../controllers/problemController');
const authController = require('../controllers/authControlller');

const router = express.Router();

router.get('/getUserProblems/:userId', problemController.getUserProblems)

router.route('/me/')
.post(authController.protect, problemController.editProblemInput, problemController.createProblem)
.get(authController.protect, problemController.getMyProblems);

router.route('/:id')
.patch(authController.protect, problemController.editProblemUpdate, problemController.updateProblem)
.delete(authController.protect, problemController.deleteProblem);
//.get(problemController.getProblem)


module.exports = router;