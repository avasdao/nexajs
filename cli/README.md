# Nexa Command Center

https://docs.nexajs.org/guide/cli.html

A command-line Nexa application and platform manager.

# Table of contents

- [Introduction](#introduction)
  - [Prerequisites](#prerequisites)
  - [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Building the workspace](#building-the-workspace)


## Introduction

Nexa Command Center is a command-line utility for efficiently and effectively managing Nexa (enterprise-level) application infrastructure.

You can get started quickly by running the CLI using:
```
npx @nexajs/cli help
```

### Prerequisites

- Node.js 16+

### Requirements

- Familiarity with general Developer Operations (DevOps) activities.


## Getting Started

We recommend you get started with Nexa Command Center by using the Node Package Manager (NPM); and installing the software globally onto your each of your system(s).

```
npm install -g @nexajs/cli
```


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


## Contributing

If you running Linux, you can install this command locally by running `sudo npm link` from within the `cli` folder.

This will allow you to run `nexa [COMMAND]` from anywhere on the system.
