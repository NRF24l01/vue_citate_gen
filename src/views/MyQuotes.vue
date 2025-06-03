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
    moderation: {
        status: string;
        comment?: string; // Optional comment field
    };
}

const quotes = ref<Quote[]>([]);
const statusFilter = ref("all");
const searchQuery = ref("");

// Fetch user's quotes
onMounted(async () => {
  try {
    const token = getAccessToken();
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/quotes/user`,
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

// Map API status to our display statuses
const getStatus = (apiStatus: string): "pending" | "approved" | "rejected" => {
  // This mapping should be adjusted based on actual API implementation
  switch (apiStatus) {
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    default:
      return "pending";
  }
};

// Computed property for filtered quotes
const filteredQuotes = computed(() => {
  return quotes.value.filter((quote) => {
    const status = getStatus(quote.moderation.status);

    // Filter by status
    if (statusFilter.value !== "all" && status !== statusFilter.value) {
      return false;
    }

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

// Get display properties for status
const getStatusDisplay = (apiStatus: string) => {
  const status = getStatus(apiStatus);
  switch (status) {
    case "approved":
      return {
        label: "Approved",
        color: "bg-green-100 text-green-800",
        icon: "✅",
      };
    case "rejected":
      return {
        label: "Rejected",
        color: "bg-red-100 text-red-800",
        icon: "❌",
      };
    case "pending":
    default:
      return {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: "🕒",
      };
  }
};
</script>

<template>
  <div class="p-6 w-full max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Созданые мной цитаты</h1>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div class="w-full md:w-1/3">
        <label
          for="status-filter"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Результат модерации</label
        >
        <select
          id="status-filter"
          v-model="statusFilter"
          class="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">Все результаты</option>
          <option value="pending">На модерации</option>
          <option value="approved">Принято</option>
          <option value="rejected">Отвергнуто</option>
        </select>
      </div>

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
        :key="index"
        :quote="quote.text"
        :author="quote.author"
        :tags="quote.tags"
        :status="quote.moderation.status"
        :moderatorComment="quote.moderation.comment"
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
