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
import { useProfileStore } from '@/stores/profile'
import { useWalletStore } from '@/stores/wallet'
import { useSystemStore } from '@/stores/system'
const Profile = useProfileStore()
const Wallet = useWalletStore()
const System = useSystemStore()

const ENDPOINT = 'https://nexa.garden/v1/asset'

const imagePreviewUrl = ref(null)
const imageData = ref(null)
const prompt = ref(null)

const creationid = ref(null)
const isPolling = ref(false)

const displayPreview = computed(() => {
    if (!creationid.value) {
        return 'https://i.ibb.co/TP1RYCV/image.png'
    }

    if (isPolling.value === true) {
        return 'https://bafkreih2lkyr3gnfl3ceidtwvxt622lumb7xq3koivel2wpeu7dvaixxiu.nexa.garden/'
    }

    return 'https://nexa.studio/ai/img/' + creationid.value + '.jpg'
})

const init = async () => {
    /* Initialize locals. */
    let creations

    console.log('CREATIONS', Profile.creations)
}

const startPolling = async () => {
    console.log('Polling for ', creationid.value, '...')

    /* Initialize locals. */
    let error
    let response

    /* Set (polling) flag. */
    isPolling.value = true

    /* Request AI image status. */
    response = await $fetch(`https://nexa.studio/ai/img/${creationid.value}`)
        .catch(err => {
            console.error(err)
            error = err
        })

    /* Validate response. */
    if (!response && error.message.code !== 500) {
        /* Set (polling) flag. */
        isPolling.value = false

        throw new Error(`Oops! AI server is unavailable!`)
    }

    /* Validate completion. */
    if (response?.isCompleted === true) {
        /* Set (polling) flag. */
        isPolling.value = false

        return console.log(`https://nexa.studio/ai/img/${creationid.value}.jpg`)
    } else if (response?.isCompleted === false) {
        return setTimeout(startPolling, 3000)
    }

    /* Set (polling) flag. */
    isPolling.value = false

    throw new Error(`Oops! AI data is invalid!`)
}

const generate = async () => {
    /* Initialize locals. */
    let response

    /* Confirm creation request. */
    if (confirm(`Are you sure you want to generate [ ${prompt.value} ]`)) {
        response = await $fetch('/api/diffusion', {
            method: 'POST',
            body: {
                sessionid: Profile.sessionid,
                action: 'CREATE',
                prompt: prompt.value,
            },
        })
        // console.log('GENERATE (response):', response)

        if (response?.id) {
            /* Set creation id. */
            creationid.value = response.id

            console.info(`Creation [ ${creationid.value} ] is in the queue...`)

            /* Start polling. */
            startPolling()
        } else {
            /* Alert user of error. */
            alert(JSON.stringify(response, null, 2))
        }
    }
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
    <section class="block grid grid-cols-5 gap-6">
        <div class="col-span-3">
            <h1 class="text-4xl lg:text-5xl font-medium">
                Stable Diffusion
            </h1>

            <p class="mt-2 lg:mt-5 text-sm lg:text-base">
                Stable Diffusion is a deep learning, text-to-image model released in 2022 based on diffusion techniques.
                It is primarily used to generate detailed images conditioned on text descriptions, though it can also be applied to other tasks such as inpainting, outpainting, and generating image-to-image translations guided by a text prompt.
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

            <NuxtLink :to="displayPreview" target="_blank">
                <img
                    :src="displayPreview"
                    class="w-full h-auto bg-gray-50 border border-gray-300 rounded-xl shadow"
                />
            </NuxtLink>
        </div>
    </section>

    <div class="my-10 border-t border-gray-300" />

    <div>
        <h2>History</h2>

        <div></div>
    </div>
</template>
