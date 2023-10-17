<template>
  <!-- Loading -->
  <Loading v-if="store.getters['postMod/getLoadingState']"></Loading>
  <!-- If there are no posts and loading is also done  -->
  <div
    v-else-if="
      store.getters['postMod/getUserPosts'].length == 0 &&
      !store.getters['postMod/getLoadingState']
    "
    class="flex flex-col justify-start items-center gap-5 px-1 mt-5"
  >
    <p
      class="smStroke text-transparent font-semibold text-xl text-center uppercase animate-bounce sm:text-2xl lg:text-3xl"
    >
      Start Your Journey with a Post!
    </p>
    <AddPost class=""></AddPost>
    <img src="../assets/noPost.svg" alt="" class="w-3/5 sm:w-4/12 lg:w-3/12" />
  </div>
  <!-- If there are posts -->
  <div
    class="my-5 w-full h-auto grid grid-cols-1 justify-items-center items-cente gap-4 sm:grid-cols-2 md:mt-5 lg:grid-cols-3"
    v-else
  >
    <Post
      v-for="post in store.getters['postMod/getUserPosts']"
      :key="post"
      :post="post"
    ></Post>
  </div>
</template>

<script setup>
import Post from "../components/Post.vue";
import { onSnapshot } from "firebase/firestore";
import store from "../store";
import { onMounted, ref } from "vue";
import Loading from "./CustomLoading.vue";
import AddPost from "./AddPost.vue";

// Create an empty array to temporarily store the data from Firestore.
let tempArr = ref([]);

let realtimePostFetcher = () => {
  console.log("in fetcher");
  // Set up a listener using onSnapshot to watch for changes in the Firestore collection.
  onSnapshot(
    store.getters["queryMod/getQueryForOwner"],
    { includeMetadataChanges: true },
    (snapshotOfDocs) => {
      const source = snapshotOfDocs.metadata.hasPendingWrites
        ? "Local"
        : "Server";
      if (source === "Server") {
        snapshotOfDocs.forEach((snapshotOfDoc) => {
          const docData = { ...snapshotOfDoc.data(), id: snapshotOfDoc.id };
          tempArr.value.push(docData);
        });
        console.log("got ", tempArr.value.length, " posts");
        store.dispatch("postMod/setUserPosts", tempArr.value);

        tempArr.value = [];
        store.dispatch("postMod/setLoadingState", false);
      }
    }
  );
};

onMounted(() => {
  store.dispatch("postMod/setLoadingState", true);
  setTimeout(() => {
    realtimePostFetcher();
  }, 500);
});
</script>

<style></style>
