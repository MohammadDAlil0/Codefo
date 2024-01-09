const express = require('express');

const userController = require('../controllers/userController');
const authController = require('../controllers/authControlller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

router.route('/')
.get(userController.getAllUsers);

router.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

router.post('/folder', userController.addFolder);
router.patch('/folder/:folderId', userController.editFolder);

router.put('/addFriend/:friendId', userController.addFriend);
router.delete('/deleteFriend/:friendId', userController.deleteFriend);


module.exports = router;