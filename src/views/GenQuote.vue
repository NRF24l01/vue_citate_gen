<template>
  <div class="flex justify-center items-center h-screen">
    <div v-if="!isGenerated" class="transition-all duration-500 ease-in-out" @click="gen">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-4/5 h-3/4 max-w-4xl mx-auto cursor-pointer transform transition duration-200 ease-in-out hover:scale-105 overflow-hidden">
        <p class="text-4xl font-semibold text-gray-800 italic text-center break-words">“Нажми чтоб сгенерировать”</p>
        <p class="mt-8 text-2xl text-right text-gray-600">- Этот сайт</p>
      </div>
    </div>

    <div v-if="isGenerated" class="transition-all duration-700 ease-out transform scale-100">
      <div class="bg-white p-8 rounded-lg shadow-2xl w-full h-3/4 mx-auto overflow-hidden">
        <p class="text-4xl font-semibold text-gray-800 italic text-center break-words">“{{ quote.text }}”</p>
        <p class="mt-8 text-2xl text-right text-gray-600">- {{ quote.author }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import axios from "axios";
import { isLoggedIn } from '@/stores/auth';
import { getAccessToken } from '@/utils/jwt';

const isGenerated = ref(false)

// Define the expected structure for a quote
interface Quote {
  text: string;
  author: string;
  tags?: string[]; // Optional tags property
}

// Initialize with a default empty quote
const quote = ref<Quote>({ text: "", author: "" });

async function gen() {
  try {
    let response;
    if (isLoggedIn.value && isLoggedIn.value === true) { 
      const token = getAccessToken();
      response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/quotes/personal`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/quotes/public/random`);
    }
    const data = response.data;
    console.log("Response data:", data);
    // Ensure the response has the expected structure
    quote.value = {
      text: data.text || "No text available",
      author: data.author || "Unknown author",
      tags: data.tags || []
    };
  } catch (error: unknown) {
    console.error("Error fetching quote:", error);
    
    if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
      quote.value = {
        text: "Для вас больше нет цитат",
        author: "Система",
        tags: []
      };
    } else {
      quote.value = {
        text: "Ошбика при получении цитаты",
        author: "Система",
        tags: []
      };
    }
  }

  isGenerated.value = true;
}

</script>
