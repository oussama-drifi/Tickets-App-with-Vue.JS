<script setup>
import SideBar from '@/components/common/SideBar.vue';
import Main from './Main.vue';
</script>


<template>
    <div class="main-container">
        <SideBar />
        <Main />
    </div>
</template>

<style scoped>

.main-container {
    display: flex;
    justify-content: space-between;
    height: 100%;
}

@media (max-width: 768px) {
    .main-container {
        flex-direction: column;
        padding-bottom: 60px;
    }
}

</style>
