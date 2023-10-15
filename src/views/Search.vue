<template>
  <div>
    <h1 v-if="posts.length == 0" class="smStroke pt-5 text-2xl text-center uppercase">No Matched result</h1>
    <div
      class="pt-5 w-full h-auto grid grid-cols-1 justify-items-center items-center gap-4 sm:grid-cols-2 md:pt-10 md:mt-5 lg:grid-cols-3 lg:mt-10"
      v-else
    >
        <Post v-for="post in posts" :key="post.id" :post="post"></Post>
    </div>
  </div>
</template>

<script setup>
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import store from "../store";
import { db } from "../firebase/config";
import Post from "../components/Post.vue";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

let route = useRoute();
let posts = ref([]);
let tempArr = [];

//a function to fetch real time data of posts
let initializeSearchListener = () => {
  //Step 1 >>> get the reference of the collection
  let collectionRef = collection(db, "anonyEntries");
  //Step 2 >>> get the query of collectino reference which is sorted by timestamp
  let collectionQry = query(
    collectionRef,
    where("tags", "array-contains", route.params.target),
    orderBy("timestamp", "desc")
  );
  //Step 3 >>> to initialize the onSnapshot listener
  onSnapshot(
    collectionQry,
    { includeMetadataChanges: true },
    (snapshotOfDocs) => {
      if (!snapshotOfDocs.metadata.hasPendingWrites) {
        console.log(
          "Found",
          snapshotOfDocs.docs.length,
          "result of",
          route.params.target
        );
        snapshotOfDocs.forEach((snapshotOfDoc) => {
          const docData = { ...snapshotOfDoc.data(), id: snapshotOfDoc.id };
          tempArr.push(docData);
        });
        posts.value = tempArr;
      }
      tempArr = [];
    }
  );
};

// Call the function to initialize the listener when the component is created
initializeSearchListener();

// console.log(route.params.target);
watch(
  () => route.params.target,
  () => {
    initializeSearchListener();
  }
);
</script>

<style></style>
