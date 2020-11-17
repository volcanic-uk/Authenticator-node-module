class VRN {
    constructor(vrn) {
        this.vrn = vrn;
    }

    /**
     * parse VRN
     * @returns {{
     *     stackId: string
     *     dataset: string
     *     resourceType: string
     *     resourceID: string
     *     params: URLSearchParams
     * }}
     */
    parse() {
        if (!this.vrn.match(/vrn:.+:.+:.+\/.+/)) {
            throw new Error('VRN is not valid');
        }
        let parsedVRN = {};
        // eslint-disable-next-line no-unused-vars
        const [vrn, stack, dataset, resource] = this.vrn.split(':');
        parsedVRN.stackId = stack;
        parsedVRN.dataset = dataset;
        const [resourceType, resourceID] = resource.split('/');
        parsedVRN.resourceType = resourceType;
        if (resourceID.indexOf('?') >= 0) {
            //vrn has qualifiers
            const [_resourceID, qualifiers] = resourceID.split('?');
            parsedVRN.params = new URLSearchParams(qualifiers);
            parsedVRN.resourceID = _resourceID;
        } else {
            parsedVRN.resourceID = resourceID;
            parsedVRN.params = new URLSearchParams('');
        }
        return parsedVRN;
    }
}

module.exports = VRN;