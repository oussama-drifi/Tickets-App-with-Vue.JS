<script setup>
import { ref } from 'vue'
import Header from '@/components/common/Header.vue'
import NewCommercial from '@/views/NewCommercial.vue'
import { RouterView } from 'vue-router'

const drawerOpen = ref(false)

</script>

<template>
    <h1>Commercials</h1>
    <div class="commercials-toolbar">
        <Header />
        <button class="add-new-btn" @click="drawerOpen = true">
            <i class="bi bi-plus-lg"></i> Add New
        </button>
    </div>
    <RouterView />

    <!-- Overlay -->
    <Transition name="fade">
        <div v-if="drawerOpen" class="drawer-overlay" @click="drawerOpen = false"></div>
    </Transition>

    <!-- Sliding Drawer -->
    <Transition name="slide">
        <div v-if="drawerOpen" class="drawer">
            <button class="drawer-close" @click="drawerOpen = false">
                <i class="bi bi-x-lg"></i>
            </button>
            <NewCommercial />
        </div>
    </Transition>
</template>

<style scoped>
.commercials-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
}

.add-new-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background-color: var(--primary);
    color: var(--bg);
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
    font-family: inherit;
}

.add-new-btn:hover {
    background-color: var(--primary-hover);
}

/* Overlay */
.drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 999;
}

/* Drawer */
.drawer {
    position: fixed;
    top: 0;
    right: 0;
    width: 40%;
    height: 100%;
    background: var(--bg);
    z-index: 1000;
    overflow-y: auto;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.15);
}

.drawer-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: none;
    border: none;
    color: var(--text-muted);
    font-size: 1.25rem;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
}

.drawer-close:hover {
    color: var(--text);
}

/* Slide transition */
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
