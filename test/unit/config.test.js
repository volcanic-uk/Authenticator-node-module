const chai = require('chai'),
    expect = chai.expect;

const Config = require('../../v1').Config;

describe('Config setter test', () => {
    it('should set the config to a new configuration', function () {
        Config.auth.set({
            identity_name: 'test',
            secret: 'test',
            dataset_id: 1,
            audience: ['*']
        });
        let updatedConfig = Config.auth.get();

        expect(updatedConfig).to.deep.include({
            identity_name: 'test',
            secret: 'test',
            dataset_id: 1,
            audience: ['*']
        });
    });
});