<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <Navbar />
  <main class="flex-grow container mx-auto">
  <RouterView />
  </main>
  <Footer />
</template>
