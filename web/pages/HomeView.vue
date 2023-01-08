<template>
    <main class="bg-white">
        <HeroView />

        <LogoCloud class="hidden" />

        <FeaturesView class="hidden" />

        <StatsView class="hidden" />

        <GetStarted class="" />
    </main>
</template>

<script>
/* Import components. */
import FeaturesView from '@/components/FeaturesView'
import GetStarted from '@/components/GetStarted'
import HeroView from '@/components/HeroView'
import LogoCloud from '@/components/LogoCloud'
import StatsView from '@/components/StatsView'

export default {
    components: {
        FeaturesView,
        GetStarted,
        HeroView,
        LogoCloud,
        StatsView,
    }
}
</script>
