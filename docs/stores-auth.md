# Authentication Store (Pinia)

**Location**: `src/stores/auth.js`

## Purpose

Manages user authentication state including login, logout, user profile, and token storage. Provides reactive auth state across the entire application.

## State Properties

```javascript
{
  user: {
    id: number,
    email: string,
    role: 'admin' | 'commercial',
    status: 'active' | 'suspended'
  } | null,
  token: string | null,
  isAuthenticated: boolean
}
```

## Key Features

- User login/logout
- Persistent token storage (localStorage)
- User profile management
- Role-based access control
- Token expiration handling
- Login state reactivity

## Getters

### `isAdmin`
Returns whether current user is an admin

```javascript
if (authStore.isAdmin) {
  // Show admin features
}
```

---

### `isCommercial`
Returns whether current user is a commercial

```javascript
if (authStore.isCommercial) {
  // Show commercial features
}
```

---

### `isLoggedIn`
Returns whether user is authenticated

```javascript
if (!authStore.isLoggedIn) {
  // Redirect to login
}
```

---

### `currentUser`
Returns current user object or null

```javascript
const user = authStore.currentUser
console.log(user?.email)
```

---

## Actions

### `login(email, password)`
**Description**: Authenticate user with credentials

**Parameters**:
- `email` (string): User email
- `password` (string): User password

**Returns**: Promise<void>

**Side Effects**:
- Sets `user` state
- Sets `token` in state and localStorage
- Sets `isAuthenticated` to true

**Throws**: Error with message from API

**Example**:
```javascript
try {
  await authStore.login('user@example.com', 'password123')
  // User is now logged in
} catch (error) {
  console.error('Login failed:', error.message)
}
```

---

### `logout()`
**Description**: Clear authentication state and token

**Returns**: void

**Side Effects**:
- Clears `user` state
- Removes token from state and localStorage
- Sets `isAuthenticated` to false

**Example**:
```javascript
authStore.logout()
// User is logged out
```

---

### `setUser(userData)`
**Description**: Set user profile from API response

**Parameters**:
- `userData` (object): User data object

**Example**:
```javascript
authStore.setUser({
  id: 1,
  email: 'user@example.com',
  role: 'commercial'
})
```

---

### `setToken(token)`
**Description**: Set authentication token

**Parameters**:
- `token` (string): JWT token

**Side Effects**:
- Saves token to localStorage
- Sets `token` in state

**Example**:
```javascript
authStore.setToken('eyJhbGciOiJIUzI1NiIs...')
```

---

### `restoreToken()`
**Description**: Restore token from localStorage on app initialization

**Returns**: string | null

**Side Effects**:
- Restores `token` state from localStorage

**Example**:
```javascript
// Called in router guards or main.js
const token = authStore.restoreToken()
```

---

### `clearAuth()`
**Description**: Clear all authentication data

**Side Effects**:
- Clears user, token, and isAuthenticated

**Example**:
```javascript
authStore.clearAuth()
```

---

## Usage in Components

### Setup in Composition API

```javascript
<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Reactive access
const isAdmin = () => authStore.isAdmin
const user = () => authStore.currentUser
const isLoggedIn = () => authStore.isLoggedIn
</script>

<template>
  <div v-if="isLoggedIn">
    <p>Welcome, {{ user?.email }}</p>
    <button v-if="isAdmin" @click="goToAdmin">Admin Panel</button>
  </div>
  <div v-else>
    <p>Please log in</p>
  </div>
</template>
```

### Login Example

```javascript
const authStore = useAuthStore()

async function handleLogin(email, password) {
  try {
    await authStore.login(email, password)
    router.push('/dashboard')
  } catch (error) {
    showError(error.message)
  }
}
```

### Router Guards

```javascript
// In router/index.js
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
  } else {
    next()
  }
})
```

---

## Token Persistence

Tokens are automatically persisted to localStorage:

```javascript
// Stored as 'auth_token'
localStorage.setItem('auth_token', token)
```

On app initialization:

```javascript
const authStore = useAuthStore()
authStore.restoreToken() // Restore from localStorage
```

---

## Error Handling

Login errors are thrown as-is from the API:

```javascript
authStore.login('invalid@example.com', 'wrong')
  .catch(error => {
    // error.message could be:
    // "Invalid email or password"
    // "Account is suspended"
  })
```

---

## Integration with Router

Protected routes should check authentication:

```javascript
const routes = [
  {
    path: '/dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    component: AdminView,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
]
```
