# Commercials Components

**Location**: `src/components/commercials/`

## Overview

Components for displaying, creating, and editing commercial entities. Includes table views, modals, and detail displays.

---

## CommercialsTable.vue

**Purpose**: Display list of commercials in a tabular format with pagination and search

**Props**:
- `commercials` (array, required): Array of commercial objects
- `isLoading` (boolean): Show loading state
- `totalPages` (number): Total number of pages
- `currentPage` (number): Current active page

**Emits**:
- `@select`: When user clicks on a commercial (payload: commercial id)
- `@page-change`: When user navigates pages (payload: page number)
- `@edit`: When user clicks edit button (payload: commercial id)
- `@delete`: When user clicks delete button (payload: commercial id)

**Slots**:
- `actions`: Custom action buttons per row

**Features**:
- Sortable columns
- Row selection
- Pagination controls
- Status badges
- Action buttons (Edit, Delete, View Details)
- Responsive table layout

**Example**:
```vue
<CommercialsTable
  :commercials="commercials"
  :is-loading="isLoading"
  :total-pages="totalPages"
  :current-page="currentPage"
  @select="handleSelect"
  @page-change="handlePageChange"
  @edit="handleEdit"
/>
```

---

## NewCommercial.vue

**Purpose**: Modal/form for creating new commercial entities

**Props**:
- `isOpen` (boolean): Control modal visibility
- `isLoading` (boolean): Show loading state during submission

**Emits**:
- `@close`: When user closes modal
- `@submit`: When form is submitted (payload: form data)

**Form Fields**:
- `name` (string, required): Commercial name
- `description` (string): Commercial description
- `userId` (number, required): User ID

**Features**:
- Form validation
- Error display
- Loading indicator
- Cancel and Submit buttons
- Required field indicators

**Example**:
```vue
<NewCommercial
  :is-open="showNewModal"
  :is-loading="isCreating"
  @close="showNewModal = false"
  @submit="handleCreate"
/>
```

---

## EditCommercialModal.vue

**Purpose**: Modal for editing existing commercial information

**Props**:
- `isOpen` (boolean): Control modal visibility
- `commercial` (object): Commercial data to edit
- `isLoading` (boolean): Show loading state

**Emits**:
- `@close`: When user closes modal
- `@submit`: When form is submitted (payload: updated form data)

**Form Fields**:
- `name` (string, required): Commercial name
- `description` (string): Commercial description
- `status` (enum): active or inactive

**Features**:
- Pre-populated form with current values
- Form validation
- Error handling
- Status toggle
- Unsaved changes warning
- Cancel and Save buttons

**Example**:
```vue
<EditCommercialModal
  :is-open="showEditModal"
  :commercial="selectedCommercial"
  :is-loading="isUpdating"
  @close="showEditModal = false"
  @submit="handleUpdate"
/>
```

---

## CommercialDetailsSkeleton.vue

**Purpose**: Loading skeleton for commercial details while data is fetching

**Props**:
- `count` (number): Number of skeleton lines to show (default: 5)

**Features**:
- Animated skeleton placeholders
- Matches detail view layout
- Smooth fade transition when content loads

**Example**:
```vue
<CommercialDetailsSkeleton v-if="isLoading" :count="3" />
<CommercialDetails v-else :commercial="commercial" />
```

---

## Component Hierarchy

```
CommercialsView
├── CommercialsTable
│   ├── Pagination Controls
│   └── Action Buttons
├── NewCommercial (Modal)
└── EditCommercialModal (Modal)

DetailView
└── CommercialDetailsSkeleton (loading)
    → CommercialDetails (content)
```

---

## Usage Example

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { useCommercialsStore } from '@/stores/commercials'
import CommercialsTable from '@/components/commercials/CommercialsTable.vue'
import NewCommercial from '@/components/commercials/NewCommercial.vue'
import EditCommercialModal from '@/components/commercials/EditCommercialModal.vue'

const store = useCommercialsStore()
const currentPage = ref(1)
const showNewModal = ref(false)
const showEditModal = ref(false)
const selectedCommercial = ref(null)

onMounted(() => {
  loadCommercials()
})

async function loadCommercials() {
  await store.fetchCommercials(currentPage.value, 10)
}

async function handleCreate(formData) {
  await store.createCommercial(formData)
  await loadCommercials()
  showNewModal.value = false
}

async function handleEdit(commercialId) {
  selectedCommercial.value = store.allCommercials.find(c => c.id === commercialId)
  showEditModal.value = true
}

async function handleUpdate(formData) {
  await store.updateCommercial(selectedCommercial.value.id, formData)
  await loadCommercials()
  showEditModal.value = false
}

function handlePageChange(newPage) {
  currentPage.value = newPage
  loadCommercials()
}
</script>

<template>
  <div class="commercials-view">
    <button @click="showNewModal = true" class="btn-primary">
      New Commercial
    </button>

    <CommercialsTable
      :commercials="store.allCommercials"
      :is-loading="store.isLoading"
      :total-pages="store.pagination.pages"
      :current-page="currentPage"
      @select="handleEdit"
      @page-change="handlePageChange"
    />

    <NewCommercial
      :is-open="showNewModal"
      :is-loading="store.isLoading"
      @close="showNewModal = false"
      @submit="handleCreate"
    />

    <EditCommercialModal
      :is-open="showEditModal"
      :commercial="selectedCommercial"
      :is-loading="store.isLoading"
      @close="showEditModal = false"
      @submit="handleUpdate"
    />
  </div>
</template>
```

---

## Styling

Components use the base CSS classes with theme support:
- `.commercial-card`: Container for single commercial
- `.status-badge`: Status indicator (active/inactive)
- `.loading-skeleton`: Skeleton animation
- `.modal-overlay`: Modal backdrop
- `.form-group`: Form field wrapper

Theme colors are available via CSS variables:
```css
--color-primary
--color-secondary
--color-success
--color-danger
--color-warning
```
