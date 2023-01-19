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
        name: 'Vanilla JS (no packaging, no TypeScript)',
        value: 'vanilla',
    },
    {
        name: 'Vue.js (default)',
        value: 'vue-ts',
    },
    {
        name: 'React',
        value: 'react-ts',
    },
    {
        name: 'React Native',
        value: 'react-native-ts',
    },
    {
        name: 'Show more options...',
        value: null,
    },
]

/* Initialize menu (question) choices. */
const FEATURES_CHOICES = [
    {
        name: 'Analytics (recommended)',
        value: 'analytics',
    },
    {
        name: 'Charts',
        value: 'charts',
    },
    {
        name: 'Database',
        value: 'db',
    },
    {
        name: 'DeFi',
        value: 'defi',
    },
    {
        name: 'Ledger Hardware Wallet',
        value: 'ledger',
    },
    {
        name: 'Markets',
        value: 'markets',
    },
    {
        name: 'Meta Network',
        value: 'meta',
    },
    {
        name: 'Nexa ID (recommended)',
        value: 'id',
    },
    {
        name: 'Purse',
        value: 'purse',
    },
    {
        name: 'Trezor',
        value: 'trezor',
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
    name: 'location',
    type: 'input',
    message: 'Where would you like your application built:',
    default: 'app',
},
{
    name: 'features',
    type: 'checkbox',
    message: 'Would you like any additional features:',
    choices: FEATURES_CHOICES,
    default: ['analytics', 'id'],
},
{
    name: 'custom',
    type: 'confirm',
    message: 'Would you like to customize your selected features:',
    default: false,
}]

// NOTE: Adding a line-break to improve the starting position of the display;
//       before presenting the menu of options to the user.
console.log()

/* Begin user interaction. */
inquirer
    .prompt(QUESTIONS)
    .then(answers => {
        /* Generate project id. */
        const projectid = uuidv4()

        console.log()
        console.log('  Your Application ID: %s', projectid)
        console.log('                       (this is auto-generated for use with "public" services)')
        console.log()
        console.log('                 Name: %s', answers.name)
        console.log('             Template: %s', displayTemplate(answers.template))
        console.log('       Adt\'l Features: %s', answers.features)
        console.log('           Customized: %s', answers.custom)
        console.log()
        console.log('  Your setup completed successfully!!')
        console.log()
        console.log(`  Now proceed to the [ ${answers.location} ] folder and run one of the following commands:`)
        console.log('    - yarn install && yarn dev')
        console.log('    - npm install && npm run dev')
        console.log('    - pnpm install && pnpm run dev')
        console.log()
    })

/**
 * Display Template
 *
 * Formats the information displayed to the user.
 */
const displayTemplate = (_templateid) => {
    switch(_templateid) {
    case 'vue-ts':
        return 'Vue + TypeScript'
    default:
        return 'Unknown'
    }
}
