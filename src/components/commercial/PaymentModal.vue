<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { commercialApi } from '@/services/api'
import { X, CreditCard, Banknote } from '@lucide/vue'

const props = defineProps({
    open: { type: Boolean, required: true },
    ticket: { type: Object, default: null },
})

const emit = defineEmits(['close', 'paid'])

// Form state
const method = ref('card')
const selectedCardId = ref(null)
const paymentCode = ref('')
const label = ref('')

// Cards list
const cards = ref([])
const cardsLoading = ref(false)

// Submission state
const submitting = ref(false)
const error = ref(null)

const selectedCard = computed(() => cards.value.find(c => c.id === selectedCardId.value) || null)

const insufficientBalance = computed(() => {
    if (method.value !== 'card' || !selectedCard.value || !props.ticket) return false
    return parseFloat(selectedCard.value.balance) < parseFloat(props.ticket.amount)
})

const canSubmit = computed(() => {
    if (submitting.value) return false
    if (method.value === 'card') return !!selectedCardId.value && !insufficientBalance.value
    if (method.value === 'cash') return paymentCode.value.trim().length > 0
    return false
})

async function loadCards() {
    cardsLoading.value = true
    try {
        const data = await commercialApi.get('/cards')
        cards.value = (data.cards || []).filter(c => c.status === 'active')
        if (cards.value.length) selectedCardId.value = cards.value[0].id
    } catch {
        cards.value = []
    } finally {
        cardsLoading.value = false
    }
}

async function submit() {
    if (!canSubmit.value) return
    error.value = null
    submitting.value = true

    const body = {
        ticket_id: props.ticket.id,
        method: method.value,
        label: label.value.trim() || undefined,
    }

    if (method.value === 'card') {
        body.card_id = selectedCardId.value
    } else {
        body.payment_code = paymentCode.value.trim()
    }

    try {
        await commercialApi.post('/payments', body)
        emit('paid', props.ticket.id)
        handleClose()
    } catch (err) {
        error.value = err.message || 'Payment failed'
    } finally {
        submitting.value = false
    }
}

function handleClose() {
    if (submitting.value) return
    emit('close')
}

// Reset form and load cards when modal opens
watch(() => props.open, (val) => {
    if (val) {
        method.value = 'card'
        selectedCardId.value = null
        paymentCode.value = ''
        label.value = ''
        error.value = null
        loadCards()
    }
})
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="open" class="modal-overlay" @click.self="handleClose">
                <div class="modal" role="dialog" aria-modal="true">

                    <!-- Header -->
                    <div class="modal-header">
                        <div class="modal-title">
                            <i class="bi bi-credit-card"></i>
                            Pay Ticket
                        </div>
                        <button class="close-btn" @click="handleClose" :disabled="submitting">
                            <X size="18" />
                        </button>
                    </div>

                    <!-- Ticket summary -->
                    <div v-if="ticket" class="ticket-summary">
                        <div class="summary-row">
                            <span class="summary-label">Ticket</span>
                            <span class="summary-value">{{ ticket.title }}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Amount</span>
                            <span class="summary-value amount">{{ ticket.amount }} MAD</span>
                        </div>
                    </div>

                    <!-- Body -->
                    <div class="modal-body">

                        <!-- Method selector -->
                        <div class="field">
                            <label>Payment method</label>
                            <div class="method-tabs">
                                <button
                                    class="method-tab"
                                    :class="{ active: method === 'card' }"
                                    @click="method = 'card'"
                                    :disabled="submitting"
                                >
                                    <CreditCard size="15" /> Card
                                </button>
                                <button
                                    class="method-tab"
                                    :class="{ active: method === 'cash' }"
                                    @click="method = 'cash'"
                                    :disabled="submitting"
                                >
                                    <Banknote size="15" /> Cash
                                </button>
                            </div>
                        </div>

                        <!-- Card method -->
                        <template v-if="method === 'card'">
                            <div class="field">
                                <label>Select card</label>
                                <div v-if="cardsLoading" class="cards-loading">Loading cards...</div>
                                <div v-else-if="!cards.length" class="no-cards">
                                    No active cards available.
                                </div>
                                <div v-else class="cards-list">
                                    <label
                                        v-for="card in cards"
                                        :key="card.id"
                                        class="card-option"
                                        :class="{ selected: selectedCardId === card.id }"
                                    >
                                        <input
                                            type="radio"
                                            :value="card.id"
                                            v-model="selectedCardId"
                                            :disabled="submitting"
                                        />
                                        <div class="card-option-info">
                                            <span class="card-option-category">{{ card.category?.name || 'Card' }}</span>
                                            <span class="card-option-balance" :class="{ low: parseFloat(card.balance) < parseFloat(ticket?.amount || 0) }">
                                                {{ card.balance }} MAD
                                            </span>
                                        </div>
                                    </label>
                                </div>
                                <p v-if="insufficientBalance" class="field-error">
                                    Insufficient balance on this card.
                                </p>
                            </div>
                        </template>

                        <!-- Cash method -->
                        <template v-if="method === 'cash'">
                            <div class="field">
                                <label>Payment code <span class="required">*</span></label>
                                <input
                                    type="text"
                                    v-model="paymentCode"
                                    placeholder="Enter your payment code"
                                    :disabled="submitting"
                                    autocomplete="off"
                                />
                                <p class="field-hint">Your payment will go into review until an admin approves it.</p>
                            </div>
                        </template>

                        <!-- Optional label -->
                        <div class="field">
                            <label>Label <span class="optional">(optional)</span></label>
                            <input
                                type="text"
                                v-model="label"
                                placeholder="e.g. Q1 expenses"
                                :disabled="submitting"
                                maxlength="100"
                            />
                        </div>

                        <!-- Error -->
                        <div v-if="error" class="error-msg">{{ error }}</div>

                    </div>

                    <!-- Footer -->
                    <div class="modal-footer">
                        <button class="btn-cancel" @click="handleClose" :disabled="submitting">Cancel</button>
                        <button class="btn-pay" @click="submit" :disabled="!canSubmit">
                            <span v-if="submitting">Processing...</span>
                            <span v-else>Confirm Payment</span>
                        </button>
                    </div>

                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* ---- Overlay ---- */
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 500;
    padding: 16px;
}

/* ---- Modal box ---- */
.modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    width: 100%;
    max-width: 420px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* ---- Header ---- */
.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px 14px;
    border-bottom: 1px solid var(--border);
}

.modal-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 700;
    color: var(--text);
}

.modal-title i {
    font-size: 18px;
    color: var(--primary);
}

.close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-muted);
    padding: 4px;
    border-radius: 6px;
    transition: background 0.15s, color 0.15s;
}

.close-btn:hover:not(:disabled) {
    background: var(--bg);
    color: var(--text);
}

.close-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* ---- Ticket summary ---- */
.ticket-summary {
    padding: 14px 20px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.summary-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
}

.summary-label {
    color: var(--text-muted);
    opacity: 0.7;
}

.summary-value {
    font-weight: 500;
    color: var(--text);
    max-width: 240px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.summary-value.amount {
    font-size: 15px;
    font-weight: 700;
    color: var(--primary);
}

/* ---- Body ---- */
.modal-body {
    padding: 18px 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
    max-height: 55vh;
}

/* ---- Field ---- */
.field {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.field label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    color: var(--text-muted);
    opacity: 0.7;
}

.field input[type="text"] {
    padding: 9px 12px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    font-family: inherit;
    transition: border-color 0.15s;
    outline: none;
}

.field input[type="text"]:focus {
    border-color: var(--primary);
}

.field input[type="text"]:disabled {
    opacity: 0.5;
}

.required { color: var(--danger); }
.optional { font-size: 11px; text-transform: none; letter-spacing: 0; opacity: 0.6; }

.field-hint {
    font-size: 11px;
    color: var(--text-muted);
    opacity: 0.6;
    margin: 0;
    line-height: 1.5;
}

.field-error {
    font-size: 12px;
    color: var(--danger);
    margin: 0;
}

/* ---- Method tabs ---- */
.method-tabs {
    display: flex;
    gap: 8px;
}

.method-tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    flex: 1;
    justify-content: center;
    padding: 8px 14px;
    border: 1.5px solid var(--border);
    border-radius: 9px;
    background: var(--bg);
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
}

.method-tab:hover:not(:disabled) {
    border-color: var(--primary);
    color: var(--primary);
}

.method-tab.active {
    border-color: var(--primary);
    background: var(--primary);
    color: #fff;
}

.method-tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ---- Cards list ---- */
.cards-loading,
.no-cards {
    font-size: 13px;
    color: var(--text-muted);
    opacity: 0.6;
    padding: 8px 0;
}

.cards-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.card-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s;
    background: var(--bg);
}

.card-option:hover {
    border-color: var(--primary);
}

.card-option.selected {
    border-color: var(--primary);
    background: color-mix(in srgb, var(--primary) 8%, transparent);
}

.card-option input[type="radio"] {
    accent-color: var(--primary);
    width: 15px;
    height: 15px;
    flex-shrink: 0;
}

.card-option-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
}

.card-option-category {
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    text-transform: capitalize;
}

.card-option-balance {
    font-size: 12px;
    color: var(--text-muted);
}

.card-option-balance.low {
    color: var(--danger);
    font-weight: 600;
}

/* ---- Error ---- */
.error-msg {
    padding: 10px 14px;
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid #FECACA;
    border-radius: 9px;
    color: var(--danger);
    font-size: 13px;
    font-weight: 500;
}

[data-theme="dark"] .error-msg {
    background: rgba(239, 68, 68, 0.1);
    border-color: #7F1D1D;
}

/* ---- Footer ---- */
.modal-footer {
    display: flex;
    gap: 10px;
    padding: 14px 20px 18px;
    border-top: 1px solid var(--border);
}

.btn-cancel {
    flex: 1;
    padding: 10px;
    border: 1.5px solid var(--border);
    border-radius: 9px;
    background: var(--surface);
    color: var(--text-muted);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
}

.btn-cancel:hover:not(:disabled) {
    border-color: var(--text-muted);
    color: var(--text);
}

.btn-cancel:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-pay {
    flex: 2;
    padding: 10px;
    border: none;
    border-radius: 9px;
    background: var(--primary);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.15s;
}

.btn-pay:hover:not(:disabled) {
    opacity: 0.88;
}

.btn-pay:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

/* ---- Transition ---- */
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s, transform 0.2s;
}
.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.96);
}
</style>
