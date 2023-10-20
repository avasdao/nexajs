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
import { useWalletStore } from '@/stores/wallet'
import { useSystemStore } from '@/stores/system'
const Wallet = useWalletStore()
const System = useSystemStore()

const ENDPOINT = 'https://nexa.garden/v1/asset'

const imagePreviewUrl = ref(null)
const imageData = ref(null)
const prompt = ref(null)
const creationid = ref(null)

const init = async () => {
    // const status = await $fetch('/api/s3', {
    //     method: 'POST',
    //     body: {
    //         hi: 'there!',
    //     }
    // })
    // .catch(err => console.error(err))
    // console.log('STATUS', status)

    creationid.value = 'e1f887d7-b980-4bad-bbaa-50170769ed83'

    const status = await $fetch(`https://nexa.studio/ai/img/${creationid.value}`)
        .catch(err => console.error(err))
    console.log('STATUS', status)
}

const generate = async () => {
    /* Initialize locals. */
    let response

    if (confirm(`Are you sure you want to generate [ ${prompt.value} ]`)) {
        response = await $fetch('/api/diffusion', {
            method: 'POST',
            body: {
                action: 'CREATE',
                prompt: prompt.value,
            },
        })
        console.log('AUTH SESSIONS (response):', response)
    }
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
        <div class="w-2/5 flex flex-col gap-5">
            <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
                Text Prompt
            </h2>

            <textarea
                placeholder="enter your prompt here"
                class="p-3 w-full h-48 bg-amber-100 border border-amber-300 rounded-xl shadow placeholder:text-amber-500"
                v-model="prompt"
            />

            <button
                @click="generate"
                class="rounded-md bg-lime-600 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime-600"
            >
                Generate Image
            </button>

            <button
                type="button"
                class="rounded-md bg-amber-600 px-3 py-2 text-xl font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
            >
                Reset
            </button>
        </div>

        <div class="w-3/5">
            <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
                Generative Preview
            </h2>

            <!-- <div class="w-full h-96 bg-gray-50 border border-gray-300 rounded-xl shadow" /> -->
            <img
                :src="'https://nexa.studio/ai/img/' + creationid + '.jpg'"
                class="w-full h-auto bg-gray-50 border border-gray-300 rounded-xl shadow"
            />
        </div>
    </section>

    <div class="my-10 border-t border-gray-300" />

    <div>
        <h2>History</h2>


    </div>
</template>
