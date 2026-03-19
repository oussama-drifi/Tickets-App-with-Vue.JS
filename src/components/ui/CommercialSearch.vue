<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { adminApi } from '@/services/api'

const props = defineProps({
    modelValue: { type: [Number, null], default: null },
    placeholder: { type: String, default: 'Search commercial...' },
})

const emit = defineEmits(['update:modelValue'])

const query = ref('')
const results = ref([])
const isOpen = ref(false)
const isLoading = ref(false)
const selectedLabel = ref('')
const wrapperRef = ref(null)

let debounceTimer = null
let justSelected = false
let requestId = 0

watch(query, (val) => {
    clearTimeout(debounceTimer)
    if (justSelected) {
        justSelected = false
        return
    }
    if (!val.trim()) {
        results.value = []
        isOpen.value = false
        return
    }
    debounceTimer = setTimeout(() => fetchResults(val.trim()), 250)
})

async function fetchResults(q) {
    const id = ++requestId
    isLoading.value = true
    try {
        const data = await adminApi.get(`/commercials/search?q=${encodeURIComponent(q)}`)
        if (id !== requestId) return
        results.value = data
        isOpen.value = true
    } catch {
        if (id === requestId) results.value = []
    } finally {
        if (id === requestId) isLoading.value = false
    }
}

function select(item) {
    clearTimeout(debounceTimer)
    requestId++
    justSelected = true
    selectedLabel.value = item.name
    query.value = item.name
    isOpen.value = false
    results.value = []
    emit('update:modelValue', item.id)
}

function onFocus() {
    if (selectedLabel.value && query.value) {
        isOpen.value = false
    }
}

function handleClickOutside(e) {
    if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
        isOpen.value = false
        if (selectedLabel.value) query.value = selectedLabel.value
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
    <div class="commercial-search" ref="wrapperRef">
        <div class="search-input-wrapper">
            <i class="bi bi-search search-icon"></i>
            <input
                v-model="query"
                :placeholder="placeholder"
                @focus="onFocus"
                autocomplete="off"
            />
            <i v-if="isLoading" class="bi bi-arrow-repeat spin loading-icon"></i>
        </div>
        <ul v-if="isOpen" class="search-results">
            <li
                v-for="item in results"
                :key="item.id"
                class="search-result-item"
                :class="{ selected: item.id === modelValue }"
                @mousedown.prevent="select(item)"
            >
                {{ item.name }}
            </li>
            <li v-if="!results.length" class="search-result-empty">No commercials found</li>
        </ul>
    </div>
</template>

<style scoped>
.commercial-search {
    position: relative;
    width: 300px;
}

.search-input-wrapper {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 14px;
    background-color: var(--surface);
    border: 2px solid var(--border);
    border-radius: 8px;
    transition: border-color 0.2s;
}

.search-input-wrapper:focus-within {
    border-color: var(--primary);
}

.search-icon {
    font-size: 14px;
    color: var(--text-muted);
    flex-shrink: 0;
}

.loading-icon {
    font-size: 14px;
    color: var(--text-muted);
    flex-shrink: 0;
}

.search-input-wrapper input {
    flex: 1;
    padding: 10px 0;
    border: none;
    background: transparent;
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
    font-family: inherit;
    outline: none;
}

.search-input-wrapper input::placeholder {
    color: var(--text-muted);
    font-weight: 500;
}

.search-results {
    position: absolute;
    width: 100%;
    list-style: none;
    z-index: 100;
    padding: 4px;
    border-radius: 8px;
    background-color: var(--surface);
    border: 2px solid var(--border);
    margin-top: 4px;
    max-height: 220px;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-result-item {
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.15s;
}

.search-result-item:hover {
    background-color: var(--border);
}

.search-result-item.selected {
    background-color: var(--border);
}

.search-result-empty {
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    text-align: center;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
.spin {
    animation: spin 0.8s linear infinite;
}
</style>