<template>
  <div class="relative w-full max-w-md mx-auto flex rounded-xl shadow-md border border-gray-200 bg-white text-gray-900 overflow-hidden">
    <!-- Status Strip with tooltip -->
    <div v-if="status && status !== ''"
      class="w-2"
      :class="getStatusDisplay(status).color"
      :title="getStatusDisplay(status).label"
    ></div>

    <!-- Content -->
    <div class="flex flex-col space-y-4 p-6 w-full relative">
      <!-- Quote Text -->
      <p class="text-lg font-medium break-words whitespace-pre-line">{{ quote }}</p>

      <!-- Tags -->
      <div v-if="tags && tags.length" class="flex flex-wrap gap-2">
        <span
          v-for="tag in tags"
          :key="tag"
          class="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Moderator Comment -->
      <p v-if="moderatorComment && moderatorComment.trim() !== ''" 
         class="text-sm italic text-gray-500 border-l-4 border-gray-300 pl-4 mt-2 max-w-full whitespace-pre-line">
        📝 {{ moderatorComment }}
      </p>

      <!-- Author -->
      <div class="text-right text-gray-600 text-sm absolute bottom-4 right-4">— {{ author }}</div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
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
    default: () => []
  },
  status: {
    type: String,
    default: '' // e.g., "approved", "pending", "rejected"
  },
  moderatorComment: {
    type: String,
    default: ''
  }
});

function getStatusDisplay(status) {
  switch (status) {
    case 'approved':
      return { label: 'Принята', color: 'bg-green-500' };
    case 'pending':
      return { label: 'На модерации', color: 'bg-yellow-400' };
    case 'rejected':
      return { label: 'Отклонена', color: 'bg-red-500' };
    default:
      return { label: 'Неизвестный статус', color: 'bg-gray-300' };
  }
}
</script>
