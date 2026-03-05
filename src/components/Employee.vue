<script setup>
const props = defineProps({
    name: {
        type: String,
        default: "unknown"
    },
    startYear: {
        type: Number,
        default: 2026
    }
}) // define and store props fo usage inside functions
</script>

<template>
    <li><i class="bi bi-arrow-return-right"></i> {{ name }} <b>since</b> {{ startYear }}</li>
</template>