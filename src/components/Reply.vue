<template>
  <div
    class="my-3 transition-all ease-in duration-300 rounded-lg p-2 hover:bg-anonybg hover:text-anonytext"
  >
    <span
      class="text-sm font-semibold underline underline-offset-2 block mb-1"
      >{{ textForWhoseReplyItIs }}</span
    >
    <p class="text-sm">
      {{ reply.text }}
    </p>

    <div class="my-2 flex justify-end items-center gap-4">
      <span class="material-symbols-outlined align-middle select-none p-1 rounded-full cursor-pointer text-anonyprimary tansition-all ease-in-out duration-300 hover:bg-red-800 hover:text-anonysecondary active:scale-75" @click="deleteReply" v-if="reply.responderUid === store.getters['authMod/getUID']">
        delete
      </span>
      <small class="text-right">{{ timeConverter(reply.timestamp) }}</small>
    </div>
    <hr class="border-anonyaccent w-10/12 m-auto" />
  </div>
</template>

<script setup>
import { computed } from "vue";
import timeConverter from "../composables/timeConverter";
import checkOwnership from "../composables/checkOwnership";
import store from "../store";
import commentModifier from "../composables/commentModifier";

let props = defineProps(["reply", "commentOwnerUid", "commentId"]);
let textForWhoseReplyItIs = computed(() => {
  if (
    checkOwnership(props.reply.responderUid) &&
    checkOwnership(store.getters["postMod/getTempPost"].uid) &&
    checkOwnership(props.commentOwnerUid)
  ) {
    return "You (Author)";
  } else if (checkOwnership(props.reply.responderUid)) {
    return "You";
  } else if (
    store.getters["postMod/getTempPost"].uid === props.reply.responderUid
  ) {
    return "Author";
  } else if (props.reply.responderUid === props.commentOwnerUid) {
    return "Anonym (Commentor)";
  } else if (
    store.getters["postMod/getTempPost"].uid !== props.responderUid &&
    props.commentOwnerUid === props.reply.responderUid
  ) {
    return "Author";
  } else {
    return "Anonym";
  }
});

let deleteReply = async () => {
  let {deleteReply} = commentModifier(props.commentId);
  try {
    await deleteReply(props.reply.id);
  } catch (error) {
    console.log(error.message);
  }
  
}
</script>

<style></style>
