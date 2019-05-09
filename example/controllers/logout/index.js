const authModule = require('authenticator-node-module/v1');

exports.logoutMiddleWare = async (req, res, next) => {
    try{
        let token = req.cookies.token;
        let result = await authModule.identityLogout(token);
        await res.clearCookie('token');
        await res.status(201).redirect('/')
    } catch (e) {
        res.status(500).json({
            messge: JSON.stringify(e)
        })
    }
}