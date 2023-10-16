<template>
  <div
    class="w-full self-start flex flex-col justify-between rounded-xl bg-anonysecondary text-anonyprimary transition-all ease-in-out duration-300 hover:-translate-y-2 hover:shadow-anonyprimary"
    @click="closeSubmenu"
  >
    <!-- Certified and Delete post container -->
    <div class="text-right flex justify-between items-center px-3 pt-2">
      <span
        class="material-symbols-outlined"
        :class="{ 'text-anonyaccent font-semibold': post.votes.upvote.count >= 2 }, {'text-gray-400': post.votes.upvote.count < 2}"
        >verified</span
      >
      <span
        class="material-symbols-outlined text-anonyaccent font-semibold cursor-pointer hover:text-red-900"
        v-if="post.uid == store.getters['authMod/getUID']"
        @click="callAction('confirmDelete')"
        >close</span
      >
    </div>
    <!-- top content container -->
    <div class="px-2 py-4 hover:cursor-pointer" @click="callAction('FullPost')">
      <small class="text-sm tracking-wider">{{ time }}</small>
      <p class="text-base break-words px-4 pt-2" v-html="highlightWords"></p>
    </div>

    <hr class="border-anonyprimary w-11/12 m-auto" />
    <!-- middle tags container -->
    <div class="my-2">
      <!-- Tag Input -->
      <Transition name="slideUp" mode="out-in">
        <div
          class="overflow-hidden w-full flex justify-evenly flex-wrap gap-1"
          v-if="!commentState"
        >
          <Tag v-for="tag in post.tags.slice(0, 3)" :key="tag" :tag="tag"></Tag>
        </div>
        <!-- comment input -->
        <input
          type="text"
          class="w-full bg-transparent text-anonyprimary p-3 outline-none placeholder-anonyaccent px-6"
          placeholder="Leave a comment"
          v-model="userComment"
          @keyup.enter="postComment"
          v-else
        />
      </Transition>
    </div>
    <!-- bottom Icon Container -->

    <div
      class="w-full bg-anonyprimary px-4 py-2 text-anonytext flex justify-around items-center rounded-b-xl relative"
    >
      <!-- >>>>>> UPVOTE <<<<<< -->
      <div class="upvote-container cursor-pointer" @click="increase_vote(1)">
        <span
          class="material-symbols-outlined align-middle transition-all ease-in-out duration-300 hover:-translate-y-0.5 active:scale-75 select-none"
          :class="{ 'text-green-300 font-bold': checkVoted(1) }"
          >arrow_upward</span
        >
        <span class="align-middle text-sm">{{ post.votes.upvote.count }}</span>
      </div>
      <!-- >>>>>>> DOWNVOTE <<<<< -->
      <div class="downvote-container cursor-pointer" @click="increase_vote(2)">
        <span
          class="material-symbols-outlined align-middle transition-all ease-in-out duration-300 hover:-translate-y-0.5 active:scale-75 select-none"
          :class="{ 'text-red-400 font-bold': checkVoted(2) }"
          >arrow_downward</span
        >
        <span class="align-middle text-sm">{{
          post.votes.downvote.count
        }}</span>
      </div>
      <!-- >>>>>>>> COMMENT <<<<<<<  -->
      <div class="commentIco-container cursor-pointer" @click="toggleComment">
        <span
          class="material-symbols-outlined align-middle transition-all ease-in-out duration-300 hover:-translate-y-0.5 active:scale-75 select-none"
          v-if="!commentState"
          >mode_comment</span
        >
        <span
          class="material-symbols-outlined align-middle transition-all ease-in-out duration-300 hover:-translate-y-0.5 active:scale-75 select-none"
          v-if="commentState"
          >tag</span
        >
      </div>
      <!-- >>>>>>>> : icon <<<<<<<<  -->
      <div
        class="editIco-container cursor-pointer"
        ref="submenuIconDiv"
        v-if="post.uid == store.getters['authMod/getUID']"
      >
        <span
          class="material-symbols-outlined align-middle transition-all ease-in-out duration-300 hover:-translate-y-0.5 active:scale-75 select-none"
          ref="submenuIcon"
          >more_vert</span
        >
      </div>

      <!-- Sub Menu -->
      <Transition name="submenu">
        <div
          class="w-fit h-fit bg-anonyprimary absolute -top-20 right-2 flex flex-col rounded-t-lg"
          v-if="submenuState"
          ref="submenu"
        >
          <!-- edit button -->
          <div class="cursor-pointer p-2" @click="callAction('EditPost')">
            <span
              class="material-symbols-outlined align-middle transition-all ease-in-out duration-300 hover:-translate-y-0.5 active:scale-75 select-none"
              >edit
            </span>
            Edit
          </div>
          <!-- delete button -->
          <div class="cursor-pointer p-2" @click="callAction('confirmDelete')">
            <span
              class="material-symbols-outlined align-middle transition-all ease-in-out duration-300 hover:-translate-y-0.5 active:scale-75 select-none"
              >delete
            </span>
            Delete
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import store from "../store";
import editDoc from "../composables/editDoc";
import Tag from "./Tag.vue";

let props = defineProps(["post"]);
//current account uid
let currentUID = store.getters["authMod/getUID"];
//method to calculate how long it's been
let time = computed(() => {
  const now = new Date();

  //Error hanlding for null timestamp
  let postDate;
  try {
    postDate = props.post.timestamp.toDate();
  } catch (error) {
    postDate = null;
  }

  //if postDate is null, it will return "Just now"
  if (!postDate) {
    return "Just now";
  } else {
    //calculate the difference of time in miliseconds
    const timegap = now - postDate;
    //converting it into hours, mins, secs
    const seconds = Math.floor(timegap / 1000); //1 second = 1000 miliseconds
    const minutes = Math.floor(seconds / 60); //1 minute = 60 seconds
    const hours = Math.floor(minutes / 60); //1 hour = 60 minutes
    //final conversion
    if (hours > 24) {
      return `${postDate.getDate()}/${
        postDate.getMonth() + 1
      }/${postDate.getFullYear()}`;
    } else if (hours >= 1 && hours <= 24) {
      return `${hours} hours ago`;
    } else if (minutes >= 1) {
      return `${minutes} mins ago`;
    } else if (seconds >= 1) {
      return `just ${seconds} secs ago`;
    } else {
      return "just now";
    }
  }
});
//computed to return the minimized content length at least 20 words
let minimizeContent = computed(() => {
  let content = props.post.content;
  let characterLimit = 200;
  console.log(content.length);
  if(content.length > characterLimit){
    return content.slice(0, characterLimit) + " ...";
  }else{
    return content.slice(0, characterLimit);
  }
});

//computed to return the content along with html tags for highlighted tags
let highlightWords = computed(() => {
  return minimizeContent.value.replace(
    /#(\w+)/g,
    "<span class='font-semibold'>#$1</span>"
  );
});
//call Vuex action
let callAction = (modeName) => {
  const dataToPass = {
    mode: modeName,
    post: props.post,
  };
  //call Vuex action to activate pop up
  store.dispatch("postMod/openPopup", dataToPass);
};
//toggle comment
let commentState = ref(false);
let toggleComment = () => {
  commentState.value = !commentState.value;
};
//to check whether this user has already voted this post for the display
let checkVoted = (typeOfVote) => {
  const voters = (typeOfVote === 1) ? props.post.votes.upvote.voters : props.post.votes.downvote.voters;
  return voters.includes(currentUID);
}   
//to increase the vote
let increase_vote = async (typeOfVote) => {
  let {increaseVote} = editDoc(props.post.id);
  await increaseVote(currentUID, typeOfVote, checkVoted(1), checkVoted(2))
};
//to toggle submenu state
let submenuIconDiv = ref("submenuIconDiv");
let submenuIcon = ref("submenuIcon");
let submenu = ref("submenu");
let submenuState = ref(false);
let closeSubmenu = (event) => {
  if (submenuState.value === true) {
    if (
      event.target == submenuIconDiv.value ||
      event.target == submenuIcon.value
    ) {
      submenuState.value = false;
    } else if (
      event.target !== submenuIconDiv.value &&
      event.target !== submenu.value &&
      event.target !== submenuIcon.value
    ) {
      submenuState.value = false;
    } else if (event.target == submenuIconDiv.value) {
      submenuState.value = false;
    }
  } else {
    if (
      event.target == submenuIconDiv.value ||
      event.target == submenuIcon.value
    ) {
      submenuState.value = true;
    }
  }
};
//comment section
let userComment = ref("");
let postComment = async () => {
  if(userComment.value){
    //upload comment
    let {uploadComment} = await editDoc(props.post.id);
    await uploadComment(userComment.value)
    .then(() => {
      //back to default setting 
      console.log("Show Noti Box")
      store.dispatch("postMod/showNoti", true);
      userComment.value = "";
      commentState.value = false;
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
</script>

<style></style>
