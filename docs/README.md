# Tickets App Frontend Documentation

This directory contains documentation for the Tickets App, a Vue 3 + Vite frontend application for managing tickets, commercials, cards, and payments.

## Project Overview

- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 5
- **Styling**: CSS (Base + Main stylesheets)
- **Icons**: Lucide Vue

## Project Structure

```
src/
├── App.vue                 # Root component
├── main.js                 # Application entry point
├── utils.js                # Utility functions
├── components/             # Reusable components
├── stores/                 # Pinia state management
├── services/               # API integration
├── views/                  # Page-level components
└── router/                 # Routing configuration
```

## Core Modules

1. **[API Service](./api-service.md)** - HTTP client for backend communication
2. **[Authentication Store](./stores-auth.md)** - User authentication state
3. **[Commercials Store](./stores-commercials.md)** - Commercial entities management
4. **[Tickets Store](./stores-tickets.md)** - Ticket management state
5. **[Commercials Components](./components-commercials.md)** - Commercial UI components
6. **[Tickets Components](./components-tickets.md)** - Ticket UI components
7. **[Layout Components](./components-layout.md)** - App layout and navigation
8. **[UI Components](./components-ui.md)** - Shared UI utilities

## Backend Integration

The app communicates with the Tickets API at the following endpoints:

```
API Base URL: /api
- Authentication: /api/auth
- Commercial Operations: /api/commercials
- Admin Operations: /api/admin
- Card Categories: /api/card-categories
```

## Views

### Admin Views
- `AdminView.vue` - Dashboard for administrators

### Commercial Views
- Commercial profile and settings
- Ticket management
- Payment handling
- Card management

### Public Pages
- Login page
- Error pages
- Dashboard

## State Management (Pinia)

Three main stores manage application state:
- **auth** - User authentication and profile
- **commercials** - Commercial entities and data
- **tickets** - Ticket data and status

## Key Features

- User authentication with JWT tokens
- Dashboard for commercial users and admins
- Ticket creation and management
- Commercial profile editing
- Card and payment management
- Search and filtering capabilities
- Responsive layout

## Running the Application

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env.local` file:

```
VITE_API_URL=http://localhost:3000
```

## Authentication Flow

1. User logs in via auth service
2. JWT token stored in localStorage
3. Token automatically included in all API requests
4. Token refreshed on app load
5. Auto-logout on token expiration
