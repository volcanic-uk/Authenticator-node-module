const V1Base = require('../v1_base');

class Subject extends V1Base {
    constructor() {
        super();
    }

    async getPrivilegesBySubject({ subject = '', serviceName = '', permissionName = '' }) {
        return super.fetch('get', `subject/privileges?filter[subject]=${subject}&filter[permission]=${permissionName}&filter[service]=${serviceName}`);
    }
}

module.exports = Subject;