const express = require('express');
const UberApiController = require('../controllers/uber-api.controller');

const router = express.Router();

router.route('/uber/cars')
.post(UberApiController.availableCars);

router.route('/uber/login')
.post(UberApiController.uberLogin)


router.route('/auth/uber')
.get(UberApiController.getAuth)

module.exports = router;