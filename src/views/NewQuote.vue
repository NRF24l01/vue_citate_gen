<script setup lang="ts">
import { ref, computed, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import { getAccessToken } from '@/utils/jwt';

// Fields
const text = ref("");
const author = ref("");
const tagInput = ref("");
const tags = ref<string[]>([]);
const isLoading = ref(false);
const globalError = ref("");
const successMessage = ref("");

// Autocomplete
const authorSuggestions = ref<string[]>([]);
const tagSuggestions = ref<string[]>([]);
const showAuthorSuggestions = ref(false);
const showTagSuggestions = ref(false);

const allAuthors = ref<string[]>([]);
const allTags = ref<string[]>([]);
let authorsLoaded = false;
let tagsLoaded = false;

const loadAllAuthors = async () => {
    if (authorsLoaded) return;
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/autocomplete/authors`);
        allAuthors.value = data;
        authorsLoaded = true;
    } catch {}
};

const loadAllTags = async () => {
    if (tagsLoaded) return;
    try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/autocomplete/tags`);
        allTags.value = data;
        tagsLoaded = true;
    } catch {}
};

const filterAuthorSuggestions = (query: string) => {
    authorSuggestions.value = allAuthors.value
        .filter((a: string) => a.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8);
};

const filterTagSuggestions = (query: string) => {
    tagSuggestions.value = allTags.value
        .filter((t: string) =>
            t.toLowerCase().includes(query.toLowerCase()) && !tags.value.includes(t)
        )
        .slice(0, 8);
};

watch(author, (val) => {
    if (val.trim().length > 0) {
        loadAllAuthors().then(() => filterAuthorSuggestions(val));
        showAuthorSuggestions.value = true;
    } else {
        showAuthorSuggestions.value = false;
    }
});

watch(tagInput, (val) => {
    if (val.trim().length > 0) {
        loadAllTags().then(() => filterTagSuggestions(val));
        showTagSuggestions.value = true;
    } else {
        showTagSuggestions.value = false;
    }
});

// Validation
const errors = ref<{ text?: string; author?: string; tags?: string; tagInput?: string }>({});

const validateText = () => {
    if (!text.value.trim()) errors.value.text = "Текст обязателен";
    else if (text.value.length < 3) errors.value.text = "Минимум 3 символа";
    else if (text.value.length > 256) errors.value.text = "Максимум 256 символов";
    else errors.value.text = undefined;
};

const validateAuthor = () => {
    if (!author.value.trim()) errors.value.author = "Автор обязателен";
    else if (author.value.length < 3) errors.value.author = "Минимум 3 символа";
    else if (author.value.length > 64) errors.value.author = "Максимум 64 символа";
    else errors.value.author = undefined;
};

const validateTags = () => {
    if (tags.value.some(t => t.length < 1 || t.length > 30)) {
        errors.value.tags = "Каждый тег от 1 до 30 символов";
    } else {
        errors.value.tags = undefined;
    }
};

const validateTagInput = () => {
    if (tagInput.value && (tagInput.value.length < 1 || tagInput.value.length > 30)) {
        errors.value.tagInput = "Тег от 1 до 30 символов";
    } else {
        errors.value.tagInput = undefined;
    }
};

const isFormValid = computed(() =>
    !errors.value.text &&
    !errors.value.author &&
    !errors.value.tags &&
    text.value.length >= 3 &&
    text.value.length <= 256 &&
    author.value.length >= 3 &&
    author.value.length <= 64 &&
    tags.value.every(t => t.length >= 1 && t.length <= 30)
);

watch([text, author, tags], () => {
    validateText();
    validateAuthor();
    validateTags();
});

const addTag = () => {
    const val = tagInput.value.trim();
    if (!val) return;
    if (val.length < 1 || val.length > 30) {
        errors.value.tagInput = "Тег от 1 до 30 символов";
        return;
    }
    if (tags.value.includes(val)) {
        errors.value.tagInput = "Такой тег уже добавлен";
        return;
    }
    tags.value.push(val);
    tagInput.value = "";
    errors.value.tagInput = undefined;
    validateTags();
    showTagSuggestions.value = false;
};

const removeTag = (tag: string) => {
    tags.value = tags.value.filter(t => t !== tag);
    validateTags();
};

const onTagInputKeydown = (e: KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        addTag();
    }
};

const selectAuthorSuggestion = (suggestion: string) => {
    author.value = suggestion;
    showAuthorSuggestions.value = false;
    validateAuthor();
};

const selectTagSuggestion = (suggestion: string) => {
    tagInput.value = suggestion;
    addTag();
    showTagSuggestions.value = false;
};

const router = useRouter();

const handleSubmit = async () => {
    validateText();
    validateAuthor();
    validateTags();
    if (!isFormValid.value) return;

    isLoading.value = true;
    globalError.value = "";
    successMessage.value = "";

    try {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/quotes`, {
            text: text.value,
            author: author.value,
            tags: tags.value,
        }, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`
            }
        });
        successMessage.value = "Цитата сохранена!";
        text.value = "";
        author.value = "";
        tags.value = [];
        tagInput.value = "";
        setTimeout(() => {
            successMessage.value = "";
            router.push({ name: "my_quotes" });
        }, 1200);
    } catch (err: any) {
        if (err.response?.data?.detail) {
            globalError.value = err.response.data.detail;
        } else {
            globalError.value = "Ошибка при сохранении цитаты";
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="flex justify-center items-center min-h-screen bg-gray-50 transition-colors">
        <form
            @submit.prevent="handleSubmit"
            class="w-full max-w-xl bg-white rounded-xl shadow-lg p-6 md:p-10 space-y-6"
            autocomplete="off"
        >
            <h1 class="text-3xl font-bold text-center text-gray-900 mb-2">Создание новой цитаты</h1>

            <!-- Global error -->
            <div v-if="globalError" class="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center border border-red-300">
                {{ globalError }}
            </div>
            <div v-if="successMessage" class="bg-green-100 text-green-700 px-4 py-2 rounded mb-2 text-center border border-green-300">
                {{ successMessage }}
            </div>

            <!-- Text -->
            <div>
                <label class="block text-gray-700 font-medium mb-1" for="text">Текст цитаты</label>
                <textarea
                    id="text"
                    v-model="text"
                    :class="[
                        'w-full resize-none rounded-md border px-3 py-2 focus:outline-none transition',
                        errors.text
                            ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                            : 'border-gray-300 focus:ring-2 focus:ring-indigo-400'
                    ]"
                    rows="3"
                    maxlength="256"
                    placeholder="Введите текст цитаты (3–256 символов)"
                    @input="validateText"
                    style="min-height: 80px; max-height: 300px;"
                ></textarea>
                <div class="flex justify-between items-center mt-1">
                    <span class="text-xs text-gray-500">{{ text.length }} / 256</span>
                    <span v-if="errors.text" class="text-xs text-red-500">{{ errors.text }}</span>
                </div>
            </div>

            <!-- Author -->
            <div class="relative">
                <label class="block text-gray-700 font-medium mb-1" for="author">Автор</label>
                <input
                    id="author"
                    v-model="author"
                    type="text"
                    maxlength="64"
                    placeholder="Введите имя автора"
                    :class="[
                        'w-full rounded-md border px-3 py-2 focus:outline-none transition',
                        errors.author
                            ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                            : 'border-gray-300 focus:ring-2 focus:ring-indigo-400'
                    ]"
                    @input="validateAuthor"
                    @focus="author && (showAuthorSuggestions = true)"
                    @blur="setTimeout(() => showAuthorSuggestions = false, 150)"
                    autocomplete="off"
                />
                <ul
                    v-if="showAuthorSuggestions && authorSuggestions.length"
                    class="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-48 overflow-auto"
                >
                    <li
                        v-for="suggestion in authorSuggestions"
                        :key="suggestion"
                        class="px-3 py-2 cursor-pointer hover:bg-indigo-100"
                        @mousedown.prevent="selectAuthorSuggestion(suggestion)"
                    >
                        {{ suggestion }}
                    </li>
                </ul>
                <span v-if="errors.author" class="text-xs text-red-500">{{ errors.author }}</span>
            </div>

            <!-- Tags -->
            <div>
                <label class="block text-gray-700 font-medium mb-1">Теги</label>
                <div class="flex flex-wrap gap-2 mb-2">
                    <span
                        v-for="tag in tags"
                        :key="tag"
                        class="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm"
                    >
                        #{{ tag }}
                        <button
                            type="button"
                            class="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                            @click="removeTag(tag)"
                            aria-label="Удалить тег"
                        >×</button>
                    </span>
                </div>
                <div class="flex gap-2 relative">
                    <input
                        v-model="tagInput"
                        type="text"
                        maxlength="30"
                        placeholder="Добавить тег и нажать Enter/Пробел"
                        @keydown="onTagInputKeydown"
                        @blur="setTimeout(() => showTagSuggestions = false, 150); validateTagInput()"
                        @focus="tagInput && (showTagSuggestions = true)"
                        :class="[
                            'flex-1 rounded-md border px-3 py-2 focus:outline-none transition',
                            errors.tagInput
                                ? 'border-red-500 focus:ring-2 focus:ring-red-400'
                                : 'border-gray-300 focus:ring-2 focus:ring-indigo-400'
                        ]"
                        autocomplete="off"
                    />
                    <button
                        type="button"
                        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
                        @click="addTag"
                        :disabled="!tagInput || !!errors.tagInput"
                        title="Добавить тег"
                    >+</button>
                    <ul
                        v-if="showTagSuggestions && tagSuggestions.length"
                        class="absolute z-10 left-0 right-0 bg-white border border-gray-200 rounded-md mt-1 shadow-lg max-h-40 overflow-auto"
                        style="top: 100%;"
                    >
                        <li
                            v-for="suggestion in tagSuggestions"
                            :key="suggestion"
                            class="px-3 py-2 cursor-pointer hover:bg-indigo-100"
                            @mousedown.prevent="selectTagSuggestion(suggestion)"
                        >
                            {{ suggestion }}
                        </li>
                    </ul>
                </div>
                <span v-if="errors.tags" class="text-xs text-red-500">{{ errors.tags }}</span>
                <span v-if="errors.tagInput" class="text-xs text-red-500">{{ errors.tagInput }}</span>
            </div>

            <!-- Submit -->
            <button
                type="submit"
                class="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition disabled:opacity-50"
                :disabled="!isFormValid || isLoading"
            >
                <span v-if="isLoading" class="animate-spin mr-2 w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                <span v-else>💾</span>
                Сохранить цитату
            </button>
        </form>
    </div>
</template>