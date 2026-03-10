<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
    { value: '5', label: 'Option 5' },
]

const isOpen = ref(false)
const selectedOption = ref(options[0])
const selectRef = ref(null)

function toggleDropdown() {
    isOpen.value = !isOpen.value
}

function selectOption(option) {
    selectedOption.value = option
    isOpen.value = false
}

function handleClickOutside(e) {
    if (selectRef.value && !selectRef.value.contains(e.target)) {
        isOpen.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>
<template>
    <header>
        <nav class="nav-bar">
            <RouterLink :to="{ name: 'commercial-all' }" class="nav-link">
                <i class="bi bi-card-list"></i> all <span>commercials</span>
            </RouterLink>
            <RouterLink :to="{ name: 'commercial-details' }" class="nav-link">
                <i class="bi bi-info-circle"></i> <span>commercial details</span>
            </RouterLink>
        </nav>
        <!-- <div class="filter">
            <div class="custom-select" ref="selectRef">
                <button class="custom-select-trigger" @click="toggleDropdown">
                    <span>{{ selectedOption.label }}</span>
                    <i class="bi bi-chevron-down" :class="{ rotated: isOpen }"></i>
                </button>
                <ul :class="`custom-select-options ${isOpen ? 'shown' : ''}`">
                    <li
                        v-for="option in options"
                        :key="option.value"
                        class="custom-select-option"
                        :class="{ selected: option.value === selectedOption.value }"
                        @click="selectOption(option)"
                    >
                        {{ option.label }}
                    </li>
                </ul>
            </div>
        </div> -->
    </header>
</template>


<style scoped>
.nav-bar {
    background-color: var(--surface);
    border: 2px solid var(--border);
    width: fit-content;
    border-radius: 8px;
    padding: 2px;
    display: flex;
    gap: 5px;
}
.nav-link {
    font-size: 16px;
    text-decoration: none;
    padding: 6px 10px;
    border: 5px;
    font-weight: 600;
    color: var(--text-muted);
    border-radius: 6px;
}
.nav-link.router-link-active {
    background-color: var(--primary);
    color: var(--bg);
}





/* custom selection menu */
.custom-select {
    position: relative;
    width: 300px;
}

.custom-select-trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    background-color: var(--surface);
    border: 2px solid var(--border);
    border-radius: 8px;
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 0.2s;
}

.custom-select-trigger:hover {
    border-color: var(--primary);
}

.custom-select-trigger i {
    font-size: 12px;
    transition: transform 0.2s;
}

.custom-select-trigger i.rotated {
    transform: rotate(180deg);
}

.custom-select-options {
    position: absolute;
    width: 100%;
    list-style: none;
    z-index: 100;
    padding: 4px;
    border-radius: 8px;
    background-color: var(--surface);
    border: 2px solid var(--border);
    bottom: 0;
    left: 0;
    transform: translateY(100%) scale(0.9);
    transform-origin: left top;
    transition: all 0.3s ease;
    pointer-events: none;
    opacity: 0;
}
.custom-select-options.shown {
    transform: translateY(100%) scale(1);
    pointer-events: auto;
    opacity: 1;
}

.custom-select-option {
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.15s;
    transition-duration: 0.3s;
}

.custom-select-option:hover {
    background-color: var(--border);
}

.custom-select-option.selected {
    background-color: var(--primary);
    color: var(--bg);
}
</style>