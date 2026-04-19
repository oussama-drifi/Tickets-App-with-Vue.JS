<template>
    <div class="cards-page">
        <nav class="cards-menu">
            <button
                v-for="tab in tabs"
                :key="tab.key"
                class="menu-item"
                :class="{ active: activeTab === tab.key }"
                @click="activeTab = tab.key"
            >
                {{ tab.label }}
            </button>
        </nav>

        <div class="cards-content">
            <div v-if="activeTab === 'categories'" class="tab-container">
                <h2>Categories</h2>
            </div>
            <div v-else-if="activeTab === 'cards'" class="tab-container">
                <h2>Cards</h2>
            </div>
            <div v-else-if="activeTab === 'payments'" class="tab-container">
                <h2>Payments</h2>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const tabs = [
    { key: 'categories', label: 'Categories' },
    { key: 'cards', label: 'Cards' },
    { key: 'payments', label: 'Payments' },
]

const activeTab = ref('categories')
</script>

<style scoped>
.cards-page {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.cards-menu {
    display: flex;
    gap: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0;
}

.menu-item {
    padding: 0.6rem 1.2rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    cursor: pointer;
    font-size: 0.95rem;
    color: #6b7280;
    transition: color 0.2s, border-color 0.2s;
}

.menu-item:hover {
    color: #111827;
}

.menu-item.active {
    color: #4f46e5;
    border-bottom-color: #4f46e5;
    font-weight: 600;
}

.tab-container {
    padding: 1rem 0;
}
</style>
