<script setup>
import QRCode from 'qrcode'

/* Define properties. */
const props = defineProps({
    isFullScreen: Boolean,
})

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
import { useWalletStore } from '@/stores/wallet'
const System = useSystemStore()
const Wallet = useWalletStore()

const dataUrl = ref(null)
const depositAmount = ref(null)

const isShowingCurrencyOptions = ref(false)

/**
 * Update QR Code
 *
 * Uses BIP-21 to encode a data URI.
 */
 const updateQrCode = async () => {
    let bip21Url

    /* Handle (user-defined) amount. */
    if (Wallet.nex > 0) {
        bip21Url = `${Wallet.address}?amount=${Wallet.nex}`
    } else {
        bip21Url = Wallet.address
    }
    console.log('Wallet.address', Wallet.address)
    console.log('bip21Url', bip21Url)

    /* Set data URL. */
    dataUrl.value = await QRCode.toDataURL(bip21Url)
}

const copyToClipboard = () => {
    /* Copy address to clipboard. */
    Clipboard.copy(Wallet.address)

    alert('Your address has been copied to the clipboard.')
}

onMounted(() => {
    /* Update the QR code. */
    updateQrCode()
})

// onBeforeUnmount(() => {
//     console.log('Before Unmount!')
//     // Now is the time to perform all cleanup operations.
// })

</script>

<template>
    <main class="" :class="[ isFullScreen === true ? 'grid lg:grid-cols-2 gap-8' : '' ]">
        <NuxtLink :to="Wallet.address">
            <section class="w-full px-3 py-2 my-5 bg-amber-500 border-2 border-amber-700 rounded-lg shadow">
                <h2 class="text-lg sm:text-xl text-amber-700 font-medium text-center uppercase">
                    Your Deposit Address
                </h2>

                <h3 :to="Wallet.address"
                    class="flex justify-center text-lg text-amber-900 font-medium truncate"
                >
                    {{Wallet.abbr}}
                </h3>

                <div class="flex justify-center">
                    <img
                        :src="dataUrl"
                        class="my-5 w-full h-auto border-2 border-amber-900 rounded-lg shadow-md"
                    />
                </div>

                <p class="px-0 sm:px-5 text-sm text-amber-900 text-center">
                    Scan the QR code shown above or click the image to open your preferred wallet.
                </p>
            </section>
        </NuxtLink>

        <section>
            <label for="combobox" class="block text-lg font-medium leading-6 text-gray-900">
                Choose a deposit currency:
            </label>

            <div class="relative mt-2">
                <input
                    id="combobox"
                    type="text"
                    class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-2xl sm:leading-6"
                    role="combobox"
                    aria-controls="options"
                    aria-expanded="false"
                    value="Nexa">

                <button type="button" class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fill-rule="evenodd" d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z" clip-rule="evenodd" />
                    </svg>
                </button>

                <ul v-if="isShowingCurrencyOptions" class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm" id="options" role="listbox">
                    <li class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900" id="option-0" role="option" tabindex="-1">
                        <span class="block truncate font-semobold">Nexa</span>

                        <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                            </svg>
                        </span>
                    </li>

                    <li class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900" id="option-0" role="option" tabindex="-1">
                        <div class="flex items-center">
                            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" class="h-6 w-6 flex-shrink-0 rounded-full">
                            <!-- Selected: "font-semibold" -->
                            <span class="ml-3 truncate">Tether - USDT</span>
                        </div>

                        <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                            </svg>
                        </span>
                    </li>

                    <li class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900" id="option-0" role="option" tabindex="-1">
                        <span class="block truncate">Bitcoin</span>

                        <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                            </svg>
                        </span>
                    </li>

                    <li class="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-900" id="option-0" role="option" tabindex="-1">
                        <span class="block truncate">Bitcoin Cash</span>

                        <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-white">
                            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                            </svg>
                        </span>
                    </li>

                </ul>
            </div>

            <input
                class="w-full my-3 px-3 py-1 text-xl sm:text-2xl bg-yellow-200 border-2 border-yellow-400 rounded-md shadow"
                type="number"
                v-model="depositAmount"
                placeholder="Enter a (USD) amount"
            />

            <div class="mb-5 flex flex-row gap-3">
                <button
                    @click="copyToClipboard"
                    class="w-full block px-3 py-1 text-2xl font-medium bg-blue-200 border-2 border-blue-400 rounded-md shadow hover:bg-blue-300"
                >
                    Copy
                </button>

                <button
                    class="w-full block px-3 py-1 text-2xl font-medium bg-blue-200 border-2 border-blue-400 rounded-md shadow hover:bg-blue-300"
                >
                    Share
                </button>
            </div>
     </section>
    </main>
</template>
