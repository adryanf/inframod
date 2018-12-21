#!/usr/bin/env node

'use strict'

const fs = require('fs');
const DepGraph = require('dependency-graph').DepGraph;
const child_process = require('child_process');
const path = require('path');
const t = require('typy');
const finder = require('find-package-json');
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    format: format.combine(
        format.splat(),
        format.simple()
    ),
    transports: [new transports.Console()]
});

const optionDefinitions = [
    {
        name: 'help',
        description: 'Display this usage guide.',
        alias: 'h',
        type: Boolean
    },
    {
        name: 'key-path',
        alias: 'k',
        type: String,
        description: 'Key path of module registration object within package.json'
    }
  ];
const usageSections = [
    {
      header: 'Module builder',
      content: 'Provisions inter dependent local modules registered in package.json'
    },
    {
      header: 'Registration format',
      content:[
        '1.Add a unique custom key to your package.json file which will contain, the module registration array',
        'e.g. \\{... myKey: \\[ \\] ...\\}',
        '(can be a sub key as well e.g. myKey.foo.bar)',
        '2.Add an entry in this array for each module which will contain the module path and a provisioning command:',
        '"foo": [\\{ "path": "/foo", "provisionCommand": "yarn install && yarn run build"\\}]'
      ],
      raw: true
    },
    {
      header: 'Options',
      optionList: optionDefinitions
    }
  ];

const usage = commandLineUsage(usageSections);

const options = commandLineArgs(optionDefinitions);

if(options.help){
    console.log(usage);
    process.exit();
}

if(!options['key-path']){
    logger.log('error', 'Option: %s is required. See -h for details', 'key-path');
    process.exit(1);
}

const mainFinder = finder();

const packageJsonPath = mainFinder.next().filename;

logger.log('info', 'package.json located here: %s', packageJsonPath);

try {
  const mainPackageJsonData = fs.readFileSync(packageJsonPath, 'utf8')
  
  const keyPath = options['key-path'];
  const packageJson = JSON.parse(mainPackageJsonData);

  if(!t(packageJson, keyPath).isDefined){
    logger.log('error', 'Invalid package.json property path provided');
    process.exit(1);
  }

  const registeredModuleArray = t(packageJson, keyPath).safeObject;
  let graph = new DepGraph();

  let moduleDepsDict = {};

  for (var i = 0, len = registeredModuleArray.length; i < len; i++) {
    let moduleData = registeredModuleArray[i];
    let modulePath = path.join(packageJsonPath, '../' + moduleData.path);
    let moduleFinder = finder(modulePath);

    let modulePackageJsonPath = moduleFinder.next().filename;

    let modulePackageJsonData = fs.readFileSync(modulePackageJsonPath, 'utf8');

    let modulePackageJson = JSON.parse(modulePackageJsonData);

    let moduleName = t(modulePackageJson, 'name').safeObject;

    let moduleDeps = t(modulePackageJson, 'dependencies').safeObject;

    moduleDepsDict[moduleName] = moduleDeps;

    graph.addNode(moduleName, moduleData);
  }

  for (const [moduleName, moduleDeps] of Object.entries(moduleDepsDict)) {
    for(var depModuleName in moduleDeps) {
      if(depModuleName in moduleDepsDict){
        graph.addDependency(moduleName, depModuleName);
        logger.log('info', 'Module: %s depends on: %s', moduleName, depModuleName);
      }
    }
  }

  let orderedModuleBuildNames = graph.overallOrder();
  for (let i = 0; i < orderedModuleBuildNames.length; i++) {
    let moduleName = orderedModuleBuildNames[i];
    let moduleData = graph.getNodeData(moduleName);
    let moduleProvisionCommand = moduleData.provisionCommand;
    let modulePath = path.join(packageJsonPath, '../' + moduleData.path);

    logger.log('info', 'Building module: %s, located here: %s', moduleName, modulePath);

    child_process.execSync(moduleProvisionCommand, {
        stdio:[0,1,2],
        cwd: modulePath
    });
  }
  process.exit()

} catch (err) {
  console.error(err)
}