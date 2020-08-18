const { Token } = require('@volcanic-uk/auth-module/v1');
const HTTP_STATUS_CODES = require('http-status-codes');

module.exports = async (req, res, next) => {

    let authorizationHeader = req.headers.authorization || null;
    if (!authorizationHeader) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ 'message': 'UNAUTHORIZED' });
        return;
    }
    let tokenValue = authorizationHeader.substr(7, authorizationHeader.length - 1);
    let validateToken = await new Token().setToken(tokenValue).remoteValidation();
    if (validateToken) {
        next();
    } else {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ 'message': 'UNAUTHORIZED' });
    }
};
