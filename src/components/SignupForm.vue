<template>
    <!-- Signup -->
    <div class="w-full h-full px-5 sm:px-10 lg:px-20 flex flex-col justify-center">
      <!-- title -->
      <div class="mb-5 flex justify-center items-center">
        <h1 class="text-3xl text-anonysecondary text-center uppercase font-bold tracking-widest md:text-5xl">
          SignUp
        </h1>
        <img src="../assets/logo.png" alt="" class="inline w-16">
      </div>
      <span class="text-sm text-center text-red-500 font-semibold mb-3" v-if="err">{{ err }}</span>
      <form @submit.prevent="clickSignup">
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
              v-model="firstPsw"
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
        <div class="flex flex-col justify-center items-start my-4">
          <label class="text-xl pb-1">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your Password"
            class="w-full py-1 bg-transparent text-anonytext placeholder-anonyprimary border-b border-anonyprimary outline-none ring-0 transition ease-in-out duration-150 focus:border-anonyaccent"
            v-model="secondPsw"
            required
          />
        </div>
        <!-- have account section -->
        <div class="text-right">
          <span
            class="text-sm cursor-pointer text-anonyprimary hover:text-anonyaccent"
            @click="store.dispatch('authMod/changeSide')"
            >Have an account?</span
          >
        </div>
        <!-- login button -->
        <button
          class="block my-3 w-9/12 md:6/12 m-auto py-1 md:py-2 bg-anonysecondary text-anonybg font-bold border border-anonyaccent rounded-full transition ease-in-out duration-300 active:scale-90 text-md md:text-xl"
        >
          Signup
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  import store from "../store";
  import signup from "../composables/signup";
  
  let email = ref("");
  let firstPsw = ref("");
  let secondPsw = ref("");
  let pswInput = ref(null); //html input tag
  let visibilityIcon = ref(null); //html span tag
  let err = ref('');
  let emit = defineEmits(["goToHome"]);

  //to control the hide/show icon
  let clickVisibility = () => {
    let inputCurrentType = pswInput.value.type;
    pswInput.value.type = inputCurrentType == "password" ? "text" : "password";
    visibilityIcon.value.textContent =
      pswInput.value.type == "password" ? "visibility" : "visibility_off";
  };
  //to sign up via firebase auth
  let clickSignup = async () => {
    if (email.value && firstPsw.value && secondPsw.value) {
  
      if (firstPsw.value == secondPsw.value) {
        let {errorMsg, createAccount} = signup();
        let uid = await createAccount(email.value, secondPsw.value);
        err.value = errorMsg.value;
        if(!err.value){
          emit("goToHome");
        }
      } else {
        err.value = "Please confirm the password again. They are not the same.";
      }
  
    }
  };
  
  onMounted(() => {
    email.value = "";
    firstPsw.value = "";
    secondPsw.value = "";
  });
  </script>
  
  <style></style>
  