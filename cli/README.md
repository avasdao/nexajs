# NexaJS CLI

https://docs.nexajs.org/guide/cli.html

A complete guide to the JavaScript NEXA library for Node.js and browsers.

# Table of contents

- [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Building the workspace](#building-the-workspace)


## Introduction

_TBD_

### Prerequisites

_TBD_

### Requirements

_TBD_


## Getting Started

If you running Linux, you can install this command locally by running `sudo yarn link` from within the `cli` folder.

This will allow you to run `nexa [COMMAND]` from anywhere on the system.


# Usage
<!-- usage -->
```sh-session
$ npm install -g nexajs-cli
$ nexajs-cli COMMAND
running command...
$ nexajs-cli (--version)
nexajs-cli/0.0.0 linux-x64 node-v14.17.0
$ nexajs-cli --help [COMMAND]
USAGE
  $ nexajs-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nexajs-cli hello PERSON`](#nexajs-cli-hello-person)
* [`nexajs-cli hello world`](#nexajs-cli-hello-world)
* [`nexajs-cli help [COMMAND]`](#nexajs-cli-help-command)
* [`nexajs-cli plugins`](#nexajs-cli-plugins)
* [`nexajs-cli plugins:install PLUGIN...`](#nexajs-cli-pluginsinstall-plugin)
* [`nexajs-cli plugins:inspect PLUGIN...`](#nexajs-cli-pluginsinspect-plugin)
* [`nexajs-cli plugins:install PLUGIN...`](#nexajs-cli-pluginsinstall-plugin-1)
* [`nexajs-cli plugins:link PLUGIN`](#nexajs-cli-pluginslink-plugin)
* [`nexajs-cli plugins:uninstall PLUGIN...`](#nexajs-cli-pluginsuninstall-plugin)
* [`nexajs-cli plugins:uninstall PLUGIN...`](#nexajs-cli-pluginsuninstall-plugin-1)
* [`nexajs-cli plugins:uninstall PLUGIN...`](#nexajs-cli-pluginsuninstall-plugin-2)
* [`nexajs-cli plugins update`](#nexajs-cli-plugins-update)

## `nexajs-cli hello PERSON`

Say hello

```
USAGE
  $ nexajs-cli hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/modenero/hello-world/blob/v0.0.0/dist/commands/hello/index.ts)_

## `nexajs-cli hello world`

Say hello world

```
USAGE
  $ nexajs-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `nexajs-cli help [COMMAND]`

Display help for nexajs-cli.

```
USAGE
  $ nexajs-cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for nexajs-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `nexajs-cli plugins`

List installed plugins.

```
USAGE
  $ nexajs-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ nexajs-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `nexajs-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ nexajs-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ nexajs-cli plugins add

EXAMPLES
  $ nexajs-cli plugins:install myplugin

  $ nexajs-cli plugins:install https://github.com/someuser/someplugin

  $ nexajs-cli plugins:install someuser/someplugin
```

## `nexajs-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ nexajs-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ nexajs-cli plugins:inspect myplugin
```

## `nexajs-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ nexajs-cli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ nexajs-cli plugins add

EXAMPLES
  $ nexajs-cli plugins:install myplugin

  $ nexajs-cli plugins:install https://github.com/someuser/someplugin

  $ nexajs-cli plugins:install someuser/someplugin
```

## `nexajs-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ nexajs-cli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ nexajs-cli plugins:link myplugin
```

## `nexajs-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nexajs-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nexajs-cli plugins unlink
  $ nexajs-cli plugins remove
```

## `nexajs-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nexajs-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nexajs-cli plugins unlink
  $ nexajs-cli plugins remove
```

## `nexajs-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nexajs-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nexajs-cli plugins unlink
  $ nexajs-cli plugins remove
```

## `nexajs-cli plugins update`

Update installed plugins.

```
USAGE
  $ nexajs-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
