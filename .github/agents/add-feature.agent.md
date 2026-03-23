# Add Feature Agent - PG Management System

Quick reference guide for AI models to implement features in the PG Management System.

---

## ⚠️ CRITICAL RULES

**Implementation:**
- ✅ ONLY implement what is explicitly requested
- ❌ DO NOT add CRUD unless specifically asked
- ❌ DO NOT add search/filter/pagination unless requested
- ✅ Start minimal - add only essential code
- ✅ Ask for clarification if ambiguous

**Code Quality:**
- ⛔ NEVER let files exceed 500 lines - refactor immediately
- ⛔ NEVER duplicate code - create reusable utilities/components
- ⛔ NEVER expose sensitive data - use DTOs
- ✅ ALWAYS check file size after changes
- ✅ ALWAYS think reusability first

**Examples:**
- "Show list of tenants" → GET endpoint + display ONLY
- "Add create properties" → POST endpoint + form ONLY
- "Display with search" → GET + display + search (both requested)

---

## Tech Stack

```
Backend: Spring Boot (Java 17) + PostgreSQL + JPA
Frontend: React 18 + TypeScript + Material-UI + Vite
Auth: JWT (24-hour expiration)
```

---

## Backend Implementation Pattern

**Order:** Database → Entity → Repository → Service → Controller → DTOs

**1. Database (database/schema.sql)**
```sql
CREATE TABLE features (
    id BIGSERIAL PRIMARY KEY,
    owner_id BIGINT REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**2. Entity (model/Feature.java)**
```java
@Entity @Table(name = "features")
public class Feature {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne @JoinColumn(name = "owner_id")
    private User owner;
    @NotBlank private String name;
    // Getters & Setters
}
```

**3. Repository (repository/FeatureRepository.java)**
```java
@Repository
public interface FeatureRepository extends JpaRepository<Feature, Long> {
    List<Feature> findByOwnerId(Long ownerId);
}
```

**4. Service (service/FeatureService.java)**
```java
@Service
public class FeatureService {
    @Autowired private FeatureRepository repo;
    
    public List<Feature> getUserFeatures(Long userId) {
        return repo.findByOwnerId(userId);
    }
    
    public Feature create(Long userId, CreateFeatureRequest req) {
        Feature f = new Feature();
        f.setOwnerId(userId);
        f.setName(req.getName());
        return repo.save(f);
    }
}
```

**5. Controller (controller/FeatureController.java)**
```java
@RestController @RequestMapping("/features")
public class FeatureController {
    @Autowired private FeatureService service;
    
    @GetMapping
    public ResponseEntity<List<FeatureResponse>> getFeatures() {
        Long userId = getCurrentUserId();
        return ResponseEntity.ok(service.getUserFeatures(userId)
            .stream().map(FeatureResponse::new).collect(Collectors.toList()));
    }
    
    @PostMapping
    public ResponseEntity<FeatureResponse> create(@Valid @RequestBody CreateFeatureRequest req) {
        Feature f = service.create(getCurrentUserId(), req);
        return ResponseEntity.status(CREATED).body(new FeatureResponse(f));
    }
    
    private Long getCurrentUserId() {
        return ((UserDetails) SecurityContextHolder.getContext()
            .getAuthentication().getPrincipal()).getUsername(); // then lookup
    }
}
```

**6. DTOs (dto/)**
```java
public class CreateFeatureRequest {
    @NotBlank private String name;
}

public class FeatureResponse {
    private Long id; private String name; private LocalDateTime createdAt;
}
```

---

## Frontend Implementation Pattern

**Order:** Types → Service → Component → Route

**1. Types (types/index.ts)**
```typescript
export interface Feature {
    id: number; name: string; createdAt: string;
}
export interface CreateFeatureRequest { name: string; }
```

**2. Service (services/featureService.ts)**
```typescript
import api from './api';
import { Feature, CreateFeatureRequest } from '../types';

export const featureService = {
    getFeatures: () => api.get<Feature[]>('/features'),
    create: (data: CreateFeatureRequest) => api.post<Feature>('/features', data),
    delete: (id: number) => api.delete(`/features/${id}`),
};
```

**3. Component (pages/Features.tsx)**
```typescript
import { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, 
         Dialog, TextField, CircularProgress } from '@mui/material';
import { featureService } from '../services/featureService';

export default function Features() {
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        featureService.getFeatures()
            .then(res => setFeatures(res.data))
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async () => {
        const res = await featureService.create(formData);
        setFeatures([...features, res.data]);
        setOpenDialog(false);
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Button variant="contained" onClick={() => setOpenDialog(true)}>Add</Button>
            <Table>
                <TableHead><TableRow><TableCell>Name</TableCell></TableRow></TableHead>
                <TableBody>
                    {features.map(f => (
                        <TableRow key={f.id}><TableCell>{f.name}</TableCell></TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <TextField label="Name" value={formData.name} 
                    onChange={(e) => setFormData({ name: e.target.value })} />
                <Button onClick={handleCreate}>Create</Button>
            </Dialog>
        </Box>
    );
}
```

**4. Route (App.tsx)**
```typescript
<Route path="features" element={<Features />} />
```

---

## Testing

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Use token for requests
curl -X GET http://localhost:8080/api/features \
  -H "Authorization: Bearer TOKEN"
```

---

## File Size & Reusability

### ⚠️ 500-Line Rule
**If file > 500 lines, refactor immediately.**

### Backend Refactoring
```java
// Split large services
@Component public class AuthUtil {
    public Long getCurrentUserId() { /* ... */ }
}

// Extract validators
@Component public class PropertyValidator {
    public void validate(Property p) { /* ... */ }
}

// Extract mappers
@Component public class PropertyMapper {
    public PropertyResponse toResponse(Property p) { /* ... */ }
}
```

### Frontend Refactoring
```typescript
// Extract custom hooks
// hooks/useProperties.ts
export function useProperties() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { /* fetch */ }, []);
    return { data, loading, setData };
}

// Extract utility functions
// utils/formatters.ts
export const formatCurrency = (n) => new Intl.NumberFormat('en-IN').format(n);

// Extract shared components
// components/shared/DataTable.tsx
export function DataTable({ data, columns }) { /* ... */ }
```

### Refactor Triggers
- 🚨 File > 500 lines
- 🚨 Code duplicated 3+ times
- 🚨 Method > 50 lines
- 🚨 Component has 5+ useState hooks

### File Structure
```
Backend: src/main/java/com/pgmanagement/util/  (shared utilities)
Frontend: src/hooks/, src/utils/, src/components/shared/
```

---

## Quick Reference

### Key Annotations
| Annotation | Purpose |
|-----------|---------|
| @Entity, @Table | JPA entity |
| @Id, @GeneratedValue | Primary key |
| @ManyToOne, @JoinColumn | Foreign key |
| @RestController, @RequestMapping | REST endpoint |
| @GetMapping, @PostMapping, @PutMapping, @DeleteMapping | HTTP methods |
| @Valid, @NotBlank | Validation |
| @Service, @Repository, @Autowired | Spring beans |

### File Locations
```
Backend: src/main/java/com/pgmanagement/{model,repository,service,controller,dto}
Frontend: src/{types,services,pages,components,contexts,hooks,utils}
Database: database/schema.sql
```

### Commands
```bash
Backend: cd backend && mvn spring-boot:run
Frontend: cd frontend && npm run dev
Database: psql -d pg_management -f database/schema.sql
```

### Architecture Flow
```
React → Axios (JWT) → Controller → Service → Repository → PostgreSQL
```

---

## Implementation Order

1. Database schema (if new table)
2. Backend: Entity → Repository → Service → Controller → DTOs
3. Test backend with curl
4. Frontend: Types → Service → Component
5. Add route to App.tsx
6. Test frontend
