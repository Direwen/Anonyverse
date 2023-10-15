<template>
    <!-- Login -->
    <div class="w-full h-full px-5 sm:px-10 lg:px-20 flex flex-col justify-center">
      <!-- title -->
      <div class="mb-5 flex justify-center items-center">
        <h1 class="text-3xl text-anonysecondary text-center uppercase font-bold tracking-widest md:text-5xl">
          Login
        </h1>
        <img src="../assets/logo.png" alt="" class="inline w-16">
      </div>
      <span class="text-sm text-center text-red-500 font-semibold mb-3" v-if="err">{{ err }}</span>
      <form @submit.prevent="clickLogin">
        <!-- form inputs -->
        <div class="flex flex-col justify-center items-start my-4">
          <label class="text-xl pb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            class="w-full py-1 bg-transparent text-anonytext placeholder-anonyprimary border-b border-anonyprimary outline-none ring-0 transition ease-in-out duration-150 focus:border-anonyaccent"
            v-model="email"
            required
          />
        </div>
        <div class="flex flex-col justify-center items-start my-4">
          <label class="text-xl pb-1">Password</label>
          <!-- password input box section -->
          <div class="relative w-full">
            <input
              type="password"
              placeholder="Enter your Password"
              class="w-full py-1 pr-10 bg-transparent text-anonytext placeholder-anonyprimary border-b border-anonyprimary outline-none ring-0 transition ease-in-out duration-150 focus:border-anonyaccent"
              v-model="password"
              ref="pswInput"
              required
            />
            <!-- hidden icon -->
            <span
              class="material-symbols-outlined inline-block absolute top-0 right-0 text-anonyprimary select-none cursor-pointer hover:text-anonyaccent active:scale-90"
              @click="clickVisibility"
              ref="visibilityIcon"
              >visibility_off</span
            >
          </div>
        </div>
        <!-- forgot password section -->
        <div class="text-right">
          <span
            class="text-sm cursor-pointer text-anonyprimary hover:text-anonyaccent"
            @click="store.dispatch('authMod/changeSide')"
            >don't have an account?</span
          >
        </div>
        <!-- login button -->
        <button
          class="block my-3 w-9/12 md:6/12 m-auto py-1 md:py-2 bg-anonysecondary text-anonybg font-bold rounded-full transition ease-in-out duration-300 active:scale-90 text-md md:text-xl"
        >
          Login
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref } from "vue";
  import store from "../store";
  import signin from "../composables/signin"
  
  let email = ref("");
  let password = ref("");
  let pswInput = ref(null); //html input tag
  let visibilityIcon = ref(null); //html span tag
  let err = ref('');
  const emit = defineEmits(["goToHome"])
  
  let clickLogin = async () => {
    if (email.value && password.value) {
      let {errMsg, loginAccount} = signin();
      await loginAccount(email.value, password.value);
      err.value = errMsg.value;
      if(!err.value){
        emit('goToHome');
      }
    }
  };
  
  let clickVisibility = () => {
    let inputCurrentType = pswInput.value.type;
    pswInput.value.type = inputCurrentType == "password" ? "text" : "password";
    visibilityIcon.value.textContent =
      pswInput.value.type == "password" ? "visibility" : "visibility_off";
  };
  
  onMounted(() => {
    email.value = "";
    password.value = "";
  });
  </script>
  
  <style></style>
  