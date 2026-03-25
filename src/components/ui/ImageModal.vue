<script setup>
defineProps({
    open: Boolean,
    loading: Boolean,
    title: String,
    image: String,
    description: String,
})

const emit = defineEmits(['close'])
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="open" class="modal-overlay" @click.self="emit('close')">
                <div class="modal-content">
                    <button class="modal-close" @click="emit('close')">
                        <i class="bi bi-x-lg"></i>
                    </button>
                    <h3 class="modal-title">{{ title }}</h3>
                    <template v-if="loading">
                        <div class="modal-image-wrapper">
                            <div class="image-skeleton"></div>
                        </div>
                        <div class="text-skeleton" style="width: 100%; height: 14px;"></div>
                        <div class="text-skeleton" style="width: 75%; height: 14px;"></div>
                    </template>

                    <template v-else>
                        <div class="modal-image-wrapper">
                            <img v-if="image" :src="image" alt="Ticket image" class="modal-image" />
                            <div v-else class="modal-no-image">
                                <i class="bi bi-image"></i>
                                <span>No image available</span>
                            </div>
                        </div>
                        <p v-if="description" class="modal-description">{{ description }}</p>
                        <p v-else class="modal-description muted">No description.</p>
                    </template>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease;
}
.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
    transition: transform 0.25s ease, opacity 0.25s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}
.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
}

.modal-content {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 28px;
    max-width: 520px;
    width: 90%;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
}

.modal-close {
    position: absolute;
    top: 14px;
    right: 14px;
    background: none;
    border: none;
    font-size: 18px;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 6px;
    transition: background 0.15s, color 0.15s;
}
.modal-close:hover {
    background: var(--bg);
    color: var(--text);
}

.modal-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 18px;
    padding-right: 30px;
}

.image-skeleton {
    width: 100%;
    height:180px;
    background: linear-gradient(90deg, var(--bg) 25%, var(--border) 50%, var(--bg) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
}

.text-skeleton {
    border-radius: 6px;
    margin-bottom: 10px;
    background: linear-gradient(90deg, var(--bg) 25%, var(--border) 50%, var(--bg) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}

.modal-image-wrapper {
    border-radius: 12px;
    overflow: hidden;
    background: var(--bg);
    border: 1px solid var(--border);
    margin-bottom: 16px;
}

.modal-image {
    width: 100%;
    display: block;
    object-fit: contain;
    max-height: 400px;
}

.modal-no-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 48px 0;
    color: var(--text-muted);
    opacity: 0.5;
}
.modal-no-image i {
    font-size: 32px;
}
.modal-no-image span {
    font-size: 14px;
}

.modal-description {
    font-size: 14px;
    line-height: 1.6;
    color: var(--text);
}
.modal-description.muted {
    color: var(--text-muted);
    opacity: 0.6;
    font-style: italic;
}
</style>