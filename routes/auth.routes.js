const express = require('express');
const AuthController = require('../controllers/auth.controller');

const router = express.Router();

// router.route('/login')
//   .post(AuthController.login);

router.route('/auth/signup')
.post(AuthController.signup);

router.route('/auth/login')
  .post(AuthController.login);

// router.route('/auth')
//   .put(AuthController.signup)
//   .post(AuthController.signup);

// router.route('/auth/signUpLogin')
//   .post(AuthController.signUpOrLogin);

// router.route('/auth/validate')
//   .get(AuthController.validateKey);

module.exports = router;