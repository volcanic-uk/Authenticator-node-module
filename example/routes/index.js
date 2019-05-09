const express = require('express');
const router = express.Router();
router.get('/', (req, res, next) => {
    res.status(201).render('home');
});
router.get('/posts', (req, res, next) => {
    res.render('posts');
});
module.exports = router;