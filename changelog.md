# Changelog
All notable changes to Auth module will be documented in this file.

## [1.1.8] - 09-11-2020
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
