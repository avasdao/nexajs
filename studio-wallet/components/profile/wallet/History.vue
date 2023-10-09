<script setup>
/* Import modules. */
import moment from 'moment'
import {
    getAddressHistory,
    getTransaction,
} from '@nexajs/rostrum'

import getSender from './_getSender.js'

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
import { useWalletStore } from '@/stores/wallet'
const System = useSystemStore()
const Wallet = useWalletStore()

const history = ref(null)
const txs = ref(null)

const init = async () => {
    let history
    let txids

    console.log('ADDRESS', Wallet.address)

    history = await getAddressHistory(Wallet.address)
        .catch(err => console.error(err))
    console.log('HISTORY', history)

    txids = history.map(_tx => _tx.tx_hash)

    txs.value = {}

    txids.forEach(async _txid => {
        let details
        console.log('TXID', _txid)

        details = await getTransaction(_txid)
            .catch(err => console.error(err))
        console.log('DETAILS', details)

        txs.value[_txid] = details
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

        <div v-for="tx of txs" :key="tx.txidem" class="px-2 p-1 bg-amber-100 border border-amber-300 rounded-md shadow">
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

            <section class="my-3 px-2 py-1 flex flex-col gap-3 bg-amber-200 border border-amber-400 rounded">
                <h2 class="text-xs text-amber-600 uppercase">
                    Inputs
                </h2>

                <div v-for="input of displayInputs(tx.vin)" :key="input.outpoint" class="flex flex-col text-xs divide-amber-700">
                    <h3 class="text-xs text-amber-800 truncate">
                        Outpoint:
                        <span class="font-medium">{{input.outpoint}}</span>
                    </h3>

                    <h3 class="text-xs text-amber-800 truncate">
                        Address:
                        <span class="font-medium">{{input.address}}</span>
                    </h3>

                    <h3 class="text-xs text-amber-800 truncate">
                        Satoshis:
                        <span class="font-medium">{{input.satoshis}}</span>
                    </h3>
                    <!-- {{input}} -->
                </div>
                <!-- <pre v-for="input of displayInputs(tx.vin)" :key="input.outpoint" class="text-xs">{{input}}</pre> -->
            </section>

            <section class="my-3 px-2 py-1 flex flex-col gap-3 bg-amber-200 border border-amber-400 rounded">
                <h2 class="text-xs text-amber-600 uppercase">
                    Outputs
                </h2>

                <div v-for="output of displayOutputs(tx.vout)" :key="output.outpoint" class="flex flex-col text-xs divide-amber-700">
                    <h3 class="text-xs text-amber-800 truncate">
                        Outpoint:
                        <span class="font-medium">{{output.outpoint}}</span>
                    </h3>

                    <h3 class="text-xs text-amber-800 truncate">
                        Address:
                        <span class="font-medium">{{output.address}}</span>
                    </h3>

                    <h3 class="text-xs text-amber-800 truncate">
                        Satoshis:
                        <span class="font-medium">{{output.satoshis}}</span>
                    </h3>

                    <h3 class="text-xs text-amber-800 truncate">
                        Script (hash):
                        <span class="font-medium">{{output.script.hash}}</span>
                    </h3>

                    <h3 class="text-xs text-amber-800 truncate">
                        Script (args):
                        <span class="font-medium">{{output.script.args}}</span>
                    </h3>

                    <h3 class="text-xs text-amber-800 truncate">
                        Group:
                        <span class="font-medium">{{output.group}}</span>
                    </h3>

                    <h3 class="text-xs text-amber-800 truncate">
                        Authority:
                        <span class="font-medium">{{output.groupAuthority}}</span>
                    </h3>

                    <h3 class="text-xs text-amber-800 truncate">
                        Quantity:
                        <span class="font-medium">{{output.groupQuantity}}</span>
                    </h3>

                    <h3 class="text-xs text-amber-800 truncate">
                        Hex:
                        <span class="font-medium">{{output.hex}}</span>
                    </h3>
                    <!-- {{input}} -->
                </div>
                <!-- <pre v-for="output of displayOutputs(tx.vout)" :key="output.outpoint" class="text-xs">{{output}}</pre> -->
            </section>
        </div>

    </main>
</template>
