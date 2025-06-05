<script lang="ts" setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import QuoteList from "@/components/QuoteList.vue"; // add import

interface Quote {
    id: string;
    text: string;
    author: string;
    tags: string[];
    moderation: {
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
    moderation: {
        status: "pending"
    }
}];

onMounted(async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/quotes/public`);
        quotas.value = response.data.map((quote: any) => ({
            id: quote.id,
            text: quote.text,
            author: quote.author,
            tags: quote.tags || [],
            moderation: quote.moderation ?? { status: "approved" }
        }));
    } catch (error) {
        console.error("Failed to fetch quotes:", error);
    }
});
</script>

<template>
    <div class="p-6 w-[80vw] mx-auto">
        <h1 class="text-4xl font-bold mb-8 text-center">Все наши цитаты</h1>
        <QuoteList :quotes="quotas" :header="''" :showModerationFilter="false" />
    </div>
</template>