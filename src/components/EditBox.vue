<template>
  <div
    class="grow w-11/12 rounded-2xl my-2 mx-auto p-4 bg-anonyprimary flex flex-col justify-between items-center gap-5 ring-4 ring-anonyaccent sm:w-9/12 md:w-6/12"
  >
    <textarea
      placeholder="Say Something"
      class="text-base w-full h-full p-4 outline-none text-anonysecondary bg-transparent"
      v-model="contentToEdit"
    ></textarea>
    <p v-if="errorForEditing" class="text-red-300 text-sm">
      {{ errorForEditing }}
    </p>
    <button
      class="uppercase tracking-wider text-lg font-bold bg-anonysecondary text-anonyprimary w-full border border-gary-100 rounded-md p-2 transition-all ease-in-out duration-300 active:scale-95"
      @click="edit"
    >
      Edit
    </button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import store from "../store";
import editDoc from "../composables/editDoc";

let contentToEdit = ref("");
let errorForEditing = ref(null);
//to edit the post
let { editContent } = editDoc(store.getters["postMod/getTempPost"].id);
let edit = async () => {
  let { err } = await editContent(contentToEdit.value);
  if (err) {
    errorForEditing.value = err;
  }
};
//on mounted cycle hook
onMounted(() => {
  contentToEdit.value = store.getters["postMod/getTempPostContent"];
});
</script>

<style></style>
