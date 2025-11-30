# Circle Mini Marketplace - Backend

Express.js backend API integrated with Supabase for authentication and data storage.

## Features

- Supabase Authentication (signup/login/logout)
- Product CRUD operations with Supabase database
- Image upload to Supabase Storage
- Row Level Security (RLS) policies
- Protected routes with JWT middleware
- CORS enabled for frontend integration

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Supabase

1. Go to [Supabase](https://supabase.com) and create a new project
2. Copy your project URL and API keys from Settings > API
3. Create a `.env` file in the backend folder:

```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
```

### 3. Set Up Database

1. Go to your Supabase project dashboard
2. Click on "SQL Editor"
3. Copy the contents of `database/schema.sql`
4. Paste and run the SQL script

This will create:
- `users` table
- `products` table
- Row Level Security policies
- Storage bucket for product images
- Necessary indexes and triggers

### 4. Run the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication

**POST** `/api/auth/signup`
- Body: `{ name, phone, email, password }`
- Returns: `{ user, session }`

**POST** `/api/auth/login`
- Body: `{ email, password }`
- Returns: `{ user, session }`

**POST** `/api/auth/logout`
- Returns: Success message

### Products

**GET** `/api/products`
- Returns: Array of all products with seller info

**GET** `/api/products/:id`
- Returns: Single product with seller info

**POST** `/api/products` (Protected)
- Headers: `Authorization: Bearer <access_token>`
- Body: FormData with `{ name, price, description, image }`
- Returns: Created product

**PUT** `/api/products/:id` (Protected)
- Headers: `Authorization: Bearer <access_token>`
- Body: FormData with updated fields
- Returns: Updated product

**DELETE** `/api/products/:id` (Protected)
- Headers: `Authorization: Bearer <access_token>`
- Returns: Success message

### Health Check

**GET** `/api/health`
- Returns: Server status

## Database Schema

### users
- `id` (UUID, Primary Key)
- `name` (TEXT)
- `phone` (TEXT)
- `email` (TEXT, Unique)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

### products
- `id` (BIGSERIAL, Primary Key)
- `name` (TEXT)
- `price` (NUMERIC)
- `description` (TEXT)
- `image_url` (TEXT)
- `seller_id` (UUID, Foreign Key -> users.id)
- `created_at` (TIMESTAMPTZ)
- `updated_at` (TIMESTAMPTZ)

## Security Features

- Row Level Security (RLS) enabled
- JWT token authentication
- File upload validation
- CORS protection
- Input validation

## Storage

Product images are stored in Supabase Storage:
- Bucket: `products`
- Public access enabled for viewing
- Authenticated access required for uploads

---

Built by Anoop
