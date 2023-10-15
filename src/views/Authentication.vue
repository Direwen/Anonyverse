<template>
  <main
    class="w-screen h-screen bg-anonybg text-anonytext font-mono grid grid-cols-1 sm:grid-cols-2"
  >
    <!-- Image Side -->
    <div
      class="bg-img relative hidden h-full text-anonysecondary overflow-hidden sm:flex flex-col justify-center items-start px-2 lg:px-5"
    >
      <p class="strokTxt w-fit relative text-5xl font-bold text-transparent tracking-widest uppercase md:text-6xl lg:text-7xl">Anonyverse</p>
      <!-- <span>{{ currentIntroLine }}</span> -->
      <Transition name="slideToRight" mode="out-in">
        <span v-if="state" class="text-anonysecondary text-lg relative tracking-wide">{{introLines[currentIndex]}}</span>
        <span v-else class="text-anonysecondary text-lg relative tracking-wide">{{introLines[currentIndex]}}</span>
      </Transition>
    </div>

    <!-- Form Side -->
    <div class="w-full h-full overflow-hidden">
      <Transition appear name="slide" mode="out-in">
        <div
          class="w-full h-full"
          v-if="store.getters['authMod/getLoginState']"
        >
          <LoginForm @goToHome="goToHome"></LoginForm>
        </div>
        <div class="w-full h-full" v-else>
          <SignupForm @goToHome="goToHome"></SignupForm>
        </div>
      </Transition>
    </div>
  </main>
</template>

<script setup>
import store from "../store";
import LoginForm from "../components/LoginForm.vue";
import SignupForm from "../components/SignupForm.vue";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";

let router = useRouter();
let goToHome = () => {
  router.push({ name: "newsfeed" });
};

//Intro Text Transition
const introLines = [
  "Where the world connects anonymously.",
  "Discover authenticity through anonymity.",
  "Your voice, your power.",
  "Make genuine connections, safely.",
  "Engage, comment, vote, connect.",
  "Celebrate your true self here.",
  "Every voice truly matters.",
  "Explore, express, be you.",
  "Transform words into impact."
];
let duration = 4000;
let currentIndex = 0;
let state = ref(false);
setInterval(() => {
  currentIndex = (currentIndex + 1) % introLines.length;
  state.value = !state.value;
}, duration);



</script>

<style></style>
