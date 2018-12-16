# Inframod

## Local node modules registration and provisioning micro-framework

index.js contains the logic used to build the modules registered in package.json

The registration mechanism requires the definition of the following section within package.json

```json
"modules": {
    "foo": {
        "path": "/foo",
        "provisionCommand": "yarn install && yarn run build"
    },
    "bar": {
        "path": "/path/bar",
        "provisionCommand": "yarn install && yarn run build",
        "dependsOn": [
            "foo"
        ]
    }
}
```
A key (foo, bar, etc.) is required to contain the definition of a module withing the "modules" sub-section of package.json.
The required fields for a module definition are

* path - the relative path of the module project (where the package.json for that module is located)
* provisionCommand - the chain of commands to execute in order to build the module project

Optional fields
* dependsOn - array of module keys that the current module is dependning upon and referencing in it's package.json as a file dependency

The index.js script builds a lightweight dependency graph and synchronously iterates it and provisions each module so that it's ready to be referenced by any consumer.

For details about this command run 
```
node index.js -h
```

The node index.js command requires a -k (--key-path) parameter to identify the parent section of the module definition within package.json (for this particular case the key is rvbd - see package.json)