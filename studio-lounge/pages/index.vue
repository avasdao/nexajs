<script setup lang="ts">
/* Import modules. */
import * as fflate from 'fflate'
import numeral from 'numeral'

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
const System = useSystemStore()

const ENDPOINT = 'https://nexa.garden/v1/asset'

const imagePreviewUrl = ref(null)
const imageData = ref(null)


const handleChange = async (e) => {
    const input = e.target
    console.log('INPUT', input)

    if (!input.files) {
        return console.error(`Oops! Missing file(s).`)
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        /* Set preview URL. */
        imagePreviewUrl.value = e.target.result
    }
    imageData.value = input.files[0]
    reader.readAsDataURL(input.files[0])
}

const mint = () => {
    const json = {
        niftyVer: '2.0',
        title: `Penny-a-Nexa #1337`,
        series: `Noob: My First Collection`,
        author: `Causes Cash`,
        keywords: [
            'nft',
            'sft',
        ],
        appuri: 'https://causes.cash/noob/token/',
        category: 'NFT',
        info: `Enjoy en exclusive SFT from one of the earliest Nexican artists.`,
        bindata: '0539',
        data: {
            id: '1337',
            traits: {},
        },
        license: `You can do whatever you want with these SFTs.`,
    }

    const zipped = fflate.zipSync({
        // Directories can be nested structures, as in an actual filesystem
        'dir1': {
            'nested': {
                'hi-again.txt': fflate.strToU8('Hi again!')
            },
            // You can also manually write out a directory path
            'other/tmp.txt': new Uint8Array([97, 98, 99, 100])
        },

        'info.json': fflate.strToU8(JSON.stringify(json)),

        // You can also provide compression options
        //   'massiveImage.bmp': [aMassiveFile, {
        //     level: 9,
        //     mem: 12
        //   }],
        // PNG is pre-compressed; no need to waste time
        //   'superTinyFile.png': [aPNGFile, { level: 0 }],

        'exec': [{
            'causes.sh': [fflate.strToU8('echo \nWelcome Guest!\n'), {
                // ZIP only: Set the operating system to Unix
                os: 3,
                // ZIP only: Make this file executable on Unix
                attrs: 0o755 << 16
            }]
        }, {
            // ZIP and GZIP support mtime (defaults to current time)
            mtime: new Date('10/20/2020')
        }]
    }, {
        // These options are the defaults for all files, but file-specific
        // options take precedence.
        level: 1,
        // Obfuscate last modified time by default
        mtime: new Date('1/1/1980')
    })
    // console.log('zipped', zipped)
    System.downloadBlob(zipped, 'download.zip', 'application/octet-stream')
}

const build = async () => {
    console.log('building...')

    if (!imageData.value) {
        return alert(`Oops! You must select a file to upload.`)
    }

    /* Initialize locals. */
    let response

    let formData = new FormData()

    formData.append('name', imageData.value?.name)

    formData.append('hi', 'there!')
    formData.append('hi', 'again...')

    formData.append('images[0]', imageData.value)

    response = await $fetch(ENDPOINT, {
        method: 'POST',
        body: formData,
    })
    .catch(err => console.error(err))
    console.log('RESPONSE (upload):', response)
}

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
            <h1 class="text-fuchsia-800 text-6xl lg:text-7xl font-light italic">
                Studio Lounge
            </h1>

            <h3 class="pl-5 text-fuchsia-600 text-xl lg:text-2xl font-medium tracking-tight">
                Manage Your Personas In-Style
            </h3>

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
