const express = require('express');
const userController = require('./../controller/userController');
const authController = require('./../controller/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

//Protect all routes after this middleware
router.use(authController.protect);
 
router.get('/me',userController.getMe,userController.getUser)//update route name

//Restrict all routes after this middleware to admin
router.use(authController.restrictTo('admin'))

router
  .route('/')
  .get(userController.getAllUsers)

router
  .route('/:id')
  .get(userController.getUser)

module.exports = router;
