<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { commercialApi } from '@/services/api'

const router = useRouter()

function showToast(type, message) {
    toast.value = { type, message }
    setTimeout(() => toast.value = null, 4000)
}

// form data 
const imageFile = ref(null)
const isDragging = ref(false)
const submitting = ref(false)
const fileInput = ref(null)
const toast = ref(null)
const categories = [
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'hotel', label: 'Hotel' },
    { value: 'work', label: 'Work' },
]
const form = reactive({
    title: '',
    description: '',
    amount: '',
    ticketDate: '',
    category: ''
})

// DropeZone
function triggerFileInput() {
    fileInput.value.click()
}
function handleFileSelect(e) {
    const file = e.target.files[0]
    if (file) imageFile.value = file
}
function handleDrop(e) {
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) imageFile.value = file
}
function removeImage() {
    imageFile.value = null
    if (fileInput.value) fileInput.value.value = ''
}

// form submition Logic
async function handleSubmit() {
    submitting.value = true
    try {
        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('amount', form.amount)
        formData.append('ticketDate', form.ticketDate)
        formData.append('category', form.category)
        if (form.description) formData.append('description', form.description)
        if (imageFile.value) formData.append('image', imageFile.value)

        await commercialApi.post('/tickets', formData)
        router.push({ name: 'commercial-tickets' })
    } catch (err) {
        showToast('error', err.message)
    } finally {
        submitting.value = false
    }
}
</script>

<template>
    <div class="new-ticket">
        <h2 class="page-title">New Ticket</h2>

        <form class="form" @submit.prevent="handleSubmit">
            <div class="form-row">
                <div class="floating-field">
                    <input id="ticket-title" v-model="form.title" type="text" placeholder=" " required />
                    <label for="ticket-title"><i class="bi bi-tag"></i> Title</label>
                </div>

                <div class="floating-field">
                    <input id="ticket-amount" v-model="form.amount" type="number" step="0.01" min="0" placeholder=" " required />
                    <label for="ticket-amount"><i class="bi bi-cash-stack"></i> Amount (MAD)</label>
                </div>
            </div>

            <div class="form-row">
                <div class="floating-field">
                    <input id="ticket-date" v-model="form.ticketDate" type="date" placeholder=" " required />
                    <label for="ticket-date"><i class="bi bi-calendar3"></i> Ticket Date</label>
                </div>

                <div class="floating-field">
                    <select id="ticket-category" v-model="form.category" required>
                        <option value="" disabled hidden></option>
                        <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                    </select>
                    <label for="ticket-category"><i class="bi bi-grid"></i> Category</label>
                </div>
            </div>

            <div class="floating-field">
                <textarea id="ticket-desc" v-model="form.description" placeholder=" " rows="3"></textarea>
                <label for="ticket-desc"><i class="bi bi-text-left"></i> Description</label>
            </div>

            <div
                class="dropzone"
                :class="{ dragging: isDragging }"
                @click="triggerFileInput"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
            >
                <input ref="fileInput" type="file" accept="image/*" hidden @change="handleFileSelect" />
                <template v-if="imageFile">
                    <div class="file-info">
                        <i class="bi bi-file-earmark-image"></i>
                        <span class="file-name">{{ imageFile.name }}</span>
                        <button type="button" class="remove-file" @click.stop="removeImage">
                            <i class="bi bi-x-lg"></i>
                        </button>
                    </div>
                </template>
                <template v-else>
                    <i class="bi bi-cloud-arrow-up upload-icon"></i>
                    <p class="dropzone-text">Drag & drop a ticket image or <span>browse</span></p>
                    <p class="dropzone-hint">PNG, JPG, WEBP up to 5MB</p>
                </template>
            </div>

            <button type="submit" class="submit-btn" :disabled="submitting">
                <span v-if="submitting" class="spinner"></span>
                <span v-if="!submitting"><i class="bi bi-plus-lg"></i> Create Ticket</span>
                <span v-else>submitting</span>
            </button>
        </form>

        <Transition name="toast">
            <div v-if="toast" class="toast-card" :class="toast.type" @click="toast = null">
                <i :class="toast.type === 'success' ? 'bi bi-check-circle' : 'bi bi-exclamation-triangle'"></i>
                <span>{{ toast.message }}</span>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.new-ticket {
    padding: 0;
    width: 100%;
}

.page-title {
    font-size: clamp(1.25rem, 2.5vw, 1.5rem);
    color: var(--text);
    margin-bottom: 28px;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.form-row {
    display: flex;
    gap: 10px;
}

/* ---- Floating label fields ---- */
.floating-field {
    position: relative;
    flex: 1;
}

.floating-field input,
.floating-field textarea,
.floating-field select {
    width: 100%;
    padding: 24px 14px 8px;
    font-size: 0.9rem;
    color: var(--text);
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 10px;
    outline: none;
    transition: border-color 0.2s;
    font-family: inherit;
    resize: vertical;
    box-sizing: border-box;
}

.floating-field select {
    appearance: none;
    cursor: pointer;
}

.floating-field input:focus,
.floating-field textarea:focus,
.floating-field select:focus {
    border-color: var(--primary);
}

.floating-field label {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.9rem;
    color: var(--text-muted);
    pointer-events: none;
    transition: all 0.2s ease;
    background: transparent;
    padding: 0;
}

.floating-field textarea ~ label {
    top: 24px;
    transform: none;
}

.floating-field input:focus ~ label,
.floating-field input:not(:placeholder-shown) ~ label {
    top: 8px;
    transform: none;
    font-size: 0.7rem;
    color: var(--primary);
}

.floating-field textarea:focus ~ label,
.floating-field textarea:not(:placeholder-shown) ~ label {
    top: 8px;
    transform: none;
    font-size: 0.7rem;
    color: var(--primary);
}

/* Date & select inputs: always float label */
.floating-field select ~ label,
.floating-field input[type="date"] ~ label {
    top: 8px;
    transform: none;
    font-size: 0.7rem;
    color: var(--primary);
}

/* ---- Dropzone ---- */
.dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 32px 16px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
    min-height: 160px;
}

.dropzone:hover,
.dropzone.dragging {
    border-color: var(--primary);
    background: rgba(250, 128, 41, 0.04);
}

.upload-icon {
    font-size: 3.5rem;
    color: var(--primary);
}

.dropzone-text {
    font-size: 0.85rem;
    color: var(--text-muted);
}

.dropzone-text span {
    color: var(--primary);
    font-weight: 500;
}

.dropzone-hint {
    font-size: 0.75rem;
    color: var(--text-muted);
    opacity: 0.7;
    margin-top: 2px;
}

.file-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.9rem;
    color: var(--text);
}

.file-info > i {
    font-size: 1.5rem;
    color: var(--primary);
}

.file-name {
    word-break: break-all;
}

.remove-file {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    font-size: 0.85rem;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: color 0.2s;
}

.remove-file:hover {
    color: var(--danger);
}

/* ---- Submit ---- */
.submit-btn {
    padding: 14px;
    background: var(--primary);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: inherit;
}

.submit-btn:hover:not(:disabled) {
    background: var(--primary-hover);
}

.submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

/* ---- Toast ---- */
.toast-card {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    z-index: 2000;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.toast-card.error {
    background: #fef2f2;
    color: #b91c1c;
    border: 1px solid #fecaca;
}

.toast-card.success {
    background: #f0fdf4;
    color: #15803d;
    border: 1px solid #bbf7d0;
}

.toast-card i {
    font-size: 1.1rem;
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(16px);
}

/* ---- Responsive ---- */
@media (max-width: 768px) {
    .form-row {
        flex-direction: column;
    }
}
</style>