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
    flex: 1;
    min-width: 0;
    margin-left: 12px;
    max-height: 100%;
    overflow-y: auto;
    transition: flex-basis 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (max-width: 768px) {
    .main-view {
        width: 100%;
        margin-left: 0;
    }
}
</style>