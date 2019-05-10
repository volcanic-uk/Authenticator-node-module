require('dotenv').config(); // environement config file 

exports.domainName = process.env.AUTH_DOMAIN;
exports.moduleTokenDuration = process.env.MODULE_TOKEN_DURATION;
exports.thirdPartyTokenDuration = process.env.THIRD_PARTY_TOKEN_DURATION;
exports.authIdentity = process.env.IDENTITY;
exports.authSecret = process.env.SECRET;
