<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { getAccessToken } from "@/utils/jwt";
import Card from "@/components/Card.vue"; 

interface Quote {
    id: string;
    author: string;
    text: string;
    tags: string[];
}

interface ModeratePayload {
  status: string;
  comment: string;
}

const quotes = ref<Quote[]>([]);
const statusFilter = ref("all");
const searchQuery = ref("");
const errorMessage = ref("");

// Fetch user's quotes
onMounted(async () => {
  try {
    const token = getAccessToken();
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/moderation/quotes`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    quotes.value = response.data;
  } catch (error) {
    console.error("Failed to fetch quotes:", error);
    quotes.value = [];
  }
});

// Computed property for filtered quotes
const filteredQuotes = computed(() => {
  return quotes.value.filter((quote) => {
    // Filter by search query
    if (
      searchQuery.value &&
      !quote.text.toLowerCase().includes(searchQuery.value.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
});

// Add handler for moderation
async function handleModerate(
  { status, comment }: { status: string; comment: string },
  quote: Quote
) {
  // Validation based on QuoteReview struct
  if (!quote.id) {
    errorMessage.value = "ID цитаты обязателен.";
    return;
  }
  if (status !== "approved" && status !== "rejected") {
    errorMessage.value = "Статус должен быть 'approved' или 'rejected'.";
    return;
  }
  if (comment && comment.length > 256) {
    errorMessage.value = "Комментарий не должен превышать 256 символов.";
    return;
  }
  errorMessage.value = "";

  try {
    const token = getAccessToken();
    await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/moderation/review`,
      {
        id: quote.id,
        result: status,
        comment: comment
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    // Remove the moderated quote from the list
    quotes.value = quotes.value.filter(q => q.id !== quote.id);
  } catch (error) {
    errorMessage.value = "Ошибка при отправке модерации.";
    console.error("Failed to moderate quote:", error);
  }
}

function onModerateTyped(payload: ModeratePayload, quote: Quote) {
    handleModerate(payload, quote);
}
</script>

<template>
  <div class="p-6 w-full max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Непромодерированые цитаты</h1>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-4 text-red-600 font-semibold">
      {{ errorMessage }}
    </div>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="w-full md:w-2/3">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1"
          >Искать</label
        >
        <input
          id="search"
          type="text"
          v-model="searchQuery"
          placeholder="Искать по вашем цитатам"
          class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>

    <!-- Quotes Grid -->
    <div
      v-if="filteredQuotes.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <Card
        v-for="(quote, index) in filteredQuotes"
        :key="quote.id"
        :quote="quote.text"
        :author="quote.author"
        :tags="quote.tags"
        :toModerate="true"
        @moderate="onModerateTyped($event, quote)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-10">
      <p class="text-gray-500 text-lg">
        Таких цитат нет.
      </p>
    </div>
  </div>
</template>
