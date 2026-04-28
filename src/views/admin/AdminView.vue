<script setup>
import SideBar from '@/components/layout/SideBar.vue';
import Main from '@/components/layout/Main.vue';
import Aside from '@/components/layout/Aside.vue';
</script>

<template>
    <div class="main-container">
        <!-- <SideBar /> -->
        <Aside />
        <Main />
    </div>
</template>

<style scoped>

.main-container {
    /* display: flex;
    justify-content: space-between; */
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
