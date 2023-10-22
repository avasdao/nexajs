<script setup lang="ts">
/* Import modules. */
import * as fflate from 'fflate'
import numeral from 'numeral'

useHead({
    title: `ChatGPT Studio for Creators`,
    meta: [
        { name: 'description', content: `Nexa Studio makes building your next BIG idea effortless.` }
    ],
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
const System = useSystemStore()

const ENDPOINT = 'https://nexa.garden/v1/asset'

const imagePreviewUrl = ref(null)
const imageData = ref(null)


// const handleChange = async (e) => {
//     const input = e.target
//     console.log('INPUT', input)

//     if (!input.files) {
//         return console.error(`Oops! Missing file(s).`)
//     }

//     const reader = new FileReader()
//     reader.onload = (e) => {
//         /* Set preview URL. */
//         imagePreviewUrl.value = e.target.result
//     }
//     imageData.value = input.files[0]
//     reader.readAsDataURL(input.files[0])
// }

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
    <section class="block grid grid-cols-5 gap-6">
        <div class="col-span-3">
            <h1 class="text-4xl lg:text-5xl font-medium">
                ChatGPT
            </h1>

            <p class="mt-2 lg:mt-5 text-sm lg:text-base">
                ChatGPT, which stands for Chat Generative Pre-trained Transformer, is a large language model-based chatbot developed by OpenAI and launched on November 30, 2022, which enables users to refine and steer a conversation towards a desired length, format, style, level of detail, and language.
            </p>
        </div>

        <MyLibrary />
    </section>

    <!-- TODO -->
</template>
