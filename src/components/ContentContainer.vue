<template>
  <main class="content-container bg-anonybg w-screen">
    <router-view></router-view>
    <!-- Popup Componnet teleporting to body tag -->
  <teleport to="body">
    <Transition name="popup">
      <PopupBox v-if="store.getters['postMod/getPopupMode']"></PopupBox>
    </Transition>
  </teleport>
  </main>
  
</template>

<script setup>
import store from "../store";
import PopupBox from "./PopupBox.vue";
</script>

<style>

</style>