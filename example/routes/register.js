const express = require('express');
const router = express.Router();

const registerMiddleware = require('../controllers/register').registerMiddleware;
const registerAuthMiddleware = require('../controllers/register').registerAuthMiddleware;

router.get('/', registerMiddleware);
router.post('/auth', registerAuthMiddleware);

module.exports = router;