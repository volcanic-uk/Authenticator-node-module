var Authenticator = require('authenticator-node-module/v1');
exports.login = async function (req, res, next) {
    res.render('login');
};

exports.postLogin = async function (req, res, next) {
    try {
        let name = req.body.name;
        let secret = req.body.secret;
        let response = await Authenticator.identityLogin(name, secret);
        req.headers.authorization = response.token;
        let validate = await Authenticator.identityValidation(response.token);
        if (validate.jwt_id) {
            res.cookie("token", response.token, {maxAge: validate.expiration_time}, {httpOnly: true, secure: true});
            res.redirect('/posts');
        } else {
            res.render('error', {message: "Invalid token"});
        }
    } catch (e) {
        res.render('error', {message: e});
    }

};

