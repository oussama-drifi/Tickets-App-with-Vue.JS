# Tickets Components

**Location**: `src/components/tickets/`

## Overview

Components for displaying and managing tickets including table views and individual ticket cards.

---

## TicketsTable.vue

**Purpose**: Display list of tickets in a tabular format with sorting and filtering

**Props**:
- `tickets` (array, required): Array of ticket objects
- `isLoading` (boolean): Show loading state
- `filter` (object): Current filter settings (status, page)
- `totalPages` (number): Total number of pages
- `currentPage` (number): Current active page

**Emits**:
- `@select`: When user clicks ticket row (payload: ticket id)
- `@view-image`: When user clicks view image button (payload: ticket id)
- `@update-status`: When status is changed (payload: { ticketId, newStatus })
- `@page-change`: When pagination changes (payload: page number)
- `@filter-change`: When filters change (payload: filter object)

**Columns**:
- Ticket ID
- Title
- Description
- Status (with badge)
- Created Date
- Actions (View, Edit, Delete)

**Features**:
- Status color-coding
- Image preview button
- Pagination
- Status filtering
- Date formatting
- Responsive layout

**Example**:
```vue
<TicketsTable
  :tickets="tickets"
  :is-loading="isLoading"
  :current-page="currentPage"
  :total-pages="totalPages"
  @select="handleSelect"
  @update-status="handleStatusChange"
  @page-change="handlePageChange"
/>
```

---

## TicketCard.vue

**Purpose**: Display individual ticket as a card component

**Props**:
- `ticket` (object, required): Ticket data
  - `id`: Ticket ID
  - `title`: Ticket title
  - `description`: Ticket description
  - `status`: Ticket status
  - `imageUrl`: URL to ticket image
  - `createdAt`: Creation timestamp
- `isLoading` (boolean): Show loading state
- `showImage` (boolean): Show/hide image preview

**Slots**:
- `actions`: Custom action buttons

**Emits**:
- `@view-image`: When image is clicked
- `@edit`: When edit button clicked
- `@delete`: When delete button clicked
- `@status-change`: When status changes (payload: new status)

**Features**:
- Ticket summary display
- Image thumbnail
- Status badge with color
- Creation date display
- Action buttons
- Responsive card layout

**Example**:
```vue
<TicketCard
  :ticket="ticket"
  :show-image="true"
  @view-image="handleViewImage"
  @status-change="handleStatusChange"
/>
```

---

## Component Hierarchy

```
TicketsView
├── StatusFilter (Sidebar)
├── TicketCard (Grid view)
│   └── Image Modal
└── TicketsTable (List view)
    └── Pagination Controls
```

---

## Usage Example

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useTicketsStore } from '@/stores/tickets'
import TicketsTable from '@/components/tickets/TicketsTable.vue'
import TicketCard from '@/components/tickets/TicketCard.vue'
import ImageModal from '@/components/ui/ImageModal.vue'

const store = useTicketsStore()
const currentPage = ref(1)
const selectedStatus = ref('')
const showImageModal = ref(false)
const selectedImage = ref(null)
const viewMode = ref('grid') // grid or table

onMounted(() => {
  loadTickets()
})

async function loadTickets() {
  const filters = {
    status: selectedStatus.value || undefined,
    page: currentPage.value
  }
  await store.fetchMyTickets(filters)
}

async function handleStatusChange(ticketId, newStatus) {
  try {
    await store.updateTicketStatus(ticketId, newStatus)
    showSuccess('Ticket updated')
  } catch (error) {
    showError(error.message)
  }
}

async function handleViewImage(ticketId) {
  try {
    selectedImage.value = await store.downloadTicketImage(ticketId)
    showImageModal.value = true
  } catch (error) {
    showError('Failed to load image')
  }
}

function handleFilterChange(status) {
  selectedStatus.value = status
  currentPage.value = 1
  loadTickets()
}

function handlePageChange(newPage) {
  currentPage.value = newPage
  loadTickets()
}
</script>

<template>
  <div class="tickets-view">
    <!-- View Mode Toggle -->
    <div class="view-controls">
      <button
        v-for="mode in ['grid', 'table']"
        :key="mode"
        @click="viewMode = mode"
        :class="{ active: viewMode === mode }"
      >
        {{ mode }}
      </button>
    </div>

    <!-- Status Filter -->
    <StatusFilter
      :selected="selectedStatus"
      @change="handleFilterChange"
    />

    <!-- Grid View -->
    <div v-if="viewMode === 'grid'" class="tickets-grid">
      <TicketCard
        v-for="ticket in store.allTickets"
        :key="ticket.id"
        :ticket="ticket"
        :is-loading="store.isLoading"
        show-image
        @view-image="handleViewImage"
        @status-change="handleStatusChange"
      />
    </div>

    <!-- Table View -->
    <TicketsTable
      v-else
      :tickets="store.allTickets"
      :is-loading="store.isLoading"
      :current-page="currentPage"
      :total-pages="10"
      @select="handleViewImage"
      @update-status="handleStatusChange"
      @page-change="handlePageChange"
    />

    <!-- Image Modal -->
    <ImageModal
      v-if="showImageModal"
      :image-url="selectedImage"
      @close="showImageModal = false"
    />
  </div>
</template>

<style scoped>
.tickets-view {
  display: flex;
  gap: 2rem;
}

.tickets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.view-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
</style>
```

---

## Status Styling

Status badges use color-coding:
- **pending**: Yellow/Orange
- **approved**: Green
- **rejected**: Red
- **completed**: Blue

---

## Image Handling

- Images are stored in AWS S3
- Presigned URLs provide secure access
- Images displayed in modal for full view
- Thumbnail shown in card view
- Lazy loading supported

---

## Responsive Design

Components are responsive across all screen sizes:
- Mobile: Single column
- Tablet: 2 columns
- Desktop: 3+ columns
- Table switches to vertical layout on mobile
