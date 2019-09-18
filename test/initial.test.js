const chai = require('chai'),
    sorted = require('chai-sorted'),
    chaiAsPromised = require('chai-as-promised'),
    expect = chai.expect;
chai.use(chaiAsPromised);
chai.use(sorted);

const Identity = require('../v1').Identity,
    Principal = require('../v1').Principal,
    Service = require('../v1').Service,
    Token = require('../v1').Token,
    Group = require('../v1').Group,
    Role = require('../v1').Roles,
    Permission = require('../v1').Permission,
    Privilege = require('../v1').Privilege;

let currentTimestampSecond = Math.floor(Date.now() / 1000),
    tmpIdentityName = `identity-${currentTimestampSecond}`,
    tmpIdentityNameWithSecret = `identity-secret-${currentTimestampSecond}`,
    tmpIdentitySecret = `identity-password-${currentTimestampSecond}`,
    tempPrincipalName = 'principal-test' + currentTimestampSecond,
    tmpGroupName = 'group-test' + currentTimestampSecond,
    tmpRoleName = 'role-test' + currentTimestampSecond,
    tmpPermissionName = 'permission-test' + currentTimestampSecond,
    tempDataSetID = currentTimestampSecond,
    identityId,
    principalID = null,
    groupID = null,
    permissionId = null,
    roleId = null,
    roleName = null,
    privilegeId = null,
    serviceId = null,
    SUtoken;

describe('principals creation tests', () => {
    // principal creation
    it('should create a new principal', async () => {
        let create = await new Principal().withAuth().create(tempPrincipalName, tempDataSetID);
        principalID = create.id;
        expect(create).to.be.instanceOf(Object).and.have.property('dataset_id').that.equals(tempDataSetID);
    });

    it('should not create a principal if the name already exists', async () => {
        try {
            await new Principal().withAuth().create(tempPrincipalName, tempDataSetID);
            throw 'should not reach this line, as the name is duplicated';
        } catch (e) {
            expect(e.errorCode).to.equal(2001);
        }
    });

    describe('with setToken', () => {
        it('should fail if principal creation function is called without a valid token and it will throw an error', async () => {
            try {
                await new Principal().setToken('token').create(tempPrincipalName, tempDataSetID);
                throw 'can not create principal with malformed or no token';
            } catch (e) {
                expect(e.errorCode).to.equal(3001);
            }
        });
    });
});
// reading principal
describe('reading principals', () => {
    it('should not proceed if the principal does not exist upon read request, and it will throw an error', async () => {
        try {
            await new Principal().withAuth().getByID(principalID + 12);
            throw 'can not retrieve a principal that does not exist';
        } catch (e) {
            expect(e.errorCode).equals(2002);
        }
    });

    it('should return an object if the principal is found successfully whlile passing valid data', async () => {
        let read = await new Principal().withAuth().getByID(principalID);
        expect(read.id).to.exist;
    });

    describe('with setToken', () => {
        it('should fail when requesting a read request when there is no token in the request header, and it will throw an error', async () => {
            try {
                await new Principal().setToken('token').getByID(principalID);
                throw 'should not reach this line, because the read request has no token, or it is malformed';
            } catch (e) {
                expect(e.errorCode).equals(3001);
            }
        });
    });
});

//update principal
describe('updating principal', () => {
    it('upon principal update, the request should not be completed if there is no authorization token in the request header, and it will throw an error', async () => {
        try {
            await new Principal().update(principalID, 'new name', 12);
            throw 'should not read this line because the update request has no token, or it is malformed';
        } catch (e) {
            expect(e.errorCode).equals(3001);
        }
    });

    it('should not update a principal that does not exist hence an error is thrown', async () => {
        try {
            await new Principal().update(principalID + 12, 'new name', 12);
            throw 'should not reach this line because the principal requested does not exist';
        } catch (e) {
            expect(e.errorCode).equals(3001);
        }
    });

    it('should be a success when the principal is updated, thus it will return an object carrying the new attributes for the principal', async () => {
        let update = await new Principal().withAuth().update(principalID, 'new name', 12);
        expect(update.dataset_id).to.exist;
    });

});

describe('identity login tests', () => {

    it('login identity', async () => {
        let login = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
        SUtoken = login.token;
        expect(login).to.be.an('object');
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
    describe('with auth', () => {
        it('creating a new identity', async () => {
            let create = await new Identity().withAuth().create(tmpIdentityName, null, principalID);
            identityId = create.id;
            expect(create).to.be.an('object');
        });

        it('creating a new identity with secret', async () => {
            let identityIdWithSecret = await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, principalID);
            expect(identityIdWithSecret).to.be.an('object');
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

    });

    describe('with setToken', () => {
        it('should not create an identity with an invalid token', async () => {
            try {
                await new Identity().setToken('token').create(tmpIdentityNameWithSecret, tmpIdentitySecret, principalID);
                throw Error('should now reach this line, the token is malformed');
            } catch (e) {
                expect(e.statusCode).to.equal(403);
            }
        });
    });
});


describe('identity update', () => {
    describe('with auth', () => {

        it('should update an identity', async () => {
            let updatedIdentity = await new Identity().withAuth().update(`updated-name-${currentTimestampSecond}`, identityId);
            expect(updatedIdentity.name).to.equal(`updated-name-${currentTimestampSecond}`);
        });

        it('it should not update a non existent identity', async () => {
            try {
                await new Identity().withAuth().update(`updated-name-${currentTimestampSecond}`, identityId + 12);
            } catch (e) {
                expect(e.errorCode).to.be.equal(1004);
                expect(e).to.exist;
            }
        });
    });

    describe('with setToken', async () => {

        it('it should not update a non existent identity', async () => {
            try {
                await new Identity().setToken('token').update(`updated-name-${currentTimestampSecond}`, identityId + 12);
            } catch (e) {
                expect(e.errorCode).to.be.equal(3001);
                expect(e).to.exist;
            }
        });

    });
});

describe('reset identity secret', async () => {
    describe('with auth', async () => {

        it('should reset identity secret', async () => {
            let resetSecret = await new Identity().withAuth().resetSecret(`new-secret-${currentTimestampSecond}`, identityId);
            expect(resetSecret.message).to.equal('Secret regenerated successfully');
        });

        it('should generate identity secret', async () => {
            let generateSecret = await new Identity().withAuth().resetSecret(null, identityId);
            expect(generateSecret.message).to.equal('Secret regenerated successfully');
        });

    });
});

describe('generate token for identity', async () => {

    describe('with auth', async () => {
        let today = new Date();

        it('should generate token for identity', async () => {
            let identity = await new Identity().withAuth().generateToken(identityId, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            expect(identity.token).to.exist;
        });

        it('should generate token for identity when expiry date is in the past', async () => {
            try {
                await new Identity().withAuth().generateToken(identityId, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            } catch (e) {
                expect(e.errorCode).to.be.equal(1008);
                expect(e.message).to.exist;
            }
        });

        it('should generate token for identity when nbf is more than 4 weeks', async () => {
            try {
                await new Identity().withAuth().generateToken(identityId, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth() + 4, today.getDate()).getTime()));
            } catch (e) {
                expect(e.errorCode).to.be.equal(1009);
                expect(e.message).to.exist;
            }
        });

    });


    describe('with setToken', async () => {
        let today = new Date();

        it('should generate token for identity', async () => {
            let identity = await new Identity().setToken(SUtoken).generateToken(identityId, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            expect(identity.token).to.exist;
        });

        it('should generate token for identity when expiry date is in the past', async () => {
            try {
                await new Identity().setToken(SUtoken).generateToken(identityId, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
            } catch (e) {
                expect(e.errorCode).to.be.equal(1008);
                expect(e.message).to.exist;
            }
        });

        it('should generate token for identity when nbf is more than 4 weeks', async () => {
            try {
                await new Identity().setToken(SUtoken).generateToken(identityId, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth() + 4, today.getDate()).getTime()));
            } catch (e) {
                expect(e.errorCode).to.be.equal(1009);
                expect(e.message).to.exist;
            }
        });

    });
});

describe('token validation tests', () => {
    it('should validate a token remotely and return true', async () => {
        let tokenValidationResponse = await new Token().setToken(SUtoken).remoteValidation();
        expect(tokenValidationResponse).to.be.true;
    });

    it('should return false when the token is invalid', async () => {
        let tokenValidationResponse = await new Token().setToken(SUtoken + '1').remoteValidation();
        expect(tokenValidationResponse).to.be.false;
    });

    it('should validate a token locally via the node module and return true', async () => {
        let tokenValidationResponse = await new Token().validate(SUtoken);
        expect(tokenValidationResponse).to.be.true;
    });

    it('should validate a token locally via the node module and return false', async () => {
        let invalidToken = SUtoken.substr(0, SUtoken.length - 2);
        invalidToken += 'XX';
        let tokenValidationResponse = await new Token().validate(invalidToken);
        expect(tokenValidationResponse).to.be.false;
    });
});

describe('Service tests', () => {
    describe('with auth', () => {
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
        describe('should read created service', () => {
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
        describe('should read all services', () => {
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
    });
    describe('with setToken', () => {
        it('should create a service', async () => {
            try {
                await new Service().setToken('token').create(`new-service-${currentTimestampSecond}`);
                throw 'should not reach this line';
            } catch (e) {
                expect(e.errorCode).to.equal(3001);
            }
        });
    });
});

describe('permissions tests', () => {
    describe('with auth', () => {

        it('creates a new permission', async () => {
            let permission = await new Permission().withAuth().create(serviceId, tmpPermissionName, 'the permission description');
            permissionId = permission.id;
            expect(permission).to.be.instanceOf(Object).and.have.property('subject_id');
        });

        it('does not create a duplicate permission', async () => {
            try {
                await new Permission().withAuth().create(serviceId, tmpPermissionName, 'the permission description');
                throw 'should not reach this line because the permission is duplicated';
            } catch (e) {
                expect(e.message).equals(`Duplicate entry ${tmpPermissionName}`);
            }
        });

        // read permissions
        it('should not pass this test and it will throw an error, for the id provided is invalid', async () => {
            try {
                await new Permission().withAuth().getById(permissionId + 12);
                throw 'can not retrieve a permissions that does not exist';
            } catch (e) {
                expect(e.message).equals('Permission does not exist');
            }
        });

        it('it should pass the test and returns an object upon valid permission retrieval', async () => {
            let read = await new Permission().withAuth().getById(permissionId);
            expect(read.service_id).to.exist;
        });

        it('it should pass the test and returns an object upon valid permission retrieval', async () => {
            let read = await new Permission().withAuth().getPermissions();
            expect(read).to.exist;
        });

        //update permissions
        it('fails when id provided is invalid on update', async () => {
            try {
                await new Permission().withAuth().update(permissionId + 12, tmpPermissionName + '-updated', 'some description');
                throw 'must not reach this line because the id doesnt exist';
            } catch (e) {
                expect(e.message).equals('Permission does not exist');
            }
        });

        it('should pass this test and return an object with the updated info upon successul permission update request', async () => {
            let update = await new Permission().withAuth().update(permissionId, tmpPermissionName + '-updated', 'some description');
            expect(update.id).to.exist;
        });
    });

    describe('with set token', () => {
        it('should not pass this test and it will throw an error because the auth header token is invalid, hence this test should fail', async () => {
            try {
                await new Permission().setToken('some token').create(tmpPermissionName, 'the permission description', serviceId);
                throw 'must not reach this line as the token provided is corrupted';
            } catch (e) {
                expect(e.message).to.be.equal('Forbidden');
            }
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

});

describe('privileges tests', () => {
    // create privileges
    describe('with setToken', () => {
        it('fails when the token is invalid', async () => {
            try {
                await new Privilege().setToken('sometoken').create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
                throw 'must not reach this line because the token is invalid';
            } catch (e) {
                expect(e.message).to.equal('Forbidden');
            }
        });
    });

    it('creates a new privielge', async () => {
        let create = await new Privilege().withAuth().create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
        privilegeId = create.id;
        expect(create).to.be.an.instanceOf(Object).and.have.property('group_id');
    });

    // read privilege

    it('gets the new privielge', async () => {
        let read = await new Privilege().withAuth().getById(privilegeId);
        expect(read).to.be.an.instanceOf(Object).and.have.property('group_id');
    });

    it('fails with non existing id', async () => {
        try {
            await new Privilege().withAuth().getById(privilegeId + 12);
            throw 'should not reach this line because privilege does not exist';
        } catch (e) {
            expect(e.message).to.equal('privilege does not exist');
        }
    });

    // update privilege

    it('fails updating a non existing ID', async () => {
        try {
            await new Privilege().withAuth().update(privilegeId + 12, 'vrn:{stack}:{dataset}:jobs/*', 1, 1);
            throw 'should not reach this line, because the id doesnt exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('updates the specified privielge', async () => {
        let update = await new Privilege().withAuth().update(privilegeId, 'vrn:{stack}:{dataset}:jobs/*', 1, 1);
        expect(update).to.be.an.instanceOf(Object).and.have.property('group_id');
    });

});

describe('roles api tests', () => {

    describe('with setToken', () => {
        it('fails on malformed token', async () => {
            try {
                await new Role().setToken('some token').create(tmpRoleName, serviceId, [1, 2]);
                throw 'it will not pass because the token is invalid';
            } catch (e) {
                expect(e.message).to.exist;
            }
        });
    });

    it('creates a new role', async () => {
        let create = await new Role().withAuth().create(tmpRoleName, serviceId, [1, 2]);
        roleId = create.id;
        roleName = create.name;
        expect(create).to.be.instanceOf(Object).and.has.property('id');
    });

    it('fails when privileges are not an array', async () => {
        try {
            await new Role().withAuth().create(tmpRoleName, serviceId, 1);
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
        let update = await new Role().withAuth().update(roleId, tmpRoleName + 'update', serviceId, [1, 2]);
        expect(update).to.instanceOf(Object).and.has.property('id');
    });

    it('fails when getting a non-existing role', async () => {
        try {
            await new Role().withAuth().update(roleId + 12, tmpRoleName + 'update', serviceId, [1, 2]);
            throw 'should not reach this line, for the id does not exist';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

});

// deleting tests here

describe('deleting roles', () => {
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

describe('deleting privilege', () => {
    it('fails deleting a non existing id', async () => {
        try {
            await new Privilege().withAuth().delete(privilegeId + 12);
            throw 'must not reach this line, the id is invalid';
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

    it('deletes the provided privilege', async () => {
        let deletePriv = await new Privilege().withAuth().delete(privilegeId);
        expect(deletePriv.message).to.exist;
    });
});

describe('groups delete', () => {
    it('deletes the specified group', async () => {
        let deleted = await new Group().withAuth().delete(groupID);
        expect(deleted.message).to.equal('Successfully deleted');
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

describe('deleing permission', () => {
    it('should not pass this test and throw an error when the id is invalid upon delete request', async () => {
        try {
            await await new Permission().withAuth().delete(permissionId + 12);
            throw 'must not reach this line because the id does not exist';
        } catch (e) {
            expect(e.message).equals('Permission does not exist');
        }
    });

    it('deletes the specified permission', async () => {
        let deleted = await new Permission().withAuth().delete(permissionId);
        expect(deleted.message).to.equal('Permission deleted successfully');
    });

    it('should pass this test, and return a message saying that the permission has been deleted', async () => {
        try {
            await new Permission().withAuth().delete(permissionId);
            throw 'should now reach this line, the id is deleted';
        } catch (e) {
            expect(e.message).to.exist;
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

describe('deactivate identity', async () => {
    describe('with auth', async () => {
        it('should deactivate identity', async () => {
            let deactivateIdentity = await new Identity().withAuth().deactivateIdentity(identityId);
            expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
        });

        it('should not deactivate already deactivated identity', async () => {
            try {
                await new Identity().withAuth().deactivateIdentity(identityId);
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

describe('deleting principals', () => {
    it('should not pass upon deleting because the header does not have a valid authorization token, and it will throw an error', async () => {
        try {
            await new Principal().delete(principalID);
            throw 'should not reach this line, because the token is not valid';
        } catch (e) {
            expect(e.message).equals('Forbidden');
        }
    });

    it('should return a success message upon valid request of deleting the principal via ID', async () => {
        let deleted = await new Principal().withAuth().delete(principalID);
        expect(deleted.message).to.exist;
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
            let logout = await new Identity().setToken(SUtoken).logout();
            expect(logout).to.be.an('object');
        });

        it('should not logout an already logged out identity', async () => {
            try {
                await new Identity().setToken(SUtoken).logout();
                throw Error('the code should not reach this scope as identity is already logged out');

            } catch (e) {
                expect(e.errorCode).to.equal(3001);
                expect(e).to.exist;
            }
        });
    });
});