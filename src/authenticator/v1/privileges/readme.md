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
await new Privilege().withAuth().getPrivileges(query[string], page[number], pageSize[number], sor[stringt, order[string]);

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