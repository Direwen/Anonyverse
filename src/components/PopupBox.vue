<template>
  <div
    class="popupContainer absolute top-0 left-0 w-screen h-screen flex flex-col items-center gap-5 pb-4 z-20"
    :class="{
      'pb-0 gap-0 bg-yellow-300': store.getters['postMod/getFullPostMode'],
      'justify-center': store.getters['postMod/getConfirmMode'],
    }"
    @click="closePopup"
    ref="popupContainer"
  >
    <!-- close button start -->
    <div
      class="w-screen p-1 text-center bg-red-700 text-anonysecondary rounded-b-full cursor-pointer transition-all ease-in-out duration-300 hover:bg-red-900"
      :class="{
        'hidden': store.getters['postMod/getConfirmMode'],
        'rounded-b-none': store.getters['postMod/getFullPostMode'],
      }"
      @click="store.dispatch('postMod/closePopup')"
    >
      <span
        class="material-symbols-outlined items-center align-middle font-semibold text-3xl"
        >dangerous</span
      >
    </div>
    <!-- close button end -->

    <ConfirmDeleteBox
      v-if="store.getters['postMod/getConfirmMode']"
    ></ConfirmDeleteBox>

    <!--EDIT input box start-->
    <EditBox v-if="store.getters['postMod/getEditMode']"></EditBox>
    <!-- EDIT INPUT BOX END -->

    <!-- FULL POST START -->
    <FullPost v-if="store.getters['postMod/getFullPostMode']"></FullPost>
    <!-- FULL POST END -->
  </div>
</template>

<script setup>
import EditBox from "./EditBox.vue";
import FullPost from "./FullPost.vue";
import ConfirmDeleteBox from "./ConfirmDeleteBox.vue";
import store from "../store";
import { onUnmounted, ref } from "vue";

let popupContainer = ref("popupContainer");
let closePopup = (event) => {
  if (event.target === popupContainer.value) {
    store.dispatch("postMod/closePopup");
  }
};

</script>

<style></style>
