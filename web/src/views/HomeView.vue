<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <h1 class="text-5xl text-pink-500 font-bold">Tailwind CSS</h1>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  }
}
</script>
