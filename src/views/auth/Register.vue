<template>
    <div class="flex-grow mx-auto">
        <div class="flex justify-center items-center min-h-screen px-4">
            <form
                @submit.prevent="handleSubmit"
                class="w-full space-y-6 text-lg"
            >
                <h2 class="text-3xl font-bold text-center">Регистрация</h2>

                <!-- Name Field -->
                <div>
                    <label for="name" class="block text-base font-medium text-gray-700">По/При+зывной</label> 
                    <input
                        v-model="name"
                        @input="validateName"
                        :class="[
                            'mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        ]"
                        type="text"
                        id="name"
                        placeholder="Введите позывной"
                    />
                    <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
                </div>

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
                    <ul class="mt-2 space-y-1 text-sm text-gray-600" v-if="password">
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

                <!-- Confirm Password Field -->
                <div>
                    <label for="confirmPassword" class="block text-base font-medium text-gray-700">Подтверждение пароля</label>
                    <input
                        v-model="confirmPassword"
                        @input="validateConfirmPassword"
                        :class="[
                            'mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                        ]"
                        type="password"
                        id="confirmPassword"
                        placeholder="Подтвердите пароль"
                    />
                    <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>
                </div>

                <!-- Authentication Error -->
                <p v-if="errors.global" class="text-red-500 text-lg text-center mt-2">{{ errors.global }}</p>

                <!-- Submit Button -->
                <button
                    type="submit"
                    class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Зарегистрироваться!
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
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errors = ref<{ name?: string; email?: string; password?: string; confirmPassword?: string; global?: string }>({});

const validateName = () => {
    if (!name.value) {
        errors.value.name = "Имя обязательно.";
    } else if (name.value.length < 2) {
        errors.value.name = "Имя должно содержать минимум 2 символа.";
    } else {
        errors.value.name = undefined;
    }
};

const validateEmail = () => {
    if (!email.value) {
        errors.value.email = "Email обязателен.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        errors.value.email = "Неверный формат email.";
    } else {
        errors.value.email = undefined;
    }
};

const validatePassword = () => {
    if (!password.value) {
        errors.value.password = "Пароль обязателен.";
    } else if (password.value.length < 8 || password.value.length > 32) {
        errors.value.password = "Пароль должен содержать от 8 до 32 символов.";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password.value)) {
        errors.value.password = "Пароль должен содержать минимум одну заглавную букву, одну строчную букву и одну цифру.";
    } else {
        errors.value.password = undefined;
    }
    
    // Re-validate confirm password when password changes
    if (confirmPassword.value) {
        validateConfirmPassword();
    }
};

const validateConfirmPassword = () => {
    if (!confirmPassword.value) {
        errors.value.confirmPassword = "Подтверждение пароля обязательно.";
    } else if (confirmPassword.value !== password.value) {
        errors.value.confirmPassword = "Пароли не совпадают.";
    } else {
        errors.value.confirmPassword = undefined;
    }
};

const validateForm = () => {
    validateName();
    validateEmail();
    validatePassword();
    validateConfirmPassword();
    return !errors.value.name && !errors.value.email && !errors.value.password && !errors.value.confirmPassword;
};

const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
            username: name.value,
            email: email.value,
            password: password.value,
        },
        {
            withCredentials: true,
        });

        console.log("Registration successful:", response.data);

        // Store the token if it's returned immediately upon registration
        localStorage.setItem("access_token", response.data.access_token);
        console.log("Access token stored:", response.data.access_token);
        
        // Navigate to login page or home depending on your flow
        router.push({ name: "login" });
    } catch (error) {
        const err = error as any;
        
        if (err.response?.status === 409) {
            errors.value.global = "Пользователь с таким email уже существует.";
            console.error("Conflict: User already exists (409)");
        } else if (err.response?.status === 422 || err.response?.status === 400) {
            errors.value.global = "Валидация не пройдена. Проверьте соблюдение требований.";
            console.error("Bad request: Validation failed (422/400) - ", err.response?.data);
        } else {
            errors.value.global = "Произошла ошибка при регистрации.";
            console.error("Registration failed:", err.response?.data || err.message);
        }
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
