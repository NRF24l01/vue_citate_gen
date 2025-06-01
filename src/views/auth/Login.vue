<template>
    <div class="flex-grow mx-auto">
        <div class="flex justify-center items-center min-h-screen px-4">
            <form
                @submit.prevent="handleSubmit"
                class="w-full space-y-6 text-lg"
            >
                <h2 class="text-3xl font-bold text-center">Войти</h2>

                <!-- Email Field -->
                <div>
                    <label for="email" class="block text-base font-medium text-gray-700">Почта</label>
                    <input
                        v-model="email"
                        @input="validateEmail"
                        :class="[
                            'mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        ]"
                        type="email"
                        id="email"
                        placeholder="Введите почту"
                    />
                    <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                </div>

                <!-- Password Field -->
                <div>
                    <label for="password" class="block text-base font-medium text-gray-700">Пароль</label>
                    <input
                        v-model="password"
                        @input="validatePassword"
                        :class="[
                            'mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
                            errors.password ? 'border-red-500' : 'border-gray-300'
                        ]"
                        type="password"
                        id="password"
                        placeholder="Введите пароль"
                    />
                    <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
                    <!-- Password Requirements -->
                    <ul class="mt-2 space-y-1 text-sm text-gray-600">
                        <li :class="password.length >= 8 && password.length <= 32 ? 'text-green-600' : ''">
                            ✔ Пароль должен содержать от 8 до 32 символов
                        </li>
                        <li :class="/[a-z]/.test(password) ? 'text-green-600' : ''">
                            ✔ Пароль должен содержать хотя бы одну строчную букву
                        </li>
                        <li :class="/[A-Z]/.test(password) ? 'text-green-600' : ''">
                            ✔ Пароль должен содержать хотя бы одну заглавную букву
                        </li>
                        <li :class="/\d/.test(password) ? 'text-green-600' : ''">
                            ✔ Пароль должен содержать хотя бы одну цифру
                        </li>
                    </ul>
                </div>

                <!-- Authentication Error -->
                <p v-if="errors.global" class="text-red-500 text-lg text-center mt-2">{{ errors.global }}</p>

                <!-- Submit Button -->
                <button
                    type="submit"
                    class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Войти!
                </button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const errors = ref<{ email?: string; password?: string; global?: string }>({});

const validateEmail = () => {
    if (!email.value) {
        errors.value.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.value.email = "Invalid email format.";
    } else {
        errors.value.email = undefined;
    }
};

const validatePassword = () => {
    if (!password.value) {
        errors.value.password = "Password is required.";
    } else if (password.value.length < 8 || password.value.length > 32) {
        errors.value.password = "Password must be between 8 and 32 characters.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password.value)) {
        errors.value.password = "Password must include at least one uppercase letter, one lowercase letter, and one number.";
    } else {
        errors.value.password = undefined;
    }
};

const validateForm = () => {
    validateEmail();
    validatePassword();
    return !errors.value.email && !errors.value.password;
};

const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
            email: email.value,
            password: password.value,
        },
        {
            withCredentials: true,
        });

        console.log("Login successful:", response.data);

        if (errors.value.global) {
            errors.value.global = "Данные для входа верны.";
        }

        localStorage.setItem("access_token", response.data.access_token);
        
        router.push({ name: "home" });
    } catch (error) {
        const err = error as any;
        
        if (err.response?.status === 401) {
            errors.value.global = "Такой пользователь не найден";
            console.error("Unauthorized: Invalid credentials (401)");
        } else if (err.response?.status === 400) {
            errors.value.global = "Валидация не пройдена. Проверьте соблюдение требований.";
            console.error("Unauthorized: bad request (400)");
        } else {
            console.error("Login failed:", err.response?.data || err.message);
        }
        // Handle login error (e.g., show error message)
    }
};
</script>

<style>
/* Remove card styling completely */
form {
    max-width: 28rem;
    padding: 0;
    background: none;
    box-shadow: none;
}
</style>