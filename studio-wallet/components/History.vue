<script setup>
/* Import modules. */
import moment from 'moment'
import {
    getAddressHistory,
    getTransaction,
} from '@nexajs/rostrum'

import getSender from './history/getSender.js'

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
import { useWalletStore } from '@/stores/wallet'
const System = useSystemStore()
const Wallet = useWalletStore()

const MAX_RESULTS_PER_PAGE = 20

const history = ref(null)
const txs = ref(null)

const init = async () => {
    /* Initialize locals. */
    let history
    let txids

    // console.log('ADDRESS', Wallet.address)

    /* Request address history. */
    history = await getAddressHistory(Wallet.address)
        .catch(err => console.error(err))
    // console.log('HISTORY', history)

    /* Handle history. */
    txids = history
        .reverse()
        .slice(0, MAX_RESULTS_PER_PAGE)
        .map(_tx => _tx.tx_hash)

    /* Initialize array. */
    txs.value = []

    txids.forEach(async _txid => {
        // console.log('TXID', _txid)

        /* Initialize locals. */
        let details

        /* Request transaction details. */
        details = await getTransaction(_txid)
            .catch(err => console.error(err))
        // console.log('DETAILS', details)

        /* Add transaction details. */
        txs.value.push(details)
    })
}

const displayInputs = (_inputs) => {
    const inputs = []

    _inputs.forEach(_input => {
        inputs.push({
            outpoint: _input.outpoint,
            address: getSender(_input),
            satoshis: _input.value_satoshi,
        })
    })

    return inputs
}

const displayOutputs = (_outputs) => {
    const outputs = []

    _outputs.forEach(_output => {
        outputs.push({
            outpoint: _output.outpoint_hash,
            address: _output.scriptPubKey.addresses[0],
            satoshis: _output.value_satoshi,
            script: {
                hash: _output.scriptPubKey.scriptHash,
                args: _output.scriptPubKey.argsHash,
            },
            group: _output.scriptPubKey.group,
            groupAuthority: _output.scriptPubKey.groupAuthority,
            groupQuantity: _output.scriptPubKey.groupQuantity,
            hex: _output.scriptPubKey.hex,
        })
    })

    return outputs
}

const displayTime = (_time) => {
    return moment.unix(_time).format('lll')
}

const displayTimeAgo = (_time) => {
    return moment.unix(_time).fromNow()
}


onMounted(() => {
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })

</script>

<template>
    <main class="flex flex-col gap-4">
        <h2 class="text-xl font-medium">
            Recent Transactions
        </h2>

        <NuxtLink
            :to="'https://nexa.sh/tx/' + tx.txidem"
            target="_blank"
            v-for="tx of txs"
            :key="tx.txidem"
            class="px-2 p-1 bg-amber-50 border border-amber-300 rounded-md shadow hover:bg-amber-100"
        >
            <h3 class="text-xs font-medium truncate">
                TXID {{tx.txidem}}
            </h3>

            <h3>
                {{displayTime(tx.time)}}
                <small>({{displayTimeAgo(tx.time)}})</small>
            </h3>

            <h3 class="text-xs text-amber-600">
                fee: {{tx.fee}}
            </h3>

            <h3 class="text-xs text-amber-600">
                size: {{tx.size}}
            </h3>

            <section class="my-3 px-2 py-1 flex flex-col gap-3 bg-gray-200 border border-gray-400 rounded">
                <h2 class="text-xs text-amber-600 uppercase">
                    Inputs
                </h2>

                <div v-for="input of displayInputs(tx.vin)" :key="input.outpoint" class="flex flex-col text-xs divide-amber-700">
                    <h3 class="text-xs text-amber-800 truncate">
                        Outpoint:
                        <span class="font-medium">{{input.outpoint}}</span>
                    </h3>

                    <NuxtLink
                        :to="'https://explorer.nexa.org/address/' + input.address"
                        target="_blank"
                        class="text-xs text-amber-600 truncate hover:text-amber-500"
                    >
                        Address:
                        <span class="font-medium">{{input.address}}</span>
                    </NuxtLink>

                    <h3 class="text-xs text-amber-800 truncate">
                        Satoshis:
                        <span class="font-medium">{{input.satoshis}}</span>
                    </h3>
                    <!-- {{input}} -->
                </div>
                <!-- <pre v-for="input of displayInputs(tx.vin)" :key="input.outpoint" class="text-xs">{{input}}</pre> -->
            </section>

            <section class="my-3 px-2 py-1 flex flex-col gap-3 bg-gray-700 border border-gray-900 rounded">
                <h2 class="text-xs text-gray-50 uppercase">
                    Outputs
                </h2>

                <div v-for="output of displayOutputs(tx.vout)" :key="output.outpoint" class="flex flex-col text-xs divide-amber-700">
                    <h3 class="text-xs text-gray-50 truncate">
                        Outpoint:
                        <span class="font-medium">{{output.outpoint}}</span>
                    </h3>

                    <h3 class="text-xs text-gray-50 truncate">
                        Address:
                        <span class="font-medium">{{output.address}}</span>
                    </h3>

                    <h3 class="text-xs text-gray-50 truncate">
                        Satoshis:
                        <span class="font-medium">{{output.satoshis}}</span>
                    </h3>

                    <h3 class="text-xs text-gray-50 truncate">
                        Script (hash):
                        <span class="font-medium">{{output.script.hash}}</span>
                    </h3>

                    <h3 class="text-xs text-gray-50 truncate">
                        Script (args):
                        <span class="font-medium">{{output.script.args}}</span>
                    </h3>

                    <h3 class="text-xs text-gray-50 truncate">
                        Group:
                        <span class="font-medium">{{output.group}}</span>
                    </h3>

                    <h3 class="text-xs text-gray-50 truncate">
                        Authority:
                        <span class="font-medium">{{output.groupAuthority}}</span>
                    </h3>

                    <h3 class="text-xs text-gray-50 truncate">
                        Quantity:
                        <span class="font-medium">{{output.groupQuantity}}</span>
                    </h3>

                    <h3 class="text-xs text-gray-50 truncate">
                        Hex:
                        <span class="font-medium">{{output.hex}}</span>
                    </h3>
                    <!-- {{input}} -->
                </div>
                <!-- <pre v-for="output of displayOutputs(tx.vout)" :key="output.outpoint" class="text-xs">{{output}}</pre> -->
            </section>
        </NuxtLink>

    </main>
</template>
