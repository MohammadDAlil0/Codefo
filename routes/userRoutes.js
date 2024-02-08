const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authControlller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.get('/', userController.getAllUsers);
router.get('/codeforces/:handle', userController.getUser)

router.use(authController.protect);

router.route('/me')
.get(userController.idToParams, userController.getMe)
.patch(userController.idToParams, userController.validateUpdateUserInput, userController.updateUser)
.delete(userController.idToParams, userController.deleteUser);

router.post('/folder', userController.addFolder);
router.patch('/folder', userController.editFolder);

router.put('/addFriend/:friendId', userController.addFriend);
router.delete('/deleteFriend/:friendId', userController.deleteFriend);


module.exports = router;