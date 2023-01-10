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
$ npm install -g @nexajs/cli
$ nexa COMMAND
running command...
$ nexa (--version)
@nexajs/cli/23.1.9 linux-x64 node-v16.15.0
$ nexa --help [COMMAND]
USAGE
  $ nexa COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nexa hello PERSON`](#nexa-hello-person)
* [`nexa hello world`](#nexa-hello-world)
* [`nexa help [COMMAND]`](#nexa-help-command)
* [`nexa plugins`](#nexa-plugins)
* [`nexa plugins:install PLUGIN...`](#nexa-pluginsinstall-plugin)
* [`nexa plugins:inspect PLUGIN...`](#nexa-pluginsinspect-plugin)
* [`nexa plugins:install PLUGIN...`](#nexa-pluginsinstall-plugin-1)
* [`nexa plugins:link PLUGIN`](#nexa-pluginslink-plugin)
* [`nexa plugins:uninstall PLUGIN...`](#nexa-pluginsuninstall-plugin)
* [`nexa plugins:uninstall PLUGIN...`](#nexa-pluginsuninstall-plugin-1)
* [`nexa plugins:uninstall PLUGIN...`](#nexa-pluginsuninstall-plugin-2)
* [`nexa plugins update`](#nexa-plugins-update)

## `nexa hello PERSON`

Say hello

```
USAGE
  $ nexa hello [PERSON] -f <value>

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

## `nexa hello world`

Say hello world

```
USAGE
  $ nexa hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `nexa help [COMMAND]`

Display help for nexa.

```
USAGE
  $ nexa help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for nexa.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.20/src/commands/help.ts)_

## `nexa plugins`

List installed plugins.

```
USAGE
  $ nexa plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ nexa plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.9/src/commands/plugins/index.ts)_

## `nexa plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ nexa plugins:install PLUGIN...

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
  $ nexa plugins add

EXAMPLES
  $ nexa plugins:install myplugin 

  $ nexa plugins:install https://github.com/someuser/someplugin

  $ nexa plugins:install someuser/someplugin
```

## `nexa plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ nexa plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ nexa plugins:inspect myplugin
```

## `nexa plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ nexa plugins:install PLUGIN...

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
  $ nexa plugins add

EXAMPLES
  $ nexa plugins:install myplugin 

  $ nexa plugins:install https://github.com/someuser/someplugin

  $ nexa plugins:install someuser/someplugin
```

## `nexa plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ nexa plugins:link PLUGIN

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
  $ nexa plugins:link myplugin
```

## `nexa plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nexa plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nexa plugins unlink
  $ nexa plugins remove
```

## `nexa plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nexa plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nexa plugins unlink
  $ nexa plugins remove
```

## `nexa plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nexa plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nexa plugins unlink
  $ nexa plugins remove
```

## `nexa plugins update`

Update installed plugins.

```
USAGE
  $ nexa plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
