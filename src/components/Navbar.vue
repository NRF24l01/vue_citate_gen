<template>
  <header class="bg-white">
    <nav class="mx-auto flex items-center justify-between py-5 lg:px-8 px-5" aria-label="Global">
      <!-- Left side: Logo -->
      <div class="flex lg:flex-1">
        <RouterLink to="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Generator citat 3000</span>
          <img class="h-8 w-auto" src="/site-logo.ico" alt="" />
        </RouterLink>
      </div>

      <!-- Right side: Mobile menu button (visible on mobile) -->
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
          <span class="sr-only">Открыть меню</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>
      </div>

      <!-- Center: Desktop navigation links -->
      <PopoverGroup class="hidden lg:flex lg:gap-x-12">
        <RouterLink :to="{ name: 'all_quotas' }" class="text-base font-semibold text-gray-900 hover:bg-gray-50">Все наши цитаты</RouterLink>
        <RouterLink v-if="isLoggedIn" :to="{ name: 'generate_quote' }" class="text-base font-semibold text-gray-900 hover:bg-gray-50">Персональная цитата</RouterLink>
        <RouterLink v-if="isLoggedIn" :to="{ name: 'history' }" class="text-base font-semibold text-gray-900 hover:bg-gray-50">История цитат</RouterLink>
        <RouterLink v-if="isLoggedIn" :to="{ name: 'my_quotes' }" class="text-base font-semibold text-gray-900 hover:bg-gray-50">Мои цитаты</RouterLink>

        <RouterLink v-if="isModeratorLoggedIn" :to="{ name: 'moderation_list' }" class="text-base font-semibold text-gray-900 hover:bg-gray-50">Модерировать</RouterLink>

        <RouterLink v-if="!isLoggedIn" :to="{ name: 'login' }" class="text-base font-semibold text-gray-900 hover:bg-gray-50">Войти</RouterLink>
        <RouterLink v-if="!isLoggedIn" :to="{ name: 'register' }" class="text-base font-semibold text-gray-900 hover:bg-gray-50">Зарегистрироваться</RouterLink>
      </PopoverGroup>
    </nav>

    <!-- Mobile menu dialog -->
    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Цитаток генераттор 2028TM</span>
            <img class="h-8 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="" />
          </a>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
            <span class="sr-only">Меню закрося</span>
            <XMarkIcon class="size-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <RouterLink :to="{ name: 'all_quotas' }" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50" @click="mobileMenuOpen=false">Все наши цитаты</RouterLink>
              <RouterLink v-if="isLoggedIn" :to="{ name: 'generate_quote' }" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50" @click="mobileMenuOpen=false">Персональная цитата</RouterLink>
              <RouterLink v-if="isLoggedIn" :to="{ name: 'history' }" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50" @click="mobileMenuOpen=false">История цитат</RouterLink>
              <RouterLink v-if="isLoggedIn" :to="{ name: 'my_quotes' }" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50" @click="mobileMenuOpen=false">Мои цитаты</RouterLink>
              
              <RouterLink v-if="isModeratorLoggedIn" :to="{ name: 'moderation_list' }" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50" @click="mobileMenuOpen=false">Модерировать</RouterLink>

              <RouterLink v-if="!isLoggedIn" :to="{ name: 'login' }" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50" @click="mobileMenuOpen=false">Войти</RouterLink>
              <RouterLink v-if="!isLoggedIn" :to="{ name: 'register' }" class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50" @click="mobileMenuOpen=false">Зарегистрироваться</RouterLink>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import {
  Dialog,
  DialogPanel,
  PopoverGroup,
} from '@headlessui/vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/outline'

import { isLoggedIn, isModeratorLoggedIn } from '@/stores/auth';

const mobileMenuOpen = ref(false)
</script>
