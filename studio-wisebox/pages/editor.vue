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

const compile = async () => {
    alert('Temporarily offline...')
}

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

        <div class="grid grid-cols-6 gap-8">
            <MonacoEditor
                v-model="monacoEditor"
                :options="{monacoOptions}"
                lang="sol"
                theme="vs-dark"
                class="col-span-4 w-full h-[450px]"
            />

            <section class="col-span-2">
                <button @click="compile" class="px-3 py-2 text-sm text-green-900 font-bold bg-green-400 border border-green-600 rounded-lg shadow hover:bg-green-300">
                    Run Compiler...
                </button>

                <h3 class="mt-5 pl-2 text-sm text-gray-400 font-medium uppercase tracking-widest">
                    Compiler Output
                </h3>

                <div class="p-5 bg-gray-800 border-2 border-amber-400 rounded-xl shadow">
                    <p class="text-gray-200">
                        ready for input...
                    </p>

                </div>
            </section>
        </div>

    </main>
</template>
