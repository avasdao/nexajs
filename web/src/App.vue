<template>
    <HeaderView />

    <router-view />

    <FooterView />
</template>

<script>
/* Import components. */
import FooterView from '@/components/FooterView'
import HeaderView from '@/components/HeaderView'

export default {
    components: {
        FooterView,
        HeaderView,
    }
}
</script>

<style>
/*  */
</style>
