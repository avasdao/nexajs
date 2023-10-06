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
]

/* Initialize menu (question) choices. */
const NETWORK_CHOICES = [
    {
        name: 'Avalanche',
        value: 'avax',
    },
    {
        name: 'Binance',
        value: 'bsc',
    },
    {
        name: 'Bitcoin',
        value: 'btc',
    },
    {
        name: 'Bitcoin Cash',
        value: 'bch',
    },
    {
        name: 'Ethereum',
        value: 'eth',
    },
    {
        name: 'Nexa (default)',
        value: 'nexa',
    },
    {
        name: 'Polygon',
        value: 'matic',
    },
    {
        name: 'Tron',
        value: 'tron',
    },
]

/* Initialize menu (question) choices. */
const FEATURE_CHOICES = [
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
        name: 'Ledger HW Wallet',
        value: 'ledger',
    },
    {
        name: 'Market',
        value: 'market',
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
    name: 'templateid',
    type: 'list',
    message: 'What type of application would you like to create?',
    choices: TEMPLATE_CHOICES,
    default: 'vue-ts'
},
{
    name: 'networks',
    type: 'checkbox',
    message: 'Which networks will you support?',
    choices: NETWORK_CHOICES,
    default: ['nexa']
},
{
    name: 'name',
    type: 'input',
    message: 'What is the name of your application:',
    default: 'Homemade Crypto',
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
    choices: FEATURE_CHOICES,
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

        // TODO Write to disk.
        const folderName = answers.location
            .replaceAll(/ /g, '_')  // replace all spaces with undescore
            .toLowerCase()          // use lowercase characters
        // console.log('FOLDER NAME', folderName)

        const templatePath = path.join(__dirname, '..', 'templates/nuxt-ts')
        // console.log('TEMPLATE PATH', templatePath)

        const gitIgnorePathSrc = path.join(folderName, '__gitignore')
        const gitIgnorePathDest = path.join(folderName, '.gitignore')

        const npmRcPathSrc = path.join(folderName, '__npmrc')
        const npmRcPathDest = path.join(folderName, '.npmrc')

        if (!fs.existsSync(folderName)) {
            /* Copy folder from template (source) folder. */
            fs.cpSync(templatePath, folderName, { recursive: true })

            /* Fix name on (excluded) hidden files. */
            fs.renameSync(gitIgnorePathSrc, gitIgnorePathDest)
            fs.renameSync(npmRcPathSrc, npmRcPathDest)
        } else {
            return console.error(`\n  Oops! The folder [ ${folderName} ] already exists.\n`)
        }

        console.log()
        console.log('  Your Application ID: %s', projectid)
        console.log('                       (this is auto-generated for use with "public" services)')
        console.log()
        console.log('                 Name: %s', answers.name)
        console.log('             Template: %s', displayTemplate(answers.templateid))
        console.log('             Networks: %s', displayNetworks(answers.networks))
        console.log('       Adt\'l Features: %s', displayFeatures(answers.features))
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
    case 'vanilla':
        return 'Vanilla JS (no packaging, no TypeScript)'
    case 'vue-ts':
        return 'Vue + TypeScript'
    case 'react-ts':
        return 'React + TypeScript'
    case 'react-native-ts':
        return 'React Native + TypeScript'
    default:
        return 'Unknown template'
    }
}

/**
 * Display Networks
 *
 * Formats the information displayed to the user.
 */
const displayNetworks = (_networks) => {
    // console.log('NETWORKS', _networks)

    /* Validate networks selection. */
    if (!_networks.length) {
        return 'No networks selected'
    }

    /* Initialize display. */
    let display = ''

    /* Handle network ids. */
    _networks.forEach(_networkid => {
        switch(_networkid) {
        case 'avax':
            display += 'Avalanche, '
            break
        case 'bsc':
            display += 'Binance, '
            break
        case 'btc':
            display += 'Bitcoin, '
            break
        case 'bch':
            display += 'Bitcoin Cash, '
            break
        case 'eth':
            display += 'Ethereum, '
            break
        case 'nexa':
            display += 'Nexa, '
            break
        case 'matic':
            display += 'Polygon, '
            break
        case 'tron':
            display += 'Tron, '
            break
        default:
            //
        }
    })

    /* Return display. */
    return display.slice(0, -2)
}

/**
 * Display Features
 *
 * Formats the information displayed to the user.
 */
const displayFeatures = (_features) => {
    // console.log('FEATURES', _features)

    /* Validate features selection. */
    if (!_features.length) {
        return 'No features selected'
    }

    /* Initialize display. */
    let display = ''

    /* Handle feature ids. */
    _features.forEach(_featureid => {
        switch(_featureid) {
        case 'analytics':
            display += 'Analytics, '
            break
        case 'charts':
            display += 'Charts, '
            break
        case 'db':
            display += 'Database, '
            break
        case 'defi':
            display += 'DeFi, '
            break
        case 'ledger':
            display += 'Ledger, '
            break
        case 'market':
            display += 'Market, '
            break
        case 'meta':
            display += 'Meta, '
            break
        case 'id':
            display += 'ID, '
            break
        case 'purse':
            display += 'Purse, '
            break
        case 'trezor':
            display += 'Trezor, '
            break
        case 'wallet':
            display += 'Wallet, '
            break
        default:
            //
        }
    })

    /* Return display. */
    return display.slice(0, -2)
}
