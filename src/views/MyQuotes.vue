<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";
import { getAccessToken } from "@/utils/jwt";
import QuoteList from "@/components/QuoteList.vue";

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

const quotes = ref<Quote[]>([]);

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
</script>

<template>
  <QuoteList :header="'Созданые вами цитаты'" :quotes="quotes" />
</template>
