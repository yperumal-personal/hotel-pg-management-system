# Add Feature Agent - PG Management System

Quick reference guide for AI models to implement features in the PG Management System.

---

## ⚠️ CRITICAL: Implementation Guidelines

**ONLY implement what is explicitly requested. DO NOT add extra features, methods, or business logic.**

- ✅ If asked to "display tenants", implement ONLY the read/display functionality
- ❌ DO NOT add create, update, delete, search, filter, or any other operations unless specifically requested
- ✅ Start minimal - add only the essential code to fulfill the exact request
- ✅ Ask for clarification if the requirement is ambiguous
- ✅ User will request additional features when needed - don't anticipate them

**Examples:**
- Request: "Show list of tenants" → Implement: GET endpoint + display table ONLY
- Request: "Add ability to create properties" → Implement: POST endpoint + create form ONLY
- Request: "Display tenant details with search" → Implement: GET + display + search (both requested)

---

## Project Structure

```
Backend: Spring Boot (Java 17) + PostgreSQL
Frontend: React (TypeScript) + Material-UI + Vite
Auth: JWT tokens (24-hour expiration)
```

---

## Backend - Adding a Feature

### Step 1: Database Schema
```sql
-- Add to database/schema.sql
CREATE TABLE features (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 2: Entity Model
```java
// src/main/java/com/pgmanagement/model/Feature.java
@Entity
@Table(name = "features")
public class Feature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;
    
    @NotBlank
    private String name;
    
    // Getters & Setters
}
```

### Step 3: Repository
```java
// src/main/java/com/pgmanagement/repository/FeatureRepository.java
@Repository
public interface FeatureRepository extends JpaRepository<Feature, Long> {
    List<Feature> findByOwnerId(Long ownerId);
    Optional<Feature> findByIdAndOwnerId(Long id, Long ownerId);
}
```

### Step 4: Service
```java
// src/main/java/com/pgmanagement/service/FeatureService.java
@Service
public class FeatureService {
    @Autowired
    private FeatureRepository repo;
    
    public List<Feature> getUserFeatures(Long userId) {
        return repo.findByOwnerId(userId);
    }
    
    public Feature getFeature(Long id, Long userId) {
        return repo.findByIdAndOwnerId(id, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Feature not found"));
    }
    
    public Feature create(Long userId, CreateFeatureRequest request) {
        Feature feature = new Feature();
        feature.setOwnerId(userId);
        feature.setName(request.getName());
        return repo.save(feature);
    }
}
```

### Step 5: Controller
```java
// src/main/java/com/pgmanagement/controller/FeatureController.java
@RestController
@RequestMapping("/features")
public class FeatureController {
    @Autowired
    private FeatureService service;
    
    @GetMapping
    public ResponseEntity<List<FeatureResponse>> getFeatures() {
        Long userId = getCurrentUserId();
        List<Feature> features = service.getUserFeatures(userId);
        return ResponseEntity.ok(features.stream()
            .map(f -> new FeatureResponse(f))
            .collect(Collectors.toList()));
    }
    
    @PostMapping
    public ResponseEntity<FeatureResponse> create(@Valid @RequestBody CreateFeatureRequest request) {
        Long userId = getCurrentUserId();
        Feature feature = service.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(new FeatureResponse(feature));
    }
    
    private Long getCurrentUserId() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal();
        return userRepository.findByEmail(userDetails.getUsername())
            .map(User::getId).orElseThrow();
    }
}
```

### Step 6: DTOs
```java
// src/main/java/com/pgmanagement/dto/CreateFeatureRequest.java
public class CreateFeatureRequest {
    @NotBlank(message = "Name required")
    private String name;
    // Getters & Setters
}

// src/main/java/com/pgmanagement/dto/FeatureResponse.java
public class FeatureResponse {
    private Long id;
    private String name;
    private LocalDateTime createdAt;
    // Getters & Setters
}
```

---

## Frontend - Adding a Feature

### Step 1: Types
```typescript
// src/types/index.ts
export interface Feature {
    id: number;
    name: string;
    createdAt: string;
}

export interface CreateFeatureRequest {
    name: string;
}
```

### Step 2: API Service
```typescript
// src/services/featureService.ts
import api from './api';
import { Feature, CreateFeatureRequest } from '../types';

export const featureService = {
    getFeatures: () => api.get<Feature[]>('/features'),
    create: (data: CreateFeatureRequest) => api.post<Feature>('/features', data),
    delete: (id: number) => api.delete(`/features/${id}`),
};
```

### Step 3: Component
```typescript
// src/pages/Features.tsx
import { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, 
         Dialog, TextField, CircularProgress } from '@mui/material';
import { featureService } from '../services/featureService';
import { Feature } from '../types';

export default function Features() {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        featureService.getFeatures()
            .then(res => setFeatures(res.data))
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async () => {
        const response = await featureService.create(formData);
        setFeatures([...features, response.data]);
        setOpenDialog(false);
        setFormData({ name: '' });
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Button variant="contained" onClick={() => setOpenDialog(true)}>Add Feature</Button>
            
            <Table>
                <TableHead>
                    <TableRow><TableCell>Name</TableCell><TableCell>Actions</TableCell></TableRow>
                </TableHead>
                <TableBody>
                    {features.map(f => (
                        <TableRow key={f.id}>
                            <TableCell>{f.name}</TableCell>
                            <TableCell>
                                <Button size="small">Edit</Button>
                                <Button size="small" color="error">Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <Box sx={{ p: 3, minWidth: 400 }}>
                    <TextField
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ name: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" onClick={handleCreate} fullWidth sx={{ mt: 2 }}>
                        Create
                    </Button>
                </Box>
            </Dialog>
        </Box>
    );
}
```

### Step 4: Add Route
```typescript
// In App.tsx
<Route path="features" element={<Features />} />
```

---

## Testing Endpoints

```bash
# Login first
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Copy token from response, then:

# Create feature
curl -X POST http://localhost:8080/api/features \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Feature"}'

# Get features
curl -X GET http://localhost:8080/api/features \
  -H "Authorization: Bearer TOKEN"
```

---

## Key Patterns to Follow

### Backend
- ✅ Always use DTOs (never return entities)
- ✅ Always validate input with @Valid
- ✅ Always check authorization (verify user owns resource)
- ✅ Always use custom exceptions (ResourceNotFoundException, UnauthorizedException)
- ✅ Always get current user from SecurityContext

### Frontend
- ✅ Always import types from src/types
- ✅ Always handle loading state
- ✅ Always handle errors
- ✅ Always use Material-UI components
- ✅ Axios auto-adds JWT token

### Database
- ✅ Add table to database/schema.sql
- ✅ Create foreign key to users
- ✅ Add timestamps (created_at, updated_at)
- ✅ Add indexes on frequently queried columns

---

## Key Annotations Reference

| Annotation | Purpose |
|-----------|---------|
| @Entity | JPA entity class |
| @Table(name="...") | Database table mapping |
| @Id | Primary key |
| @GeneratedValue | Auto-generate ID |
| @ManyToOne | Foreign key relationship |
| @JoinColumn | Column name for foreign key |
| @RestController | REST endpoint class |
| @RequestMapping("/path") | Base URL path |
| @GetMapping | GET request |
| @PostMapping | POST request |
| @PutMapping | PUT request |
| @DeleteMapping | DELETE request |
| @Valid | Validate input |
| @NotBlank | Required field |
| @Service | Service bean |
| @Repository | Repository bean |
| @Autowired | Dependency injection |

---

## File Locations

```
Backend:
  src/main/java/com/pgmanagement/model/        (Entities)
  src/main/java/com/pgmanagement/repository/   (JPA)
  src/main/java/com/pgmanagement/service/      (Business logic)
  src/main/java/com/pgmanagement/controller/   (HTTP endpoints)
  src/main/java/com/pgmanagement/dto/          (Request/Response)

Frontend:
  src/types/index.ts                           (Types)
  src/services/                                (API calls)
  src/pages/                                   (Full pages)
  src/components/                              (Reusable components)
  src/contexts/                                (Global state)

Database:
  database/schema.sql                          (Table definitions)
```

---

## Common Commands

```bash
# Backend
cd backend
mvn clean package          # Build
mvn spring-boot:run       # Run
mvn test                  # Test

# Frontend
cd frontend
npm install               # Install
npm run dev              # Dev server
npm run build            # Build

# Database
psql -d pg_management -f database/schema.sql  # Apply schema
```

---

## Architecture Overview

```
User Request
    ↓
Axios (adds JWT token)
    ↓
Spring Boot Controller
    ↓
Service (business logic)
    ↓
Repository (database)
    ↓
PostgreSQL
    ↓
JSON Response ← Frontend
```

---

**When implementing a feature, always follow this order:**
1. Database schema (only if new table needed)
2. Backend: repository → service → controller → DTOs (only methods needed for the request)
3. Test backend with curl
4. Frontend: types → service → component (only functionality needed for the request)
5. Add route
6. Test frontend

**Critical Rules:**
- ⛔ NEVER expose sensitive data in responses. Use DTOs to hide passwords/secrets
- ⛔ NEVER implement CRUD operations unless specifically requested
- ⛔ NEVER add search, filter, pagination unless specifically requested  
- ⛔ NEVER add extra endpoints or service methods "just in case"
- ✅ ONLY implement the minimum viable code to satisfy the exact request
- ✅ User will ask for additional features when they need them
