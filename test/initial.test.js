const chai = require('chai'),
    sorted = require('chai-sorted'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../v1/index').Identity,
    Principal = require('../v1').Principal,
    Service = require('../v1').Service,
    Token = require('../v1').Token,
    Group = require('../v1').Group;

let currentTimestampSecond = Math.floor(Date.now() / 1000),
    tmpIdentityName = `identity-${currentTimestampSecond}`,
    tmpIdentityNameWithSecret = `identity-secret-${currentTimestampSecond}`,
    tmpIdentitySecret = `identity-password-${currentTimestampSecond}`,
    tempPrincipalName = 'principal-test' + currentTimestampSecond,
    tmpGroupName = 'group-test' + currentTimestampSecond,
    identityCreation,
    tempDataSetID = currentTimestampSecond,
    principalID = null,
    groupID,
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

describe('token validation tests', () => {
    it('should validate a token remotely and return true', async () => {
        let tokenValidationResponse = await new Token().setToken(token).remoteValidation();
        expect(tokenValidationResponse).to.be.true;
    });

    it('should return false when the token is invalid', async () => {
        let tokenValidationResponse = await new Token().setToken(token + '1').remoteValidation();
        expect(tokenValidationResponse).to.be.false;
    });

    it('should validate a token locally via the node module and return true', async () => {
        let tokenValidationResponse = await new Token().validate(token);
        expect(tokenValidationResponse).to.be.true;
    });

    it('should validate a token locally via the node module and return false', async () => {
        let invalidToken = token.substr(0, token.length - 2);
        invalidToken += 'XX';
        let tokenValidationResponse = await new Token().validate(invalidToken);
        expect(tokenValidationResponse).to.be.false;
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
describe('Service tests', async () => {
    describe('with auth', async () => {
        let serviceId = null;
        let service = null;
        let serviceName = null;
        describe('create service', async () => {
            it('should create a service', async () => {
                service = await new Service().withAuth().create(`new-service-${currentTimestampSecond}`);
                serviceId = service.id;
                serviceName = service.name;
            });
            it('should not create duplicated service', async () => {
                try {
                    service = await new Service().withAuth().create(`new-service-${currentTimestampSecond}`);
                } catch (e) {
                    expect(e.errorCode).to.equal(6001);
                    expect(e).to.exist;
                }
            });
            it('should not create service without name', async () => {
                try {
                    service = await new Service().withAuth().create(null);
                } catch (e) {
                    expect(e.errorCode).to.equal(10001);
                    expect(e).to.exist;
                }
            });
        });
        describe('should read created service', async () => {
            it('should read a service', async () => {
                let serviceRead = await new Service().withAuth().getByID(serviceId);
                expect(serviceRead.id).to.exist;
            });
            it('should not read service with wrong id', async () => {
                try {
                    await new Service().withAuth().getByID(`${currentTimestampSecond}`);
                } catch (e) {
                    expect(e.errorCode).to.equal(6002);
                    expect(e).to.exist;
                }

            });
            it('should read a service by name', async () => {
                let serviceRead = await new Service().withAuth().getByName(serviceName);
                expect(serviceRead.id).to.exist;
            });
            it('should not read service with non existence name', async () => {
                try {
                    await new Service().withAuth().getByName(`read-${currentTimestampSecond}`);
                } catch (e) {
                    expect(e.errorCode).to.equal(6002);
                    expect(e).to.exist;
                }

            });
        });
        describe('should read all services', async () => {
            it('should read all services in ascending order', async () => {
                let servicesGetAll = await new Service().withAuth().getServices('', '', '', 'id', 'asc');
                expect(servicesGetAll.data).to.be.ascendingBy('id');
            });
            it('should read all services in descending order', async () => {
                let servicesGetAll = await new Service().withAuth().getServices('', '', '', 'id', 'desc');
                expect(servicesGetAll.data).to.be.descendingBy('id');
            });

        });
        describe('update a service', async () => {
            it('should update a service', async () => {
                let updateService = await new Service().withAuth().update(serviceId, `service-name-update-${currentTimestampSecond}`);
                expect(updateService.name).to.equal(`service-name-update-${currentTimestampSecond}`);
            });
            it('should not update a non-exist service', async () => {
                try {
                    await new Service().withAuth().update(`${currentTimestampSecond}`, `service-name-update-${currentTimestampSecond}`);
                } catch (e) {
                    expect(e.errorCode).to.equal(6002);
                    expect(e).to.exist;
                }
            });
        });
        describe('delete a service', async () => {
            it('should delete a service', async () => {
                let deleteService = await new Service().withAuth().delete(serviceId);
                expect(deleteService.message).to.exist;
            });
            it('should not delete a service', async () => {
                try {
                    await new Service().withAuth().delete(`${currentTimestampSecond}`);
                } catch (e) {
                    expect(e.errorCode).to.equal(6002);
                    expect(e).to.exist;
                }
            });
        });
    });
    describe('without auth and with setToken', async () => {
        let serviceId = null;
        let service = null;
        let serviceName = null;
        before(async () => {
            token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
            token = token.token;
        });
        describe('create service', async () => {
            it('should create a service', async () => {
                service = await new Service().setToken(token).create(`new-service-${currentTimestampSecond}`);
                serviceId = service.id;
                serviceName = service.name;
            });
            it('should not create duplicated service', async () => {
                try {
                    service = await new Service().setToken(token).create(`new-service-${currentTimestampSecond}`);
                } catch (e) {
                    expect(e.errorCode).to.equal(6001);
                    expect(e).to.exist;
                }
            });
            it('should not create service without name', async () => {
                try {
                    service = await new Service().setToken(token).create(null);
                } catch (e) {
                    expect(e.errorCode).to.equal(10001);
                    expect(e).to.exist;
                }
            });
        });
        describe('should read created service', async () => {
            it('should read a service', async () => {
                let serviceRead = await new Service().setToken(token).getByID(serviceId);
                expect(serviceRead.id).to.exist;
            });
            it('should not read service with wrong id', async () => {
                try {
                    await new Service().setToken(token).getByID(`${currentTimestampSecond}`);
                } catch (e) {
                    expect(e.errorCode).to.equal(6002);
                    expect(e).to.exist;
                }

            });
            it('should read a service by name', async () => {
                let serviceRead = await new Service().setToken(token).getByName(serviceName);
                expect(serviceRead.id).to.exist;
            });
            it('should not read service with non existence name', async () => {
                try {
                    await new Service().setToken(token).getByName(`read-${currentTimestampSecond}`);
                } catch (e) {
                    expect(e.errorCode).to.equal(6002);
                    expect(e).to.exist;
                }

            });
        });
        describe('should read all services', async () => {
            it('should read all services in ascending order', async () => {
                let servicesGetAll = await new Service().setToken(token).getServices('', '', '', 'id', 'asc');
                expect(servicesGetAll.data).to.be.ascendingBy('id');
            });
            it('should read all services in descending order', async () => {
                let servicesGetAll = await new Service().setToken(token).getServices('', '', '', 'id', 'desc');
                expect(servicesGetAll.data).to.be.descendingBy('id');
            });
        });
        describe('update a service', async () => {
            it('should update a service', async () => {
                let updateService = await new Service().setToken(token).update(serviceId, `service-name-update-without-auth${currentTimestampSecond}`);
                expect(updateService.name).to.equal(`service-name-update-without-auth${currentTimestampSecond}`);
            });
            it('should not update a non-exist service', async () => {
                try {
                    await new Service().setToken(token).update(`${currentTimestampSecond}`, `service-name-update-without-auth${currentTimestampSecond}`);
                } catch (e) {
                    expect(e.errorCode).to.equal(6002);
                    expect(e).to.exist;
                }
            });
        });
        describe('delete a service', async () => {
            it('should delete a service', async () => {
                let deleteService = await new Service().setToken(token).delete(serviceId);
                expect(deleteService.message).to.exist;
            });
            it('should not delete a service', async () => {
                try {
                    await new Service().setToken(token).delete(`${currentTimestampSecond}`);
                } catch (e) {
                    expect(e.errorCode).to.equal(6002);
                    expect(e).to.exist;
                }
            });
        });
    });
});


describe('groups test', () => {

    describe('with set token', () => {
        it('will fail with an invalid token', async () => {
            try {
                await new Group().setToken('asdasd').create(tmpGroupName);
                throw 'should not reach this line because the token is not valid';
            } catch (e) {
                expect(e.message).to.be.equal('Forbidden');
            }
        });
    });

    it('should create a new group', async () => {
        let create = await new Group().withAuth().create(tmpGroupName, [], 'test group for module');
        groupID = create.id;
        expect(create).to.be.instanceOf(Object).and.have.property('id');
    });

    it('fails upon duplicate entry', async () => {
        try {
            await new Group().withAuth().create(tmpGroupName, [], 'test group for module');
            throw 'should not reach this line because the group name already exists';
        } catch (e) {
            expect(e.message).equals(`Duplicate entry ${tmpGroupName}`);
        }
    });

    // read a group by id
    it('should ge the specified group', async () => {
        let read = await new Group().withAuth().getById(groupID);
        expect(read).to.be.instanceOf(Object).and.have.property('id');
    });

    it('fails upon fetching a non existing id', async () => {
        try {
            await new Group().withAuth().getById(groupID + 12);
            throw 'should not read this line because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
    });

    // read a group by name
    it('gets a group by its name', async () => {
        let read = await new Group().withAuth().getByName(tmpGroupName);
        expect(read).to.be.instanceOf(Object).and.have.property('id');
    });

    it('fails when the name doesnt exist', async () => {
        try {
            await new Group().withAuth().getByName(tmpGroupName + 12);
            throw 'should not read this line because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
    });

    // group update

    it('it updates the specified group info', async () => {
        let update = await new Group().withAuth().update(groupID, tmpGroupName + 'updated');
        expect(update).to.be.instanceOf(Object).and.have.property('id');
    });

    it('fails when passing an invalid id', async () => {
        try {
            await new Group().withAuth().update(groupID + 12, tmpGroupName + 'updated');
            throw 'should not read this line, because the id is not valid';
        } catch (e) {
            expect(e.message).equals('Permission group does not exist');
        }
    });

    //delete group

    it('deletes the specified id', async () => {
        let deleted = await new Group().withAuth().delete(groupID);
        expect(deleted).to.be.instanceOf(Object).and.have.property('message').that.equals('Successfully deleted');
    });

    it('fails when the id is already deleted', async () => {
        try {
            await new Group().withAuth().delete(groupID);
            throw 'should not read this line because the group is deleted already';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('fails when the id does not exist', async () => {
        try {
            await new Group().withAuth().delete(groupID + 12);
            throw 'should not read this line because the group does not exist';
        } catch (e) {
            expect(e.message).equals('Group does not exist');
        }
    });
});