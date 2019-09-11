const V1Base = require('../v1_base');

class Token extends V1Base {
    constructor() {
        super();
    }

    async remoteValidation(token) {
        return this.fetch('post', 'token/validate', { Authorization: `Bearer ${token}` });
    }
}

module.exports = Token;