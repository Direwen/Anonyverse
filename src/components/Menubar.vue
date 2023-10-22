<template>
  <footer
    class="flex justify-evenly items-center bg-anonyprimary text-anonytext z-20  sm:hidden" style="box-shadow: 0px -5px .5rem rgba(0, 0, 0, .6);"
  >
    <router-link
      :to="{name: 'newsfeed'}"
      class="w-full transition-all ease-in-out duration-300 active:scale-50"
    >
      <span
        class="material-symbols-outlined w-full text-2xl font-light text-center py-4"
        >feed
      </span>
    </router-link>

    <router-link
      :to="{name: 'profile', params: {uid: uid}}"
      class="w-full transition-all ease-in-out duration-300 active:scale-90"
    >
      <span
        class="material-symbols-outlined w-full text-2xl font-light text-center py-4"
        >account_circle
      </span>
    </router-link>
  </footer>
</template>

<script setup>
import { computed } from "vue";
import store from "../store"

let uid = computed(() => store.getters["authMod/getUID"]);
// console.log("it works", uid);
</script>

<style></style>
