# Mini ERP + CRM Operations Portal

A production-style internal operations portal for a wholesale or distribution business. The application includes authentication, role-based access control, customer relationship management, product and inventory tracking, stock movement history, and sales order workflows.

## Overview

This project is designed to simulate a business operations system used by different roles in a company. It helps manage customers, products, inventory, and sales challans in a structured, role-aware environment.

## Features

- JWT authentication
- Role-based access for Admin, Sales, Warehouse, and Accounts users
- Customer CRM with search and follow-up data
- Product and inventory management
- Low-stock tracking
- Stock movement history
- Sales challan creation
- Draft / confirm / cancel flow
- Stock deduction when challans are confirmed
- Responsive dashboard and management pages

## Tech Stack

- React + TypeScript
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT + bcrypt

## Project Structure

```text
.
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── README.md
└── package.json
```

## Setup

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

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`
- `FRONTEND_URL`

### Frontend

- `VITE_API_URL`

## Demo Credentials

- Admin: `admin@example.com` / `password`
- Sales: `sales@example.com` / `password`
- Warehouse: `warehouse@example.com` / `password`
- Accounts: `accounts@example.com` / `password`

## API Overview

- `POST /auth/login`
- `GET /customers`
- `POST /customers`
- `GET /products`
- `POST /products`
- `GET /inventory`
- `GET /inventory/movements`
- `GET /inventory/low-stock`
- `GET /challans`
- `POST /challans`
- `POST /challans/:id/confirm`

## Deployment

- Frontend: Vercel or Netlify
- Backend: Render or Railway
- Database: PostgreSQL via Neon, Supabase, or Render

## Current Limitations

- Invoice generation is not implemented yet
- File uploads and PDF export are not included

## Portfolio Value

This project demonstrates:
- full-stack application architecture
- business workflow modeling
- role-aware application design
- practical CRUD and operations dashboards
- professional product-style thinking
