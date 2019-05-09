const express = require('express');
const router = express.Router();

const logoutMiddleWare = require('../controllers/logout').logoutMiddleWare;

router.get('/', logoutMiddleWare);

module.exports = router;