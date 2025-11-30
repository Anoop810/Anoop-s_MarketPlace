# Circle Mini Marketplace - Setup Guide

## Overview

This guide walks through setting up Circle Mini Marketplace, a professional reselling platform.

## System Requirements

- Node.js 18+
- npm or yarn
- Supabase account

## Architecture

### Backend
- Express.js REST API
- Supabase integration for auth and database
- JWT token authentication

### Frontend
- React 19 with Vite
- Tailwind CSS for styling
- Framer Motion for animations

## Setup Steps

### 1. Database Configuration

Run in Supabase SQL Editor:

```sql
-- Add role column to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS role TEXT CHECK (role IN ('buyer', 'seller'));
```

### 2. Start Backend Server

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Start Frontend

```bash
cd mini-marketplace
npm run dev
```

Frontend runs on `http://localhost:5173`

## Application Flow

### Registration
1. User selects role (Buyer/Seller)
2. Completes signup form
3. Backend creates Supabase auth user
4. Backend creates user profile with role
5. User is automatically logged in

### Login
1. User selects role
2. Enters credentials
3. Backend validates with Supabase
4. Backend verifies role matches
5. User accesses dashboard

### Role Permissions
- **Buyers**: Browse all products, view details, contact sellers
- **Sellers**: Add products, manage listings, view sales stats

## Security

- JWT token authentication
- Role validation on login
- Protected API endpoints
- Row Level Security in database
- Secure token storage
- Session management

## Troubleshooting

**Connection Issues**
- Verify backend is running on port 5000
- Check backend console for errors

**Role Validation Errors**
- User registered as different role
- Create account with correct role

**Products Not Loading**
- Check backend console
- Verify Supabase connection

---

Built by Anoop
