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
      <div class="text-right text-gray-600 text-sm bottom-4 right-4">— {{ author }}</div>
      
      <!-- Moderation Fields (only shown when toModerate is true) -->
      <div v-if="toModerate" class="mt-8 pt-4 border-t border-gray-200">
        <div class="flex gap-2">
          <!-- Reject Button (Red) -->
          <button 
            @click="setModerationAction('rejected')" 
            class="flex-1 py-2 text-white rounded transition-all flex items-center justify-center"
            :class="moderationAction === 'rejected' || moderationAction === '' ? 'bg-red-600' : 'bg-red-200'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Отклонить
          </button>
          
          <!-- Approve Button (Green) -->
          <button 
            @click="setModerationAction('approved')" 
            class="flex-1 py-2 text-white rounded transition-all flex items-center justify-center"
            :class="moderationAction === 'approved' || moderationAction === '' ? 'bg-green-600' : 'bg-green-200'"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
            Одобрить
          </button>
        </div>
        
        <!-- Comment area and icon-only submit button in a row -->
        <div class="mt-2 flex flex-col gap-2">
          <textarea
            v-model="moderationComment"
            placeholder="Комментарий модератора"
            class="w-full p-2 border border-gray-300 rounded-md"
            rows="3"
          ></textarea>
          
          <!-- Full-width submit button -->
          <button 
            @click="submit"
            class="w-full p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center"
            :disabled="!moderationAction"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            Отправить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const emit = defineEmits(['moderate']);

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
  },
  toModerate: {
    type: Boolean,
    default: false
  },
  id: {
    type: String,
    default: ''
  }
});

const moderationAction = ref('');
const moderationComment = ref(props.moderatorComment || '');

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

function setModerationAction(action) {
  moderationAction.value = action;
}

function submit() {
  // Empty function that can be called by the submit button
  if (moderationAction.value) {
    submitModeration();
  }
}

function submitModeration() {
  if (!moderationAction.value) return;
  
  emit('moderate', {
    status: moderationAction.value,
    comment: moderationComment.value,
    id: props.id
  });
}
</script>
