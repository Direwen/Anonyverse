<template>
  <div
    class="addPostComponent w-11/12 bg-anonybg flex justify-between items-center border border-anonyaccent transition-all ease-in-out duration-150 overflow-hidden sm:w-9/12 md:w-6/12"
    :class="{
      'flex-col gap-2 h-40 px-1 py-2 rounded-md border-anonysecondary':
        focusedState,
      'h-11 px-1 mx-auto rounded-lg rounded-t-2xl': !focusedState,
    }"
    @focusin="focus"
    @focusout="noFocus"
  >
    <textarea
      class="grow align-middle bg-transparent px-2 outline-none ring-0 text-anonysecondary select-none transition-all ease-in-out duration-300 rounded-2xl leading-8 cursor-pointer placeholder-anonysecondary"
      :class="{
        'pt-0 w-full overflow-y-scroll cursor-text': focusedState,
        'pt-8': !focusedState,
      }"
      placeholder="Say Something"
      v-model="postContent"
      @keyup.esc="noFocus"
    ></textarea>

    <button
      class="w-auto px-8 py-2 text-sm font-bold tracking-wide transition-all ease-in-out duration-300 text-anonysecondary bg-anonyprimary uppercase"
      :class="{
        'w-full active:scale-90 rounded-md': focusedState,
        'rounded-lg rounded-t-2xl': !focusedState,
      }"
      @click="post"
    >
      Post
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import store from "../store";
import { timestamp } from "../firebase/config";
import addPost from "../composables/addPost";
import extractTagsFromContent from "../composables/extractTagsFromContent";

let postContent = ref("");
let focusedState = ref(false);
let focus = () => {
  focusedState.value = true;
};
let noFocus = () => {
  focusedState.value = false;
};

let { extractTags } = extractTagsFromContent();
//TO filter the content and control the long string
let filteredContent = computed(() => {
  let isCertified = true;
  postContent.value.split(" ").forEach(word => {
    if (word.length > 45) {
      console.log("This one has more than 45 characters")
      isCertified = false;
    }
  });
  return isCertified;
});

//To upload the post
let post = async () => {
  //collecting data in an object to add to the database
  if (postContent.value.length > 0 && filteredContent.value) {
    let dataToAdd = {
      uid: store.getters["authMod/getUID"], // User's UID
      content: postContent.value,
      timestamp: timestamp,
      votes: {
        upvote: {
          count: 0,
          voters: [],
        },
        downvote: {
          count: 0,
          voters: [],
        },
      },
      tags: extractTags(postContent.value),
    };
    store.dispatch("postMod/setLoadingState", true);
    //changing the add box to default
    postContent.value = "";
    noFocus();

    let { error, addDocument } = addPost();
    await addDocument(dataToAdd);

    //to show Noti
    if (!error.value) {
      store.dispatch("postMod/showNoti", true);
    } else {
      store.dispatch("postMod/showNoti", false);
    }
  } else {
    //if the post content is blank
    store.dispatch("postMod/showNoti", false);
  }
};
</script>

<style></style>
