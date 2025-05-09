<template>
    <div class="flex flex-col items-center justify-center h-screen text-center w-full">
        <div class="flex flex-col lg:flex-row items-center justify-center lg:items-center">
            <div class="text-center lg:text-left">
            <h1 class="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p class="text-xl text-gray-600 mb-6">Упс! Страница не найдена.</p>
            <RouterLink to="/" class="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition">
                Вернуться на главную
            </RouterLink>
            </div>
            <div class="flex items-center justify-center text-center lg:text-left lg:ml-8">
            <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExY2l6YzFwaDl2cXRldGk1cXBwMHR3MjQ4bWxzdG91NGZiMzAyaTVwbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/C21GGDOpKT6Z4VuXyn/giphy.gif" alt="404 Not Found" class="w-128 h-128">
            </div>
        </div>
    </div>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>