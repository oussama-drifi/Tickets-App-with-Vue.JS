<script setup>
import { ref } from 'vue'
import { formatDate } from '@/utils'
import { CreditCard, Banknote, CheckCircle, XCircle, Ban } from '@lucide/vue'

const props = defineProps({
    payments: { type: Array, required: true },
    loading: { type: Boolean, default: false },
    skeletonRows: { type: Number, default: 8 },
})

const emit = defineEmits(['approve', 'reject', 'cancel'])

// Track in-flight actions per payment id to prevent double-clicks
const actionLoading = ref({})

async function handleAction(action, payment) {
    if (actionLoading.value[payment.id]) return
    actionLoading.value[payment.id] = action
    try {
        await emit(action, payment)
    } finally {
        delete actionLoading.value[payment.id]
    }
}

// Column resize
const resizing = ref(null)
const tableWrapper = ref(null)
const columnWidths = ref({
    method: 100,
    label: null,
    amount: 120,
    status: 140,
    payer: null,
    ticket: null,
    card: null,
    date: 170,
    actions: 190,
})

function onResizeStart(col, e) {
    e.preventDefault()
    const startX = e.clientX
    const th = e.target.closest('th')
    const startWidth = th.offsetWidth

    function onMouseMove(e) {
        columnWidths.value[col] = Math.max(60, startWidth + (e.clientX - startX))
    }
    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
        resizing.value = null
    }

    resizing.value = col
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
}

function colStyle(col) {
    const w = columnWidths.value[col]
    return w ? { width: w + 'px', minWidth: w + 'px' } : {}
}

// Action visibility rules
function canApprove(p) { return p.method === 'cash' && p.status === 'in_review' }
function canReject(p)  { return p.method === 'cash' && p.status === 'in_review' }
function canCancel(p)  { return p.status === 'success' }
</script>

<template>
    <!-- Loading skeleton -->
    <div v-if="loading" class="table-wrapper">
        <table class="payments-table">
            <thead>
                <tr>
                    <th :style="colStyle('method')">Method</th>
                    <th :style="colStyle('label')">Label</th>
                    <th :style="colStyle('amount')">Amount</th>
                    <th :style="colStyle('status')">Status</th>
                    <th :style="colStyle('payer')">Payer</th>
                    <th :style="colStyle('ticket')">Ticket</th>
                    <th :style="colStyle('card')">Card</th>
                    <th :style="colStyle('date')">Date</th>
                    <th :style="colStyle('actions')">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="i in skeletonRows" :key="i" class="skeleton-row">
                    <td><div class="skeleton skeleton-short"></div></td>
                    <td><div class="skeleton skeleton-text"></div></td>
                    <td><div class="skeleton skeleton-short"></div></td>
                    <td><div class="skeleton skeleton-badge"></div></td>
                    <td><div class="skeleton skeleton-text"></div></td>
                    <td><div class="skeleton skeleton-text"></div></td>
                    <td><div class="skeleton skeleton-short"></div></td>
                    <td><div class="skeleton skeleton-medium"></div></td>
                    <td><div class="skeleton skeleton-actions"></div></td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Data table -->
    <div v-else ref="tableWrapper" class="table-wrapper" :class="{ resizing }">
        <table class="payments-table">
            <thead>
                <tr>
                    <th :style="colStyle('method')">Method<span class="resize-handle" @mousedown="onResizeStart('method', $event)"></span></th>
                    <th :style="colStyle('label')">Label<span class="resize-handle" @mousedown="onResizeStart('label', $event)"></span></th>
                    <th :style="colStyle('amount')">Amount<span class="resize-handle" @mousedown="onResizeStart('amount', $event)"></span></th>
                    <th :style="colStyle('status')">Status<span class="resize-handle" @mousedown="onResizeStart('status', $event)"></span></th>
                    <th :style="colStyle('payer')">Payer<span class="resize-handle" @mousedown="onResizeStart('payer', $event)"></span></th>
                    <th :style="colStyle('ticket')">Ticket<span class="resize-handle" @mousedown="onResizeStart('ticket', $event)"></span></th>
                    <th :style="colStyle('card')">Card<span class="resize-handle" @mousedown="onResizeStart('card', $event)"></span></th>
                    <th :style="colStyle('date')">Date<span class="resize-handle" @mousedown="onResizeStart('date', $event)"></span></th>
                    <th :style="colStyle('actions')">Actions<span class="resize-handle" @mousedown="onResizeStart('actions', $event)"></span></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="payment in payments" :key="payment.id">
                    <!-- Method -->
                    <td>
                        <span class="method-badge" :class="payment.method">
                            <component :is="payment.method === 'card' ? CreditCard : Banknote" size="13" />
                            {{ payment.method }}
                        </span>
                    </td>

                    <!-- Label -->
                    <td>
                        <span class="cell-text" :title="payment.label || ''">
                            {{ payment.label || '—' }}
                        </span>
                    </td>

                    <!-- Amount -->
                    <td>
                        <span class="amount">{{ payment.amount }} <small>MAD</small></span>
                    </td>

                    <!-- Status -->
                    <td>
                        <span class="status-badge" :class="payment.status">
                            {{ payment.status.replace('_', ' ') }}
                        </span>
                    </td>

                    <!-- Payer -->
                    <td>
                        <div class="payer-cell">
                            <span class="payer-name">{{ payment.payer?.name || '—' }}</span>
                            <span class="payer-email">{{ payment.payer?.email || '' }}</span>
                        </div>
                    </td>

                    <!-- Ticket -->
                    <td>
                        <div v-if="payment.ticket" class="ticket-cell">
                            <span class="ticket-title" :title="payment.ticket.title">{{ payment.ticket.title }}</span>
                            <span class="ticket-status" :class="payment.ticket.status">{{ payment.ticket.status }}</span>
                        </div>
                        <span v-else class="muted">—</span>
                    </td>

                    <!-- Card -->
                    <td>
                        <div v-if="payment.card" class="card-cell">
                            <span class="card-category">{{ payment.card.category?.name || '—' }}</span>
                            <span class="card-balance">{{ payment.card.balance }} MAD</span>
                        </div>
                        <span v-else class="muted">—</span>
                    </td>

                    <!-- Date -->
                    <td>
                        <span class="date">{{ formatDate(payment.createdAt) }}</span>
                    </td>

                    <!-- Actions -->
                    <td>
                        <div class="actions">
                            <button
                                v-if="canApprove(payment)"
                                class="action-btn approve"
                                :disabled="!!actionLoading[payment.id]"
                                @click="handleAction('approve', payment)"
                                title="Approve payment"
                            >
                                <CheckCircle size="14" />
                                {{ actionLoading[payment.id] === 'approve' ? '...' : 'Approve' }}
                            </button>
                            <button
                                v-if="canReject(payment)"
                                class="action-btn reject"
                                :disabled="!!actionLoading[payment.id]"
                                @click="handleAction('reject', payment)"
                                title="Reject payment"
                            >
                                <XCircle size="14" />
                                {{ actionLoading[payment.id] === 'reject' ? '...' : 'Reject' }}
                            </button>
                            <button
                                v-if="canCancel(payment)"
                                class="action-btn cancel"
                                :disabled="!!actionLoading[payment.id]"
                                @click="handleAction('cancel', payment)"
                                title="Cancel payment"
                            >
                                <Ban size="14" />
                                {{ actionLoading[payment.id] === 'cancel' ? '...' : 'Cancel' }}
                            </button>
                            <span v-if="!canApprove(payment) && !canReject(payment) && !canCancel(payment)" class="muted no-action">—</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
/* ---- Table wrapper ---- */
.table-wrapper {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    max-height: 85vh;
    overflow-y: auto;
    overflow-x: auto;
}

.table-wrapper.resizing {
    user-select: none;
    cursor: col-resize;
}

.table-wrapper > table thead tr:first-child th:first-child { border-top-left-radius: 14px; }
.table-wrapper > table thead tr:first-child th:last-child  { border-top-right-radius: 14px; }
.table-wrapper > table tbody tr:last-child td:first-child  { border-bottom-left-radius: 14px; }
.table-wrapper > table tbody tr:last-child td:last-child   { border-bottom-right-radius: 14px; }

/* ---- Table ---- */
.payments-table {
    width: 100%;
    border-collapse: collapse;
}

.payments-table thead {
    background: var(--bg);
    position: sticky;
    top: 0;
    z-index: 10;
}

.payments-table th {
    position: relative;
    padding: 14px 18px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    opacity: 0.6;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.payments-table td {
    padding: 8px 18px;
    font-size: 14px;
    color: var(--text);
    border-top: 1px solid var(--border);
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.payments-table tbody tr {
    transition: background 0.15s;
}

.payments-table tbody tr:hover {
    background: var(--bg);
}

/* ---- Resize handle ---- */
.resize-handle {
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 6px;
    cursor: col-resize;
    background: transparent;
    transition: background 0.15s;
    z-index: 2;
}
.resize-handle:hover,
.table-wrapper.resizing .resize-handle {
    background: var(--primary);
    opacity: 0.4;
}

/* ---- Cells ---- */
.cell-text {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
    font-size: 13px;
    color: var(--text-muted);
}

.amount {
    font-weight: 600;
    font-variant-numeric: tabular-nums;
}
.amount small {
    font-size: 11px;
    font-weight: 500;
    opacity: 0.5;
}

.date {
    font-size: 13px;
    color: var(--text-muted);
    opacity: 0.7;
}

.muted {
    color: var(--text-muted);
    opacity: 0.4;
    font-size: 13px;
}

/* ---- Method badge ---- */
.method-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 9px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
    border: 1px solid var(--border);
}
.method-badge.card   { color: #1D4ED8; background: #EFF6FF; border-color: #BFDBFE; }
.method-badge.cash   { color: #15803D; background: #F0FDF4; border-color: #BBF7D0; }
[data-theme="dark"] .method-badge.card { color: #93C5FD; background: rgba(59,130,246,0.1); border-color: #1E3A5F; }
[data-theme="dark"] .method-badge.cash { color: #86EFAC; background: rgba(34,197,94,0.1);  border-color: #14532D; }

/* ---- Status badge ---- */
.status-badge {
    display: inline-block;
    padding: 4px 9px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 600;
    text-transform: capitalize;
    border: 1px solid var(--border);
}
.status-badge.in_review  { color: #B45309; background: #FFFBEB; border-color: #FDE68A; }
.status-badge.success    { color: #15803D; background: #F0FDF4; border-color: #BBF7D0; }
.status-badge.cancelled  { color: #6B7280; background: var(--bg); border-color: var(--border); }
.status-badge.failed     { color: #B91C1C; background: #FEF2F2; border-color: #FECACA; }
[data-theme="dark"] .status-badge.in_review { color: #FCD34D; background: rgba(245,158,11,0.1);  border-color: #78350F; }
[data-theme="dark"] .status-badge.success   { color: #86EFAC; background: rgba(34,197,94,0.1);   border-color: #14532D; }
[data-theme="dark"] .status-badge.cancelled { color: #9CA3AF; background: var(--bg);              border-color: var(--border); }
[data-theme="dark"] .status-badge.failed    { color: #FCA5A5; background: rgba(239,68,68,0.1);   border-color: #7F1D1D; }

/* ---- Payer cell ---- */
.payer-cell {
    display: flex;
    flex-direction: column;
    gap: 1px;
}
.payer-name  { font-size: 13px; font-weight: 500; color: var(--text); }
.payer-email { font-size: 11px; color: var(--text-muted); opacity: 0.6; }

/* ---- Ticket cell ---- */
.ticket-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.ticket-title {
    font-size: 13px;
    font-weight: 500;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
}
.ticket-status {
    font-size: 11px;
    font-weight: 600;
    text-transform: capitalize;
}
.ticket-status.pending  { color: #B45309; }
.ticket-status.verified { color: #1D4ED8; }
.ticket-status.paid     { color: #15803D; }
.ticket-status.rejected { color: #B91C1C; }
[data-theme="dark"] .ticket-status.pending  { color: #FCD34D; }
[data-theme="dark"] .ticket-status.verified { color: #93C5FD; }
[data-theme="dark"] .ticket-status.paid     { color: #86EFAC; }
[data-theme="dark"] .ticket-status.rejected { color: #FCA5A5; }

/* ---- Card cell ---- */
.card-cell {
    display: flex;
    flex-direction: column;
    gap: 1px;
}
.card-category { font-size: 12px; font-weight: 500; color: var(--text-muted); text-transform: capitalize; }
.card-balance  { font-size: 12px; color: var(--text-muted); opacity: 0.7; }

/* ---- Action buttons ---- */
.actions {
    display: flex;
    gap: 6px;
    align-items: center;
}

.action-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 10px;
    border-radius: 7px;
    border: 1px solid transparent;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
    transition: all 0.15s;
    white-space: nowrap;
}
.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.action-btn.approve {
    background: #F0FDF4;
    border-color: #BBF7D0;
    color: #15803D;
}
.action-btn.approve:not(:disabled):hover {
    background: #DCFCE7;
    border-color: #86EFAC;
}

.action-btn.reject {
    background: #FEF2F2;
    border-color: #FECACA;
    color: #B91C1C;
}
.action-btn.reject:not(:disabled):hover {
    background: #FEE2E2;
    border-color: #FCA5A5;
}

.action-btn.cancel {
    background: var(--bg);
    border-color: var(--border);
    color: var(--text-muted);
}
.action-btn.cancel:not(:disabled):hover {
    background: #FEF2F2;
    border-color: #FECACA;
    color: #B91C1C;
}

[data-theme="dark"] .action-btn.approve {
    background: rgba(34,197,94,0.1);
    border-color: #14532D;
    color: #86EFAC;
}
[data-theme="dark"] .action-btn.reject {
    background: rgba(239,68,68,0.1);
    border-color: #7F1D1D;
    color: #FCA5A5;
}
[data-theme="dark"] .action-btn.cancel {
    background: var(--bg);
    border-color: var(--border);
    color: var(--text-muted);
}
[data-theme="dark"] .action-btn.cancel:not(:disabled):hover {
    background: rgba(239,68,68,0.1);
    border-color: #7F1D1D;
    color: #FCA5A5;
}

.no-action { font-size: 13px; }

/* ---- Skeleton ---- */
.skeleton {
    border-radius: 6px;
    background: var(--skeleton-gradient);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}
.skeleton-short   { width: 70px;  height: 26px; border-radius: 7px; }
.skeleton-medium  { width: 120px; height: 18px; }
.skeleton-text    { width: 90%;   height: 18px; }
.skeleton-badge   { width: 80px;  height: 26px; border-radius: 7px; }
.skeleton-actions { width: 160px; height: 30px; border-radius: 7px; }

@keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
.skeleton-row td { border-top: 1px solid var(--border); }
</style>
