const Authenticator = require('authenticator-node-module/v1');
exports.authChecker = async function (req, res, next) {
    try {

        if(req.path==='/posts'){
            let validate = await Authenticator.identityValidation(req.cookies.token);
            if (validate.jwt_id) {
                next();
            }
        }
        else{
            return next();
        }

    } catch (e) {
        res.status(403).render('error',{message:'Unauthorized please log in'});
    }


};