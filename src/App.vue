<template>
    <side-menu-left/>
    <div class="container">
      <router-view />
    </div>
</template>

<script setup lang="ts">
import sideMenuLeft from "./components/side-menu-left.vue"

import flowsDataStore from "./stores/flows";
const store = flowsDataStore();


</script>

<style lang="scss" src="./assets/scss/index.scss">
</style>