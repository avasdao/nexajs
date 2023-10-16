<script setup lang="ts">
/* Import modules. */
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

    const params = {
        path: `m/44'/29223'/0'`,
        // coin: 'nexa',
    }

    const result = await TrezorConnect.getPublicKey(params)
    console.log('TREZOR CONNECT (result):', result)

    /* Initialize Trezor event handler. */
    TrezorConnect.on(DEVICE_EVENT, event => {
        console.log('TREZOR EVENT', event)
        if (event.type === DEVICE.CONNECT) {
        } else if (event.type === DEVICE.DISCONNECT) {
        }
    })
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
                Trezor<span class="text-5xl lg:text-6xl text-sky-600 font-light">/</span>OneKey Manager
            </h1>

            <p class="mt-2 lg:mt-5 text-sm lg:text-base">
                Trezor Wallet Connect is an open protocol that facilitates a secure connection between mobile cryptocurrency wallets and desktop applications, such as dapps.
                Transactions are made through an encrypted connection by scanning a QR code, and are confirmed on the mobile device.
            </p>
        </div>

        <div class="col-span-2 h-full flex flex-col">
            <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
                My Devices
            </h2>

            <div class="w-full h-full bg-sky-100 border border-sky-300 rounded-lg shadow">

            </div>
        </div>
    </section>
</template>
