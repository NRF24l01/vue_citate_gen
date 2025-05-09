<template>
    <div class="flex justify-center items-center min-h-screen px-4">
        <form
            @submit.prevent="handleSubmit"
            class="w-full space-y-6 text-lg"
        >
            <h2 class="text-3xl font-bold text-center">Login</h2>

            <!-- Email Field -->
            <div>
                <label for="email" class="block text-base font-medium text-gray-700">Email</label>
                <input
                    v-model="email"
                    @input="validateEmail"
                    :class="[
                        'mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
                        errors.email ? 'border-red-500' : 'border-gray-300'
                    ]"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                />
                <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
            </div>

            <!-- Password Field -->
            <div>
                <label for="password" class="block text-base font-medium text-gray-700">Password</label>
                <input
                    v-model="password"
                    @input="validatePassword"
                    :class="[
                        'mt-1 block w-full px-4 py-3 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500',
                        errors.password ? 'border-red-500' : 'border-gray-300'
                    ]"
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                />
                <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>
                <!-- Password Requirements -->
                <ul class="mt-2 space-y-1 text-sm text-gray-600">
                    <li :class="password.length >= 8 && password.length <= 32 ? 'text-green-600' : ''">
                        ✔ Password must be between 8 and 32 characters
                    </li>
                    <li :class="/[a-z]/.test(password) ? 'text-green-600' : ''">
                        ✔ At least one lowercase letter
                    </li>
                    <li :class="/[A-Z]/.test(password) ? 'text-green-600' : ''">
                        ✔ At least one uppercase letter
                    </li>
                    <li :class="/\d/.test(password) ? 'text-green-600' : ''">
                        ✔ At least one number
                    </li>
                </ul>
            </div>

            <!-- Submit Button -->
            <button
                type="submit"
                class="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
                Login
            </button>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const email = ref("");
const password = ref("");
const errors = ref<{ email?: string; password?: string }>({});

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
        });

        console.log("Login successful:", response.data);
        // Handle successful login (e.g., store token, redirect)
    } catch (error) {
        const err = error as any;
        console.error("Login failed:", err.response?.data || err.message);
        // Handle login error (e.g., show error message)
    }
};
</script>

<style scoped>
/* Remove card styling completely */
form {
    max-width: none;
    padding: 0;
    background: none;
    box-shadow: none;
}
</style>