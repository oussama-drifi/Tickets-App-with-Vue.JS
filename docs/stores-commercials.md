# Commercials Store (Pinia)

**Location**: `src/stores/commercials.js`

## Purpose

Manages commercial entities state including fetching, creating, updating, and searching commercials. Used primarily by admin users for managing commercial accounts.

## State Properties

```javascript
{
  commercials: [
    {
      id: number,
      name: string,
      description: string,
      status: 'active' | 'inactive',
      userId: number,
      createdAt: string,
      updatedAt: string
    }
  ],
  selectedCommercial: null | object,
  loading: boolean,
  error: string | null,
  searchResults: [],
  pagination: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}
```

## Key Features

- Fetch all commercials with pagination
- Search commercials by query
- Get commercial details by ID
- Create new commercial
- Update commercial information
- Get tickets for specific commercial
- Error handling and loading states

## Getters

### `allCommercials`
Returns list of all commercials

```javascript
const commercials = commercialsStore.allCommercials
```

---

### `selectedCommercial`
Returns currently selected commercial or null

```javascript
const commercial = commercialsStore.selectedCommercial
```

---

### `isLoading`
Returns loading state

```javascript
if (commercialsStore.isLoading) {
  // Show loading indicator
}
```

---

### `hasError`
Returns whether an error occurred

```javascript
if (commercialsStore.hasError) {
  console.error(commercialsStore.error)
}
```

---

### `searchResults`
Returns current search results

```javascript
const results = commercialsStore.searchResults
```

---

## Actions

### `fetchCommercials(page, limit)`
**Description**: Fetch paginated list of commercials

**Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

**Returns**: Promise<void>

**Side Effects**:
- Sets `loading` to true during fetch
- Updates `commercials` with results
- Updates `pagination` info
- Clears `error` on success

**Example**:
```javascript
await commercialsStore.fetchCommercials(1, 20)
const commercials = commercialsStore.allCommercials
```

---

### `getCommercialById(id)`
**Description**: Fetch and set a specific commercial

**Parameters**:
- `id` (number): Commercial ID

**Returns**: Promise<object> - The commercial data

**Side Effects**:
- Sets `selectedCommercial`
- Sets `loading` state

**Example**:
```javascript
const commercial = await commercialsStore.getCommercialById(5)
console.log(commercial.name)
```

---

### `searchCommercials(query)`
**Description**: Search commercials by name or description

**Parameters**:
- `query` (string): Search query

**Returns**: Promise<array> - Matching commercials

**Side Effects**:
- Sets `searchResults`
- Sets `loading` state

**Example**:
```javascript
const results = await commercialsStore.searchCommercials('acme')
```

---

### `createCommercial(commercialData)`
**Description**: Create new commercial entity

**Parameters**:
- `commercialData` (object):
  - `name` (string, required): Commercial name
  - `description` (string): Description
  - `userId` (number): User ID

**Returns**: Promise<object> - Created commercial

**Side Effects**:
- Adds commercial to `commercials` list
- Updates `pagination.total`

**Example**:
```javascript
const newCommercial = await commercialsStore.createCommercial({
  name: 'ABC Corp',
  description: 'Commercial entity',
  userId: 3
})
```

---

### `updateCommercial(id, updates)`
**Description**: Update commercial details

**Parameters**:
- `id` (number): Commercial ID
- `updates` (object):
  - `name` (string): Updated name
  - `description` (string): Updated description
  - `status` (string): active or inactive

**Returns**: Promise<object> - Updated commercial

**Side Effects**:
- Updates commercial in `commercials` list
- Updates `selectedCommercial` if it matches

**Example**:
```javascript
const updated = await commercialsStore.updateCommercial(5, {
  name: 'Updated Name',
  status: 'active'
})
```

---

### `getCommercialTickets(commercialId)`
**Description**: Fetch all tickets for a specific commercial

**Parameters**:
- `commercialId` (number): Commercial ID

**Returns**: Promise<array> - Array of tickets

**Example**:
```javascript
const tickets = await commercialsStore.getCommercialTickets(5)
```

---

### `clearError()`
**Description**: Clear error state

**Example**:
```javascript
commercialsStore.clearError()
```

---

### `clearSearch()`
**Description**: Clear search results

**Example**:
```javascript
commercialsStore.clearSearch()
```

---

## Usage in Components

### Fetch and Display Commercials

```javascript
<script setup>
import { onMounted } from 'vue'
import { useCommercialsStore } from '@/stores/commercials'

const store = useCommercialsStore()

onMounted(async () => {
  await store.fetchCommercials(1, 10)
})
</script>

<template>
  <div>
    <div v-if="store.isLoading" class="spinner">Loading...</div>
    
    <div v-else-if="store.hasError" class="error">
      {{ store.error }}
    </div>
    
    <div v-else class="list">
      <div v-for="commercial in store.allCommercials" :key="commercial.id">
        <h3>{{ commercial.name }}</h3>
        <p>{{ commercial.description }}</p>
      </div>
    </div>
  </div>
</template>
```

---

### Search Functionality

```javascript
const query = ref('')

async function handleSearch() {
  await commercialsStore.searchCommercials(query.value)
}

const results = computed(() => commercialsStore.searchResults)
```

---

### Create Commercial

```javascript
const form = reactive({
  name: '',
  description: '',
  userId: null
})

async function handleCreate() {
  try {
    const created = await commercialsStore.createCommercial(form)
    showSuccess('Commercial created')
    router.push(`/commercials/${created.id}`)
  } catch (error) {
    showError(error.message)
  }
}
```

---

## Pagination

The store manages pagination state:

```javascript
// Check pagination info
const { page, limit, total, pages } = commercialsStore.pagination

// Load next page
await commercialsStore.fetchCommercials(page + 1, limit)
```

---

## Error Handling

Errors are caught and stored in state:

```javascript
commercialsStore.fetchCommercials().catch(error => {
  // Error is also in commercialsStore.error
  console.error(error.message)
})
```
