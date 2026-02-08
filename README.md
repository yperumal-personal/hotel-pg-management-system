# PG Management System

A scalable Paying Guest management system built with Java Spring Boot and React.

## Architecture

- **Backend**: Java 17 + Spring Boot 3.x + Spring Security + JPA
- **Frontend**: React 18 + TypeScript + Material-UI
- **Database**: PostgreSQL + Redis
- **Build Tools**: Maven (Backend) + Vite (Frontend)

## Project Structure

```
pg-management-system/
├── backend/           # Spring Boot application
├── frontend/          # React application
├── database/          # SQL scripts and migrations
└── docs/             # API documentation
```

## Getting Started

1. **Backend**: `cd backend && mvn spring-boot:run`
2. **Frontend**: `cd frontend && npm start`
3. **Database**: Run PostgreSQL and execute scripts in `database/`

## Core Modules

- Authentication & Authorization
- Property Management
- Room Management
- Tenant Management
- Booking System
- Payment Processing
- Maintenance Requests
- Reports & Analytics