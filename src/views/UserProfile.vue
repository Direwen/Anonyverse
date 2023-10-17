<template>
  <section class="py-5 px-2 sm:px-6 md:px-10 lg:px-14">
    <!-- The top part -->
    <div class="w-full flex flex-col items-center justify-around px-2">
      <button
        class="py-2 px-3 rounded-lg bg-red-800 text-md text-gray-100 font-semibold transition-all ease-in-out duration-300 active:scale-90 sm:text-xl sm:px-4"
        @click="logout"
      >
        <span class="material-symbols-outlined align-middle">logout</span>
        Log Out
      </button>
    </div>
    <!-- The bottom part     -->
    <UserPostShowcase></UserPostShowcase>
    
    
  </section>
</template>

<script setup>
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useRouter } from "vue-router";
import UserPostShowcase from "../components/UserPostShowcase.vue";

let router = useRouter();

//Function to logout
let logout = async () => {
  try {
    await signOut(auth);
    console.log("Logged out");
    router.replace("/");
  } catch (error) {
    console.log(error.message);
  }
};

</script>

<style></style>
