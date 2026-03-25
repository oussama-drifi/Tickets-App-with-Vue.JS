<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineProps({
    modelValue: { type: String, default: '' },
});

const statuses = [
    { value: '', label: 'All statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'verified', label: 'Verified' },
    { value: 'paid', label: 'Paid' },
    { value: 'rejected', label: 'Rejected' },
]
// sync the selected value with parent filters
const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const wrapperRef = ref(null)

function select(value) {
    emit('update:modelValue', value)
    isOpen.value = false
}

function handleClickOutside(e) {
    if (wrapperRef.value && !wrapperRef.value.contains(e.target)) {
        isOpen.value = false
    }
}
// make the document handle the outside click
onMounted(() => document.addEventListener('click', handleClickOutside))
// cleanup outsideClick event handler
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
    <div class="status-filter" ref="wrapperRef">
        <button class="trigger" :class="modelValue || 'all'" @click="isOpen = !isOpen">
            <span v-if="modelValue" class="status-dot" :class="modelValue"></span>
            <span v-else><i class="bi bi-activity"></i></span>
            <span class="label">{{ statuses.find(s => s.value === modelValue)?.label }}</span>
            <i class="bi bi-chevron-down chevron" :class="{ rotated: isOpen }"></i>
        </button>
        <Transition name="dropdown">
            <ul v-if="isOpen" class="dropdown">
                <li
                    v-for="s in statuses"
                    :key="s.value"
                    class="option"
                    :class="[s.value || 'all', { active: s.value === modelValue }]"
                    @click="select(s.value)"
                >
                    <span v-if="s.value" class="status-dot" :class="s.value"></span>
                    <span v-else class="all-icon"><i class="bi bi-collection"></i></span>
                    <span>{{ s.label }}</span>
                    <i v-if="s.value === modelValue" class="bi bi-check2 check"></i>
                </li>
            </ul>
        </Transition>
    </div>
</template>

<style scoped>
.status-filter {
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

.chevron {
    font-size: 11px;
    opacity: 0.4;
    transition: transform 0.2s;
    margin-left: 2px;
}

.chevron.rotated {
    transform: rotate(180deg);
}

/* Status dot */
.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.status-dot.pending { background: #F59E0B; }
.status-dot.verified { background: #3B82F6; }
.status-dot.paid { background: var(--success); }
.status-dot.rejected { background: var(--danger); }

/* Trigger color variants */
.trigger.pending { color: #B45309; border-color: #FDE68A; background: #FFFBEB; }
.trigger.verified { color: #1D4ED8; border-color: #BFDBFE; background: #EFF6FF; }
.trigger.paid { color: #15803D; border-color: #BBF7D0; background: #F0FDF4; }
.trigger.rejected { color: #B91C1C; border-color: #FECACA; background: #FEF2F2; }

[data-theme="dark"] .trigger.pending { color: #FCD34D; border-color: #78350F; background: rgba(245, 158, 11, 0.1); }
[data-theme="dark"] .trigger.verified { color: #93C5FD; border-color: #1E3A5F; background: rgba(59, 130, 246, 0.1); }
[data-theme="dark"] .trigger.paid { color: #86EFAC; border-color: #14532D; background: rgba(34, 197, 94, 0.1); }
[data-theme="dark"] .trigger.rejected { color: #FCA5A5; border-color: #7F1D1D; background: rgba(239, 68, 68, 0.1); }

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

.all-icon {
    font-size: 14px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
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