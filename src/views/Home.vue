<template>
  <section class="w-screen h-screen overflow-hidden flex flex-col">
    <Navbar class="w-screen h-fit"></Navbar>
    <NotiBox></NotiBox>
    <ContentContainer class="grow overflow-y-scroll"></ContentContainer>
    <Menubar class="w-screen h-fit"></Menubar>
  </section>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
import Menubar from "../components/Menubar.vue";
import ContentContainer from "../components/ContentContainer.vue";
import NotiBox from "../components/NotiBox.vue";
import {auth} from "../firebase/config"
import { onAuthStateChanged } from "firebase/auth";
import store from "../store";


onAuthStateChanged(auth, (currentUser) => {
    store.dispatch("authMod/getUserInfo", currentUser);
})


</script>

<style></style>
