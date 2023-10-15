<template>
  <span
    class="absolute top-0 right-0 px-9 py-3 rounded font-semibold z-30"
    :class="{
      'bg-red-600': !store.getters['postMod/getNotiStatus'],
      'text-gray-100': !store.getters['postMod/getNotiStatus'],
      'bg-green-400': store.getters['postMod/getNotiStatus'],
      'text-green-900': store.getters['postMod/getNotiStatus'],
    }"
    v-if="store.getters['postMod/getNotiShow']"
    >{{ notiText }}</span
  >
</template>

<script setup>
import { computed } from "vue";
import store from "../store";

let notiText = computed(() => store.getters["postMod/getNotiState"]);
</script>

<style></style>
