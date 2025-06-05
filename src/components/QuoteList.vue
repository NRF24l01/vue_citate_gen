<script setup lang="ts">
import { ref, computed } from "vue";
import Card from "@/components/Card.vue";

interface Quote {
  id: string;
  author: string;
  text: string;
  tags: string[];
  moderation: {
    status: string;
    comment?: string;
  };
}

const props = withDefaults(defineProps<{
  quotes: Quote[];
  showModerationFilter?: boolean;
  header?: string;
}>(), {
  showModerationFilter: true,
  header: "Цитаты",
});

const statusFilter = ref("all");
const searchQuery = ref("");

// Normalize API status
const getStatus = (apiStatus: string): "pending" | "approved" | "rejected" => {
  switch (apiStatus) {
    case "approved":
      return "approved";
    case "rejected":
      return "rejected";
    default:
      return "pending";
  }
};

const filteredQuotes = computed(() => {
  return props.quotes.filter((quote) => {
    const status = getStatus(quote.moderation.status);

    if (
      (props.showModerationFilter ?? true) && // фильтрация только если проп не false
      statusFilter.value !== "all" &&
      status !== statusFilter.value
    ) {
      return false;
    }

    if (
      searchQuery.value &&
      !quote.text.toLowerCase().includes(searchQuery.value.toLowerCase())
    ) {
      return false;
    }

    return true;
  });
});
</script>

<template>
  <div class="p-6 w-full max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6" v-if="header && header!==''">{{ header }}</h1>

    <!-- Filters -->
    <div class="flex flex-col md:flex-row gap-4 mb-6">
      <div
        v-if="showModerationFilter ?? true"
        class="w-full md:w-1/3"
      >
        <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">
          Результат модерации
        </label>
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

      <div :class="(showModerationFilter ?? true) ? 'w-full md:w-2/3' : 'w-full'">
        <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
          Искать
        </label>
        <input
          id="search"
          type="text"
          v-model="searchQuery"
          placeholder="Искать по вашим цитатам"
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
        v-for="quote in filteredQuotes"
        :key="quote.id"
        :quote="quote.text"
        :author="quote.author"
        :tags="quote.tags"
        v-bind="(showModerationFilter ?? true) ? { status: quote.moderation.status, moderatorComment: quote.moderation.comment } : {}"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-10">
      <p class="text-gray-500 text-lg">Таких цитат нет.</p>
    </div>
  </div>
</template>