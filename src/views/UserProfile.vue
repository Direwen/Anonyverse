<template>

  <section class="py-5 px-2 sm:px-6 md:px-10 lg:px-14">
    <div class="w-full flex flex-col items-center justify-around px-2">
      <button
        class="py-2 px-3 rounded-lg bg-red-800 text-md text-gray-100 font-semibold transition-all ease-in-out duration-300 active:scale-90 sm:text-xl sm:px-4"
        @click="logout"
      >
        <span class="material-symbols-outlined align-middle">logout</span>
        Log Out
      </button>
    </div>
    <!-- if there are no posts -->
    <div v-if="noPost" class="flex flex-col justify-start items-center gap-5 px-1 mt-5">
      <p class="smStroke text-transparent font-semibold text-xl text-center uppercase animate-bounce sm:text-2xl lg:text-3xl">Start Your Journey with a Post!</p>
      <AddPost class=""></AddPost>
      <img src="../assets/noPost.svg" alt="" class="w-3/5 sm:w-4/12 lg:w-3/12">
    </div>
    <!-- if there are posts -->
    <div
      class="my-5 w-full h-auto grid grid-cols-1 justify-items-center items-cente gap-4 sm:grid-cols-2 md:mt-5 lg:grid-cols-3" v-else
    >
      <Post v-for="post in userPosts" :key="post" :post="post"></Post>
    </div>
  </section>
</template>

<script setup>
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "vue-router";
import store from "../store";
import { ref } from "vue";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import Post from "../components/Post.vue";
import AddPost from "../components/AddPost.vue";

let router = useRouter();
let userPosts = ref([]);
let noPost = ref(true);
//Function to logout
let logout = () => {
  console.log("Log Out");
  signOut(auth);
  router.push("/");
};

//real-time database fetching function
//Step 1 >>> get the database reference
const collectionRef = collection(db, "anonyEntries");

//Step 2 >>> get the query of collectino reference which is sorted by timestamp
const collectionQry = query(
  collectionRef,
  where("uid", "==", store.getters["authMod/getUID"]),
  orderBy("timestamp", "desc")
);

//Step 3 >>> onSnapshot functino
// Create an empty array to temporarily store the data from Firestore.
let tempArr = [];
// Set up a listener using onSnapshot to watch for changes in the Firestore collection.
onSnapshot(
  collectionQry,
  { includeMetadataChanges: true },
  (snapshotOfDocs) => {
    const source = snapshotOfDocs.metadata.hasPendingWrites
      ? "Local"
      : "Server";
    if (source === "Server") {
      if (snapshotOfDocs.docs.length == 0) {
        noPost.value = true;
      } else {
        noPost.value = false;
        snapshotOfDocs.forEach((snapshotOfDoc) => {
          const docData = { ...snapshotOfDoc.data(), id: snapshotOfDoc.id };
          tempArr.push(docData);
        });
        userPosts.value = tempArr;
        tempArr = [];
      }
    }
  }
);
</script>

<style></style>
