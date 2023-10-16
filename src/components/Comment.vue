<template>
  <div @dblclick="toggleReactionBtn" class="w-full">
    <!-- Main Comment -->
    <div
      class="w-full bg-anonytext px-3 pt-5 pb-2 rounded-xl relative shadow-xl z-10 transition-all ease-in-out duration-300 md:w-11/12 md:m-auto"
      
    >
      <!-- Comment Timestamp -->
      <span
        class="absolute -top-4 -right-1 px-2 py-1 bg-anonybg shadow-xl rounded-md text-sm sm:text-base"
      >
        {{ timeConverter(comment.timestamp) }}
      </span>
      <!-- Comment Text -->
      <div class="text-anonyprimary mb-2">
        <span
          class="text-sm font-semibold underline underline-offset-2 block mb-1"
          >{{textForWhoseCommentItIs}}</span
        >
        <p class="text-justify break-words">{{ comment.commentText }}</p>
      </div>
      <!-- Reply Input Box -->
      <div class="text-anonyprimary relative">
        <Transition name="slideToRight" mode="out-in">
          <!-- if the state if OFF -->
          <div
            v-if="!replyInputBoxState"
            class="flex justify-center items-center"
          >
            <button
              class="w-1/2 grow cursor-pointer px-2 py-1 font-semibold transition-all ease-in-out duration-300 rounded-full hover:bg-anonyprimary hover:text-anonysecondary"
              @click="controlReplyInput"
              v-if="isYourCmt"
            >
              Reply
              <span class="material-symbols-outlined align-middle ml-2"
                >toggle_on</span
              >
            </button>
            <!-- DELETE COMMENT Button-->
            <button
              class="w-1/2 text-red-800 px-2 py-1 font-semibold transition-all ease-in-out duration-300 rounded-full hover:bg-red-800 hover:text-anonysecondary active:scale-90"
              @click="deleteComment"
              :class="{ hidden: !isYourMsg }"
              v-if="isYourCmt"
            >
              Delete
              <span class="material-symbols-outlined align-middle select-none">
                delete
              </span>
            </button>
          </div>
          <!-- if the state is ON -->
          <div v-else>
            <input
              type="text"
              class="bg-transparent w-full placeholder:text-anonyprimary border-b-2 border-b-anonyaccent px-2 py-1 pr-8 outline-none transition-all ease-in-out duration-300 focus:border-b-anonybg"
              placeholder="Leave a reply here"
              v-model="replyText"
              maxlength="150"
              @keyup.enter="postReply"
            />
            <span
              class="material-symbols-outlined align-middle absolute top-1 right-0 cursor-pointer"
              @click="controlReplyInput"
              v-if="isYourCmt"
              >swap_horiz</span
            >
          </div>
        </Transition>
      </div>
      <!-- Display Replies -->
      <div class="mt-3 text-anonyprimary">
        <!-- show/hide button replies -->
        <button
          class="w-full bg-anonybg text-anonytext py-1 rounded-md"
          @click="showReplies = !showReplies"
        >
          {{ textForReplyDisplayBtn }}
          <span
            class="material-symbols-outlined align-middle animate-bounce"
            v-if="!showReplies"
            >stat_minus_2</span
          >
          <span
            class="material-symbols-outlined align-middle animate-bounce"
            v-else
            >stat_2</span
          >
        </button>
        <Transition name="slideUp2">
          <div v-if="showReplies" class="my-3">
            <!-- title part of display replies -->
            <div class="flex justify-evenly items-center gap-1">
              <span class="bg-anonyprimary grow h-1"></span>
              <span class="w-fit">{{ repliesOfComment.length }} Replies</span>
              <span class="bg-anonyprimary grow h-1"></span>
            </div>
            <!-- replies -->
            <Reply
              v-for="reply in repliesOfComment"
              :key="reply.id"
              :reply="reply"
              :commentOwnerUid="comment.commentatorUid"
              :commentId = "comment.id"
            ></Reply>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import timeConverter from "../composables/timeConverter";
import commentModifier from "../composables/commentModifier";
import store from "../store";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import Reply from "./Reply.vue";
import checkOwnership from "../composables/checkOwnership";

const props = defineProps(["comment"]);
//Reply section
let replyInputBoxState = ref(true);
let showReplies = ref(false);
let isYourCmt = computed(() => checkOwnership(props.comment.commentatorUid));
let replyText = ref("");
let repliesOfComment = ref([]);
// let replyInputBoxStateForAnonym = ref(true);
let controlReplyInput = () => {
  if(isYourCmt){
    replyInputBoxState.value = !replyInputBoxState.value;
  }else{
    console.log("anonym")
  }
  return replyInputBoxState.value;
};
let textForReplyDisplayBtn = computed(() => {
  if (!showReplies.value) {
    if (repliesOfComment.value.length == 0) {
      return "No Replies";
    } else if (repliesOfComment.value.length == 1) {
      return "Show 1 Reply";
    } else {
      return `Show ${repliesOfComment.value.length} replies`;
    }
  } else {
    return "Hide Replies";
  }
});
//upload reply function
let postReply = async () => {
  //checking whether the reply is null or blank
  if (replyText.value) {
    let { uploadReply } = commentModifier(props.comment.id);
    await uploadReply(replyText.value);
    replyText.value = "";
  }
};
//delete button function
let deleteComment = async () => {
  let { deleteComment } = commentModifier(props.comment.id);
  await deleteComment();
};

//reaction button
let toggleReactionBtn = async () => {
  if (checkOwnership(store.getters["postMod/getTempPost"].uid)) {
    let { reactComment } = commentModifier(props.comment.id);
    await reactComment();
  } else {
    console.log("You can't react to a comment");
  }
};
//determine whether this is the comment owner or not
let isYourMsg = computed(() => {
  return checkOwnership(props.comment.commentatorUid);
});
//text for whose comment it is
let textForWhoseCommentItIs = computed(() => {
  if(checkOwnership(props.comment.commentatorUid) && checkOwnership(store.getters['postMod/getTempPost'].uid)) {
    return "You (Author)";
  }else if(checkOwnership(props.comment.commentatorUid)){
    return "You";
  }else if(!checkOwnership(props.comment.commentatorUid) && props.comment.commentatorUid === store.getters["postMod/getTempPost"].uid){
    return "Author";
  }else{
    return "Anonym";
  }
})

//Turn the replies sub-collection into a query for onSnapshot
let repliesQuery = query(
  collection(
    db,
    "anonyEntries",
    store.getters["postMod/getTempPostId"],
    "comments",
    props.comment.id,
    "replies"
  ),
  orderBy("timestamp", "desc")
);
onSnapshot(repliesQuery, async (docSnapshot) => {
  repliesOfComment.value = [];
  docSnapshot.docs.forEach((doc) => {
    repliesOfComment.value.push({ ...doc.data(), id: doc.id });
  });
});
</script>

<style></style>
