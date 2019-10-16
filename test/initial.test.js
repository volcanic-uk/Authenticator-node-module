// const chai = require('chai'),
//     chaiAsPromised = require('chai-as-promised'),
//     sorted = require('chai-sorted'),
//     axiosVCR = require('axios-vcr');
// expect = chai.expect;
// chai.use(chaiAsPromised);
// chai.use(sorted);
//
// const Identity = require('../v1/index').Identity,
//     Principal = require('../v1').Principal,
//     Service = require('../v1').Service,
//     Token = require('../v1').Token,
//     Group = require('../v1').Group,
//     Role = require('../v1').Roles,
//     Privilege = require('../v1').Privilege,
//     Permission = require('../v1').Permission;
//
// let currentTimestampSecond = 111,
//     tmpIdentityName = `identity-${currentTimestampSecond}`,
//     tmpIdentityNameWithSecret = `identity-secret`,
//     tmpIdentitySecret = `identity-password`,
//     tempPrincipalName = 'principal-test',
//     tmpGroupName = 'group-test',
//     tmpRoleName = 'role-test',
//     identityCreation,
//     tempDataSetID = currentTimestampSecond,
//     principalID = null,
//     groupID,
//     serviceId = null,
//     roleId = null,
//     roleName = null,
//     privilegeId = null,
//     token;
//
//
// describe('principals tests', () => {
//     // principal creation
//     let principal = new Principal();
//     it('should fail if principal creation function is called without a valid token and it will throw an error', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//             await principal.create(tempPrincipalName, tempDataSetID);
//             axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             throw 'can not create principal with malformed or no token';
//         } catch (e) {
//             expect(e.message).to.be.equal('Forbidden');
//         }
//     });
//
//     it('should be a success when passing valid data, hence it will return an object carrying the created principal data', async () => {
//         axiosVCR.mountCassette('./test/cassettes/principal_create.json');
//         let create = await principal.withAuth().create(tempPrincipalName, tempDataSetID);
//         principalID = create.id;
//         axiosVCR.ejectCassette('./test/cassettes/principal_create.json');
//         expect(create).to.be.instanceOf(Object).and.have.property('dataset_id').that.equals(tempDataSetID);
//     });
//
//     it('should not create a principal and it will throw an error if the name already exist', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/principal_exist.json', true);
//             await principal.withAuth().create(tempPrincipalName, tempDataSetID);
//             axiosVCR.ejectCassette('./test/cassettes/principal_exist.json');
//             throw 'should not reach this line, as the name is duplicated';
//         } catch (e) {
//             expect(e.message).to.exist;
//         }
//     });
//
//     // reading principal
//     it('should not proceed if the principal does not exist upon read request, and it will throw an error', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//             await principal.withAuth().getByID(principalID + 12);
//             axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             throw 'can not retrieve a principal that does not exist';
//         } catch (e) {
//             expect(e.message).equals('Principal does not exist');
//         }
//     });
//
//     it('should fail when requesting a read request when there is no token in the request header, and it will throw an error', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//             await new Principal().getByID(principalID);
//             axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             throw 'should not reach this line, because the read request has no token, or it is malformed';
//         } catch (e) {
//             expect(e.message).to.be.equals('Forbidden');
//         }
//     });
//
//     it('should return an object if the principal is found successfully while passing valid data', async () => {
//         axiosVCR.mountCassette('./test/cassettes/principal_read.json');
//         let read = await principal.withAuth().getByID(1);
//         axiosVCR.ejectCassette('./test/cassettes/principal_read.json');
//         expect(read.id).to.exist;
//     });
//
//     //update principal
//     it('upon principal update, the request should not be completed if there is no authorization token in the request header, and it will throw an error', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//             await new Principal().update(principalID, 'new name', 12);
//             axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             throw 'should not read this line because the update request has no token, or it is malformed';
//         } catch (e) {
//             expect(e.message).to.exist;
//         }
//     });
//
//     it('should not update a principal that does not exist hence an error is thrown', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//             await principal.update(12, 'new name', 12);
//             axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             throw 'should not reach this line because the principal requested does not exist';
//         } catch (e) {
//             expect(e.message).to.exist;
//         }
//     });
//
//     it('should be a success when the principal is updated, thus it will return an object carrying the new attributes for the principal', async () => {
//         axiosVCR.mountCassette('./test/cassettes/principal_update.json');
//         let update = await principal.withAuth().update(1, 'new name', 12);
//         axiosVCR.ejectCassette('./test/cassettes/principal_update.json');
//         expect(update.dataset_id).to.exist;
//     });
//
//     // delete principal
//
//     it('should not pass upon deleting because the header does not have a valid authorization token, and it will throw an error', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//             await new Principal().delete(1);
//             axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             throw 'should not reach this line, because the token is not valid';
//         } catch (e) {
//             expect(e.message).equals('Forbidden');
//         }
//     });
//
//     it('should return a success message upon valid request of deleting the principal via ID', async () => {
//         axiosVCR.mountCassette('./test/cassettes/principal_delete.json');
//         let deleted = await principal.withAuth().delete(2);
//         axiosVCR.ejectCassette('./test/cassettes/principal_delete.json');
//         expect(deleted.message).to.exist;
//     });
// });
//
// describe('identity login tests', () => {
//
//     before(async () => {
//         token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
//         token = token.token;
//     });
//
//     it('login identity', async () => {
//         axiosVCR.mountCassette('./test/cassettes/identity_login.json');
//         let identityLogin = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
//         axiosVCR.ejectCassette('./test/cassettes/identity_login.json');
//         expect(identityLogin).to.be.an('object');
//     });
//
//     it('login identity without principal id', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//             await new Identity().login('volcanic', 'volcanic!123', ['kratakao']);
//             axiosVCR.ejectCassette('./test/cassettes/fail.json');
//         } catch (e) {
//             expect(e.errorCode).to.equal(10001);
//             expect(e).to.be.exist;
//         }
//     });
//
//     it('login identity with invalid credentials (name)', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//             await new Identity().login(`volcanic-invalid ${currentTimestampSecond}`, 'volcanic!123', ['kratakao'], 1);
//             axiosVCR.ejectCassette('./test/cassettes/fail.json');
//         } catch (e) {
//             expect(e.errorCode).to.equal(1001);
//             expect(e).to.be.exist;
//         }
//     });
//
//     it('login identity with invalid credentials (password)', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//             await new Identity().login('volcanic', `volcanic${currentTimestampSecond}`, ['kratakao'], 1);
//             axiosVCR.ejectCassette('./test/cassettes/fail.json');
//         } catch (e) {
//             expect(e.errorCode).to.equal(1001);
//             expect(e).to.be.exist;
//         }
//     });
//
// });
//
//
// describe('identity create tests', () => {
//     describe('with auth', async () => {
//         it('creating a new identity', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_create.json');
//             identityCreation = await new Identity().withAuth().create(tmpIdentityName, null, 1);
//             axiosVCR.ejectCassette('./test/cassettes/identity_create.json');
//             expect(identityCreation).to.be.an('object');
//         });
//
//         it('creating a new identity with secret', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_create_secret.json');
//             let identityCreationWithSecret = await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, 1);
//             axiosVCR.ejectCassette('./test/cassettes/identity_create_secret.json');
//             expect(identityCreationWithSecret).to.be.an('object');
//         });
//
//         it('should not create a duplicate identity record', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, 1);
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 throw Error('The code should not reach this scope as it would be a duplicate identity record');
//             } catch (e) {
//                 expect(e.errorCode).to.equal(1003);
//                 expect(e).to.exist;
//             }
//         });
//
//         it('creating an identity record without principal_id', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().withAuth().create(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 throw Error('The code should not reach this scope as identity cannot be created without principal id');
//             } catch (e) {
//                 expect(e.errorCode).to.equal(10001);
//                 expect(e).to.exist;
//             }
//         });
//
//         it('creating an identity record without name', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().withAuth().create(null, tmpIdentitySecret, null);
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 throw Error('The code should not reach this scope as identity cannot be created without identity name');
//             } catch (e) {
//                 expect(e.errorCode).to.equal(10001);
//                 expect(e).to.exist;
//             }
//         });
//
//         // it('should remote validate a token', async () => {
//         //     let token = await new Identity().withAuth().remoteValidation();
//         //     expect(token).to.equal(true);
//         // });
//     });
//
//
//     describe('without auth and with setToken', async () => {
//         before(async () => {
//             token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
//             token = token.token;
//         });
//         it('creating a new identity', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_create.json');
//             let identityCreation = await new Identity().setToken(token).create(tmpIdentityName + '-withtoken', null, 1);
//             axiosVCR.ejectCassette('./test/cassettes/identity_create.json');
//             expect(identityCreation).to.be.an('object');
//         });
//
//         it('creating a new identity with secret', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_create_secret.json');
//             let identityCreationWithSecret = await new Identity().setToken(token).create(tmpIdentityNameWithSecret + '-withtoken', tmpIdentitySecret, 1);
//             axiosVCR.mountCassette('./test/cassettes/identity_create_secret.json');
//             expect(identityCreationWithSecret).to.be.an('object');
//         });
//
//         it('should not create a duplicate identity record', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().setToken(token).create(tmpIdentityNameWithSecret, tmpIdentitySecret, 1);
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 throw Error('The code should not reach this scope as it would be a duplicate identity record');
//             } catch (e) {
//                 expect(e.errorCode).to.equal(1003);
//                 expect(e).to.exist;
//             }
//         });
//
//         it('creating an identity record without principal_id', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().setToken(token).create(tmpIdentityNameWithSecret, tmpIdentitySecret, null);
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 throw Error('The code should not reach this scope as identity cannot be created without principal id');
//             } catch (e) {
//                 expect(e.errorCode).to.equal(10001);
//                 expect(e).to.exist;
//             }
//         });
//
//         it('creating an identity record without name', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().setToken(token).create(null, tmpIdentitySecret, null);
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 throw Error('The code should not reach this scope as identity cannot be created without identity name');
//             } catch (e) {
//                 expect(e.errorCode).to.equal(10001);
//                 expect(e).to.exist;
//             }
//         });
//
//     });
//     //register with auth
//
// });
//
//
// describe('identity update', async () => {
//
//     describe('with auth', async () => {
//
//         it('should update an identity', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_update.json');
//             let updatedIdentity = await new Identity().withAuth().update(`updated-name-${currentTimestampSecond}`, 2); //check identity creation id here
//             axiosVCR.ejectCassette('./test/cassettes/identity_update.json');
//             expect(updatedIdentity.name).to.equal(`updated-name-${currentTimestampSecond}`);
//         });
//
//         it('it should not update a non existent identity', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().withAuth().update(`updated-name-${currentTimestampSecond}`, `${currentTimestampSecond}`);
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             } catch (e) {
//                 expect(e.errorCode).to.be.equal(1004);
//                 expect(e).to.exist;
//             }
//         });
//     });
//
//
//     describe('without auth and with setToken', async () => {
//         before(async () => {
//             token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
//             token = token.token;
//         });
//         it('should update an identity', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_update_where.json');
//             let updatedIdentity = await new Identity().setToken(token).update(`updated-name-${currentTimestampSecond}-token`, 2);
//             axiosVCR.ejectCassette('./test/cassettes/identity_update_where.json');
//             expect(updatedIdentity.name).to.equal(`updated-name-${currentTimestampSecond}-token`);
//         });
//
//         it('it should not update a non existent identity', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().setToken(token).update(`updated-name-${currentTimestampSecond}`, `${currentTimestampSecond}`);
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             } catch (e) {
//                 expect(e.errorCode).to.be.equal(1004);
//                 expect(e).to.exist;
//             }
//         });
//
//     });
// });
//
//
// describe('reset identity secret', async () => {
//
//     describe('with auth', async () => {
//
//         it('should reset identity secret', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_reset.json');
//             let resetSecret = await new Identity().withAuth().resetSecret(`new-secret-${currentTimestampSecond}`, 2);
//             axiosVCR.ejectCassette('./test/cassettes/identity_reset.json');
//             expect(resetSecret.message).to.equal('Secret regenerated successfully');
//         });
//
//         it('should generate identity secret', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_reset.json');
//             let generateSecret = await new Identity().withAuth().resetSecret(null, 2);
//             axiosVCR.ejectCassette('./test/cassettes/identity_reset.json');
//             expect(generateSecret.message).to.equal('Secret regenerated successfully');
//         });
//
//     });
//
//
//     describe('without auth and with setToken', async () => {
//         before(async () => {
//             token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
//             token = token.token;
//         });
//         it('should reset identity secret', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_reset.json');
//             let resetSecret = await new Identity().setToken(token).resetSecret(`new-secret-${currentTimestampSecond}`, 2);
//             axiosVCR.ejectCassette('./test/cassettes/identity_reset.json');
//             expect(resetSecret.message).to.equal('Secret regenerated successfully');
//         });
//
//         it('should generate identity secret', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_reset.json');
//             let generateSecret = await new Identity().setToken(token).resetSecret(null, 2);
//             axiosVCR.ejectCassette('./test/cassettes/identity_reset.json');
//             expect(generateSecret.message).to.equal('Secret regenerated successfully');
//         });
//
//     });
// });
//
//
// describe('generate token for identity', async () => {
//
//     describe('with auth', async () => {
//         let today = new Date();
//
//         it('should generate token for identity', async () => {
//             axiosVCR.mountCassette('./test/cassettes/token_generate.json');
//             let identity = await new Identity().withAuth().generateToken(2, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
//             axiosVCR.ejectCassette('./test/cassettes/token_generate.json');
//             expect(identity.token).to.exist;
//         });
//
//         it('should generate token for identity when expiry date is in the past', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().withAuth().generateToken(2, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             } catch (e) {
//                 expect(e.errorCode).to.be.equal(1008);
//                 expect(e.message).to.exist;
//             }
//         });
//
//         it('should generate token for identity when nbf is more than 4 weeks', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().withAuth().generateToken(2, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth() + 4, today.getDate()).getTime()));
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             } catch (e) {
//                 expect(e.errorCode).to.be.equal(1009);
//                 expect(e.message).to.exist;
//             }
//         });
//
//     });
//
//
//     describe('without auth and with setToken', async () => {
//         let today = new Date();
//         before(async () => {
//             token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
//             token = token.token;
//         });
//         it('should generate token for identity', async () => {
//             axiosVCR.mountCassette('./test/cassettes/generate_token.json');
//             let identity = await new Identity().setToken(token).generateToken(2, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
//             axiosVCR.ejectCassette('./test/cassettes/generate_token.json');
//             expect(identity.token).to.exist;
//         });
//
//         it('should generate token for identity when expiry date is in the past', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().setToken(token).generateToken(2, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).getTime()));
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             } catch (e) {
//                 expect(e.errorCode).to.be.equal(1008);
//                 expect(e.message).to.exist;
//             }
//         });
//
//         it('should generate token for identity when nbf is more than 4 weeks', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().setToken(token).generateToken(2, ['*'], Math.round(new Date(today.getFullYear(), today.getMonth() + 2, today.getDate()).getTime()), false, Math.round(new Date(today.getFullYear(), today.getMonth() + 4, today.getDate()).getTime()));
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//             } catch (e) {
//                 expect(e.errorCode).to.be.equal(1009);
//                 expect(e.message).to.exist;
//             }
//         });
//
//     });
// });
//
// describe('token validation tests', () => {
//     before(async () => {
//         token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
//         token = token.token;
//     });
//     it('should validate a token remotely and return true', async () => {
//         axiosVCR.mountCassette('./test/cassettes/token_validation.json');
//         let tokenValidationResponse = await new Token().setToken(token).remoteValidation();
//         axiosVCR.ejectCassette('./test/cassettes/token_validation.json');
//         expect(tokenValidationResponse).to.be.true;
//     });
//
//     it('should return false when the token is invalid', async () => {
//         axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//         let tokenValidationResponse = await new Token().setToken(token + '1').remoteValidation();
//         axiosVCR.ejectCassette('./test/cassettes/fail.json');
//         expect(tokenValidationResponse).to.be.false;
//     });
//
//     it('should validate a token locally via the node module and return true', async () => {
//         axiosVCR.mountCassette('./test/cassettes/token_validate_local.json');
//         let tokenValidationResponse = await new Token().validate(token);
//         axiosVCR.ejectCassette('./test/cassettes/token_validate_local.json');
//         expect(tokenValidationResponse).to.be.true;
//     });
//
//     it('should validate a token locally via the node module and return false', async () => {
//         let invalidToken = token.substr(0, token.length - 2);
//         invalidToken += 'XX';
//         let tokenValidationResponse = await new Token().validate(invalidToken);
//         expect(tokenValidationResponse).to.be.false;
//     });
// });
//
// describe('deactivate identity', async () => {
//
//     describe('with auth', async () => {
//
//         it('should deactivate identity', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_deactivation.json');
//             let deactivateIdentity = await new Identity().withAuth().deactivateIdentity(2);
//             axiosVCR.ejectCassette('./test/cassettes/identity_deactivation.json');
//             expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
//         });
//
//         it('should not deactivate already deactivated identity', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().withAuth().deactivateIdentity(2);
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 throw Error('The code should not reach this scope as identity already deactivated');
//             } catch (e) {
//                 expect(e.errorCode).to.equal(1004);
//             }
//
//         });
//
//     });
//
//
//     describe('without auth and with setToken', async () => {
//         let newToken, newIdentity;
//
//         before(async () => {
//             newToken = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
//             newToken = newToken.token;
//             newIdentity = await new Identity().setToken(newToken).create(`new-identity-${currentTimestampSecond}`, 'new-secret', 1);
//         });
//
//         it('should deactivate identity', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_deactivate.json');
//             let deactivateIdentity = await new Identity().setToken(newToken).deactivateIdentity(newIdentity.id);
//             axiosVCR.ejectCassette('./test/cassettes/identity_deactivate.json');
//             expect(deactivateIdentity.message).to.equal('Successfully deactivated identity');
//         });
//
//         it('should not deactivate already deactivated identity', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/identity_deactivate.json', true);
//                 let deactivate = await new Identity().setToken(newToken).deactivateIdentity(newIdentity.id);
//                 console.log('deactivate',deactivate);
//                 axiosVCR.ejectCassette('./test/cassettes/identity_deactivate.json');
//                 throw Error('The code should not reach this scope as identity already deactivated');
//             } catch (e) {
//                 expect(e.errorCode).to.equal(1004);
//             }
//         });
//
//     });
// });
//
//
// describe('identity logout tests', async () => {
//
//     describe('with auth', async () => {
//         it('should logout an identity', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_logout.json');
//             let logout = await new Identity().withAuth().logout();
//             axiosVCR.ejectCassette('./test/cassettes/identity_logout.json');
//             expect(logout).to.be.an('object');
//         });
//     });
//
//
//     describe('without auth and with setToken', async () => {
//         before(async () => {
//             token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
//             token = token.token;
//         });
//         it('should logout an identity', async () => {
//             axiosVCR.mountCassette('./test/cassettes/identity_logout.json');
//             let logout = await new Identity().setToken(token).logout();
//             axiosVCR.ejectCassette('./test/cassettes/identity_logout.json');
//             expect(logout).to.be.an('object');
//         });
//
//         it('should not logout an already logged out identity', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 await new Identity().setToken(token).logout();
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 throw Error('the code should not reach this scope as identity is already logged out');
//
//             } catch (e) {
//                 expect(e.errorCode).to.equal(3001);
//                 expect(e).to.exist;
//             }
//         });
//
//     });
// });
// describe('Service tests', async () => {
//     describe('with auth', async () => {
//         let service = null;
//         let serviceName = null;
//         describe('create service', async () => {
//             it('should create a service', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/service_create.json');
//                 service = await new Service().withAuth().create(`new-service-${currentTimestampSecond}`);
//                 serviceId = service.id;
//                 serviceName = service.name;
//                 axiosVCR.ejectCassette('./test/cassettes/service_create.json');
//             });
//             it('should not create duplicated service', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/create_service_fail.json', true);
//                     service = await new Service().withAuth().create(`new-service-${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/create_service_fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(6001);
//                     expect(e).to.exist;
//                 }
//             });
//             it('should not create service without name', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/create_service_fail.json', true);
//                     service = await new Service().withAuth().create(null);
//                     axiosVCR.ejectCassette('./test/cassettes/create_service_fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(10001);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//         describe('should read created service', async () => {
//             it('should read a service', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/service_read.json');
//                 let serviceRead = await new Service().withAuth().getByID(serviceId);
//                 axiosVCR.ejectCassette('./test/cassettes/service_read.json');
//                 expect(serviceRead.id).to.exist;
//             });
//             it('should not read service with wrong id', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                     await new Service().withAuth().getByID(`${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(6002);
//                     expect(e).to.exist;
//                 }
//
//             });
//             it('should read a service by name', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/service_read.json');
//                 let serviceRead = await new Service().withAuth().getByID(serviceName);
//                 axiosVCR.ejectCassette('./test/cassettes/service_read.json');
//                 expect(serviceRead.id).to.exist;
//             });
//             it('should not read service with non existence name', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                     await new Service().withAuth().getByName(`read-${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(6002);
//                     expect(e).to.exist;
//                 }
//
//             });
//         });
//         describe('should read all services', async () => {
//             it('should read all services in ascending order', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/services_read.json');
//                 let servicesGetAll = await new Service().withAuth().getServices('', '', '', 'id', 'asc');
//                 axiosVCR.ejectCassette('./test/cassettes/services_read.json');
//                 expect(servicesGetAll.data).to.be.ascendingBy('id');
//             });
//             it('should read all services in descending order', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/services_read.json');
//                 let servicesGetAll = await new Service().withAuth().getServices('', '', '', 'id', 'desc');
//                 axiosVCR.ejectCassette('./test/cassettes/services_read.json');
//                 expect(servicesGetAll.data).to.be.descendingBy('id');
//             });
//
//         });
//         describe('update a service', async () => {
//             it('should update a service', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/service_update.json');
//                 let updateService = await new Service().withAuth().update(2, `service-name-update-${currentTimestampSecond}`);
//                 axiosVCR.ejectCassette('./test/cassettes/service_update.json');
//                 expect(updateService.name).to.equal(`service-name-update-${currentTimestampSecond}`);
//             });
//             it('should not update a non-exist service', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                     await new Service().withAuth().update(`${currentTimestampSecond}`, `service-name-update-${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(6002);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//         describe('delete a service', async () => {
//             it('should delete a service', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/service_deletion.json');
//                 let deleteService = await new Service().withAuth().delete(2);
//                 axiosVCR.ejectCassette('./test/cassettes/service_deletion.json');
//                 expect(deleteService.message).to.exist;
//             });
//             it('should not delete a service', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                     await new Service().withAuth().delete(`${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(6002);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//     });
//     describe('without auth and with setToken', async () => {
//         let serviceId = null;
//         let service = null;
//         let serviceName = null;
//         before(async () => {
//             token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
//             token = token.token;
//         });
//         describe('create service', async () => {
//             it('should create a service', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/service_creation.json');
//                 service = await new Service().setToken(token).create(`new-service-${currentTimestampSecond}-withoutauth`);
//                 serviceId = service.id;
//                 serviceName = service.name;
//                 axiosVCR.ejectCassette('./test/cassettes/service_creation.json');
//             });
//             it('should not create duplicated service', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                     service = await new Service().setToken(token).create(`new-service-${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(6001);
//                     expect(e).to.exist;
//                 }
//             });
//             it('should not create service without name', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                     service = await new Service().setToken(token).create(null);
//                     axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(10001);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//         describe('should read created service', async () => {
//             it('should read a service', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                 let serviceRead = await new Service().setToken(token).getByID(serviceId);
//                 axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 expect(serviceRead.id).to.exist;
//             });
//             it('should not read service with wrong id', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                     await new Service().setToken(token).getByID(`${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(6002);
//                     expect(e).to.exist;
//                 }
//
//             });
//             it('should read a service by name', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/service_read.json');
//                 let serviceRead = await new Service().setToken(token).getByName(serviceName);
//                 axiosVCR.ejectCassette('./test/cassettes/service_read.json');
//                 expect(serviceRead.id).to.exist;
//             });
//             it('should not read service with non existence name', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                     await new Service().setToken(token).getByName(`read-${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(6002);
//                     expect(e).to.exist;
//                 }
//
//             });
//         });
//         describe('should read all services', async () => {
//             it('should read all services in ascending order', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/services_read.json');
//                 let servicesGetAll = await new Service().setToken(token).getServices('', '', '', 'id', 'asc');
//                 axiosVCR.ejectCassette('./test/cassettes/services_read.json');
//                 expect(servicesGetAll.data).to.be.ascendingBy('id');
//             });
//             it('should read all services in descending order', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/services_read.json');
//                 let servicesGetAll = await new Service().setToken(token).getServices('', '', '', 'id', 'desc');
//                 axiosVCR.ejectCassette('./test/cassettes/services_read.json');
//                 expect(servicesGetAll.data).to.be.descendingBy('id');
//             });
//         });
//         describe('update a service', async () => {
//             it('should update a service', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/service_update.json');
//                 let updateService = await new Service().setToken(token).update(serviceId, `service-name-update-without-auth${currentTimestampSecond}`);
//                 axiosVCR.ejectCassette('./test/cassettes/service_update.json');
//                 expect(updateService.name).to.equal(`service-name-update-without-auth${currentTimestampSecond}`);
//             });
//             it('should not update a non-exist service', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                     await new Service().setToken(token).update(`${currentTimestampSecond}`, `service-name-update-without-auth${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(6002);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//         describe('delete a service', async () => {
//             it('should delete a service', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/service_delete.json');
//                 let deleteService = await new Service().setToken(token).delete(serviceId);
//                 axiosVCR.ejectCassette('./test/cassettes/service_delete.json');
//                 expect(deleteService.message).to.exist;
//             });
//             it('should not delete a service', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                     await new Service().setToken(token).delete(`${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(6002);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//     });
// });
//
// describe('Permissions tests', async () => {
//     describe('with auth', async () => {
//         let permissionId = null;
//         let permission = null;
//         describe('create permission', async () => {
//             it('should create a permission', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permission_create.json');
//                 permission = await new Permission().withAuth().create(`new-permission-${currentTimestampSecond}`, 'this is new permission', 2);
//                 permissionId = permission.id;
//                 axiosVCR.ejectCassette('./test/cassettes/permission_create.json');
//             });
//             it('should not create duplicated permission', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail-permission-create.json', true);
//                     permission = await new Permission().withAuth().create(`new-permission-${currentTimestampSecond}`, 'description', 2);
//                     axiosVCR.ejectCassette('./test/cassettes/fail-permission-create.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(5003);
//                     expect(e).to.exist;
//                 }
//             });
//             it('should not create permission without name', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail-permission-create-without-name.json', true);
//                     permission = await new Permission().withAuth().create(null);
//                     axiosVCR.ejectCassette('./test/cassettes/fail-permission-create-without-name.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(10001);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//         describe('should read created permission', async () => {
//             it('should read a permission', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permission_read.json');
//                 let permissionRead = await new Permission().withAuth().getByID(1);
//                 axiosVCR.ejectCassette('./test/cassettes/permission_read.json');
//                 expect(permissionRead.id).to.exist;
//             });
//             it('should not read permission with wrong id', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail-permission-read.json', true);
//                     await new Permission().withAuth().getByID(`${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail-permission-read.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(5002);
//                     expect(e).to.exist;
//                 }
//
//             });
//         });
//         describe('should read all permissions', async () => {
//             it('should read all permissions in ascending order', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permissions_read.json');
//                 let permissionsGetAll = await new Permission().withAuth().getPermissions('', '', '', 'id', 'asc');
//                 axiosVCR.ejectCassette('./test/cassettes/permissions_read.json');
//                 expect(permissionsGetAll.data).to.be.ascendingBy('id');
//             });
//             it('should read all permissions in descending order', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permissions_read.json');
//                 let permissionsGetAll = await new Permission().withAuth().getPermissions('', '', '', 'id', 'desc');
//                 axiosVCR.ejectCassette('./test/cassettes/permissions_read.json');
//                 expect(permissionsGetAll.data).to.be.descendingBy('id');
//             });
//         });
//         describe('update a permission', async () => {
//             it('should update a permission', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permissions_update.json');
//                 let updatepermission = await new Permission().withAuth().update(2, `permission-name-update-${currentTimestampSecond}`);
//                 axiosVCR.ejectCassette('./test/cassettes/permissions_update.json');
//                 expect(updatepermission.name).to.equal(`permission-name-update-${currentTimestampSecond}`);
//             });
//             it('should not update a non-exist permission', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail-permission-update.json', true);
//                     await new Permission().withAuth().update(`${currentTimestampSecond}`, `permission-name-update-${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail-permission-update.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(5002);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//         describe('delete a permission', async () => {
//             it('should delete a permission', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permissions_delete.json');
//                 let deletepermission = await new Permission().withAuth().delete(2);
//                 axiosVCR.ejectCassette('./test/cassettes/permissions_delete.json');
//                 expect(deletepermission.message).to.exist;
//             });
//             it('should not delete a permission', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail-permission-delete.json', true);
//                     await new Permission().withAuth().delete(`${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail-permission-delete.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(5002);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//     });
//     describe('without auth and with setToken', async () => {
//         let permissionId = null;
//         let permission = null;
//         before(async () => {
//             token = await new Identity().login('volcanic', 'volcanic!123', ['kratakao'], 1);
//             token = token.token;
//         });
//         describe('create permission', async () => {
//             it('should create a permission', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permissions_create.json');
//                 permission = await new Permission().setToken(token).create(`new-permission-${currentTimestampSecond}-without-auth`, 'this is a new permission', 2);
//                 permissionId = permission.id;
//                 axiosVCR.ejectCassette('./test/cassettes/permissions_create.json');
//
//             });
//             it('should not create duplicated permission', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail.json', true);
//                     permission = await new Permission().setToken(token).create(`new-permission-${currentTimestampSecond}`, 'description', 2);
//                     axiosVCR.ejectCassette('./test/cassettes/fail.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(5003);
//                     expect(e).to.exist;
//                 }
//             });
//             it('should not create permission without name', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail-permission-create-without-name.json', true);
//                     permission = await new Permission().setToken(token).create(null);
//                     axiosVCR.ejectCassette('./test/cassettes/fail-permission-create-without-name.json');
//
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(10001);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//         describe('should read created permission', async () => {
//             it('should read a permission', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permission_read.json');
//                 let permissionRead = await new Permission().setToken(token).getByID(2);
//                 axiosVCR.ejectCassette('./test/cassettes/permission_read.json');
//                 expect(permissionRead.id).to.exist;
//             });
//             it('should not read permission with wrong id', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail-permission-read.json', true);
//                     await new Permission().setToken(token).getByID(`${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail-permission-read.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(5002);
//                     expect(e).to.exist;
//                 }
//
//             });
//         });
//         describe('should read all permissions', async () => {
//             it('should read all permissions in ascending order', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permissions_read.json');
//                 let permissionsGetAll = await new Permission().setToken(token).getPermissions('', '', '', 'id', 'asc');
//                 axiosVCR.ejectCassette('./test/cassettes/permissions_read.json');
//                 expect(permissionsGetAll.data).to.be.ascendingBy('id');
//             });
//             it('should read all permissions in descending order', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permissions_read.json');
//                 let permissionsGetAll = await new Permission().setToken(token).getPermissions('', '', '', 'id', 'desc');
//                 axiosVCR.ejectCassette('./test/cassettes/permissions_read.json');
//                 expect(permissionsGetAll.data).to.be.descendingBy('id');
//             });
//         });
//         describe('update a permission', async () => {
//             it('should update a permission', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permission_update.json');
//                 let updatepermission = await new Permission().setToken(token).update(2, `permission-name-update-without-auth${currentTimestampSecond}`);
//                 axiosVCR.ejectCassette('./test/cassettes/permission_update.json');
//                 expect(updatepermission.name).to.equal(`permission-name-update-without-auth${currentTimestampSecond}`);
//             });
//             it('should not update a non-exist permission', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail-update-permission.json', true);
//                     await new Permission().setToken(token).update(`${currentTimestampSecond}`, `permission-name-update-without-auth${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail-update-permission.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(5002);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//         describe('delete a permission', async () => {
//             it('should delete a permission', async () => {
//                 axiosVCR.mountCassette('./test/cassettes/permission_delete.json');
//                 let deletepermission = await new Permission().setToken(token).delete(3);
//                 axiosVCR.ejectCassette('./test/cassettes/permission_delete.json');
//                 expect(deletepermission.message).to.exist;
//             });
//             it('should not delete a permission', async () => {
//                 try {
//                     axiosVCR.mountCassette('./test/cassettes/fail-permission-deletion.json', true);
//                     await new Permission().setToken(token).delete(`${currentTimestampSecond}`);
//                     axiosVCR.ejectCassette('./test/cassettes/fail-permission-deletion.json');
//                 } catch (e) {
//                     expect(e.errorCode).to.equal(5002);
//                     expect(e).to.exist;
//                 }
//             });
//         });
//     });
// });
//
// describe('groups test', () => {
//
//     describe('with set token', () => {
//         it('will fail with an invalid token', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail-group-token.json', true);
//                 await new Group().setToken('asdasd').create(tmpGroupName);
//                 axiosVCR.ejectCassette('./test/cassettes/fail-group-token.json');
//                 throw 'should not reach this line because the token is not valid';
//             } catch (e) {
//                 expect(e.message).to.be.equal('Forbidden');
//             }
//         });
//     });
//
//     it('should create a new group', async () => {
//         axiosVCR.mountCassette('./test/cassettes/group-create.json');
//         let create = await new Group().withAuth().create(tmpGroupName, [], 'test group for module');
//         groupID = create.id;
//         axiosVCR.ejectCassette('./test/cassettes/group-create.json');
//         expect(create).to.be.instanceOf(Object).and.have.property('id');
//     });
//
//     it('fails upon duplicate entry', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-group-duplicate.json', true);
//             await new Group().withAuth().create(tmpGroupName, [], 'test group for module');
//             axiosVCR.ejectCassette('./test/cassettes/fail-group-duplicate.json');
//             throw 'should not reach this line because the group name already exists';
//         } catch (e) {
//             expect(e.message).equals(`Duplicate entry ${tmpGroupName}`);
//         }
//     });
//
//     // read a group by id
//     it('should ge the specified group', async () => {
//         axiosVCR.mountCassette('./test/cassettes/group-read.json');
//         let read = await new Group().withAuth().getById(groupID);
//         axiosVCR.ejectCassette('./test/cassettes/group-read.json');
//         expect(read).to.be.instanceOf(Object).and.have.property('id');
//     });
//
//     it('fails upon fetching a non existing id', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-group-read.json', true);
//             await new Group().withAuth().getById(groupID + 12);
//             axiosVCR.ejectCassette('./test/cassettes/fail-group-read.json');
//             throw 'should not read this line because the id is not valid';
//         } catch (e) {
//             expect(e.message).equals('Group does not exist');
//         }
//     });
//
//     // read a group by name
//     it('gets a group by its name', async () => {
//         axiosVCR.mountCassette('./test/cassettes/group-read.json');
//         let read = await new Group().withAuth().getByName(tmpGroupName);
//         axiosVCR.ejectCassette('./test/cassettes/group-read.json');
//         expect(read).to.be.instanceOf(Object).and.have.property('id');
//     });
//
//     it('fails when the name doesnt exist', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-group-read.json', true);
//             await new Group().withAuth().getByName(tmpGroupName + 12);
//             axiosVCR.ejectCassette('./test/cassettes/fail-group-read.json');
//             throw 'should not read this line because the id is not valid';
//         } catch (e) {
//             expect(e.message).equals('Group does not exist');
//         }
//     });
//
//     // group update
//
//     it('it updates the specified group info', async () => {
//         axiosVCR.mountCassette('./test/cassettes/group-update.json');
//         let update = await new Group().withAuth().update(groupID, tmpGroupName + 'updated');
//         axiosVCR.ejectCassette('./test/cassettes/group-update.json');
//         expect(update).to.be.instanceOf(Object).and.have.property('id');
//     });
//
//     it('fails when passing an invalid id', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-group-read.json', true);
//             await new Group().withAuth().update(groupID + 12, tmpGroupName + 'updated');
//             axiosVCR.ejectCassette('./test/cassettes/fail-group-read.json');
//             throw 'should not read this line, because the id is not valid';
//         } catch (e) {
//             expect(e.message).equals('Permission group does not exist');
//         }
//     });
//
//     //delete group
//
//     it('deletes the specified id', async () => {
//         axiosVCR.mountCassette('./test/cassettes/group-update.json');
//         let deleted = await new Group().withAuth().delete(groupID);
//         axiosVCR.ejectCassette('./test/cassettes/group-update.json');
//         expect(deleted).to.be.instanceOf(Object).and.have.property('message').that.equals('Successfully deleted');
//     });
//
//     it('fails when the id is already deleted', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-group-delete.json', true);
//             await new Group().withAuth().delete(groupID);
//             axiosVCR.ejectCassette('./test/cassettes/fail-group-delete.json');
//             throw 'should not read this line because the group is deleted already';
//         } catch (e) {
//             expect(e.message).to.exist;
//         }
//     });
//
//     it('fails when the id does not exist', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-group-delete.json', true);
//             await new Group().withAuth().delete(groupID + 12);
//             axiosVCR.ejectCassette('./test/cassettes/fail-group-delete.json');
//             throw 'should not read this line because the group does not exist';
//         } catch (e) {
//             expect(e.message).equals('Group does not exist');
//         }
//     });
// });
//
// describe('privileges tests', () => {
//     // create privileges
//     describe('with setToken', () => {
//         it('fails when the token is invalid', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail-privilege-token.json', true);
//                 await new Privilege().setToken('sometoken').create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
//                 axiosVCR.ejectCassette('./test/cassettes/fail-privilege-token.json');
//
//                 throw 'must not reach this line because the token is invalid';
//             } catch (e) {
//                 expect(e.message).to.equal('Forbidden');
//             }
//         });
//     });
//
//     it('creates a new privilege', async () => {
//         axiosVCR.mountCassette('./test/cassettes/privilege-create.json');
//         let create = await new Privilege().withAuth().create('vrn:{stack}:{dataset}:jobs/*', 1, 1, true);
//         privilegeId = create.id;
//         axiosVCR.ejectCassette('./test/cassettes/privilege-create.json');
//         expect(create).to.be.an.instanceOf(Object).and.have.property('group_id');
//     });
//
//     // read privilege
//
//     it('gets the new privilege', async () => {
//         axiosVCR.mountCassette('./test/cassettes/privilege-get.json');
//         let read = await new Privilege().withAuth().getById(privilegeId);
//         axiosVCR.ejectCassette('./test/cassettes/privilege-get.json');
//         expect(read).to.be.an.instanceOf(Object).and.have.property('group_id');
//
//     });
//
//     it('fails with non existing id', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-privilege-token.json', true);
//             await new Privilege().withAuth().getById(privilegeId + 12);
//             axiosVCR.ejectCassette('./test/cassettes/fail-privilege-token.json');
//             throw 'should not reach this line because privilege does not exist';
//         } catch (e) {
//             expect(e.message).to.equal('privilege does not exist');
//         }
//     });
//
//     // update privilege
//
//     it('fails updating a non existing ID', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-privilege-update-fail.json', true);
//             await new Privilege().withAuth().update(privilegeId + 12, 'vrn:{stack}:{dataset}:jobs/*', 1, 1);
//             axiosVCR.ejectCassette('./test/cassettes/fail-privilege-update-fail.json');
//             throw 'should not reach this line, because the id doesnt exist';
//         } catch (e) {
//             expect(e.message).to.exist;
//         }
//     });
//
//     it('updates the specified privilege', async () => {
//         axiosVCR.mountCassette('./test/cassettes/privilege-update.json');
//         let update = await new Privilege().withAuth().update(privilegeId, 'vrn:{stack}:{dataset}:jobs/*', 1, 1);
//         axiosVCR.ejectCassette('./test/cassettes/privilege-update.json');
//         expect(update).to.be.an.instanceOf(Object).and.have.property('group_id');
//     });
//
//     // delete privilege
//
//     it('fails deleting a non existing id', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-privilege-update-fail.json', true);
//             await new Privilege().withAuth().delete(privilegeId + 12);
//             axiosVCR.ejectCassette('./test/cassettes/fail-privilege-update-fail.json');
//             throw 'must not reach this line, the id is invalid';
//         } catch (e) {
//             expect(e.message).to.exist;
//         }
//     });
//
//     it('deletes the provided privilege', async () => {
//         axiosVCR.mountCassette('./test/cassettes/privilege-delete.json');
//         let deletePriv = await new Privilege().withAuth().delete(privilegeId);
//         axiosVCR.ejectCassette('./test/cassettes/privilege-delete.json');
//         expect(deletePriv.message).to.exist;
//     });
// });
//
// describe('roles api tests', () => {
//     describe('with setToken', () => {
//         it('fails on malformed token', async () => {
//             try {
//                 axiosVCR.mountCassette('./test/cassettes/fail-role-token.json', true);
//                 await new Role().setToken('some token').create(tmpRoleName, 2, [1, 2]);
//                 axiosVCR.ejectCassette('./test/cassettes/fail-role-token.json');
//                 throw 'it will not pass because the token is invalid';
//             } catch (e) {
//                 expect(e.message).to.exist;
//             }
//         });
//     });
//
//     it('creates a new role', async () => {
//         axiosVCR.mountCassette('./test/cassettes/role-create.json');
//         let create = await new Role().withAuth().create(tmpRoleName, 2, [1, 2]);
//         roleId = create.id;
//         roleName = create.name;
//         axiosVCR.ejectCassette('./test/cassettes/role-create.json');
//         expect(create).to.be.instanceOf(Object).and.has.property('id');
//     });
//
//     it('fails when privileges are not an array', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-privilege-array.json', true);
//             await new Role().withAuth().create(tmpRoleName, 2, 1);
//             axiosVCR.ejectCassette('./test/cassettes/fail-privilege-array.json');
//             throw 'should not reach this line, privileges are not an array';
//         } catch (e) {
//             expect(e.message).to.exist;
//         }
//
//     });
//
//     // Get role by id API
//     it('should return the right role', async () => {
//         axiosVCR.mountCassette('./test/cassettes/role-get.json');
//         let read = await new Role().withAuth().getById(roleId);
//         axiosVCR.ejectCassette('./test/cassettes/role-get.json');
//         expect(read).to.be.instanceOf(Object).and.has.property('id');
//     });
//
//     it('will fail because the requested id is not available', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-role-id.json', true);
//             await new Role().withAuth().getById(roleId + 12);
//             axiosVCR.ejectCassette('./test/cassettes/fail-role-id.json');
//             throw 'it will not pass because the name does not exist';
//         } catch (e) {
//             expect(e.message).to.exist;
//         }
//     });
//
//     it('gets the right role by its name', async () => {
//         axiosVCR.mountCassette('./test/cassettes/role-get-name.json');
//         let read = await new Role().withAuth().getByName(roleName);
//         axiosVCR.ejectCassette('./test/cassettes/role-get-name.json');
//         expect(read).to.be.instanceOf(Object).and.has.property('id');
//     });
//
//
//     // get all roles
//
//     it('gets the desired token', async () => {
//         axiosVCR.mountCassette('./test/cassettes/role-get-token.json');
//         let read = await new Role().withAuth().getRoles(null, 1, 15, 'id', 'asc');
//         axiosVCR.ejectCassette('./test/cassettes/role-get-token.json');
//         expect(read.data).to.be.an('array');
//     });
//
//     // update roles api
//
//     it('updates the requested role', async () => {
//         console.log('requested role', roleId);
//         axiosVCR.mountCassette('./test/cassettes/role-update.json');
//         let update = await new Role().withAuth().update(4, `${tmpRoleName}-t`, 2, [1, 2]);
//         axiosVCR.ejectCassette('./test/cassettes/role-update.json');
//         expect(update).to.instanceOf(Object).and.has.property('id');
//     });
//
//     it('fails when getting a non-existing role', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-role-id-update.json', true);
//             await new Role().withAuth().update(roleId + 12, tmpRoleName + 'update', 2, [1, 2]);
//             axiosVCR.ejectCassette('./test/cassettes/fail-role-id-update.json');
//             throw 'should not reach this line, for the id does not exist';
//         } catch (e) {
//             expect(e.message).to.exist;
//         }
//     });
//
//     // delete roles API
//
//     it('deletes the required role', async () => {
//         axiosVCR.mountCassette('./test/cassettes/role-delete.json');
//         let deleteIt = await new Role().withAuth().delete(roleId);
//         axiosVCR.ejectCassette('./test/cassettes/role-delete.json');
//         expect(deleteIt.message).to.exist;
//     });
//
//     it('fails deleting an already deleted role', async () => {
//         try {
//
//         } catch (e) {
//             axiosVCR.mountCassette('./test/cassettes/fail-role-id-delete.json', true);
//             await new Role().withAuth().delete(roleId);
//             axiosVCR.ejectCassette('./test/cassettes/fail-role-id-delete.json');
//             throw 'should not reach this line because the id is gone';
//             expect(e.message).to.exist;
//         }
//     });
//
//     it('fails deleting a non existing role', async () => {
//         try {
//             axiosVCR.mountCassette('./test/cassettes/fail-role-id-delete.json', true);
//             await new Role().withAuth().delete(roleId + 123132);
//             axiosVCR.ejectCassette('./test/cassettes/fail-role-id-delete.json');
//             throw 'should not reach this line because the id is not valid';
//         } catch (e) {
//             expect(e.message).to.exist;
//         }
//     });
//
// });