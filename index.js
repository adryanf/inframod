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
        '1.Add a unique custom key to your package.json file which will contain, the module registration object',
        'e.g. \\{... myKey: \\{ \\} ...\\}',
        '(can be a sub key as well e.g. myKey.foo.bar)',
        '2.Register each module in this section in this format:',
        '"foo": \\{ "path": "/foo", "provisionCommand": "yarn install && yarn run build", {underline [optional]} "dependsOn": ["bar"]\\}'
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

const f = finder();

const packageJsonPath = f.next().filename;

logger.log('info', 'package.json located here: %s', packageJsonPath);

fs.readFile(packageJsonPath, 'utf8', function (err, data) {
  if (err) throw err;
  
  const keyPath = options['key-path'];
  const packageJson = JSON.parse(data);

  if(!t(packageJson, keyPath).isDefined){
    logger.log('error', 'Invalid package.json property path provided');
    process.exit(1);
  }

  const moduleRegistrar = t(packageJson, keyPath).safeObject;
  let graph = new DepGraph();
  for (const [key, value] of Object.entries(moduleRegistrar)) {
    let moduleId = key;
    let moduleData = value;
    graph.addNode(moduleId, moduleData);
    if(moduleData.dependsOn && value.dependsOn.length){
        let idsOfDependentModules = value.dependsOn;
        for (let i = 0; i < idsOfDependentModules.length; i++) {
            graph.addDependency(moduleId, idsOfDependentModules[i]);
        }
    }
  }
  let orderedModuleBuildIds = graph.overallOrder();
  for (let i = 0; i < orderedModuleBuildIds.length; i++) {
    let moduleId = orderedModuleBuildIds[i];
    let moduleData = graph.getNodeData(moduleId);
    let moduleProvisionCommand = moduleData.provisionCommand;
    let modulePath = path.join(__dirname, moduleData.path);

    logger.log('info', 'Building module: %s, located here: %s', moduleId, modulePath);

    child_process.execSync(moduleProvisionCommand, {
        stdio:[0,1,2],
        cwd: modulePath
    });
  }
  process.exit()
});