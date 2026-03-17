<script setup>
import { ref, watch } from 'vue'
import { adminApi } from '@/services/api'

const props = defineProps({
    open: Boolean,
    commercial: { type: Object, default: null },
})

const emit = defineEmits(['close', 'updated'])

const name = ref('')
const bio = ref('')
const status = ref('active')
const profileFile = ref(null)
const previewUrl = ref(null)
const saving = ref(false)
const error = ref('')

watch(() => props.open, (val) => {
    if (val && props.commercial) {
        name.value = props.commercial.name || ''
        bio.value = props.commercial.bio || ''
        status.value = props.commercial.status || 'active'
        profileFile.value = null
        previewUrl.value = null
        error.value = ''
    }
})

function onFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    profileFile.value = file
    previewUrl.value = URL.createObjectURL(file)
}
function triggerFileInput() {
    document.getElementById('edit-commercial-avatar').click()
}

async function save() {
    if (!name.value.trim()) {
        error.value = 'Name is required'
        return
    }
    saving.value = true
    error.value = ''

    const formData = new FormData()
    formData.append('name', name.value.trim())
    formData.append('bio', bio.value.trim())
    formData.append('status', status.value)
    if (profileFile.value) {
        formData.append('profileImage', profileFile.value)
    }

    try {
        const res = await adminApi.patch(`/commercials/${props.commercial.id}`, formData)
        emit('updated', res.commercial)
    } catch (err) {
        error.value = err.message || 'Failed to update'
    } finally {
        saving.value = false
    }
}
</script>

<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="open" class="modal-overlay" @click.self="emit('close')">
                <div class="modal-content">
                    <button class="modal-close" @click="emit('close')">
                        <i class="bi bi-x-lg"></i>
                    </button>

                    <h3 class="modal-title">Edit Commercial</h3>

                    <!-- Avatar -->
                    <div class="avatar-section" @click="triggerFileInput">
                        <img
                            v-if="previewUrl || commercial?.profileImagePath"
                            :src="previewUrl || commercial?.profileImagePath"
                            alt="profile"
                            class="avatar-img"
                            @error="$event.target.style.display='none'"
                        />
                        <div v-else class="avatar-placeholder">
                            <i class="bi bi-cloud-arrow-up"></i>
                        </div>
                        <div class="avatar-overlay">
                            <i class="bi bi-camera"></i>
                        </div>
                        <input
                            id="edit-commercial-avatar"
                            type="file"
                            accept="image/*"
                            hidden
                            @change="onFileChange"
                        />
                    </div>

                    <!-- Form -->
                    <div class="form-fields">
                        <!-- Name (floating label) -->
                        <div class="floating-field">
                            <input id="edit-name" v-model="name" type="text" placeholder=" " />
                            <label for="edit-name">Name</label>
                        </div>

                        <!-- Bio (floating label textarea) -->
                        <div class="floating-field">
                            <textarea id="edit-bio" v-model="bio" placeholder=" " rows="3"></textarea>
                            <label for="edit-bio">Bio</label>
                        </div>

                        <!-- Status toggle -->
                        <div class="status-toggle">
                            <button
                                type="button"
                                class="status-pill active-pill"
                                :class="{ selected: status === 'active' }"
                                @click="status = 'active'"
                            >
                                <i class="bi bi-activity status-icon active"></i> Active
                            </button>
                            <button
                                type="button"
                                class="status-pill suspended-pill"
                                :class="{ selected: status === 'suspended' }"
                                @click="status = 'suspended'"
                            >
                                <i class="bi bi-activity status-icon suspended"></i> Suspended
                            </button>
                        </div>
                    </div>

                    <!-- Error -->
                    <p v-if="error" class="error-msg">{{ error }}</p>

                    <!-- Actions -->
                    <div class="modal-actions">
                        <button class="btn-cancel" @click="emit('close')">Cancel</button>
                        <button class="btn-save" :disabled="saving" @click="save">
                            <i v-if="saving" class="bi bi-arrow-repeat spin"></i>
                            {{ saving ? 'Saving...' : 'Save' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* ---- Avatar ---- */
.avatar-section {
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    margin: 0 auto 24px;
    cursor: pointer;
    overflow: hidden;
}

.avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.avatar-placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--bg);
    border: 2px dashed var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: var(--text-muted);
    opacity: 0.5;
}

.avatar-overlay {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 20px;
    opacity: 0;
    transition: opacity 0.2s;
}

.avatar-section:hover .avatar-overlay {
    opacity: 1;
}

/* ---- Floating fields ---- */
.form-fields {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.floating-field {
    position: relative;
}

.floating-field input,
.floating-field textarea {
    width: 100%;
    padding: 14px 14px 6px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: var(--text);
    font-size: 14px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
    box-sizing: border-box;
    resize: vertical;
}

.floating-field input:focus,
.floating-field textarea:focus {
    border-color: var(--primary);
}

.floating-field label {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 14px;
    color: var(--text-muted);
    pointer-events: none;
    transition: all 0.15s ease;
    background: var(--surface);
    padding: 0 4px;
}

.floating-field textarea ~ label {
    top: 14px;
    transform: none;
}

.floating-field input:focus ~ label,
.floating-field input:not(:placeholder-shown) ~ label {
    top: 0;
    transform: translateY(-50%);
    font-size: 11px;
    color: var(--primary);
}

.floating-field textarea:focus ~ label,
.floating-field textarea:not(:placeholder-shown) ~ label {
    top: 0;
    transform: translateY(-50%);
    font-size: 11px;
    color: var(--primary);
}

/* ---- Status toggle ---- */
.status-toggle {
    display: flex;
    gap: 8px;
}

.status-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
}

.status-pill:hover {
    border-color: var(--text-muted);
}

.status-icon {
    font-size: 14px;
}

.status-icon.active { color: var(--success); }
.status-icon.suspended { color: var(--danger); }

.active-pill.selected { color: #15803D; border-color: #BBF7D0; background: #F0FDF4; }
.suspended-pill.selected { color: #B91C1C; border-color: #FECACA; background: #FEF2F2; }

[data-theme="dark"] .active-pill.selected { color: #86EFAC; border-color: #14532D; background: rgba(34, 197, 94, 0.1); }
[data-theme="dark"] .suspended-pill.selected { color: #FCA5A5; border-color: #7F1D1D; background: rgba(239, 68, 68, 0.1); }

/* ---- Error ---- */
.error-msg {
    color: var(--danger);
    font-size: 13px;
    margin-top: 12px;
}

/* ---- Actions ---- */
.modal-actions {
    display: flex;
    gap: 10px;
    margin-top: 24px;
}

.btn-cancel {
    flex: 1;
    padding: 10px 0;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--surface);
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
}

.btn-cancel:hover {
    border-color: var(--text-muted);
    color: var(--text);
}

.btn-save {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 0;
    border: none;
    border-radius: 8px;
    background: var(--primary);
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: background 0.15s;
}

.btn-save:hover {
    background: var(--primary-hover);
}

.btn-save:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.spin {
    animation: spin 0.8s linear infinite;
}
</style>