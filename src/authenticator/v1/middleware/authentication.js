const Token = require('../token');
const HTTP_STATUS_CODES = require('http-status-codes');
module.exports = async (req, res, next) => {

    let authorizationHeader = req.headers.authorization || null;
    if (!authorizationHeader) {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ 'message': 'UNAUTHORIZED' });
        return;
    }
    let tokenValue = authorizationHeader.substr(7, authorizationHeader.length - 1);
    let token = new Token().setToken(tokenValue);
    let validateToken = await token.remoteValidation();
    if (validateToken) {
        req.custom = {
            tokenData: { ...token.decoded },
            parsedSubject: token.parseSubject()
        };
        next();
    } else {
        res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({ 'message': 'UNAUTHORIZED' });
    }
};
