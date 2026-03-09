<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
    <main class="main-view">
        <RouterView />
    </main>
</template>

<style>
.main-view {
    border-radius: 10px;
    width: calc(100% - 90px);
    max-height: 100%;
    overflow-y: auto;
}
</style>