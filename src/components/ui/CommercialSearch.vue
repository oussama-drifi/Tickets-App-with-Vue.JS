<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
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
let abortController = null
let skipWatch = false

// Sets query without triggering the watcher
function setQuerySilent(val) {
    skipWatch = true
    query.value = val
}

watch(query, (val) => {
    if (skipWatch) { skipWatch = false; return }

    clearTimeout(debounceTimer)

    if (!val.trim()) {
        cancelFetch()
        results.value = []
        isOpen.value = false
        return
    }

    isLoading.value = true
    isOpen.value = true
    debounceTimer = setTimeout(() => fetchResults(val.trim()), 300)
})

function cancelFetch() {
    clearTimeout(debounceTimer)
    if (abortController) {
        abortController.abort()
        abortController = null
    }
    isLoading.value = false
}

async function fetchResults(q) {
    if (abortController) abortController.abort()
    abortController = new AbortController()
    const { signal } = abortController

    try {
        const data = await adminApi.get(`/commercials/search?q=${encodeURIComponent(q)}`, { signal })
        results.value = data
    } catch (err) {
        if (err.name === 'AbortError') return
        results.value = []
    } finally {
        if (!signal.aborted) isLoading.value = false
    }
}

function select(item) {
    cancelFetch()
    selectedLabel.value = item.name
    setQuerySilent(item.name)
    isOpen.value = false
    results.value = []
    emit('update:modelValue', item.id)
}

function clear() {
    cancelFetch()
    selectedLabel.value = ''
    setQuerySilent('')
    results.value = []
    isOpen.value = false
    emit('update:modelValue', null)
}

function onFocus() {
    if (selectedLabel.value) {
        setQuerySilent('')
        results.value = []
        isOpen.value = false
    }
}

function onFocusOut(e) {
    if (wrapperRef.value?.contains(e.relatedTarget)) return
    cancelFetch()
    if (selectedLabel.value) setQuerySilent(selectedLabel.value)
    results.value = []
    isOpen.value = false
}

onBeforeUnmount(cancelFetch)
</script>

<template>
    <div class="commercial-search" ref="wrapperRef" @focusout="onFocusOut">
        <div class="search-input-wrapper">
            <i class="bi bi-search search-icon"></i>
            <input
                v-model="query"
                :placeholder="placeholder"
                @focus="onFocus"
                autocomplete="off"
            />
            <i
                v-if="selectedLabel || query"
                class="bi bi-x-lg"
                @click="clear"
            ></i>
        </div>

        <Transition name="dropdown">
            <ul v-if="isOpen" class="search-results">
                <template v-if="isLoading">
                    <li class="skeleton-item" v-for="n in 3" :key="n">
                        <span class="skeleton-bone"></span>
                    </li>
                </template>
                <template v-else>
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
                </template>
            </ul>
        </Transition>
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

.clear-icon {
    font-size: 16px;
    color: var(--text-muted);
    flex-shrink: 0;
    cursor: pointer;
    transition: color 0.15s;
}

.clear-icon:hover {
    color: var(--danger);
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

.search-result-item:hover,
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

.skeleton-item {
    padding: 8px 12px;
    border-radius: 6px;
}

.skeleton-bone {
    display: block;
    height: 14px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--border) 25%, color-mix(in srgb, var(--border) 60%, transparent) 50%, var(--border) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s infinite;
    width: 70%;
}

.skeleton-item:nth-child(2) .skeleton-bone { width: 50%; }
.skeleton-item:nth-child(3) .skeleton-bone { width: 60%; }

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>