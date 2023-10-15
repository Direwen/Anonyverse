<template>
  <section class="py-5 px-2 relative flex flex-col justify-start items-center sm:px-6 md:px-10 lg:px-14">
    <AddPost class="absolute z-20 shadow-2xl"></AddPost>
    
    <Suspense>
      <AsyncPostShowcase></AsyncPostShowcase>
    </Suspense>
  </section>
</template>

<script setup>
import { defineAsyncComponent } from "vue";
import AddPost from "../components/AddPost.vue";

let AsyncPostShowcase = defineAsyncComponent(() =>
  import("../components/PostShowcase.vue")
);
</script>

<style></style>
