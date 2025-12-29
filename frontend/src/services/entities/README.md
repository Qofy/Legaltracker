# Entity Services Layer

This directory contains service classes for managing all entity types in the Legaltracker application. Each service provides a consistent CRUD (Create, Read, Update, Delete) interface for interacting with the backend API.

## Overview

The entity services layer provides a standardized, reusable approach to managing API interactions for each entity in the application. This abstraction layer:

- Encapsulates API communication logic
- Provides consistent error handling
- Supports sorting, filtering, and pagination
- Integrates with the configured axios instance
- Maintains clear separation of concerns

## Available Services

All 14 entity services are available:

1. **Case.js** - Legal case management
2. **User.js** - User accounts and authentication
3. **Document.js** - Document storage and management
4. **ActionItem.js** - Action items and tasks
5. **Comment.js** - Comments on entities
6. **ChatMessage.js** - Chat messaging
7. **Meeting.js** - Meeting scheduling and tracking
8. **Annotation.js** - Document and content annotations
9. **Invitation.js** - User invitations and access
10. **GuestPass.js** - Guest access passes
11. **BugReport.js** - Bug tracking and reporting
12. **FeatureRequest.js** - Feature request tracking
13. **Customer.js** - Customer management
14. **Lawyer.js** - Lawyer profiles and information

## Usage

### Import Methods

#### Method 1: Named imports from index
```javascript
import { Case, User, Document } from '@/services/entities'

// Use services
const cases = await Case.list()
const user = await User.get('user-id')
```

#### Method 2: Default import from index
```javascript
import entities from '@/services/entities'

const cases = await entities.Case.list()
const user = await entities.User.get('user-id')
```

#### Method 3: Direct import from service file
```javascript
import Case from '@/services/entities/Case'

const cases = await Case.list()
```

## Service Methods

### Standard CRUD Methods

All services provide the following methods:

#### list(sortOrder = '-created_date')
Retrieves all records with optional sorting.

```javascript
// Default sorting (by created_date descending)
const cases = await Case.list()

// Custom sorting
const cases = await Case.list('-priority')
const cases = await Case.list('case_number')
```

#### get(id)
Retrieves a single record by ID.

```javascript
const caseData = await Case.get('case-123')
```

#### create(data)
Creates a new record.

```javascript
const newCase = await Case.create({
  case_number: 'CASE-001',
  title: 'Important Case',
  lawyer_id: 'lawyer-123'
})
```

#### update(id, data)
Updates an existing record.

```javascript
const updatedCase = await Case.update('case-123', {
  status: 'in_progress',
  priority: 'high'
})
```

#### delete(id)
Deletes a record.

```javascript
await Case.delete('case-123')
```

#### filter(criteria, sortOrder = '-created_date', limit = null)
Filters records by criteria.

```javascript
// Basic filtering
const activeCases = await Case.filter({ status: 'open' })

// With sorting
const activeCases = await Case.filter(
  { status: 'open' },
  '-created_date'
)

// With limit
const recentActiveCases = await Case.filter(
  { status: 'open' },
  '-created_date',
  10
)
```

### Special Methods

#### User Service: me()
Retrieves the current authenticated user's information.

```javascript
const currentUser = await User.me()
```

## Error Handling

All services include try-catch error handling. Errors are logged to the console and re-thrown for handling at the component level.

```javascript
try {
  const cases = await Case.list()
} catch (error) {
  console.error('Failed to fetch cases:', error)
  // Handle error appropriately
}
```

## API Endpoints

Services map to the following API endpoints (configured via baseUrl in each service):

| Service | Base URL | Example |
|---------|----------|---------|
| Case | `/cases` | GET `/cases`, POST `/cases/` |
| User | `/users` | GET `/users`, GET `/users/:id` |
| Document | `/documents` | GET `/documents`, POST `/documents` |
| ActionItem | `/action-items` | GET `/action-items`, POST `/action-items` |
| Comment | `/comments` | GET `/comments`, POST `/comments` |
| ChatMessage | `/chat-messages` | GET `/chat-messages`, POST `/chat-messages` |
| Meeting | `/meetings` | GET `/meetings`, POST `/meetings` |
| Annotation | `/annotations` | GET `/annotations`, POST `/annotations` |
| Invitation | `/invitations` | GET `/invitations`, POST `/invitations` |
| GuestPass | `/guest-passes` | GET `/guest-passes`, POST `/guest-passes` |
| BugReport | `/bug-reports` | GET `/bug-reports`, POST `/bug-reports` |
| FeatureRequest | `/feature-requests` | GET `/feature-requests`, POST `/feature-requests` |
| Customer | `/customers` | GET `/customers`, POST `/customers` |
| Lawyer | `/lawyers` | GET `/lawyers`, POST `/lawyers` |

## Response Format

The axios instance in `@/plugins/axios` is pre-configured with:
- Base URL: `http://localhost:3000/api` (or VITE_API_URL environment variable)
- Headers: `Content-Type: application/json`
- Request interceptor: Automatically adds `Authorization: Bearer {token}` header
- Response interceptor: Handles 401/403 errors and redirects to login on 401

Services return the `response.data` directly.

## Component Integration Example

```vue
<template>
  <div>
    <button @click="fetchCases">Load Cases</button>
    <ul>
      <li v-for="case in cases" :key="case.id">
        {{ case.title }}
      </li>
    </ul>
  </div>
</template>

<script>
import { Case, User } from '@/services/entities'

export default {
  data() {
    return {
      cases: []
    }
  },
  methods: {
    async fetchCases() {
      try {
        this.cases = await Case.list('-priority')
      } catch (error) {
        console.error('Failed to fetch cases:', error)
      }
    },
    async createCase() {
      try {
        const newCase = await Case.create({
          case_number: 'CASE-001',
          title: 'New Case',
          lawyer_id: 'lawyer-123'
        })
        this.cases.push(newCase)
      } catch (error) {
        console.error('Failed to create case:', error)
      }
    }
  },
  mounted() {
    this.fetchCases()
  }
}
</script>
```

## Composable Integration Example

```javascript
// composables/useCases.js
import { ref } from 'vue'
import { Case } from '@/services/entities'

export function useCases() {
  const cases = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCases = async () => {
    loading.value = true
    error.value = null
    try {
      cases.value = await Case.list('-priority')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const createCase = async (data) => {
    try {
      const newCase = await Case.create(data)
      cases.value.push(newCase)
      return newCase
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    cases,
    loading,
    error,
    fetchCases,
    createCase
  }
}
```

## Best Practices

1. **Error Handling**: Always wrap service calls in try-catch blocks or handle promise rejections.

2. **Loading States**: Use loading indicators while fetching data.

3. **Component Structure**: Separate API logic into composables for reusability.

4. **Filtering**: Use the filter method for complex queries instead of fetching all records.

5. **Pagination**: Use the `limit` parameter in filter method for pagination.

6. **Authentication**: The axios instance automatically adds the auth token; ensure tokens are properly stored in localStorage.

## Configuration

The services use the axios instance from `@/plugins/axios` which can be configured by:

1. Setting the `VITE_API_URL` environment variable
2. Modifying `/src/plugins/axios.js`

Default base URL: `http://localhost:3000/api`

## Future Extensions

To add a new service:

1. Create a new file (e.g., `NewEntity.js`) in this directory
2. Extend the service class with the same pattern
3. Add specific methods as needed
4. Export from `index.js`

Example:
```javascript
// services/entities/NewEntity.js
import axios from '@/plugins/axios'

class NewEntityService {
  constructor() {
    this.baseUrl = '/new-entities'
  }

  // ... standard methods ...
}

export default new NewEntityService()
```
