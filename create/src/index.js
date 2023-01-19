#!/usr/bin/env node

/* Import modules. */
import chalk from 'chalk'
import fs from 'fs'
import inquirer from 'inquirer'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// NOTE: ES module bug fix.
//       see (https://flaviocopes.com/fix-dirname-not-defined-es-module-scope/)
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// const templates = fs.readdirSync(path.join(__dirname, 'templates'))

/* Initialize menu (question) choices. */
const TEMPLATE_CHOICES = [
    {
        name: 'Pure JS (no packaging, no TypeScript)',
        value: '',
    },
    {
        name: 'Vue',
        value: 'vue',
    },
    {
        name: 'Vue + TS (default)',
        value: 'vue-ts',
    },
    {
        name: 'React',
        value: 'react',
    },
    {
        name: 'React + TS',
        value: 'react-ts',
    },
    {
        name: 'React Native',
        value: 'react-native',
    },
    {
        name: 'React Native + TS',
        value: 'react-native-ts',
    },
]

/* Initialize menu (question) choices. */
const FEATURES_CHOICES = [
    {
        name: 'Charts',
        value: 'charts',
    },
    {
        name: 'Database',
        value: 'db',
    },
    {
        name: 'Nexa ID',
        value: 'id',
    },
    {
        name: 'Purse',
        value: 'purse',
    },
    {
        name: 'Wallet',
        value: 'wallet',
    },
]

/* Initialize menu questions. */
const QUESTIONS = [
{
    name: 'template',
    type: 'list',
    message: 'What type of application would you like to create?',
    choices: TEMPLATE_CHOICES,
    default: 'vue-ts'
},
{
    name: 'name',
    type: 'input',
    message: 'What is the name of your application:',
    default: 'Homemade Crypto App',
},
{
    name: 'features',
    type: 'checkbox',
    message: 'Would you like any additional features:',
    choices: FEATURES_CHOICES,
    // default: 'DB, ID, Wallet',
}]

inquirer
    .prompt(QUESTIONS)
    .then(answers => {
        /* Generate project id. */
        const projectid = uuidv4()

        console.log()
        console.log('  Your Project ID: %s', projectid)
        console.log('                   (this is auto-generated)')
        console.log()
        console.log('             Name: %s', answers.name)
        console.log('         Template: %s', displayTemplate(answers.template))
        console.log('   Adt\'l Features: %s', answers.features)
        console.log()
        console.log('  Is this correct?')
        console.log()
    })

const displayTemplate = (_templateid) => {
    switch(_templateid) {
    case 'vue-ts':
        return 'Vue + TypeScript'
    default:
        return 'Unknown'
    }
}
