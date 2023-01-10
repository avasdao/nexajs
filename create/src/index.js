#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// import path from 'path';
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

// NOTE: ES module bug fix.
//       see (https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/)
const __dirname = path.dirname(__filename)

const CHOICES = fs.readdirSync(path.join(__dirname, 'templates'))

const QUESTIONS = [
{
    name: 'template',
    type: 'list',
    message: 'What project template would you like to generate?',
    choices: CHOICES
},
{
    name: 'name',
    type: 'input',
    message: 'Project name:'
}]

import inquirer from 'inquirer'
import chalk from 'chalk'

inquirer.prompt(QUESTIONS)
.then(answers => {
    const projectid = uuidv4()
    console.log(projectid, answers)
})
