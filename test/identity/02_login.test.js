const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock } = require('../../src/helpers/test_helpers'),
    expect = chai.expect,
    token = require('../../config').auth.BaseToken,
    Identity = require('../../v1/index').Identity;
chai.use(chaiAsPromised);

describe('Identity login', () => {

    it('login identity', async () => {
        nock('/identity/login', 'post', {
            name: 'volcanic',
            secret: 'volcanic!123',
            audience: ['kratakao'],
            dataset_id: '-1'
        }, 200, {
            response: {
                response: {
                    token: token
                }
            },
            status: 200
        });
        let identityLogin = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], '-1');
        expect(identityLogin).to.be.an('object');
    });


    it('login identity with invalid credentials (name)', async () => {
        try {
            nock('/identity/login', 'post', {
                name: 'volcanic-invalid',
                secret: 'volcanic!123',
                audience: ['kratakao'],
                dataset_id: '-1'
            }, 200, {
                response: {
                    response: {
                        token: token
                    }
                },
                status: 200
            });
            await new Identity().login('volcanic-invalid', 'volcanic!123', ['kratakao'], '-1');
        } catch (e) {
            expect(e.errorCode).to.equal(1001);
            expect(e).to.be.exist;
        }
    });

    it('login identity with invalid credentials (password)', async () => {
        try {
            nock('/identity/login', 'post', {
                name: 'volcanic',
                secret: 'volcanic!123-invalid',
                audience: ['kratakao'],
                dataset_id: '-1'
            }, 200, {
                response: {
                    response: {
                        token: token
                    }
                },
                status: 200
            });
            await new Identity().login('volcanic', 'volcanic!123-invalid', ['kratakao'], '-1');
        } catch (e) {
            expect(e.errorCode).to.equal(1001);
            expect(e).to.be.exist;
        }
    });
});