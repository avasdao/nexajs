<script setup lang="ts">
/* Import modules. */
import Arweave from 'arweave'
import * as fflate from 'fflate'
import numeral from 'numeral'
import { sha256 } from '@nexajs/crypto'
import { binToHex } from '@nexajs/utils'

/* Initialize stores. */
import { useSystemStore } from '@/stores/system'
const System = useSystemStore()

// const _jsonToArray = function(json) {
//     const str = JSON.stringify(json, null, 0)
//     const ret = new Uint8Array(str.length)

//     for (var i = 0; i < str.length; i++) {
//         ret[i] = str.charCodeAt(i)
//     }

//     return ret
// }


const ENDPOINT = 'https://nexa.garden/v1/asset'

const imagePreviewUrl = ref(null)
const imageData = ref(null)

const README = `
   _______  ______________________   _________ __            .___.__
   \\      \\ \\_   _____/\\__    ___/  /   _____//  |_ __ __  __| _/|__| ____
   /   |   \\ |    __)    |    |     \\_____  \\\\   __\\  |  \\/ __ | |  |/  _ \\
  /    |    \\|     \\     |    |     /        \\|  | |  |  / /_/ | |  (  <_> )
  \\____|__  /\\___  /     |____|    /_______  /|__| |____/\\____ | |__|\\____/
          \\/     \\/                        \\/                 \\/

                                                      https://nft.nexa.studio

                               Thank you for choosing NFT Studio for Creators

-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --


  [ Token details go here... ]


-- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --

  Are you a Creative person with a passion for technology? If so, then you
  should really consider getting involved in the wonderfully disruptive and
  immensely rewarding world of Decentralized Application (dApp) building?

  Get started here --> https://nexa.studio


  Then check out some of our other Builder studios:
    1. https://nexa.studio/ai
    2. https://nexa.studio/wallet


  When you feel ready for a challenge, come participate in one of our seasonal
  Builder Festivals.

  Visit https://nexicana.org for more details.

`

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

const mint = async () => {
    /* Initialize locals. */
    let author
    let bindata
    let buf
    let cardBack
    let cardBackId
    let cardFront
    let cardFrontId
    let cardPlayMp3
    let cardPlayMp3Id
    let cardPlayMp4
    let cardPlayMp4Id
    let cardPlayOgg
    let cardPlayOggId
    let cardPlayWav
    let cardPlayWavId
    let cardPublic
    let cardPublicId
    let data
    let eternalVer
    let hash256
    let json
    let license
    let title
    let zipped

    /* Set EternalDB version. */
    eternalVer = '0.1'

    /* Set title. */
    title = `A Builder's Breakfast`

    /* Set author. */
    author = `Shomari`

    /* Set binary data. */
    bindata = '0000000000000001'

    /* Set data. */
    data = {
        mintid: 1
    }

    /* Set license. */
    license = ''

    /* Request (remote) asset. */
    buf = await $fetch('https://bafkreicqwnf5fdoxgzw7dpq6t5q7qhm33p644qi3rkwd5idyuy4sdtuiiy.nexa.garden')
        .catch(err => console.error(err))
    /* Convert (blob) to array buffer. */
    cardBack = new Uint8Array(await buf.arrayBuffer())
    cardBackId = sha256(sha256(cardBack))
    // console.log('CARD BACK (sha256):', binToHex(cardBackId))

    /* Request (remote) asset. */
    buf = await $fetch('https://bafybeifojzblnubcobpzgdcwk62iwfo74b3oamtmv5fjesgb3hdczta6fm.nexa.garden')
        .catch(err => console.error(err))
    /* Convert (blob) to array buffer. */
    cardFront = new Uint8Array(await buf.arrayBuffer())
    cardFrontId = sha256(sha256(cardFront))
    // console.log('CARD FRONT (sha256):', binToHex(cardFrontId))

    /* Request (remote) asset. */
    buf = await $fetch('https://bafybeic7crntw5ycafsfdnsw4hku32jlqmgrux2kqgsxrdi3hche7ashmq.nexa.garden')
        .catch(err => console.error(err))
    /* Convert (blob) to array buffer. */
    cardPublic = new Uint8Array(await buf.arrayBuffer())
    cardPublicId = sha256(sha256(cardPublic))
    // console.log('CARD PUBLIC (sha256):', binToHex(cardPublicId))

    /* Request (remote) asset. */
    buf = await $fetch('https://bafkreid332pr3yybhbk3gc46yycnlgy263sutwgv2unucumfvh6esyzffe.nexa.garden')
        .catch(err => console.error(err))
    /* Convert (blob) to array buffer. */
    cardPlayMp3 = new Uint8Array(await buf.arrayBuffer())
    cardPlayMp3Id = sha256(sha256(cardPlayMp3))
    // console.log('CARD PLAY MP3 (sha256):', binToHex(cardPlayMp3Id))

    /* Request (remote) asset. */
    buf = await $fetch('https://bafkreifefgf3udmjlw5jl6uo5zx3gmrm7gywoavhtpzn57u5r2mdimjlgi.nexa.garden')
        .catch(err => console.error(err))
    /* Convert (blob) to array buffer. */
    cardPlayOgg = new Uint8Array(await buf.arrayBuffer())
    cardPlayOggId = sha256(sha256(cardPlayOgg))
    // console.log('CARD PLAY OGG (sha256):', binToHex(cardPlayOggId))

    /* Request (remote) asset. */
    buf = await $fetch('https://bafkreic6on3pfgpsvpmj43u6pvt4eppnjptiybv6st7m3fesefjrt3uqru.nexa.garden')
        .catch(err => console.error(err))
    /* Convert (blob) to array buffer. */
    cardPlayWav = new Uint8Array(await buf.arrayBuffer())
    cardPlayWavId = sha256(sha256(cardPlayWav))
    // console.log('CARD PLAY WAV (sha256):', binToHex(cardPlayWavId))

    /* Build JSON package. */
    json = {
        eternalVer,
        title,
        author,
        series: `The Nexican Gallery`,
        subseries: `Gm!`,
        info: `This is the 1st NFT to bootstrap The Nexican Gallery's exclusive new collection.`,
        keywords: [
            'steak',
            'eggs',
            'ipa',
            'builder',
            'breakfast',
            'gm',
            'good morning',
            'amazon',
            'sunrise',
            'LFG'
        ],
        appuri: 'https://nexa.studio/app',
        category: 'NFT',
        assets: {
            public: {
                id: binToHex(cardPublicId),
                title: `Amazon Sunrise`,
                src: '/public.png',
                keywords: [],
                license: [
                    'CC-BY-NC-SA'
                ],
                royalty: [
                    {
                        receiver: 'ava.nexa',
                        rate: 333
                    }
                ]
            },
            cardf: {
                id: binToHex(cardFrontId),
                title: `Steak & Eggs à la IPA`,
                src: '/cardf.png',
                keywords: [],
                license: [
                    'SAMPLE_ASSET_ID0000000000000000000000000000000000000000000000001',
                    'SAMPLE_ASSET_ID0000000000000000000000000000000000000000000000022',
                    'SAMPLE_ASSET_ID0000000000000000000000000000000000000000000000333'
                ],
                royalty: {}
            },
            cardb: {
                id: binToHex(cardBackId),
                title: `LFG!`,
                src: '/cardb.png',
                keywords: [],
                license: [
                    'CC0'
                ],
                royalty: {}
            },
            play: [
                {
                    id: binToHex(cardPlayMp3Id),
                    title: `Ohh.. good morning!`,
                    src: '/play.mp3',
                    keywords: [],
                    license: [
                        'CC-BY-NC-SA'
                    ],
                    royalty: [
                        {
                            receiver: 'shomari.nexa',
                            rate: 546
                        }
                    ],
                    autoplay: false,
                    repeat: false,
                    loops: 0
                },
                {
                    id: binToHex(cardPlayOggId),
                    title: `Ohh.. good morning!`,
                    src: '/play.ogg',
                    keywords: [],
                    license: [
                        'CC-BY-NC-SA'
                    ],
                    royalty: [
                        {
                            receiver: 'shomari.nexa',
                            rate: 546
                        }
                    ],
                    autoplay: true,
                    repeat: false,
                    loops: 0
                },
                {
                    id: binToHex(cardPlayWavId),
                    title: `Ohh.. good morning!`,
                    src: '/play.wav',
                    keywords: [],
                    license: [
                        'CC-BY-NC-SA'
                    ],
                    royalty: [
                        {
                            receiver: 'shomari.nexa',
                            rate: 1337
                        }
                    ],
                    autoplay: false,
                    repeat: false,
                    loops: 0
                }
            ]
        },
        bindata,
        data,
        license,
    }

    zipped = fflate.zipSync({
        /* Add card back. */
        'cardb.png': [ cardBack, { level: 0 } ],

        /* Add card front. */
        'cardf.png': [ cardFront, { level: 0 } ],

        /* Add card public. */
        'public.png': [ cardPublic, { level: 0 } ],

        /* Add card play(s). */
        'play.mp3': [ cardPlayMp3, { level: 0 } ],
        'play.ogg': [ cardPlayOgg, { level: 0 } ],
        'play.wav': [ cardPlayWav, { level: 9 } ],

        /* Add card info. */
        'info.json': fflate.strToU8(JSON.stringify(json, null, 2)),

        /* Add README. */
        'README.TXT': fflate.strToU8(README),

    }, {
        // NOTE: Disables compression.
        level: 0,
    })
    console.log('ZIPPED', zipped)

    // let decompressed = fflate.unzipSync(zipped)
    // console.log('DECOMPRESSED', decompressed)

    /* Calculate double SHA-256 hash. */
    hash256 = sha256(sha256(zipped))
    console.log('HASH256', binToHex(hash256))

    /* Download ZIP archive. */
    System.downloadBlob(zipped, `Nexa_Token_Studio-${binToHex(hash256)}.zip`, 'application/octet-stream')
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

const init = async () => {
    console.log('Arweave', Arweave)

    /* Initialize locals. */
    let arweave

    arweave = Arweave.init({})
    console.log('arweave', arweave)
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
                NFT<span class="text-5xl lg:text-6xl text-sky-600 font-light">/</span>SFT Canvas
            </h1>

            <p class="mt-2 lg:mt-5 text-sm lg:text-base">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Id eius voluptatem minus natus at eveniet dolorum eos mollitia, maxime animi excepturi harum omnis illum odit recusandae pariatur! Unde, explicabo molestias.
            </p>
        </div>

        <MyLibrary />
    </section>

    <section class="my-5 flex flex-col lg:flex-row gap-4">
        <div class="flex-1 h-96 order-3">
            <h2 class="pl-3 text-gray-500 text-sm font-medium uppercase">
                Asset Designer
            </h2>

            <div class="h-full bg-rose-100 border border-rose-300 rounded-xl shadow">
                <!-- preview windows -->
            </div>
        </div>

        <div class="mt-5 w-full lg:w-32 h-32 lg:h-96 order-2">
            <Thumbnails />
        </div>

        <div class="w-[500px] order-1">
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
            @click="mint"
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
