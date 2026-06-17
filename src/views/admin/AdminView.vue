<script setup>
import Main from '@/components/layout/Main.vue';
import Aside from '@/components/layout/Aside.vue';
</script>

<template>
    <div class="main-container">
        <Aside />
        <Main />
    </div>
</template>

<style scoped>

.main-container {
    height: 100%;
    display: grid;
    grid-template-columns: auto 1fr;
}

@media (max-width: 768px) {
    .main-container {
        flex-direction: column;
        padding-bottom: 60px;
    }
}

</style>
