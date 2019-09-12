const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
chai.use(chaiAsPromised);
const Identity = require('../v1/index').Identity;
let currentTimestampSecond = Math.floor(Date.now() / 1000);
let tmpIdentityName = `identity-${currentTimestampSecond}`;
let tmpIdentityNameWithSecret = `identity-secret-${currentTimestampSecond}`;
let tmpIdentitySecret = `identity-password-${currentTimestampSecond}`;
let tmpPrincipalID = 1;
let identityCreation;
require('dotenv').config();
let loginToken;
before(async () => {
    loginToken = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
    loginToken = loginToken.token;

});
describe('identity login tests', () => {
    it('login identity', async () => {
        let identityLogin = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        expect(identityLogin).to.be.an('object');
    });
    it('login identity without principal id', async () => {
        try {
            await new Identity().login('volcanic', 'volcanic!123', ['kratakao']);
        } catch (e) {
            expect(e.errorCode).to.equal(10001);
            expect(e).to.be.exist;
        }
    });
    it('login identity with invalid credentials (name)', async () => {
        try {
            await new Identity().login(`volcanic-invalid ${currentTimestampSecond}`, 'volcanic!123', ['kratakao'], 1);
        } catch (e) {
            expect(e.errorCode).to.equal(1001);
            expect(e).to.be.exist;
        }
    });
    it('login identity with invalid credentials (password)', async () => {
        try {
            await new Identity().login('volcanic', `volcanic${currentTimestampSecond}`, ['kratakao'], 1);
        } catch (e) {
            expect(e.errorCode).to.equal(1001);
            expect(e).to.be.exist;
        }
    });
});
describe('identity create tests', () => {
    describe('with auth', async () => {
        it('creating a new identity', async () => {
            identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, tmpPrincipalID);
            expect(identityCreation).to.be.an('object');
        });
        it('creating a new identity with secret', async () => {
            let identityCreationWithSecret = await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, tmpPrincipalID);
            expect(identityCreationWithSecret).to.be.an('object');
        });
        it('should not create a duplicate identity record', async () => {
            try {
                await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, tmpPrincipalID);
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
        });
        it('creating an identity record without principal_id', async () => {
            try {
                await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });
        it('creating an identity record without name', async () => {
            try {
                await new Identity().withAuth().create(null, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });
        // it('should remote validate a token', async () => {
        //     let token = await new Identity().withAuth().remoteValidation();
        //     expect(token).to.equal(true);
        // });
    });
    describe('without auth and with setToken', async () => {
        it('creating a new identity', async () => {
            let identityCreation = await new Identity().setToken(loginToken).create(tmpIdentityName + '-withtoken', null, 1);
            expect(identityCreation).to.be.an('object');
        });
        it('creating a new identity with secret', async () => {
            let identityCreationWithSecret = await new Identity().setToken(loginToken).create(tmpIdentityNameWithSecret + '-withtoken', tmpIdentitySecret, tmpPrincipalID);
            expect(identityCreationWithSecret).to.be.an('object');
        });
        it('should not create a duplicate identity record', async () => {
            try {
                await new Identity().setToken(loginToken).create(tmpIdentityNameWithSecret, tmpIdentitySecret, tmpPrincipalID);
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
        });
        it('creating an identity record without principal_id', async () => {
            try {
                await new Identity().setToken(loginToken).create(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });
        it('creating an identity record without name', async () => {
            try {
                await new Identity().setToken(loginToken).create(null, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without identity name');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });
    });
    //register with auth

});
describe('identity update', async () => {
    describe('with auth', async () => {
        it('should update an identity', async () => {
            let updatedIdentity = await new Identity().withAuth().update(`updated-name-${currentTimestampSecond}`, identityCreation.response.id);
            expect(updatedIdentity.response.name).to.equal(`updated-name-${currentTimestampSecond}`);
        });
        it('it should not update a non existent identity', async () => {
            try {
                await new Identity().withAuth().update(`updated-name-${currentTimestampSecond}`, `${currentTimestampSecond}`);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
        });
    });
    describe('without auth and with setToken', async () => {
        it('should update an identity', async () => {
            let updatedIdentity = await new Identity().setToken(loginToken).update(`updated-name-${currentTimestampSecond}`, identityCreation.response.id);
            expect(updatedIdentity.response.name).to.equal(`updated-name-${currentTimestampSecond}`);
        });
        it('it should not update a non existent identity', async () => {
            try {
                await new Identity().setToken(loginToken).update(`updated-name-${currentTimestampSecond}`, `${currentTimestampSecond}`);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
        });
    });
});
describe('reset identity secret', async () => {
    describe('with auth', async () => {
        it('should reset identity secret', async () => {
            let resetSecret = await new Identity().withAuth().resetSecret(`new-secret-${currentTimestampSecond}`, identityCreation.response.id);
            expect(resetSecret.response.message).to.equal('Secret regenerated successfully');
        });
        it('should generate identity secret', async () => {
            let generateSecret = await new Identity().withAuth().resetSecret(null, identityCreation.response.id);
            expect(generateSecret.response.message).to.equal('Secret regenerated successfully');
        });
    });

    describe('without auth and with setToken', async () => {
        it('should reset identity secret', async () => {
            let resetSecret = await new Identity().setToken(loginToken).resetSecret(`new-secret-${currentTimestampSecond}`, identityCreation.response.id);
            expect(resetSecret.response.message).to.equal('Secret regenerated successfully');
        });
        it('should generate identity secret', async () => {
            let generateSecret = await new Identity().setToken(loginToken).resetSecret(null, identityCreation.response.id);
            expect(generateSecret.response.message).to.equal('Secret regenerated successfully');
        });
    });
});
describe('generate token for identity', async () => {
    describe('with auth', async () => {
        let today = new Date();
        it('should generate token for identity', async () => {
            let identity = await new Identity().withAuth().generateToken(identityCreation.response.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            expect(identity.response.token).to.exist;

        });
        it('should generate token for identity when expiry date is in the past', async () => {
            try {
                await new Identity().withAuth().generateToken(identityCreation.response.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            } catch (e) {
                expect(e.errorCode).to.be.equal(1008);
                expect(e.message).to.exist;
            }
        });
        it('should generate token for identity when nbf is more than 4 weeks', async () => {
            try {
                await new Identity().withAuth().generateToken(identityCreation.response.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth() + 4, today.getDate()).getTime()));
            } catch (e) {
                expect(e.errorCode).to.be.equal(1009);
                expect(e.message).to.exist;
            }

        });
    });

    describe('without auth and with setToken', async () => {
        let today = new Date();
        it('should generate token for identity', async () => {
            let identity = await new Identity().setToken(loginToken).generateToken(identityCreation.response.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            expect(identity.response.token).to.exist;
        });
        it('should generate token for identity when expiry date is in the past', async () => {
            try {
                await new Identity().setToken(loginToken).generateToken(identityCreation.response.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            } catch (e) {
                expect(e.errorCode).to.be.equal(1008);
                expect(e.message).to.exist;
            }
        });
        it('should generate token for identity when nbf is more than 4 weeks', async () => {
            try {
                await new Identity().setToken(loginToken).generateToken(identityCreation.response.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth() + 4, today.getDate()).getTime()));
            } catch (e) {
                expect(e.errorCode).to.be.equal(1009);
                expect(e.message).to.exist;
            }

        });
    });
});
describe('deactivate identity', async () => {
    describe('with auth', async () => {
        it('should deactivate identity', async () => {
            let deactivateIdentity = await new Identity().withAuth().deactivateIdentity(identityCreation.response.id);
            expect(deactivateIdentity.response.message).to.equal('Successfully deactivated identity');
        });
        it('should not deactivate already deactivated identity', async () => {
            try {
                await new Identity().withAuth().deactivateIdentity(identityCreation.response.id);
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }

        });
    });
    describe('without auth and with setToken', async () => {
        let newToken, newIdentity;
        before(async () => {
            newToken = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
            newToken = newToken.token;
            newIdentity = await new Identity().setToken(newToken).create(`new-identity-${currentTimestampSecond}`, 'new-secret', 1);
        });
        it('should deactivate identity', async () => {
            let deactivateIdentity = await new Identity().setToken(newToken).deactivateIdentity(newIdentity.response.id);
            expect(deactivateIdentity.response.message).to.equal('Successfully deactivated identity');
        });
        it('should not deactivate already deactivated identity', async () => {
            try {
                await new Identity().setToken(newToken).deactivateIdentity(newIdentity.response.id);
                throw Error('The code should not reach this scope as identity already deactivated');
            } catch (e) {
                expect(e.errorCode).to.equal(1004);
            }

        });
    });
});
describe('identity logout tests', async () => {
    describe('with auth', async () => {
        it('should logout an identity', async () => {
            let logout = await new Identity().withAuth().logout();
            expect(logout).to.be.an('object');
        });
    });
    describe('without auth and with setToken', async () => {
        it('should logout an identity', async () => {
            let logout = await new Identity().setToken(loginToken).logout();
            expect(logout).to.be.an('object');
        });
        it('should not logout an already logged out identity', async () => {
            try {
                await new Identity().setToken(loginToken).logout();
                throw Error('the code should not reach this scope as identity is already logged out');

            } catch (e) {
                expect(e.errorCode).to.equal(3001);
                expect(e).to.exist;
            }

        });
    });
});