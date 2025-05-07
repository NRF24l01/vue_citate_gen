<script lang="ts" setup>
import Card from "@/components/Card.vue"; 
import { ref, onMounted } from "vue";

interface Quote {
    id: number;
    text: string;
    author: string;
    tags: string[];
}

const quotas = ref<Quote[]>([]);

import axios from "axios";

onMounted(async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/quotes/public`);
        quotas.value = response.data.map((quote: any) => ({
            id: quote.id,
            text: quote.text,
            author: quote.author,
            tags: quote.tags || []
        }));
    } catch (error) {
        console.error("Failed to fetch quotes:", error);
    }
});
</script>

<template>
    <div class="p-6 w-[80vw] mx-auto">
        <h1 class="text-4xl font-bold mb-8 text-center">Все наши цитаты</h1>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card
                v-for="(quote, index) in quotas"
                :key="index"
                :quote="quote.text"
                :author="quote.author"
                :tags="quote.tags"
            />
        </div>
    </div>
</template>