<template>
  <div class="flex justify-center items-center h-screen">
    <div v-if="!isGenerated" class="transition-all duration-500 ease-in-out">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-4/5 h-3/4 max-w-4xl mx-auto cursor-pointer transform transition duration-200 ease-in-out hover:scale-105" @click="gen" >
        <p class="text-4xl font-semibold text-gray-800 italic">“Нажми чтоб сгенерировать”</p>
        <p class="mt-8 text-2xl text-right text-gray-600">- Этот сайт</p>
      </div>
    </div>

    <div v-if="isGenerated" class="transition-all duration-700 ease-out transform scale-100">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-4/5 h-3/4 max-w-4xl mx-auto">
        <p class="text-4xl font-semibold text-gray-800 italic">“{{ quote.text }}”</p>
        <p class="mt-8 text-2xl text-right text-gray-600">- {{ quote.author }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import quotas from "@/assets/quotas.json"
import { ref } from "vue";
import { useQuotesStore } from '@/stores/quotes'; // Adjust the import path accordingly

const itemStore = useQuotesStore();
const isGenerated = ref(false)
var quote = ref({})

// Get a random index from the JSON list
const randomIndex = Math.floor(Math.random() * quotas.length);
// Set the random element
quote.value = quotas[randomIndex];

function gen() {
    itemStore.loadQuotes();

    isGenerated.value = true;
    itemStore.addQuotes(quote.value);
}
</script>