<script setup lang="ts">
/* Import modules. */
// import * as monaco from 'monaco-editor'
import TransferWithTimeout from '@/static/scripts/TransferWithTimeout.js'

useHead({
    title: `Editor — Wisebox`,
    meta: [
        { name: 'description', content: `Wisebox is the Ultimate Playground for UTXO Script developers to design, test and deploy their smart contracts.` }
    ],
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
const System = useSystemStore()

const monacoEditor = ref(null)

// const monacoOptions = monaco.editor.IEditorConstructionOptions = {
//   automaticLayout: true
// }
const monacoOptions = JSON.stringify({
    automaticLayout: true,
    theme: 'vs-dark',
    lineNumbers: 'off',
})
console.log('MONOCO OPTIONS', monacoOptions)

const init = () => {
    /* Initialize editor. */
    monacoEditor.value = TransferWithTimeout
    console.log('MONACO EDITOR', monacoEditor)

    // const aceEditor = ace.edit('ace-editor')
    // aceEditor.setTheme('ace/theme/clouds')
    //     // editor.session.setMode('ace/mode/solidity')
    // console.log('ACE EDITOR', aceEditor)
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

        <MonacoEditor
            v-model="monacoEditor"
            :options="{monacoOptions}"
            lang="sol"
            theme="vs-dark"
            class="w-full h-[450px]"
        />

    </main>
</template>
