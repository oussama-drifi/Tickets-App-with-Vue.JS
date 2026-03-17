<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
    modelValue: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const wrapperRef = ref(null)

const categories = [
    { value: '', label: 'All categories', icon: 'bi bi-grid' },
    { value: 'restaurant', label: 'Restaurant', icon: 'bi bi-cup-hot' },
    { value: 'hotel', label: 'Hotel', icon: 'bi bi-building' },
    { value: 'work', label: 'Work', icon: 'bi bi-briefcase' },
]

function select(value) {
    emit('update:modelValue', value)
    isOpen.value = false
}

function handleClickOutside(e) {
    if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
        isOpen.value = false
    }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
    <div class="category-filter" ref="wrapperRef">
        <button class="trigger" @click="isOpen = !isOpen">
            <i :class="categories.find(c => c.value === modelValue)?.icon"></i>
            <span class="label">{{ categories.find(c => c.value === modelValue)?.label }}</span>
            <i class="bi bi-chevron-down chevron" :class="{ rotated: isOpen }"></i>
        </button>
        <Transition name="dropdown">
            <ul v-if="isOpen" class="dropdown">
                <li
                    v-for="c in categories"
                    :key="c.value"
                    class="option"
                    :class="{ active: c.value === modelValue }"
                    @click="select(c.value)"
                >
                    <i :class="c.icon" class="option-icon"></i>
                    <span>{{ c.label }}</span>
                    <i v-if="c.value === modelValue" class="bi bi-check2 check"></i>
                </li>
            </ul>
        </Transition>
    </div>
</template>

<style scoped>
.category-filter {
    position: relative;
}

.trigger {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 12px;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    white-space: nowrap;
    transition: border-color 0.15s;
}

.trigger:hover {
    border-color: var(--primary);
}

.trigger > i:first-child {
    font-size: 14px;
    color: var(--text-muted);
}

.chevron {
    font-size: 11px;
    opacity: 0.4;
    transition: transform 0.2s;
    margin-left: 2px;
}

.chevron.rotated {
    transform: rotate(180deg);
}

/* Dropdown */
.dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 180px;
    list-style: none;
    padding: 5px;
    border-radius: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    z-index: 100;
}

.option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    cursor: pointer;
    text-transform: capitalize;
    transition: background 0.1s;
}

.option:hover {
    background: var(--bg);
}

.option.active {
    background: var(--bg);
}

.option-icon {
    font-size: 14px;
    color: var(--text-muted);
    width: 16px;
    text-align: center;
}

.check {
    margin-left: auto;
    font-size: 14px;
    color: var(--primary);
}

/* Transition */
.dropdown-enter-active,
.dropdown-leave-active {
    transition: opacity 0.15s, transform 0.15s;
}
.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
</style>
