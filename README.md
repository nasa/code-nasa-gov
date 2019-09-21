# CODE.NASA.GOV

[![Build Status](https://travis-ci.org/nasa/code-nasa-gov.svg?branch=master)](https://travis-ci.org/nasa/code-nasa-gov)

Catalog of Open Source Software from NASA. Built using [Polymer](https://www.polymer-project.org).

## Do You have a Open-Source Code Project For This Site?

#### Instructions
Instructions for releasing a NASA open-source project can be found on <a href="https://code.nasa.gov/#/guide">https://code.nasa.gov/#/guide</a>

#### Code.json vs Category.json
Newly approved code projects for release are added to code.json. 

All federal agencies are mandated to have a code.json that is then harvested by the General Services Adminstration (GSA) and aggregated into code.gov. 

Code.json is reformatted by a script run by NASA's open-innovation team into <a href="https://raw.githubusercontent.com/nasa/code-nasa-gov/master/data/catalog.json">category.json</a>. Category.json has some attributes not in code.json and is used to build the project page on code.nasa.gov.

You can add your approved open-source NASA project to <a href="https://raw.githubusercontent.com/nasa/Open-Source-Catalog/master/code.json"><b>code.json</b></a>, <a href="https://github.com/nasa/Open-Source-Catalog">here</a>.

Additionally, at this time, only category.json has the A.I.-generated keyword tags in addition to the human-generated tags. This may change in the future. 

#### Why code.json is bigger then category.json
Some of the code projects in code.json have open-source liceneses. Other projects in code.json have government-source only licenses, meaning sharing is constrainted to government agencies. All of the code projects listed in category.json have open-source licenses. 

## Running The Code In This Repository

### Setup

test

### Prerequisites

Install bower and [polymer-cli](https://github.com/Polymer/polymer-cli):

    npm install -g bower polymer-cli

Check that you are using Node v8+

    node -v
    
### Install dependencies

    bower i

### Start the development server

This command serves the app at `http://localhost:8080` and provides basic URL
routing for the app:

    polymer serve --open


### Build

This command performs HTML, CSS, and JS minification on the application
dependencies, and generates a service-worker.js file with code to pre-cache the
dependencies based on the entrypoint and fragments specified in `polymer.json`.
The minified files are output to the `build/unbundled` folder, and are suitable
for serving from a HTTP/2+Push compatible server.

In addition the command also creates a fallback `build/bundled` folder,
generated using fragment bundling, suitable for serving from non
H2/push-compatible servers or to clients that do not support H2/Push.

    polymer build

### Preview the build

This command serves the minified version of the app at `http://localhost:8080`
in an unbundled state, as it would be served by a push-compatible server:

    polymer serve build/unbundled

This command serves the minified version of the app at `http://localhost:8080`
generated using fragment bundling:

    polymer serve build/bundled
    
### Deploying

When deploying to a static web server (with no HTTP/2+Push), be sure to copy only
the files from `build/bundled` directory (**NOT** the project directory) which
contains a functional service worker and minified files. Put them in a top level part of the directory, not within another build/bundled directory within the production directory.

### Adding a new view

You can extend the app by adding more views that will be demand-loaded
e.g. based on the route, or to progressively render non-critical sections
of the application.  Each new demand-loaded fragment should be added to the
list of `fragments` in the included `polymer.json` file.  This will ensure
those components and their dependencies are added to the list of pre-cached
components (and will have bundles created in the fallback `bundled` build).
