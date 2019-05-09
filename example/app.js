// third party packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authMiddleware = require('./middlewares');
const path = require('path');

// utilities
app.use(cookieParser());
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('view engine', 'pug');


// local variables
const homePage = require('./routes/index');
const loginPage = require('./routes/login');
const registerPage = require('./routes/register');
const logoutPage = require('./routes/logout');
app.use(authMiddleware.authChecker);

// local views
app.use('/', homePage);
app.use('/login', loginPage);
app.use('/register', registerPage);
app.use('/logout', logoutPage)

app.use(express.static(path.join(__dirname, 'public')))

// error handling
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);

});
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.render('error', {message: 'the page you requested doesn\'t seem to exist', status: 404, })
})
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;