<template>
  <div
    class="fullcontent-container grow w-full px-2 bg-transparent text-anonysecondary flex flex-col items-center gap-5 overflow-y-scroll md:w-full md:flex-row md:h-screen md:overflow-hidden md:gap-0 md:px-5"
  >
    <!-- FULL CONTENT SECTION -->
    <div
      class="fullContentShowcase-container bg-transparent rounded-2xl whitespace-pre-line w-full md:w-3/5 md:h-full md:overflow-y-scroll md:px-5 md:py-10"
    >
      <!-- Content -->
      <p class="break-words">{{ store.getters["postMod/getTempPostContent"] }}</p>
      <!-- Tags -->
      <button
        class="w-full mt-5 py-2 px-4 rounded-2xl bg-anonysecondary text-anonyprimary text-md font-bold tracking-widest flex justify-between transition-all ease-in-out duration-300"
        :class="{ 'px-10 rounded-b-none': tagBoxMode }"
        @click="tagBoxMode = !tagBoxMode"
      >
        Tags
        <span
          class="material-symbols-outlined align-middle font-bold"
          v-if="!tagBoxMode"
          >expand_more</span
        >
        <span
          class="material-symbols-outlined align-middle font-bold"
          v-if="tagBoxMode"
          >expand_less</span
        >
      </button>
      <Transition name="tagBox">
        <div
          class="bg-anonysecondary flex flex-wrap justify-start items-center gap-2 py-3 px-5 rounded-b-2xl"
          v-if="tagBoxMode"
        >
          <Tag v-for="tag in store.getters['postMod/getTempPostTag']" :key="tag" :tag="tag"></Tag>
          
        </div>
      </Transition>
    </div>

    <!-- COMMENT SECTION -->
    <div
      class="hide-scroll w-full h-auto bg-anonyprimary rounded-lg px-2 py-5 md:h-full md:w-2/5 md:px-5 md:py-10 md:rounded-lg md:overflow-y-scroll"
    >
      <!-- comment title -->
      <div class="flex justify-between items-center">  
        <h3 class="text-xl font-bold tracking-wider uppercase">Comments</h3>
        <!-- <span class="material-symbols-outlined align-middle transition-all ease-in-out duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-xl">help</span> -->
      </div>
      <!-- comment input box for the user -->
      <div class="relative mt-2 mb-10">
        <input
          type="text"
          class="w-full bg-transparent text-anonytext p-2 pr-11 outline-none placeholder-anonytext border-b-2 border-b-anonyaccent transition-all ease-in-out duration-300 focus:border-b-anonytext"
          placeholder="Leave a comment here"
          v-model="userComment"
          oninvalid="alert('Must contain 6 or more characters');" pattern=".{6,10}"
          @keyup.enter="postComment"
        />
        <span
          class="material-symbols-outlined absolute top-0 right-0 text-anonytext cursor-pointer p-2 align-middle h-full rounded-t-md transition-all ease-in-out duration-300 hover:bg-anonybg"
          @click="postComment"
        >
          send
        </span>
      </div>
      <!-- Display all comments -->
      <Transition name="popup2" mode="out-in">
        <!-- if the comments are fully loaded yet -->
        <CS v-if="!skeletonMode"></CS>
        <!-- if the comments are ready to be displayed -->
        <div class="flex flex-col gap-10 items-center justify-center" v-else>
          <h1 class="smStroke sm:text-xl" v-if="commentsOfPost.length == 0">No one has commented yet</h1>
          <Comment v-for="comment in commentsOfPost" :key="comment.id" :comment="comment"></Comment>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import store from "../store";
import Comment from "./Comment.vue";
import editDoc from "../composables/editDoc";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import {db} from "../firebase/config"
import Tag from "./Tag.vue";
import CS from "./CommentSkeleton.vue";


let tagBoxMode = ref(false);
//comment section
let userComment = ref("");
let commentsOfPost = ref([]);
let skeletonMode = ref(false);
let postComment = async () => {
  if(userComment.value){
    //upload comment
    let {uploadComment} = await editDoc(store.getters["postMod/getTempPost"].id);
    await uploadComment(userComment.value)
    .then(() => {
      //back to default setting 
      console.log("Show Noti Box")
      store.dispatch("postMod/showNoti", true);
      userComment.value = "";
      // window.location.reload();
    })
    .catch((error) => {
      store.dispatch("postMod/showNoti", false);
      console.log(error.message);
    })
    
  }else{
    console.log("Empty Comment");
    store.dispatch("postMod/showNoti", false);
  }
}
// turning a collection reference into a query
let dbQuery = query(collection(db, "anonyEntries", store.getters["postMod/getTempPostId"], "comments"), orderBy("timestamp", "desc"));
onSnapshot(dbQuery, docSnapshot => {
  //clear the old data first
  commentsOfPost.value = [];
  //loop through the documents of the docSnapshot
  docSnapshot.docs.forEach(doc => {
    commentsOfPost.value.push({...doc.data(), id: doc.id})
  }) 
  setTimeout(() => {
    skeletonMode.value = true;
  }, 500);
})
</script>

<style></style>
