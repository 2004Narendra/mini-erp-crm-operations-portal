# Mini ERP + CRM Operations Portal

A production-style internal operations portal for a wholesale/distribution company. The application provides authentication, role-based access, customer CRM, product inventory, stock movement logging, and sales challan workflows.

## Features
- JWT authentication with Admin, Sales, Warehouse, and Accounts roles
- Customer CRM with search, details, and follow-up notes
- Product and inventory management with low-stock tracking
- Stock movement history
- Sales challan creation, draft/confirm/cancel flow, and stock deduction on confirmation
- Responsive React dashboard and management pages

## Tech Stack
- React + TypeScript
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT + bcrypt

## Project Structure
- backend/: Express API, Prisma schema, auth and business routes
- frontend/: React/Vite UI with role-aware pages and services

## Installation
### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables
### Backend
- DATABASE_URL
- JWT_SECRET
- PORT
- FRONTEND_URL

### Frontend
- VITE_API_URL

## Test Credentials
- Admin: admin@example.com / password
- Sales: sales@example.com / password
- Warehouse: warehouse@example.com / password
- Accounts: accounts@example.com / password

## API Overview
- POST /auth/login
- GET /customers, POST /customers
- GET /products, POST /products
- GET /inventory, GET /inventory/movements, GET /inventory/low-stock
- GET /challans, POST /challans, POST /challans/:id/confirm

## Deployment
- Frontend: Vercel or Netlify
- Backend: Render or Railway
- Database: Neon/Supabase/Render Postgres

## Known Limitations
- Invoice generation is not implemented yet
- File uploads and PDF export are not included
