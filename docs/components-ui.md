# UI Components

**Location**: `src/components/ui/`

## Overview

Reusable utility components for common UI patterns like filters, search, modals, and form elements.

---

## CategoryFilter.vue

**Purpose**: Filter tickets/items by category

**Props**:
- `categories` (array): List of available categories
- `modelValue` (string | number): Currently selected category
- `multiple` (boolean): Allow multiple selections (default: false)
- `isLoading` (boolean): Show loading state

**Emits**:
- `@update:modelValue`: When selection changes (payload: selected value(s))

**Features**:
- Single/multiple selection
- Search/filter by category name
- Clear all option
- Category icons
- Badge count display

**Example**:
```vue
<CategoryFilter
  v-model="selectedCategory"
  :categories="categories"
  :multiple="false"
  @update:modelValue="handleFilterChange"
/>
```

---

## CommercialSearch.vue

**Purpose**: Search commercials by name or description

**Props**:
- `modelValue` (string): Search query
- `isLoading` (boolean): Show loading state during search
- `placeholder` (string): Input placeholder text

**Emits**:
- `@update:modelValue`: When input changes (payload: search query)
- `@search`: When user submits search (payload: query)
- `@clear`: When clear button clicked

**Features**:
- Debounced search
- Clear button
- Search suggestions (optional)
- Loading spinner
- Keyboard shortcuts (Enter to search)

**Example**:
```vue
<CommercialSearch
  v-model="searchQuery"
  :is-loading="isSearching"
  placeholder="Search commercials..."
  @search="handleSearch"
  @clear="clearSearch"
/>
```

---

## CustomSelect.vue

**Purpose**: Enhanced select dropdown with search and filtering

**Props**:
- `modelValue` (string | number | array): Selected value(s)
- `options` (array): Array of option objects
  - `value`: Option value
  - `label`: Display label
  - `disabled`: Whether option is disabled
  - `icon`: Icon name (optional)
- `multiple` (boolean): Allow multiple selections
- `searchable` (boolean): Enable search (default: true)
- `clearable` (boolean): Show clear button
- `disabled` (boolean): Disable select
- `placeholder` (string): Placeholder text

**Emits**:
- `@update:modelValue`: When selection changes (payload: selected value(s))
- `@open`: When dropdown opens
- `@close`: When dropdown closes

**Features**:
- Searchable options
- Custom option rendering
- Multi-select support
- Clear selected values
- Keyboard navigation
- Option groups
- Custom styling

**Example**:
```vue
<CustomSelect
  v-model="selectedStatus"
  :options="[
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ]"
  placeholder="Select status..."
  searchable
/>
```

---

## ImageModal.vue

**Purpose**: Display image in a modal/lightbox

**Props**:
- `isOpen` (boolean): Control modal visibility
- `imageUrl` (string): Image URL to display
- `title` (string): Modal title
- `alt` (string): Image alt text
- `showDownload` (boolean): Show download button

**Emits**:
- `@close`: When modal closes

**Features**:
- Full-screen image view
- Zoom controls (optional)
- Download button
- Close on ESC key
- Dark overlay
- Touch gestures (pinch zoom)
- Previous/Next navigation (if multiple images)

**Example**:
```vue
<ImageModal
  :is-open="showImageModal"
  :image-url="selectedImage"
  title="Ticket Image"
  @close="showImageModal = false"
/>
```

---

## StatusFilter.vue

**Purpose**: Filter items by status with visual badges

**Props**:
- `modelValue` (string): Selected status
- `statuses` (array): Available statuses with labels and colors
- `clearable` (boolean): Allow clearing selection

**Emits**:
- `@update:modelValue`: When status changes (payload: status value)

**Statuses**:
- `pending`: Yellow/Orange badge
- `approved`: Green badge
- `rejected`: Red badge
- `completed`: Blue badge

**Features**:
- Color-coded badges
- Icon support
- Count display
- Toggle filter
- Clear selection

**Example**:
```vue
<StatusFilter
  v-model="selectedStatus"
  :statuses="['pending', 'approved', 'rejected', 'completed']"
/>
```

---

## Component Usage Examples

### Combined Filters

```vue
<script setup>
import { ref } from 'vue'
import CategoryFilter from '@/components/ui/CategoryFilter.vue'
import CommercialSearch from '@/components/ui/CommercialSearch.vue'
import StatusFilter from '@/components/ui/StatusFilter.vue'

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

async function applyFilters() {
  const filters = {
    search: searchQuery.value,
    category: selectedCategory.value,
    status: selectedStatus.value
  }
  // Apply filters
}
</script>

<template>
  <div class="filters">
    <CommercialSearch
      v-model="searchQuery"
      placeholder="Search by name..."
    />

    <CategoryFilter
      v-model="selectedCategory"
      :categories="categories"
    />

    <StatusFilter
      v-model="selectedStatus"
    />

    <button @click="applyFilters">Apply Filters</button>
  </div>
</template>
```

---

### Search with Results

```vue
<script setup>
import { ref } from 'vue'
import CommercialSearch from '@/components/ui/CommercialSearch.vue'
import { useCommercialsStore } from '@/stores/commercials'

const store = useCommercialsStore()
const query = ref('')
const isSearching = ref(false)

async function handleSearch(searchQuery) {
  isSearching.value = true
  await store.searchCommercials(searchQuery)
  isSearching.value = false
}

function clearSearch() {
  query.value = ''
  store.clearSearch()
}
</script>

<template>
  <div>
    <CommercialSearch
      v-model="query"
      :is-loading="isSearching"
      @search="handleSearch"
      @clear="clearSearch"
    />

    <div v-if="store.searchResults.length > 0" class="results">
      <div v-for="result in store.searchResults" :key="result.id">
        {{ result.name }}
      </div>
    </div>

    <div v-else-if="query && !isSearching" class="empty">
      No results found
    </div>
  </div>
</template>
```

---

## Styling

UI components follow design system:
- Color variables for theming
- Consistent spacing and padding
- Accessibility features (ARIA)
- Keyboard navigation
- Responsive design

---

## Accessibility

All components include:
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- High contrast support
