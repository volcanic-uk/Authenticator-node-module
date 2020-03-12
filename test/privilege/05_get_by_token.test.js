const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    { nock, nockLogin } = require('../helpers'),
    Privilege = require('../../v1').Privilege,
    expect = chai.expect;
chai.use(chaiAsPromised);

describe('get privileges by token claims', () => {
    it('gets the claims', async () => {
        nock('/privileges/identity', 'get', {}, 200, {
            response: [
                {
                    'id': 1,
                    'name': 'auth',
                    'permissions': [
                        {
                            'id': 1,
                            'name': 'identity:create',
                            'privileges': [
                                {
                                    'id': 1,
                                    'scope': 'vrn:sandbox:-1:identity/*',
                                    'allow': true
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        nockLogin();
        let read = await new Privilege().withAuth().getByToken();
        expect(read).to.be.an('array');
    });

    it('fails if the token is invalid', async () => {
        try {
            nock('/privileges/identity', 'get', {}, 404, {
                message: 'UNAUTHORIZED', errorCode: 3001
            });
            await new Privilege().setToken('asd').getByToken();
            throw 'should not reach this line because privilege does not exist';
        } catch (e) {
            expect(e.message).to.equal('UNAUTHORIZED');
            expect(e.errorCode).to.equal(3001);
        }
    });

});