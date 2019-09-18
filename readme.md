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