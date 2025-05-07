<template>
<div class="p-6 w-full max-w-md mx-auto bg-gray text-gray-900 rounded-xl shadow-md flex flex-col space-y-4 relative">
    <p class="text-lg font-medium break-words whitespace-pre-line">{{ quote }}</p>
    <div class="flex flex-wrap gap-2">
        <span v-for="tag in tags" :key="tag" class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">{{ tag }}</span>
    </div>
    <div class="text-right text-gray-600 text-sm absolute bottom-4 right-4">— {{ author }}</div>
</div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  quote: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    required: false,
    default: () => []
  }
});
</script>