<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
</script>

<template>
  <div>
    <Navbar />
    <main class="flex-grow mx-auto ">
      <RouterView class="bg-white bg-opacity-80 backdrop-blur-md shadow-md"/>
    </main>
    <Footer />
  </div>
</template>