<template>
  <div class="relative w-fit bg-anonysecondary p-5 rounded-lg">
    <span
      class="material-symbols-outlined absolute top-2 right-2 font-semibold cursor-pointer transition-all ease-in-out duration-300 hover:text-red-900 hover:font-bold"
      @click="store.dispatch('postMod/closePopup')"
      >close</span
    >
    <p class="mt-5 mb-3 font-semibold text-anonybg">Are you sure to delete this post?</p>
    <button
      class="w-full text-center bg-red-800 py-2 rounded-lg transition-all ease-in-out duration-300 hover:bg-red-900"
      @click="deletePost(store.getters['postMod/getTempPost'].id)"
    >
      <span class="material-symbols-outlined align-middle text-anonysecondary"
        >delete</span
      >
    </button>
  </div>
</template>

<script setup>
import store from '../store';
import editDoc from '../composables/editDoc';

//to delete post
let deletePost = async (id) => {
  //close popup
  store.dispatch('postMod/closePopup');
  store.dispatch("postMod/setLoadingState", true);
  let { deletePost } = editDoc(id);
  await deletePost(id);
  
};
</script>

<style></style>
