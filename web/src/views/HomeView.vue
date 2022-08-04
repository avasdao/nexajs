<template>
    <main class="bg-white">
        <HeroView />

        <LogoCloud class="hidden" />

        <FeaturesView class="hidden" />

        <StatsView class="hidden" />

        <LearnMore class="" />
    </main>
</template>

<script>
/* Import components. */
import FeaturesView from '@/components/FeaturesView'
import HeroView from '@/components/HeroView'
import LearnMore from '@/components/LearnMore'
import LogoCloud from '@/components/LogoCloud'
import StatsView from '@/components/StatsView'

export default {
    components: {
        FeaturesView,
        HeroView,
        LearnMore,
        LogoCloud,
        StatsView,
    }
}
</script>
