const V1Base = require('../v1_base');

class Subject extends V1Base {
    constructor() {
        super();
    }

    async getPrivilegesBySubject({ subject = '', serviceName = '', permissionName = '' }) {
        const params = new URLSearchParams({
            'filter[subject]': subject,
            'filter[permission]': permissionName,
            'filter[service]': serviceName
        });
        return super.fetch('get', `subject/privileges?${params.toString()}`);
    }
}

module.exports = Subject;
