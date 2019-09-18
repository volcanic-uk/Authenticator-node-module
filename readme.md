# Authenticator Node Module

This node module is a utility used to facilitate API requests for the AUTH server 

## How to Use:
    1- install the node module to your project by adding the git link to your package.json file into the dependecies field
    2- copy .env.example file to a new .env file on your main project directory, not the module itself
    3- fill in the required information about the server and services you need
    4- run npm i in your project directory from the terminal to install needed dependencies
    5- require the module and call the classes needed after instantiating, example below.

### basic usage
```javascript
const auth = require('auth-node-module/v1');
let login = new auth.Identity().login('username', 'password', ['audience'], 'exp-date');
```

### withAuth
```javascript
const auth = require('auth-node-module/v1');
let login = new auth.withAuth().Identity().login('username', 'password', ['audience'], 'exp-date');
```

### setToken
```javascript
const auth = require('auth-node-module/v1');
let login = new auth.setToken().Identity().login('username', 'password', ['audience'], 'exp-date');
```

### permissions docs

#### create new permission
```javascript
await new Permission().setToken(token).create(name[strnig], description[string], serviceId[number]);

response:{ 
    name: 'n***********************1',
    service_id: 544,
    description: 'this is new permission',
    subject_id: '2',
    updated_at: '2019-09-18T07:46:59.057Z',
    created_at: '2019-09-18T07:46:59.057Z',
    id: 583 
} 
````
#### get a permission by ID
```javascript
//get permission by id
await new Permission().setToken(token).getById(id[number]);

response:{
    id: 583,
    name: 'n***********************1',
    description: 'this is new permission',
    subject_id: 2,
    service_id: 544,
    active: true,
    created_at: '2019-09-18T07:46:59.057Z',
    updated_at: '2019-09-18T07:46:59.057Z' 
}
```
#### get mmutiple permissions
```javascript
await new Permission().setToken(token).getPermissions(query[string], page[number], pageSize[number], sort[string], order[string]);

response: { 
    pagination: [Object], 
    data: [Array] 
}
```
#### update a permission
```javascript
await new Permission().setToken(token).update(id[number], name[string], description[string]);

response:{
    id: 583,
    name: 'n***********************1',
    description: 'updated',
    subject_id: 2,
    service_id: 544,
    active: true,
    created_at: '2019-09-18T07:46:59.057Z',
    updated_at: '2019-09-18T07:46:59.057Z' 
}
```
#### deleting a permission
```javascript
await new Permission().setToken(token).update(id[number]);

response:{
    message: 'deleted successfully'
}
```

### Privileges Docs

#### creating a new privilege
```javascript
await new Privilege().withAuth().create('vrn:{stack}:{dataset}:resourceName/resourceType'[string], permissionId[number], groupId[number], allow[boolean]);

response:{ 
    scope: 'vrn:{stack}:{dataset}:jobs/*',
    permission_id: 1,
    group_id: 1,
    subject_id: '2',
    allow: true,
    updated_at: '2019-09-18T07:47:00.332Z',
    created_at: '2019-09-18T07:47:00.332Z',
    id: 521 
} 
```

#### get a privilege by id
```javascript
await new Privilege().withAuth().getById(id[number]);

response:{ 
    scope: 'vrn:{stack}:{dataset}:jobs/*',
    permission_id: 1,
    group_id: 1,
    subject_id: '2',
    allow: true,
    updated_at: '2019-09-18T07:47:00.332Z',
    created_at: '2019-09-18T07:47:00.332Z',
    id: 521 
} 
```

#### get privileges
```javascript
await new Privilege().withAuth().getPrivileges(query, page, pageSize, sort, order);

response: { 
    pagination: [Object], 
    data: [Array] 
}
```

#### update a privilege
```javascript
await new Privilege().withAuth().update(id[number], scope[string], permissionID[number], groupID[number], allow[boolean]);

response:{ 
    scope: 'vrn:{stack}:{dataset}:jobs/1',
    permission_id: 1,
    group_id: 1,
    subject_id: '2',
    allow: true,
    updated_at: '2019-09-18T07:47:00.332Z',
    created_at: '2019-09-18T07:47:00.332Z',
    id: 521 
} 
```

#### delete a privilege
```javascript
await new Privilege().withAuth().delete(id[number]);

response:{ 
    message: 'Successfully deleted privilege'
} 
```