<script setup lang="ts">
useHead({
    title: `PRO — Nexa Studio`,
    meta: [
        { name: 'description', content: `Nexa Studio makes building your next BIG idea effortless.` }
    ],
})

/* Initialize stores. */
import { useWalletStore } from '@/stores/wallet'
import { useSystemStore } from '@/stores/system'
const Wallet = useWalletStore()
const System = useSystemStore()

const PRO_BASE_RATE = 50

const stakeline = ref('0')
const isShowingRecovery = ref(true)

const displayMonths = computed(() => {
    if (stakeline.value === '0') {
        return '30 Days'
    }
    else if (stakeline.value === '12') {
        return '1 Year'
    }
    else {
        return `${stakeline.value} Months`
    }
})

const displayProRate = computed(() => {
    if (stakeline.value === '0') {
        return PRO_BASE_RATE * 10
    }
    else if (stakeline.value === '3') {
        return PRO_BASE_RATE * 7.5
    }
    else if (stakeline.value === '6') {
        return PRO_BASE_RATE * 5
    }
    else if (stakeline.value === '9') {
        return PRO_BASE_RATE * 2.5
    }
    else if (stakeline.value === '12') {
        return PRO_BASE_RATE
    }
})

const activate = async () => {
    /* Confirm request. */
    if (confirm(`Are you sure you want to Activate this Stakeline?`)) {

        // TODO Calculate amount
        const amount = BigInt(1)

        /* Activate stakeline. */
        const result = await Wallet.activateStakeline(amount)
            .catch(err => {
                console.error(err.message)
                alert(err.message)
            })
        console.log('RESULT', result)

        /* Validate result. */
        if (result) {
            alert(JSON.stringify(result))
        }

    }
}

const closeout = async () => {
    /* Confirm request. */
    if (confirm(`Are you sure you want to CLOSEOUT this Stakeline?`)) {

        // FOR DEV PURPOSES ONLY
        const outpoint = 'fca0ce43c76800c363f9272c1fef87798120241d4e7c725070cde859a93cba4b'

        /* Activate stakeline. */
        const result = await Wallet.closeout({ outpoint })
            .catch(err => {
                console.error(err.message)
                alert(err.message)
            })
        console.log('RESULT', result)

        /* Validate result. */
        if (result) {
            alert(JSON.stringify(result))
        }

    }
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
    <main class="mx-auto max-w-7xl py-12 sm:px-2 sm:py-16 lg:px-4">
        <section class="mx-auto max-w-2xl px-4 lg:max-w-none">
            <div class="grid grid-cols-1 items-center gap-x-16 gap-y-10 lg:grid-cols-2">
                <div class="flex flex-col gap-5">
                    <h2 class="text-5xl font-bold tracking-tight text-gray-900">
                        Go <span class="text-6xl text-rose-400 font-light italic">PRO</span> for a One-of-a-Kind Builder Experience — it's <span class="text-6xl text-rose-400 font-light italic">FREE!</span>
                    </h2>

                    <p class="mt-4 text-xl leading-8 tracking-wide text-gray-500">
                        Are you ready to propel your career to the NEXT level?
                        <span class="font-bold">Activate your 1st stakeline</span> for INSTANT access to ALL PRO features, plus begin receiving DAILY rewards.
                    </p>

                    <p class="mt-4 text-xl leading-8 tracking-wide text-gray-500">
                        Receive daily airdrops of <span class="font-bold">25K $STUDIO Time</span>, plus ALL bonus rewards, during the entire duration of your PRO subscription.
                    </p>

                    <p class="mt-4 text-xl leading-8 tracking-wide text-gray-500">
                        At the end of your subscription, simply <span class="font-bold">closeout the stakeline</span> <em>(ie. redeem your assets)</em> — you can always <span class="font-bold">re-stake your assets</span> for NEW rewards at ANY time.
                    </p>
                </div>

                <div class="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg bg-gray-100 border-2 border-rose-300 shadow">
                    <img src="https://images.unsplash.com/photo-1615526675651-91bdbee68170?auto=format&fit=crop&q=80&w=1886&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" class="object-cover object-center" />
                </div>
            </div>
        </section>

        <section class="bg-white py-12 sm:py-16">
            <div class="mx-auto max-w-7xl px-6 lg:px-8">
                <div class="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                    <div class="p-8 sm:p-10 lg:flex-auto">
                        <h3 class="text-2xl font-bold tracking-tight text-gray-900">
                            Upgrade to Studio PRO
                        </h3>

                        <p class="mt-6 text-base leading-7 text-gray-600">
                            <span class="font-medium">
                                Studio PRO is 100% FREE Forever!
                            </span>

                            Just stake your assets for the time that you want access to PRO benefits and daily rewards.
                        </p>

                        <section class="max-w-2xl w-full mt-10">
                            <div class="px-5 py-2 flex flex-col items-center bg-gray-700 border-2 border-amber-300 shadow rounded-2xl">
                                <h2 class="pl-3 text-base font-medium text-amber-200 uppercase tracking-widest">
                                    Set Your Stakeline
                                </h2>

                                <input
                                    type="range"
                                    min="0"
                                    max="12"
                                    step="3"
                                    class="my-2 px-3 w-full h-8 bg-gray-200 rounded-2xl appearance-none cursor-pointer range-lg dark:bg-amber-400"
                                    v-model="stakeline"
                                />

                                <h2 class="pl-3 text-2xl font-medium text-amber-200 uppercase tracking-widest">
                                    {{displayMonths}}
                                </h2>
                            </div>

                            <div class="pl-5 text-sm text-rose-500 italic tracking-wider">
                                <h4 class="text-center">
                                    NOTE: The <span class="font-medium">LONGER</span> your stakeline, the <span class="font-medium">LESS</span> assets required for PRO activation.
                                </h4>
                            </div>
                        </section>

                        <div class="mt-10 flex items-center gap-x-4">
                            <h4 class="flex-none text-xl font-semibold leading-6 tracking-wider text-sky-600">
                                What’s included in PRO
                            </h4>
                            <div class="h-px flex-auto bg-gray-100"></div>
                        </div>

                        <ul role="list" class="mt-8 grid grid-cols-1 gap-4 text-xl leading-6 tracking-tighter font-light text-gray-600 sm:grid-cols-2 sm:gap-6">
                            <li class="flex gap-x-3">
                                <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                </svg>

                                <div>
                                    <span class="text-rose-500 text-2xl font-bold">25K</span> $STUDIO Daily Airdrop

                                    <div class="pl-3 flex flex-col text-xs text-rose-400 font-medium tracking-wide">
                                        <span class="">
                                            plus <span class="text-rose-500 text-sm font-bold">2X</span> thru 1st <span class="text-rose-500 text-sm font-bold">30</span> days of stakeline
                                        </span>

                                        <span class="">
                                            plus <span class="text-rose-500 text-sm font-bold">2X</span> thru <span class="text-rose-500 text-sm font-bold">Bootstrap</span> phase
                                        </span>
                                    </div>
                                </div>
                            </li>

                            <li class="flex gap-x-3">
                                <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                </svg>

                                Early Access to NEW Studios
                            </li>

                            <li class="flex gap-x-3">
                                <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                </svg>

                                Premium Builder Support
                            </li>

                            <li class="flex gap-x-3">
                                <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                </svg>

                                Exclusive Community Chats
                            </li>

                            <li class="flex gap-x-3">
                                <svg class="h-6 w-5 flex-none text-indigo-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                                </svg>

                                Exclusive Rewards
                            </li>
                        </ul>
                    </div>

                    <div class="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
                        <div class="h-full rounded-2xl bg-sky-100 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                            <div class="mx-auto max-w-xs px-3">
                                <h2 class="text-4xl font-semibold text-sky-800">
                                    It's 100% FREE!
                                </h2>

                                <h3 class="text-xl font-semibold text-sky-800">
                                    Stake As Long As You Want
                                </h3>

                                <p class="mt-6 flex items-baseline justify-center gap-x-2">
                                    <span class="text-8xl font-bold tracking-wide text-sky-900 italic">
                                        {{displayProRate}}
                                    </span>

                                    <span class="text-lg font-semibold leading-6 tracking-wide text-gray-600">
                                        $AVAS
                                    </span>

                                </p>

                                <p class="text-lg font-bold tracking-widest text-rose-400">
                                    Go PRO for {{displayMonths}}
                                </p>

                                <button
                                    @click="activate"
                                    class="mt-10 block w-full rounded-lg bg-indigo-600 px-3 py-5 text-center text-2xl font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Activate Stakeline
                                </button>

                                <p class="mt-6 text-base leading-5 text-gray-600">
                                    Early termination may result in loss of some or all of your remaining assets.
                                </p>
                            </div>

                            <button v-if="isShowingRecovery" @click="closeout" class="mt-5 mx-auto px-5 py-2 w-fit text-xl text-gray-800 font-bold bg-red-500 border-2 border-red-600 rounded-lg shadow hover:bg-red-400">
                                <span class="text-red-100">
                                    Closeout Stakeline
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <Footer />
</template>
