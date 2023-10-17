<template>
  <nav
    class="flex flex-col items-center bg-anonyprimary text-anonytext shadow-2xl z-20 gap-2 sm:px-2 sm:py-1 sm:flex-row sm:justify-between"
  >
  <!-- Left Side -->
    <div
      class="w-20 sm:w-25 md:w-30 border border-transparent rounded-full transition-all ease-in-out duration-300 hover:border-anonybg hover:bg-anonybg"
    >
      <img
        src="../assets/logo.png"
        alt="logo"
        class="transition-all ease-in-out duration-500 hover:saturate-150 hover:animate-pulse align-middle cursor-pointer"
      />
    </div>
  <!-- Right Side  -->
    <div
      class="w-full flex justify-center items-center gap-2 pb-2 px-4 sm:px-0 sm:w-10/12 md:w-8/12 lg:w-6/12 sm:text-left"
    >
      <!-- Search Box -->
      <input
        type="text"
        placeholder="Search Posts by tags"
        class="w-full bg-transparent placeholder-anonytext px-3 py-1 outline-none ring-0 select-none transition ease-in-out duration-300 rounded focus:bg-anonysecondary focus:text-anonyprimary focus:placeholder-anonyaccent sm:bg-anonysecondary sm:hover:bg-anonysecondary sm:placeholder-anonyprimary sm:text-anonyprimary"
        v-model="searchedTxt"
        @keyup.enter="searchByTag"
      />
      <span
        class="material-symbols-outlined align-middle select-none transition ease-in-out duration-300 hover:scale-110 active:scale-90 sm:text-3xl sm:mx-1" @click="searchByTag"
        >search</span
      >
      <!-- newsfeed icon *** added 'replace' to navigate-->
      <router-link :to="{ name: 'newsfeed' }" replace>
        <span
          class="material-symbols-outlined font-light align-middle select-none hidden transition ease-in-out duration-300 hover:scale-110 active:scale-90 sm:inline-block sm:text-3xl sm:mx-1"
          >feed</span
        >
      </router-link>
      <!-- profile icon *** added 'replace' to navigate -->
      <router-link
        :to="{ name: 'profile', params: { uid: uid }}" replace
        class="flex justify-center items-center p-2 rounded-full transition ease-in-out duration-500 active:scale-90 hover:bg-anonybg "
      >
        <span
          class="material-symbols-outlined font-light align-middle select-none hidden transition ease-in-out duration-300  sm:inline-block sm:text-3xl sm:mx-1"
          >account_circle</span
        >
        <span class="font-bold hidden sm:inline-block">
          {{ store.getters["authMod/getUserInfo"].email }}
        </span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "../store";

let router = useRouter();
let route = useRoute();
let uid = computed(() => store.getters["authMod/getUID"]);
let searchedTxt = ref('');

let searchByTag = () => {
  if(searchedTxt.value){
    let userInput = searchedTxt.value.charAt(0).toUpperCase() + searchedTxt.value.slice(1).toLowerCase()
    console.log(userInput);
    console.log(route.name);
    //direct the user to the newsfeed route
    router.push({name: "newsfeed"});
    //display Loading
    store.dispatch("postMod/setLoadingState", true);
    //Dispatch an action to change the query dynamically
    store.dispatch("queryMod/setQuery", userInput);
    //reset the input box
    searchedTxt.value = "";
  }else{
    store.dispatch("postMod/showNoti", false);
  }
}

</script>

<style></style>
