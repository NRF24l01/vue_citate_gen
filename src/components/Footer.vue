<script setup>
import { GlobeAltIcon, CheckCircleIcon, UserIcon } from '@heroicons/vue/24/outline'
</script>

<template>
  <footer class="bg-gray-900 text-white py-8">
    <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Development Section -->
      <div>
        <h3 class="text-lg font-semibold mb-3 flex items-center">
          🚀 Разработка
        </h3>
        <ul class="space-y-2">
          <li>
            <a href="https://github.com/your-repo" target="_blank" class="flex items-center space-x-2 hover:text-blue-400">
              <GlobeAltIcon class="w-5 h-5 text-gray-400" />
              <span>GitHub</span>
            </a>
          </li>
          <li>
            <a href="https://your-ci-builds.com" target="_blank" class="flex items-center space-x-2 hover:text-green-400">
              <CheckCircleIcon class="w-5 h-5 text-gray-400" />
              <span>Успешные билды</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Our Elephants Section -->
      <div>
        <h3 class="text-lg font-semibold mb-3 flex items-center">
          🐘 Наши слоны
        </h3>
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
            <span>Ну который гойда кричал</span>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
