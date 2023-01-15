<template>
    <main class="w-full overflow-x-hidden flex flex-col justify-center items-center">
        <HeaderView />
        <section>
            <h1 class="text-5xl text-indigo-500 font-medium">
                NexaJS
            </h1>

            <p>
                A complete guide to the JavaScript NEXA library for Node.js and browsers.
            </p>

            <ol class="mt-10 flex flex-col gap-2">
                <NuxtLink to="/cashlib">
                    CashLib
                </NuxtLink>

                <NuxtLink to="/gettx">
                    Get Transaction
                </NuxtLink>

                <NuxtLink to="/cli">
                    Command-line Interface
                </NuxtLink>
            </ol>

            <p class="w-96">
                # Introduction

                Nexa began with the idea of creating an experimental blockchain to innovate on the bleeding edge of what Bitcoin could manage.

                The original incantation, [NextChain](https://www.nextchain.cash/) is now known as Nexa Coin.
            </p>

            <p class="w-96">
                features:
                - title: Group Tokenization
                  details: Nexa has advanced token functionality built directly into the protocol by default.
                - title: Advanced Smart Contracts
                  details: Nexa has deployed "transaction introspection" allowing smart-contracts to query their own code.
                - title: Double-spend Proofs
                  details: Double-spend proofs allow businesses to offer faster payments while lowering the risks of fraud.
            </p>
        </section>
        <FooterView />
    </main>
</template>

<script>
export default {
    //
}
</script>
