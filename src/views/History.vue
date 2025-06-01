<script setup lang="ts">
import Card from "@/components/Card.vue"; 
import { ref, onMounted } from "vue";
import { getAccessToken } from '@/utils/jwt';

const quotes: Quote[] = [];

interface Quote {
    id: string;
    text: string;
    author: string;
    tags: string[];
}

const quotas = ref<Quote[]>([]);

quotas.value = [{
            id: "load",
            text: "Загружаемся...",
            author: "Бекенд",
            tags: ["#Загрузка", "#Бек ответь"]
        }]

import axios from "axios";

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
            tags: quote.tags || []
        }));
    } catch (error) {
        console.error("Failed to fetch quotes:", error);
    }
});
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <Card
            v-for="(quote, index) in quotas"
            :key="index"
            :quote="quote.text"
            :author="quote.author"
            :tags="quote.tags"
        />
    </div>
</template>