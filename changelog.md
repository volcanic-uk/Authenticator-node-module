# Changelog
All notable changes to Auth module will be documented in this file.

## [1.2.4] - 7-1-2021
### Changes
- Fix missing ids filter at getIdentities

## [1.2.3] - 24-11-2020
### Changes
- Fix typing definition for new Identity().generateToken() response and expiry date

## [1.2.2] - 17-11-2020
### Changes
- Add typing definition for the base class method `setToken` and provide a typed response for the new Identity().logout() function

## [1.2.1] - 17-11-2020
### Changes
- Add a new class to support VRN (AUTH-414)
- Add VRN parser (AUTH-414)
- FIX: Identity login argument typing


## [1.1.9] - 16-11-2020
### Added
- Add support to module import and named imports 
- Add types to the following 
 - Principal.create
 - Principal.getByID
 - Principal.getPrincipals
 - Identity.resetSecret
 - Identity.getIdentities
 - Identity.create
 - Identity.deactivateIdentity
 - Identity.activateIdentity
- Declare abstract super class V1Base to support instance functional chaining
- FIX: Principal getPrincipals: change default sort value to "created_at" instead of "id" 

## [1.1.8] - 11-11-2020
### Added
- Add index.d.ts for TS support
- Add "main", "files" and "types" to package.json to reduce package download size via npm install on consumers node_modules

## [1.1.7] - 15-10-2020
### Added
- Attach permissions to group

## [1.1.6] - 02-09-2020
### Added
- Attach token, subject and subject details to express authentication middleware
- Increase the time of caching privileges in authorization class to 5 minutes

## [1.1.5] - 25-08-2020
### Added
- Authentication and Authorization middleware
- Better testing coverage
- Add tag to privileges API 

## [1.1.4] - 29-07-2020
### Added
- update forbidden errors

## [1.1.3] - 29-07-2020
### Changes
- Throw AuthV1Error for forbidden access (AUTH-420)

## [1.1.2] - 03-07-2020
### Changes
- Added privileges by subject
- Added permission_id and group_id filter to privileges API

## [1.1.1] - 12-06-2020
### Changes
- Fix Get Identities for a principal

## [1.1.0] - 12-06-2020
### Changes
- Update the way to call the interface to be object
- Add search by name param to permissions
- Add search by name param to groups
- Add search by scope param to privilege
