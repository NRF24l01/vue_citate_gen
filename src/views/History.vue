<script setup lang="ts">
import QuoteList from "@/components/QuoteList.vue";
import { ref, onMounted } from "vue";
import { getAccessToken } from '@/utils/jwt';
import axios from "axios";

interface Quote {
    id: string;
    text: string;
    author: string;
    tags: string[];
    moderation?: {
        status: string;
        comment?: string;
    };
}

const quotas = ref<Quote[]>([]);

quotas.value = [{
    id: "load",
    text: "Загружаемся...",
    author: "Бекенд",
    tags: ["#Загрузка", "#Бек ответь"],
    moderation: { status: "pending" }
}];

onMounted(async () => {
    try {
        const token = getAccessToken();
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/quotes/personal/history`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        quotas.value = response.data.map((quote: any) => ({
            id: quote.id,
            text: quote.text,
            author: quote.author,
            tags: quote.tags || [],
            moderation: quote.moderation || { status: "pending" }
        }));
    } catch (error) {
        console.error("Failed to fetch quotes:", error);
        quotas.value = [];
    }
});
</script>

<template>
    <QuoteList :quotes="quotas" :showModerationFilter="false" />
</template>