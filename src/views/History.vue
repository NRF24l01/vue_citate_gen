<script setup lang="ts">
import { useQuotesStore } from '@/stores/quotes';
import Card from '@/components/Card.vue';

var qstore = useQuotesStore()
qstore.loadQuotes()
const quotes = qstore.items
console.log(quotes);
</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <Card
            v-for="(quote, index) in quotes"
            :key="index"
            :quote="quote.text"
            :author="quote.author"
        />
    </div>
</template>