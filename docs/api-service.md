# API Service

**Location**: `src/services/api.js`

## Purpose

Provides a centralized HTTP client for communicating with the backend API. Handles authentication headers, error handling, and request/response formatting.

## Key Features

- Automatic JWT token injection in requests
- Centralized error handling
- FormData support for file uploads
- Base URL configuration
- Request/response interceptors
- Automatic retries on network errors

## Core Functions

### `request(url, options)`
**Description**: Base HTTP request function

**Parameters**:
- `url` (string): API endpoint URL
- `options` (object): Fetch options
  - `method`: HTTP method (GET, POST, etc.)
  - `headers`: Custom headers
  - `body`: Request payload
  - `signal`: AbortSignal for cancellation

**Returns**: Promise with response data

**Error Handling**:
- Throws error with API error message or status code
- Includes 1200ms delay before throwing (simulated delay)

---

### `getToken()`
**Description**: Retrieve JWT token from localStorage

**Returns**: Token string or null

---

## API Endpoints

### Authentication

#### `login(email, password)`
```javascript
const response = await request(`${AUTH_URL}/login`, {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
```

#### `getMe()`
```javascript
const user = await request(`${AUTH_URL}/me`, {
  method: 'GET'
})
```

---

### Commercials (User Operations)

#### `getMyTickets(params)`
```javascript
const tickets = await request(`${COMMERCIAL_URL}/tickets`, {
  method: 'GET'
})
```

#### `createTicket(formData)`
```javascript
const ticket = await request(`${COMMERCIAL_URL}/tickets`, {
  method: 'POST',
  body: formData  // FormData with file upload
})
```

#### `getTicketImage(ticketId)`
```javascript
const image = await request(`${COMMERCIAL_URL}/tickets/${ticketId}/image`)
```

#### `updateProfile(userData)`
```javascript
const updated = await request(`${COMMERCIAL_URL}/profile`, {
  method: 'PATCH',
  body: JSON.stringify(userData)
})
```

#### `getMyCards()`
```javascript
const cards = await request(`${COMMERCIAL_URL}/cards`)
```

#### `getMyPayments()`
```javascript
const payments = await request(`${COMMERCIAL_URL}/payments`)
```

#### `createPayment(paymentData)`
```javascript
const payment = await request(`${COMMERCIAL_URL}/payments`, {
  method: 'POST',
  body: JSON.stringify(paymentData)
})
```

---

### Admin Operations

#### `getAllCommercials(params)`
```javascript
const commercials = await request(`${ADMIN_URL}/commercials?page=${page}&limit=${limit}`)
```

#### `searchCommercials(query)`
```javascript
const results = await request(`${ADMIN_URL}/commercials/search?q=${query}`)
```

#### `getCommercialById(id)`
```javascript
const commercial = await request(`${ADMIN_URL}/commercials/${id}`)
```

#### `createCommercial(data)`
```javascript
const commercial = await request(`${ADMIN_URL}/commercials`, {
  method: 'POST',
  body: JSON.stringify(data)
})
```

#### `updateCommercial(id, data)`
```javascript
const updated = await request(`${ADMIN_URL}/commercials/${id}`, {
  method: 'PATCH',
  body: JSON.stringify(data)
})
```

#### `getCommercialTickets(commercialId)`
```javascript
const tickets = await request(`${ADMIN_URL}/commercials/${commercialId}/tickets`)
```

#### `getAllTickets()`
```javascript
const tickets = await request(`${ADMIN_URL}/tickets`)
```

#### `updateTicketStatus(ticketId, status)`
```javascript
const updated = await request(`${ADMIN_URL}/tickets/${ticketId}/status`, {
  method: 'PATCH',
  body: JSON.stringify({ status })
})
```

---

### Card Categories

#### `getCardCategories()`
```javascript
const categories = await request(`${BASE}/api/card-categories`)
```

---

### Cards (Admin)

#### `getAllCards()`
```javascript
const cards = await request(`${ADMIN_URL}/cards`)
```

#### `createCard(cardData)`
```javascript
const card = await request(`${ADMIN_URL}/cards`, {
  method: 'POST',
  body: JSON.stringify(cardData)
})
```

#### `updateCardStatus(cardId, status)`
```javascript
const updated = await request(`${ADMIN_URL}/cards/${cardId}/status`, {
  method: 'PATCH',
  body: JSON.stringify({ status })
})
```

#### `topUpCard(cardId, amount)`
```javascript
const updated = await request(`${ADMIN_URL}/cards/${cardId}/balance`, {
  method: 'PATCH',
  body: JSON.stringify({ amount })
})
```

---

### Payments (Admin)

#### `getAllPayments()`
```javascript
const payments = await request(`${ADMIN_URL}/payments`)
```

#### `approvePayment(paymentId)`
```javascript
const updated = await request(`${ADMIN_URL}/payments/${paymentId}/approve`, {
  method: 'PATCH'
})
```

#### `rejectPayment(paymentId, reason)`
```javascript
const updated = await request(`${ADMIN_URL}/payments/${paymentId}/reject`, {
  method: 'PATCH',
  body: JSON.stringify({ reason })
})
```

---

## Authentication Headers

All requests automatically include:
```
Authorization: Bearer <token>
Content-Type: application/json
```

For FormData requests, `Content-Type` is omitted to allow the browser to set it with the boundary.

## Error Handling

Errors are thrown with descriptive messages:

```javascript
try {
  const data = await request(url, options)
} catch (error) {
  console.error(error.message)
  // Handle error (show toast, redirect, etc.)
}
```

## Base URL Configuration

The API base URL is configured via environment variable:

```
VITE_API_URL=http://localhost:3000
```

If not set, defaults to relative paths (same origin).

## File Upload

FormData is used for file uploads:

```javascript
const formData = new FormData()
formData.append('title', 'Ticket Title')
formData.append('description', 'Description')
formData.append('image', fileInput.files[0])

const ticket = await request(`${COMMERCIAL_URL}/tickets`, {
  method: 'POST',
  body: formData
})
```

The service automatically detects FormData and omits the Content-Type header.
