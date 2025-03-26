<script setup>
import { GlobeAltIcon, CheckCircleIcon, UserIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <footer class="bg-gray-900 text-white py-6">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-center items-center text-center gap-8">
      <!-- Development Section -->
      <div class="flex flex-col items-center">
        <h3 class="text-lg font-semibold mb-3">🚀 Разработка</h3>
        <ul class="space-y-2">
          <li class="flex items-center space-x-2">
            <GlobeAltIcon class="w-5 h-5 text-gray-400" />
            <a href="https://github.com/NRF24l01/vue_citate_gen" target="_blank" class="hover:text-blue-400">
              GitHub фронт
            </a>
          </li>
          <li class="flex items-center space-x-2">
            <GlobeAltIcon class="w-5 h-5 text-gray-400" />
            <a href="https://github.com/NRF24l01/back_citate_gen" target="_blank" class="hover:text-blue-400">
              GitHub бэк
            </a>
          </li>
          <li class="flex items-center space-x-2">
            <CheckCircleIcon class="w-5 h-5 text-gray-400" />
            <a href="https://github.com/NRF24l01/vue_citate_gen/actions" target="_blank" class="hover:text-green-400">
              Билды фронта
            </a>
          </li>
        </ul>
      </div>

      <!-- Our Elephants Section -->
      <div class="flex flex-col items-center">
        <h3 class="text-lg font-semibold mb-3">🐘 Наши слоны</h3>
        <ul class="space-y-2">
          <li class="flex items-center space-x-2">
            <UserIcon class="w-5 h-5 text-gray-400" />
            <span>Павел Дуров</span>
          </li>
          <li class="flex items-center space-x-2">
            <UserIcon class="w-5 h-5 text-gray-400" />
            <span>Дмитрий Нагиев</span>
          </li>
          <li class="flex items-center space-x-2">
            <UserIcon class="w-5 h-5 text-gray-400" />
            <span>И все остальные лысые</span>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
