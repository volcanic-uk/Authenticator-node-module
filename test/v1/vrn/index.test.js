const { VRN } = require('../../../v1');
const { expect } = require('chai');

describe('VRN tests', () => {
    it('should parse VRN without qualifiers', function () {
        let vrnString = 'vrn:sandbox:*:jobs/*';
        let vrn = new VRN(vrnString);
        let parsedVRN = vrn.parse();
        expect(parsedVRN.dataset).to.eq('*');
        expect(parsedVRN.resourceID).to.eq('*');
        expect(parsedVRN.stackId).to.eq('sandbox');
        expect(parsedVRN.resourceType).to.eq('jobs');
    });

    it('should parse VRN with qualifiers', function () {
        let vrnString = 'vrn:sandbox:*:jobs/*?site_name=my_site&param2=value2';
        let vrn = new VRN(vrnString);
        let parsedVRN = vrn.parse();
        expect(parsedVRN.dataset).to.eq('*');
        expect(parsedVRN.resourceID).to.eq('*');
        expect(parsedVRN.stackId).to.eq('sandbox');
        expect(parsedVRN.resourceType).to.eq('jobs');
        expect(parsedVRN.params.get('site_name')).to.eq('my_site');
        expect(parsedVRN.params.get('param2')).to.eq('value2');
    });

    it('should not parse invalid VRN', function () {
        let vrnString = 'vrn:invalid:ddd';
        try {
            let vrn = new VRN(vrnString);
            vrn.parse();
        } catch (e) {
            expect(e.message).to.eq('VRN is not valid');
        }
    });
});