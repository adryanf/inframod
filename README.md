# inframod

Provisions local interdependent node modules referenced as file dependencies so you don't have to do this manually for each one.
Removes the need for packages to be published to npm or a local npm repo.
Useful when you want to develop modular applications which rely on shared or common infrastructure local modules without having them deployed on npm.

## Installation

The module is released in the public npm registry and can be installed by
running:

```
npm install --save inframod
```

## Usage

Module registration requires the definition of the following section within package.json containing the module registration array

```json
"modules": [
    {
        "path": "/foo",
        "provisionCommand": "yarn install && yarn run build"
    },
    {
        "path": "/bar/bar",
        "provisionCommand": "yarn install && yarn run build"
    }
]
```

The required fields for a module definition are

* path - the relative path of the module project (where the package.json for that module is located)
* provisionCommand - the chain of commands to execute in order to build the module project

The provision-modules command builds a lightweight dependency graph and synchronously iterates it and provisions each module so that it's ready to be referenced by any consumer.

```
provision-modules --key-path modules
```

For details about this command run 
```
provision-modules -h
```

## Example

The [example](example) folder contains a use case which involves the creation of a base docker image containing the infrastructure modules referenced by a modular app.