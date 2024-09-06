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
    <main class="py-5">
        <div class="mt-3 p-5 text-2xl font-medium bg-gray-100 border-4 border-gray-300 rounded-xl">
            Add a time-to-live.

            <small class="block text-sm">
                NOTE: See Studio Docs to learn how to manage TTL.
            </small>
        </div>

<pre class="mt-5 p-5 bg-yellow-50 border-4 border-yellow-300 rounded-xl">
<code>pragma nexscript >= 1.0.0;

contract TransferWithTimeout(pubkey sender, pubkey recipient, int timeout) {
    // Require recipient's signature to match
    function transfer(sig recipientSig) {
        require(checkSig(recipientSig, recipient));
    }

    // Require timeout time to be reached and sender's signature to match
    function timeout(sig senderSig) {
        require(checkSig(senderSig, sender));
        require(tx.time >= timeout);
    }
}
</code></pre>

    </main>
</template>
