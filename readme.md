# Authenticator Node Module

This node module is a utility used to request multiple functions and services from the authentication server on this repo: https://github.com/volcanic-uk/Authenticator

## Services Included:
  - Identities( register, login, logout)
  - Principals( create, read, update, delete)
  - Tokens (validate)
  - in memory caching service
  - tokens decoding and subject claims retrieval 

## How to Use:
    1- install the node module to your project by adding the git link to your package.json file into the dependecies field
    2- copy .env.example file to a new .env file on your main project directory, not the module itself
    3-  fill in the required information about the server and services you need
    4- run npm i in your project directory from the terminal
    5- require the module and call the functions needed directly from v1

for more information about the module and how to use it, checkout the example branch, it has an express server set up with full functionality.