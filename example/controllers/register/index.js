const authModule = require('authenticator-node-module/v1');
const bodyParser = require('body-parser');

exports.registerMiddleware = async (req, res, next) => {
    await res.render('register', {msg: 'thx'});
}

exports.registerAuthMiddleware = async (req, res, next) => {
    try{
        let userName = req.body.username
        let result = await authModule.identityRegisterAuth(userName);
        await res.status(201).render('layout', {
            message: 'success!', 
            id: 'id: '+result.id, 
            username: 'username: '+result.name, 
            secret: 'secret: '+result.secret
        })
    } catch (e) {
        res.status(500).json({
            error: e.toString()
        })
    }
}
