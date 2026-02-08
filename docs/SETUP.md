# Development Setup Guide

## Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Maven 3.8+

## Quick Start

### 1. Database Setup
```bash
# Install PostgreSQL and create database
createdb pg_management

# Run schema
psql -d pg_management -f database/schema.sql
```

### 2. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend runs on: http://localhost:8080

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: http://localhost:3000

## API Endpoints Structure

### Authentication
- POST `/api/auth/login`
- POST `/api/auth/register`
- POST `/api/auth/refresh`

### Properties
- GET `/api/properties`
- POST `/api/properties`
- GET `/api/properties/{id}`
- PUT `/api/properties/{id}`

### Rooms
- GET `/api/properties/{propertyId}/rooms`
- POST `/api/properties/{propertyId}/rooms`
- PUT `/api/rooms/{id}`

### Tenants & Bookings
- GET `/api/tenants`
- POST `/api/bookings`
- GET `/api/bookings/{id}`

### Payments
- GET `/api/payments`
- POST `/api/payments`
- PUT `/api/payments/{id}`

## Next Steps

1. **Implement Authentication Module**
   - JWT token service
   - User registration/login
   - Role-based access control

2. **Build Core Entities**
   - User, Property, Room, Booking models
   - JPA repositories
   - Service layer

3. **Create REST Controllers**
   - CRUD operations
   - Input validation
   - Error handling

4. **Frontend Components**
   - Login/Dashboard
   - Property management
   - Room booking interface

## Architecture Benefits

- **Scalable**: Multi-tenant architecture
- **Secure**: JWT authentication + Spring Security
- **Maintainable**: Clean separation of concerns
- **Professional**: Industry-standard tech stack
- **Extensible**: Modular design for easy feature addition