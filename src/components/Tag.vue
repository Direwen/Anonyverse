<template>
  <small class="text-sm whitespace-normal rounded-lg p-2 bg-anonyaccent text-anonysecondary shadow-lg cursor-pointer transition ease-in-out duration-300 hover:-translate-y-0.5 hover:bg-anonyprimary hover:shadow-anonyprimary" @click="search">
    {{ tag }}
  </small>
</template>

<script setup>
import { useRouter } from "vue-router";
import store from "../store";

let router = useRouter();
let props = defineProps(["tag"]);
let search = () => {
    //direct the user to the newsfeed route
    router.push({name: "newsfeed"});
    //display Loading
    store.dispatch("postMod/setLoadingState", true);
    //Close the popup
    store.dispatch("postMod/closePopup");
    //Dispatch an action to change the query dynamically
    store.dispatch("queryMod/setQuery", props.tag);
}
</script>

<style></style>
