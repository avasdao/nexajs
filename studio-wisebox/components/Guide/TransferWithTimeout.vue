<script setup lang="ts">
/* Define properties. */
// https://vuejs.org/guide/components/props.html#props-declaration
const props = defineProps({
    data: {
        type: [Object],
    },
})

// onMounted(() => {
//     console.log('Mounted!')
//     // Now it's safe to perform setup operations.
// })

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>

<template>
    <main class="">
        <h1 class="">
            TransferWithTimeout
        </h1>

<pre>
import { ElectrumNetworkProvider, Contract, SignatureTemplate } from 'cashscript';
import { alicePriv, alicePub, bobPriv, bobPub } from './keys.js';
import artifact from './transfer_with_timeout.json';

// Initialise a network provider for network operations
const provider = new ElectrumNetworkProvider('mainnet');
const addressType = 'p2sh20';

// Instantiate a new TransferWithTimeout contract
const contract = new Contract(artifact, [alicePub, bobPub, 100000n], options:{ provider, addressType});

// Call the transfer function with Bob's signature
// i.e. Bob claims the money that Alice has sent him
const transferDetails = await contract.functions
    .transfer(new SignatureTemplate(bobPriv))
    .to('bitcoincash:qrhea03074073ff3zv9whh0nggxc7k03ssh8jv9mkx', 10000n)
    .send();
console.log(transferDetails);

// Call the timeout function with Alice's signature
// i.e. Alice recovers the money that Bob has not claimed
const timeoutDetails = await contract.functions
    .timeout(new SignatureTemplate(alicePriv))
    .to('bitcoincash:qqeht8vnwag20yv8dvtcrd4ujx09fwxwsqqqw93w88', 10000n)
    .send();
console.log(timeoutDetails);
</pre>

        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Consectetur quisquam velit fugit atque beatae aperiam, perferendis aliquam quos voluptatum tempora accusantium veritatis corrupti sit est mollitia? Numquam, tempora. Aut, ipsa.
        </p>

    </main>
</template>
