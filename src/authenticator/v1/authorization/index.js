const V1Base = require('../v1_base');
const Privilege = require('../privileges');
const { md5Generator } = require('../../../helpers');
const Cache = require('../../cache');
const { checkAuthorization } = require('./helpers');

class Authorization extends V1Base {
    constructor() {
        super();
        this.privileges = null;
        this.privilege = new Privilege();
    }

    async authorize({ serviceName, permissionName, resourceType, resourceID, datasetID }) {
        if (!this.token) {
            throw new Error('token is not provided, use setToken');
        }
        const tokenMD5 = md5Generator(this.token);
        const cacheKey = `_privileges_${tokenMD5}`;
        this.privileges = Cache.get(cacheKey);
        if (!this.privileges) {
            this.privileges = await this.privilege.setToken(this.token).getByToken();
            Cache.put(cacheKey, this.privileges, 10);
        }
        return checkAuthorization({
            privilegesList: this.privileges,
            serviceName,
            permissionName,
            resourceType,
            resourceID,
            datasetID
        });
    }
}

module.exports = Authorization;