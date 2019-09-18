# Authenticator Node Module

This utility is used to request multiple functions and services from the authentication server on this repo: https://github.com/volcanic-uk/Authenticator

## Getting started:
1.  Install the node module to your project by adding the git link to your `package.json` file into the dependecies field.
2.  Copy `.env.example` file to a new .env file in your main project directory, not the module itself
3.  Fill in the required information about the server and services you need like the server route, token related info and  such.
4.  Run `npm i` in your project directory from the terminal to install all dependencies.
5.  Require the module and call the functions needed directly from v1, all the functions are structured into categories based on their role.

## Classes within the Authenticator node package:
* Principal
* Identity
* Service
* Permission
* Group
* Privileges
* Roles


## How to use
Methods for this node package documented below are available using an instance of the any of the classes above. For example:
```javascript
   const auth = require('auth-node-module/v1');
   let login = new auth.Identity().login('username', 'password', ['audience'], 'exp-date');
   //=>  {
  token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImE1ZjUzZmEyNWYyZjgyYTM4NDNjNGFmMTFiZDgwMWExIn0.eyJleHAiOjE1NjkwMDUzNTgsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xLzEvMS8yIiwibmJmIjoxNTY4Nzg5MzU4LCJhdWRpZW5jZSI6WyJrcmF0YWthbyJdLCJpYXQiOjE1Njg3ODkzNTgsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AXFEi1ogRN_BENdkdGYorh3Zku5Z0WZWvhkES_6ZkPUs0izbPJWVLcn4v9OUSYiFxcOAaGlAoZyJcL0Q11g11GcZAKdXkqkRmOKGdfHuw4-mqRG8zSscJfK4mvhq1egSkLeS7NmPKaumPnP0BPpfI8JD3dXknkCGB_AA-1p4wRykJKle'
}

```
## Classes
### Identities:
##### login(name, secret, audience, principalId)
###### output
Type : ```Object```

Result :  ``` {token: 'eyJhbGciOiJFUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImE1ZjUzZmEyNWYyZjgyYTM4NDNjNGFmMTFiZDgwMWExIn0.eyJleHAiOjE1NjkwMDUzNTgsInN1YiI6InVzZXI6Ly9zYW5kYm94Ly0xLzEvMS8yIiwibmJmIjoxNTY4Nzg5MzU4LCJhdWRpZW5jZSI6WyJrcmF0YWthbyJdLCJpYXQiOjE1Njg3ODkzNTgsImlzcyI6InZvbGNhbmljX2F1dGhfc2VydmljZV9hcDIifQ.AXFEi1ogRN_BENdkdGYorh3Zku5Z0WZWvhkES_6ZkPUs0izbPJWVLcn4v9OUSYiFxcOAaGlAoZyJcL0Q11g11GcZAKdXkqkRmOKGdfHuw4-mqRG8zSscJfK4mvhq1egSkLeS7NmPKaumPnP0BPpfI8JD3dXknkCGB_AA-1p4wRykJKle'
}```
###### example
```javascript
   const auth = require('auth-node-module/v1');
   let login = new auth.Identity().login('username', 'password', ['audience'], 'exp-date');
```
##### create(name, secret, principalId)
###### output
Type : ```Object```

Result :  ``` {
  name: 'identity-1568792822',
  principal_id: 186,
  secret: 'f945129e13a9de6b0fb35de640a065708656630d',
  updated_at: '2019-09-18T07:47:06.715Z',
  created_at: '2019-09-18T07:47:06.715Z',
  id: 1327,
  status: true
}
}```
###### example
```javascript
   const auth = require('auth-node-module/v1');
   let create = new auth.Identity().create('username', 'secret', 'principalId');
```
##### update(name, id)
###### output
Type : ```Object```

Result :  ``` {
  id: 1332,
  principal_id: 187,
  name: 'updated-name-1568793394',
  last_active_date: null,
  last_used_ip_address: null,
  active: true,
  created_at: '2019-09-18T07:56:37.748Z',
  updated_at: '2019-09-18T07:56:40.735Z',
  status: true
}
```
###### example
```javascript
   const auth = require('auth-node-module/v1');
   let login = new auth.Identity().update('username', 1);
}
```
##### resetSecret(secret, id)
###### output
Type : ```Object```

Result :  ```  { message: 'Secret regenerated successfully', status: true }```
###### example
```javascript
   const auth = require('auth-node-module/v1');
   let resetSecret = new auth.Identity().resetSecret('secret', 1);
}
```
##### deactivateIdentity(id)
###### output
Type : ```Object```

Result :  ```  { message: 'Sucessfully deactivated identity', status: true }```
###### example
```javascript
   const auth = require('auth-node-module/v1');
   let deactiveIdentity = new auth.Identity().deactiveIdentity(1);
}
```
##### generateToken(id,audience = [], expiryDate, singleUse, nbf)
###### output
Type : ```Object```

Result :  ```  { message: 'Sucessfully deactivated identity', status: true }```
###### example
```javascript
   const auth = require('auth-node-module/v1');
   let generateToken = new auth.Identity().generateToken(1, ['*'],1573488000 , false, 1568943952000));
}
```
