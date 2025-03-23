<template>
<div class="p-6 w-full max-w-md mx-auto bg-gray text-gray-900 rounded-xl shadow-md flex flex-col space-y-4">
    <p class="text-lg font-medium break-words whitespace-pre-line">{{ quote }}</p>
    <div class="text-right text-gray-600 text-sm">— {{ author }}</div>
</div>
</template>

<script>
export default {
props: {
    quote: {
    type: String,
    required: true
    },
    author: {
    type: String,
    required: true
    }
}
};
</script>