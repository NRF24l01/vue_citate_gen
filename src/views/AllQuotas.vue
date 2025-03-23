<script lang="ts" setup>
import quotas from "@/assets/quotas.json"
import Card from "@/components/Card.vue";

</script>

<template>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        <Card
            v-for="(quote, index) in quotas"
            :key="index"
            :quote="quote.text"
            :author="quote.author"
        />
    </div>
</template>