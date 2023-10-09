<script setup lang="ts">
/* Import modules. */
import numeral from 'numeral'

useHead({
    title: `Stable Diffusion Studio for Creators`,
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

const init = async () => {
    const status = await $fetch('/api/s3', {
        method: 'POST',
        body: {
            hi: 'there!',
        }
    })
    .catch(err => console.error(err))
    console.log('STATUS', status)
}

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

onMounted(() => {
    init()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })
</script>

<template>
    <section class="block grid grid-cols-5 gap-6">
        <div class="col-span-3">
            <h1 class="text-4xl lg:text-5xl font-medium">
                Stable Diffusion
            </h1>

            <p class="mt-2 lg:mt-5 text-sm lg:text-base">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id eius voluptatem minus natus at eveniet dolorum eos mollitia, maxime animi excepturi harum omnis illum odit recusandae pariatur! Unde, explicabo molestias.
            </p>
        </div>

        <MyLibrary />
    </section>

    <section class="my-5 flex flex-row gap-4">
        <div class="flex-1 h-72">
            <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
                Text Prompt
            </h2>

            <textarea
                placeholder="enter your prompt here (photo-realistic)"
                class="p-3 w-full h-full bg-amber-100 border border-amber-300 rounded-xl shadow placeholder:text-amber-500"
            />
        </div>

        <div class="mt-5 w-32 h-96">
            <Themes />
        </div>

        <div class="w-[500px]">
            <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
                Generative Preview
            </h2>

            <div class="w-full h-96 bg-gray-50 border border-gray-300 rounded-xl shadow" />
        </div>
    </section>

    <div class="mt-5 pr-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-xl font-semibold leading-6 text-gray-900">
            Reset
        </button>

        <button
            @click="build"
            class="rounded-md bg-lime-600 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
        >
            Preview My Card
        </button>
    </div>

    <div class="my-10 border-t border-gray-300" />

    <Metadata />

    <div class="mt-5 pr-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-xl font-semibold leading-6 text-gray-900">
            Reset
        </button>

        <button
            @click="build"
            class="rounded-md bg-lime-600 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
        >
            Preview My Token
        </button>
    </div>
</template>
