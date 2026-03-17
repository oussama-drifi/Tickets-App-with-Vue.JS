<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    options: {
        type: Array,
        required: true,
    },
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
    placeholder: {
        type: String,
        default: '-- Select --',
    },
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref(null)

const selectedLabel = computed(() => {
    const found = props.options.find(o => o.value === props.modelValue)
    return found ? found.label : props.placeholder
})

function toggleDropdown() {
    isOpen.value = !isOpen.value
}

function selectOption(option) {
    emit('update:modelValue', option.value)
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
    <div class="custom-select" ref="selectRef">
        <button class="custom-select-trigger" @click="toggleDropdown">
            <span>{{ selectedLabel }}</span>
            <i class="bi bi-chevron-down" :class="{ rotated: isOpen }"></i>
        </button>
        <ul :class="`custom-select-options ${isOpen ? 'shown' : ''}`">
            <li
                v-for="option in options"
                :key="option.value"
                class="custom-select-option"
                :class="{ selected: option.value === modelValue }"
                @click="selectOption(option)"
            >
                {{ option.label }}
            </li>
        </ul>
    </div>
</template>

<style scoped>
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
    font-family: inherit;
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
    background-color: var(--border);
}
</style>