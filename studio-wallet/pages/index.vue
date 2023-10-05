<script setup lang="ts">
/* Import modules. */
// import TrezorConnect from '@trezor/connect-web'
import TrezorConnect, { DEVICE_EVENT, DEVICE } from '@trezor/connect-web'

import numeral from 'numeral'

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

const init = async () => {
    /* Initialize Trezor Connect. */
    // source: https://docs.trezor.io/trezor-suite/packages/connect/index.html
    TrezorConnect.init({
        lazyLoad: true, // this param will prevent iframe injection until TrezorConnect.method will be called
        manifest: {
            email: 'support@avasdao.org',
            appUrl: 'https://nexa.studio',
        },
    })

    // const params = {
    //     path: `m/44'/29223'/0'`,
    //     // coin: 'nexa',
    // }

    // const result = await TrezorConnect.getPublicKey(params)
    // console.log('TREZOR CONNECT (result):', result)

    /* Initialize Trezor event handler. */
    // TrezorConnect.on(DEVICE_EVENT, event => {
    //     console.log('TREZOR EVENT', event)
    //     if (event.type === DEVICE.CONNECT) {
    //     } else if (event.type === DEVICE.DISCONNECT) {
    //     }
    // })
    // const publicKey = await TrezorConnect.getPublicKey({
    //     path: `m/44'/29223'/0'/0/0`,
    // })
    // console.log('PUBLIC KEY (BTC):', publicKey)
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
                Portfolio
            </h1>

            <p class="mt-2 lg:mt-5 text-sm lg:text-base">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id eius voluptatem minus natus at eveniet dolorum eos mollitia, maxime animi excepturi harum omnis illum odit recusandae pariatur! Unde, explicabo molestias.
            </p>
        </div>

        <MyLibrary />
    </section>

    <section class="my-5 flex flex-row gap-4">
        <div class="flex-1 h-96">
            <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
                Asset Designer
            </h2>

            <div class="h-full bg-rose-100 border border-rose-300 rounded-xl shadow">
                <!-- preview windows -->
            </div>
        </div>

        <div class="mt-5 w-32 h-96">
            <Thumbnails />
        </div>

        <div class="w-[500px]">
            <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
                Cover Preview
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

    <div class="space-y-12">
        <Metadata />

        <Collection />

        <Royalties />
    </div>

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
