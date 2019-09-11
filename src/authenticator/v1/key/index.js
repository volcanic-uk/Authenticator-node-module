const V1Base = require('../v1_base');

class Key extends V1Base {
    constructor() {
        super();
    }

    async getByID(id, expired = false) {
        return super.fetch('get', `key/${id}?expired=${expired}`);
    }
}

module.exports = Key;