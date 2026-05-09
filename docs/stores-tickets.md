# Tickets Store (Pinia)

**Location**: `src/stores/tickets.js`

## Purpose

Manages ticket state including fetching, creating, and managing tickets for both regular users and admins. Handles ticket uploads with image support.

## State Properties

```javascript
{
  tickets: [
    {
      id: number,
      title: string,
      description: string,
      status: 'pending' | 'approved' | 'rejected' | 'completed',
      imageUrl: string | null,
      createdAt: string,
      updatedAt: string,
      userId: number
    }
  ],
  selectedTicket: null | object,
  loading: boolean,
  uploading: boolean,
  error: string | null,
  uploadProgress: number
}
```

## Key Features

- Fetch user tickets
- Create new tickets with optional image upload
- Get ticket details
- Download/view ticket images
- Update ticket status (admin)
- Progress tracking for uploads
- Error handling and loading states

## Getters

### `allTickets`
Returns list of all user tickets

```javascript
const tickets = ticketsStore.allTickets
```

---

### `selectedTicket`
Returns currently selected ticket or null

```javascript
const ticket = ticketsStore.selectedTicket
```

---

### `isLoading`
Returns loading state

```javascript
if (ticketsStore.isLoading) {
  // Show loading spinner
}
```

---

### `isUploading`
Returns upload state

```javascript
if (ticketsStore.isUploading) {
  // Show upload progress
}
```

---

### `uploadProgress`
Returns current upload progress percentage (0-100)

```javascript
console.log(`Upload: ${ticketsStore.uploadProgress}%`)
```

---

### `hasError`
Returns whether an error occurred

```javascript
if (ticketsStore.hasError) {
  console.error(ticketsStore.error)
}
```

---

## Actions

### `fetchMyTickets(filters)`
**Description**: Fetch tickets for current user

**Parameters**:
- `filters` (object, optional):
  - `status`: Filter by status
  - `page`: Pagination page

**Returns**: Promise<void>

**Side Effects**:
- Sets `loading` to true
- Updates `tickets` with results
- Clears `error` on success

**Example**:
```javascript
await ticketsStore.fetchMyTickets({ status: 'pending', page: 1 })
const tickets = ticketsStore.allTickets
```

---

### `createTicket(formData)`
**Description**: Create new ticket with optional image

**Parameters**:
- `formData` (FormData):
  - `title` (string, required): Ticket title
  - `description` (string): Ticket description
  - `image` (File, optional): Image file (max 5MB)

**Returns**: Promise<object> - Created ticket

**Side Effects**:
- Sets `uploading` to true during upload
- Updates `uploadProgress`
- Adds ticket to `tickets` list
- Clears `error` on success

**Example**:
```javascript
const formData = new FormData()
formData.append('title', 'Support Request')
formData.append('description', 'Issue description')
formData.append('image', fileInput.files[0])

const newTicket = await ticketsStore.createTicket(formData)
console.log(newTicket.id)
```

---

### `getTicketById(id)`
**Description**: Fetch specific ticket details

**Parameters**:
- `id` (number): Ticket ID

**Returns**: Promise<object> - Ticket data

**Side Effects**:
- Sets `selectedTicket`
- Sets `loading` state

**Example**:
```javascript
const ticket = await ticketsStore.getTicketById(5)
```

---

### `downloadTicketImage(ticketId)`
**Description**: Get ticket image URL or download image

**Parameters**:
- `ticketId` (number): Ticket ID

**Returns**: Promise<blob | url> - Image data or URL

**Example**:
```javascript
const imageUrl = await ticketsStore.downloadTicketImage(5)
// Display image or trigger download
```

---

### `updateTicketStatus(ticketId, newStatus)`
**Description**: Update ticket status (admin only)

**Parameters**:
- `ticketId` (number): Ticket ID
- `newStatus` (string): New status (pending, approved, rejected, completed)

**Returns**: Promise<object> - Updated ticket

**Side Effects**:
- Updates ticket in `tickets` list
- Updates `selectedTicket` if it matches

**Example**:
```javascript
const updated = await ticketsStore.updateTicketStatus(5, 'approved')
```

---

### `clearError()`
**Description**: Clear error state

**Example**:
```javascript
ticketsStore.clearError()
```

---

### `resetUpload()`
**Description**: Reset upload state

**Example**:
```javascript
ticketsStore.resetUpload()
```

---

## Usage in Components

### Fetch and List Tickets

```javascript
<script setup>
import { onMounted } from 'vue'
import { useTicketsStore } from '@/stores/tickets'

const store = useTicketsStore()

onMounted(async () => {
  await store.fetchMyTickets({ status: 'pending' })
})
</script>

<template>
  <div>
    <div v-if="store.isLoading" class="spinner">Loading tickets...</div>
    
    <div v-else-if="store.hasError" class="error">
      {{ store.error }}
    </div>
    
    <div v-else class="ticket-list">
      <div v-for="ticket in store.allTickets" :key="ticket.id">
        <h3>{{ ticket.title }}</h3>
        <p>{{ ticket.description }}</p>
        <span class="status" :class="ticket.status">{{ ticket.status }}</span>
        <img v-if="ticket.imageUrl" :src="ticket.imageUrl" alt="Ticket" />
      </div>
    </div>
  </div>
</template>
```

---

### Create Ticket with Image Upload

```javascript
<script setup>
import { reactive } from 'vue'
import { useTicketsStore } from '@/stores/tickets'

const store = useTicketsStore()

const form = reactive({
  title: '',
  description: '',
  imageFile: null
})

async function handleSubmit() {
  try {
    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('description', form.description)
    
    if (form.imageFile) {
      formData.append('image', form.imageFile)
    }
    
    const created = await store.createTicket(formData)
    showSuccess('Ticket created successfully')
    form.title = ''
    form.description = ''
    form.imageFile = null
  } catch (error) {
    showError(error.message)
  }
}

function handleImageChange(event) {
  form.imageFile = event.target.files[0]
}
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.title" placeholder="Title" required />
    <textarea v-model="form.description" placeholder="Description"></textarea>
    <input type="file" @change="handleImageChange" accept="image/*" />
    
    <div v-if="store.isUploading" class="progress">
      Upload progress: {{ store.uploadProgress }}%
    </div>
    
    <button type="submit" :disabled="store.isUploading">
      Create Ticket
    </button>
  </form>
</template>
```

---

### Update Ticket Status (Admin)

```javascript
async function approveTicket(ticketId) {
  try {
    const updated = await store.updateTicketStatus(ticketId, 'approved')
    showSuccess('Ticket approved')
  } catch (error) {
    showError(error.message)
  }
}
```

---

## Ticket Status Flow

```
[Pending] → [Approved] → [Completed] ✓
    ↓
[Rejected] ✗
```

- **Pending**: Initial status when created
- **Approved**: Admin approves the ticket
- **Rejected**: Admin rejects the ticket
- **Completed**: Task is completed

---

## Image Upload

- Maximum file size: 5MB
- Supported formats: PNG, JPG, JPEG, GIF
- Images are uploaded to AWS S3
- Progress tracking available during upload

---

## Error Handling

```javascript
await ticketsStore.fetchMyTickets()
  .catch(error => {
    // Error is also in ticketsStore.error
    showError(error.message)
  })
```
