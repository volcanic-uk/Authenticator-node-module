#### create new permission
```javascript
await new Permission().setToken(token).create(name[string], description[string], serviceId[number]);

response:{ 
    name: 'n***********************1',
    service_id: 544,
    description: permissions,
    subject_id: '2',
    updated_at: '2019-09-18T07:46:59.057Z',
    created_at: '2019-09-18T07:46:59.057Z',
    id: 583 
} 
````
#### get a permission by ID
```javascript
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
#### get all permissions
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
