# Authenticator Node Module

This node module is a utility used to request multiple functions and services from the authentication server on this repo: https://github.com/volcanic-uk/Authenticator

## How to Use:
    1- install the node module to your project by adding the git link to your package.json file into the dependecies field
    2- copy .env.example file to a new .env file in your main project directory, not the module itself
    3- fill in the required information about the server and services you need like the server route, token related info and such
    4- run npm i in your project directory from the terminal to install all dependencies 
    5- require the module and call the functions needed directly from v1, all the functions are structured into categories based on their role.

## Services Included:

  ###Identities:

      - register (name, principalId, password:optional): async function takes 2 main params username and principalId.
      - login (name, secret, tokenExpiryDate:optional, audience:[array]optional) async function that will issue a token with max validity of 1 hour by default, unless it has an expiry time provided which can not exceed 24 hours.
      - tokenLocalValidation (token) this async function will validate a given token locally by using the JWT npm package by returning true or false, just simply pass the token
      - remoteTokenValidaition (token) this async function will validate the token from the auth server and will also return true or false whether the token is valid or not
      - identityLogout/blacklistToken (token) async function which will blacklist the given token, and afterwards that token can never be used anymore

  ###Principal full CRUD

      - createPrincipal (name, datasetId:optional) async function takes 1 main param as a string which represents the name of the principal needed to be created
      - readPrincipal (id) async function takes 1 param which is the id, then the fucntion will fetch the principal from the auth api, and show an object containing all the info related to that consultant
      - updatePrincipal(id, activeStatus) async function which takes 2 main params name, active status either 1 or 0, the function then will update the principal with the provided data 
      - deletePrincipal (id) async function which takes one main param the id of the desired principal to delete, the function then will return a success message 

  ###Permissions full CRUD

      - createPermission (name) async function takes 1 param as a string which represents the name of the permission needed to be created
      - readPermission (id) async function takes 1 param which is the id, then the fucntion will fetch the permission from the auth api, and show an object containing all the info related to that consultant
      - updatePermission(id, name) async function which takes 2 main params name, id the function then will update the principal with the provided data name for example
      - deletePermission (id) async function which takes one main param the id of the desired permission to delete, the function then will return a success message 

  ###Group full CRUD

      - createGroup (name) async function takes 1 param as a string which represents the name of the group needed to be created
      - readGroup (id) async function takes 1 param which is the id, then the fucntion will fetch the group from the auth api, and show an object containing all the info related to that consultant
      - updateGroup(id, name) async function which takes 2 main params name, id and an optional description, the function then will update the Group with the provided data name or description if present
      - deleteGroup (id) async function which takes one main param the id of the desired group to delete, the function then will return a success message 

  ###services full CRUD

      - createGroup (name) async function takes 1 param as a string which represents the name of the principal needed to be created
      - readPrincipal (id) async function takes 1 param which is the id, then the fucntion will fetch the principal from the auth api, and show an object containing all the info related to that consultant
      - updatePrincipal(id, name, description:optional) async function which takes 2 main params name, id and an optional description, the function then will update the principal with the provided data name or description if present
      - deletePrincipal (id) async function which takes one main param the id of the desired principal to delete, the function then will return a success message 

  ### helper function and useful services

    - in memory caching service, on login it will save the token in memory for later usage, to make the user logging and services usage much faster
    - tokens decoding and subject claims retrieval 
    - tokens generating middleware
    

for more information about the module and how to use it, checkout the example branch, it has an express server set up with full functionality.