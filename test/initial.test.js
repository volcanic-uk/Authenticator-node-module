const chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect;
chai.use(chaiAsPromised);

const Identity = require('../v1/index').Identity,
    Principal = require('../v1').Principal,
    Role = require('../v1').Roles;

let currentTimestampSecond = Math.floor(Date.now() / 1000),
    tmpIdentityName = `identity-${currentTimestampSecond}`,
    tmpIdentityNameWithSecret = `identity-secret-${currentTimestampSecond}`,
    tmpIdentitySecret = `identity-password-${currentTimestampSecond}`,
    tempPrincipalName = 'principal-test' + currentTimestampSecond,
    tmpRoleName = 'role-test' + currentTimestampSecond,

    identityCreation,
    tempDataSetID = currentTimestampSecond,
    principalID = null,
    roleId = null,
    roleName = null,
    token;


describe('principals tests', () => {
    // principal creation
    let principal = new Principal();
    it('should fail if principal creation function is called without a valid token and it will throw an error', async () => {
        try {
            await principal.create(tempPrincipalName, tempDataSetID);
            throw 'can not create principal with malformed or no token';
        } catch (e) {
            expect(e.message).to.be.equal('Forbidden');
        }
    });

    it('should be a success when passing valid data, hence it will return an object carrying the created principal data', async () => {
        let create = await principal.withAuth().create(tempPrincipalName, tempDataSetID);
        principalID = create.id;
        expect(create).to.be.instanceOf(Object).and.have.property('dataset_id').that.equals(tempDataSetID);
    });

    it('should not create a principal and it will throw an error if the name already exist', async () => {
        try {
            await await principal.withAuth().create(tempPrincipalName, tempDataSetID);
            throw 'should not reach this line, as the name is duplicated';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    // reading principal
    it('should not proceed if the principal does not exist upon read request, and it will throw an error', async () => {
        try {
            await principal.withAuth().getByID(principalID + 12);
            throw 'can not retrieve a principal that does not exist';
        } catch (e) {
            expect(e.message).equals('Principal does not exist');
        }
    });

    it('should fail when requesting a read request when there is no token in the request header, and it will throw an error', async () => {
        try {
            await new Principal().getByID(principalID);
            throw 'should not reach this line, because the read request has no token, or it is malformed';
        } catch (e) {
            expect(e.message).to.be.equals('Forbidden');
        }
    });

    it('should return an object if the principal is found successfully whlile passing valid data', async () => {
        let read = await principal.getByID(principalID);
        expect(read.id).to.exist;
    });

    //update principal
    it('upon principal update, the request should not be completed if there is no authorization token in the request header, and it will throw an error', async () => {
        try {
            await new Principal().update(principalID, 'new name', 12);
            throw 'should not read this line because the update request has no token, or it is malformed';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('should not update a principal that does not exist hence an error is thrown', async () => {
        try {
            await principal.update(principalID + 12, 'new name', 12);
            throw 'should not reach this line because the principal requested does not exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('should be a success when the principal is updated, thus it will return an object carrying the new attributes for the principal', async () => {
        let update = await principal.withAuth().update(principalID, 'new name', 12);
        expect(update.dataset_id).to.exist;
    });

    // delete principal

    it('should not pass upon deleting because the header does not have a valid authorization token, and it will throw an error', async () => {
        try {
            await new Principal().delete(principalID);
            throw 'should not reach this line, because the token is not valid';
        } catch (e) {
            expect(e.message).equals('Forbidden');
        }
    });

    it('should return a success message upon valid request of deleting the principal via ID', async () => {
        let deleted = await principal.withAuth().delete(principalID);
        expect(deleted.message).to.exist;
    });
});

describe('identity login tests', () => {

    before(async () => {
        token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        token = token.token;
    });

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
            identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, principalID);
            expect(identityCreation).to.be.an('object');
        });

        it('creating a new identity with secret', async () => {
            let identityCreationWithSecret = await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, principalID);
            expect(identityCreationWithSecret).to.be.an('object');
        });

        it('should not create a duplicate identity record', async () => {
            try {
                await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, principalID);
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
            let identityCreation = await new Identity().setToken(token).create(tmpIdentityName + '-withtoken', null, 1);
            expect(identityCreation).to.be.an('object');
        });

        it('creating a new identity with secret', async () => {
            let identityCreationWithSecret = await new Identity().setToken(token).create(tmpIdentityNameWithSecret + '-withtoken', tmpIdentitySecret, principalID);
            expect(identityCreationWithSecret).to.be.an('object');
        });

        it('should not create a duplicate identity record', async () => {
            try {
                await new Identity().setToken(token).create(tmpIdentityNameWithSecret, tmpIdentitySecret, principalID);
                throw Error('The code should not reach this scope as it would be a duplicate identity record');
            } catch (e) {
                expect(e.errorCode).to.equal(1003);
                expect(e).to.exist;
            }
        });

        it('creating an identity record without principal_id', async () => {
            try {
                await new Identity().setToken(token).create(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
                throw Error('The code should not reach this scope as identity cannot be created without principal id');
            } catch (e) {
                expect(e.errorCode).to.equal(10001);
                expect(e).to.exist;
            }
        });

        it('creating an identity record without name', async () => {
            try {
                await new Identity().setToken(token).create(null, tmpIdentitySecret, null);
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
            let updatedIdentity = await new Identity().withAuth().update(`updated-name-${currentTimestampSecond}`, identityCreation.id);
            expect(updatedIdentity.name).to.equal(`updated-name-${currentTimestampSecond}`);
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
            let updatedIdentity = await new Identity().setToken(token).update(`updated-name-${currentTimestampSecond}`, identityCreation.id);
            expect(updatedIdentity.name).to.equal(`updated-name-${currentTimestampSecond}`);
        });

        it('it should not update a non existent identity', async () => {
            try {
                await new Identity().setToken(token).update(`updated-name-${currentTimestampSecond}`, `${currentTimestampSecond}`);
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
            let resetSecret = await new Identity().withAuth().resetSecret(`new-secret-${currentTimestampSecond}`, identityCreation.id);
            expect(resetSecret.message).to.equal('Secret regenerated successfully');
        });

        it('should generate identity secret', async () => {
            let generateSecret = await new Identity().withAuth().resetSecret(null, identityCreation.id);
            expect(generateSecret.message).to.equal('Secret regenerated successfully');
        });

    });


    describe('without auth and with setToken', async () => {

        it('should reset identity secret', async () => {
            let resetSecret = await new Identity().setToken(token).resetSecret(`new-secret-${currentTimestampSecond}`, identityCreation.id);
            expect(resetSecret.message).to.equal('Secret regenerated successfully');
        });

        it('should generate identity secret', async () => {
            let generateSecret = await new Identity().setToken(token).resetSecret(null, identityCreation.id);
            expect(generateSecret.message).to.equal('Secret regenerated successfully');
        });

    });
});


describe('generate token for identity', async () => {

    describe('with auth', async () => {
        let today = new Date();

        it('should generate token for identity', async () => {
            let identity = await new Identity().withAuth().generateToken(identityCreation.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            expect(identity.token).to.exist;
        });

        it('should generate token for identity when expiry date is in the past', async () => {
            try {
                await new Identity().withAuth().generateToken(identityCreation.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            } catch (e) {
                expect(e.errorCode).to.be.equal(1008);
                expect(e.message).to.exist;
            }
        });

        it('should generate token for identity when nbf is more than 4 weeks', async () => {
            try {
                await new Identity().withAuth().generateToken(identityCreation.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth() + 4, today.getDate()).getTime()));
            } catch (e) {
                expect(e.errorCode).to.be.equal(1009);
                expect(e.message).to.exist;
            }
        });

    });


    describe('without auth and with setToken', async () => {
        let today = new Date();

        it('should generate token for identity', async () => {
            let identity = await new Identity().setToken(token).generateToken(identityCreation.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            expect(identity.token).to.exist;
        });

        it('should generate token for identity when expiry date is in the past', async () => {
            try {
                await new Identity().setToken(token).generateToken(identityCreation.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            } catch (e) {
                expect(e.errorCode).to.be.equal(1008);
                expect(e.message).to.exist;
            }
        });

        it('should generate token for identity when nbf is more than 4 weeks', async () => {
            try {
                await new Identity().setToken(token).generateToken(identityCreation.id, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth() + 4, today.getDate()).getTime()));
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
            let deactivateIdentity = await new Identity().withAuth().deactivateIdentity(identityCreation.id);
            expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
        });

        it('should not deactivate already deactivated identity', async () => {
            try {
                await new Identity().withAuth().deactivateIdentity(identityCreation.id);
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
            let deactivateIdentity = await new Identity().setToken(newToken).deactivateIdentity(newIdentity.id);
            expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
        });

        it('should not deactivate already deactivated identity', async () => {
            try {
                await new Identity().setToken(newToken).deactivateIdentity(newIdentity.id);
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
            let logout = await new Identity().setToken(token).logout();
            expect(logout).to.be.an('object');
        });

        it('should not logout an already logged out identity', async () => {
            try {
                await new Identity().setToken(token).logout();
                throw Error('the code should not reach this scope as identity is already logged out');

            } catch (e) {
                expect(e.errorCode).to.equal(3001);
                expect(e).to.exist;
            }
        });

    });
});

describe('roles api tests', () => {

    describe('with setToken', () => {
        it('fails on malformed token', async () => {
            try {
                await new Role().setToken('some token').create(tmpRoleName, 1, [1, 2]);
                throw 'it will not pass because the token is invalid';
            } catch (e) {
                expect(e.message).to.exist;
            }
        });
    });

    it('creates a new role', async () => {
        let create = await new Role().withAuth().create(tmpRoleName, 1, [1, 2]);
        roleId = create.id;
        roleName = create.name;
        expect(create).to.be.instanceOf(Object).and.has.property('id');
    });

    it('fails when privileges are not an array', async () => {
        try {
            await new Role().withAuth().create(tmpRoleName, 1, 1);
            throw 'should not reach this line, privileges are not an array';
        } catch (e) {
            expect(e.message).to.exist;
        }

    });

    // Get role by id API
    it('should return the right role', async () => {
        let read = await new Role().withAuth().getById(roleId);
        expect(read).to.be.instanceOf(Object).and.has.property('id');
    });

    it('will fail because the requested id is not available', async () => {
        try {
            await new Role().withAuth().getById(roleId + 12);
            throw 'it will not pass because the name does not exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('gets the right role by its name', async () => {
        let read = await new Role().withAuth().getById(roleName);
        expect(read).to.be.instanceOf(Object).and.has.property('id');
    });

    it('will fail because the requested id is not available', async () => {
        try {
            await new Role().withAuth().getById(roleName + 'test');
            throw 'it will not pass because the name does not exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    // get all roles

    it('gets the desired token', async () => {
        let read = await new Role().withAuth().getRoles(null, 1, 15, 'id', 'asc');
        expect(read.data).to.be.an('array');
    });

    // update roles api

    it('updates the requested role', async () => {
        let update = await new Role().withAuth().update(roleId, tmpRoleName + 'update', 1, [1, 2]);
        expect(update).to.instanceOf(Object).and.has.property('id');
    });

    it('fails when getting a non-existing role', async () => {
        try {
            await new Role().withAuth().update(roleId + 12, tmpRoleName + 'update', 1, [1, 2]);
            throw 'should not reach this line, for the id does not exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    // delete roles API

    it('deletes the required role', async () => {
        let deleteIt = await new Role().withAuth().delete(roleId);
        expect(deleteIt.message).to.exist;
    });

    it('fails deleting an already deleted role', async () => {
        try {
            await new Role().withAuth().delete(roleId);
            throw 'should not reach this line because the id is gone';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('fails deleting a non existing role', async () => {
        try {
            await new Role().withAuth().delete(roleId + 123132);
            throw 'should not reach this line because the id is not valid';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

});