<script setup lang="ts">
useHead({
    title: `Editor — Wisebox`,
    meta: [
        { name: 'description', content: `Wisebox is the Ultimate Playground for UTXO Script developers to design, test and deploy their smart contracts.` }
    ],
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
const System = useSystemStore()

const init = () => {
    const editor = ace.edit('ace-editor')
        editor.setTheme('ace/theme/clouds')
        // editor.session.setMode('ace/mode/solidity')
    console.log('EDITOR', editor)
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
        <h1 class="text-5xl font-medium">
            Editor
        </h1>

        <pre id="ace-editor" class="w-full h-[450px] text-[1.1em]">
pragma nexscript >= 1.0.0;

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
</pre>
    </main>
</template>
