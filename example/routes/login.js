var express = require('express');
var router = express.Router();
var loginRoute = require('../controllers/login');
/* GET home page. */
router.get('/',loginRoute.login);
router.post('/',loginRoute.postLogin);
module.exports = router;
