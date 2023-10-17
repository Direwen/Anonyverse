<template>
  <!-- if there are no posts yet -->
  <Loading v-if="store.getters['postMod/getLoadingState']"></Loading>
  <!-- If there are no results found -->
  <div
    v-else-if="
      store.getters['postMod/getPosts'].length == 0 &&
      !store.getters['postMod/getLoadingState']
    "
    class="mt-16 flex flex-col items-center justify-center"
  >
    <div
      v-if="store.getters['queryMod/getSearchMode']"
      class="mt-16 mb-5 text-xl flex justify-center items-center gap-2 uppercase font-bold text-anonysecondary border-2 border-anonysecondary w-fit px-2 py-1 rounded-lg m-auto cursor-pointer transition-all ease-in-out duration-100 hover:bg-anonysecondary hover:text-anonyprimary active:scale-90"
      @click="showAllPosts"
    >
      <span class="material-symbols-outlined align-middle"> widgets </span>
      <span> Show All Posts </span>
    </div>

    <h1 class="smStroke text-3xl">No Results</h1>
  </div>
  <!-- if there are posts -->
  <div v-else class="w-full">
    <div
      v-if="store.getters['queryMod/getSearchMode']"
      class="mt-16 mb-5 text-xl flex justify-center items-center gap-2 uppercase font-bold text-anonysecondary border-2 border-anonysecondary w-fit px-2 py-1 rounded-lg m-auto cursor-pointer transition-all ease-in-out duration-100 hover:bg-anonysecondary hover:text-anonyprimary active:scale-90"
      @click="showAllPosts"
    >
      <span class="material-symbols-outlined align-middle"> widgets </span>
      <span> Show All Posts </span>
    </div>

    <div
      class="h-auto grid grid-cols-1 justify-items-center items-center gap-4 sm:grid-cols-2 lg:grid-cols-3"
      :class="{
        'mt-16 md:mt-20 lg:mt-25': !store.getters['queryMod/getSearchMode'],
      }"
    >
      <Post
        v-for="post in store.getters['postMod/getPosts']"
        :key="post"
        :post="post"
      ></Post>
    </div>
  </div>
</template>

<script setup>
import Post from "./Post.vue";
import store from "../store";
import Loading from "./CustomLoading.vue";
import { onSnapshot } from "firebase/firestore";
import { onMounted, onUnmounted, watch } from "vue";

let showAllPosts = () => {
  store.dispatch("queryMod/resetQuery");
};

let realtimePostFetcher = () => {
  //Step 1 >>> create an empty array to temporarily store the data from Firestore
  let tempArr = [];
  //Step 2 >>> Set up a listener using onSnapshot to watch for changes in the Firestore collection.
  onSnapshot(
    store.getters["queryMod/getQuery"],
    { includeMetadataChanges: true },
    (snapshotOfDocs) => {
      const source = snapshotOfDocs.metadata.hasPendingWrites
        ? "Local"
        : "Server";
      if (source === "Server") {
        snapshotOfDocs.forEach((snapshotOfDoc) => {
          const docData = { ...snapshotOfDoc.data(), id: snapshotOfDoc.id };
          tempArr.push(docData);
        });
        store.dispatch("postMod/setPosts", tempArr);
        tempArr = [];
        //stop loading
        store.dispatch("postMod/setLoadingState", false);
      }
    }
  );
};

onMounted(() => {
  //display Loading
  store.dispatch("postMod/setLoadingState", true);
  // Step 3 >>> initialize the function
  setTimeout(() => {
    realtimePostFetcher();
  }, 500);
});

//Step 4 >>> For the dynamic search query, this will reinitialize the function depending on the changes of query from vuex
watch(
  () => store.getters["queryMod/getQuery"],
  () => {
    //display Loading
    store.dispatch("postMod/setLoadingState", true);
    setTimeout(() => {
      realtimePostFetcher();
    }, 1000);
  }
);

onUnmounted(() => {
  store.dispatch("queryMod/resetQuery");
});

console.log("UID => ", store.getters["authMod/getUID"]);

</script>

<style></style>
