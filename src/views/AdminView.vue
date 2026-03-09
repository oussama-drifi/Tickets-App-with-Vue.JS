<script setup>
import SideBar from '@/components/common/SideBar.vue';
import { ref } from 'vue';
import Main from './Main.vue';


// const isDark = ref(false)

// const toggleTheme = () => {
//     isDark.value = !isDark.value
//     document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : '');
// }
</script>


<template>
    <!-- <button @click="toggleTheme">theme toggle</button> -->
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
