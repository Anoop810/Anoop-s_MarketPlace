# Supabase Storage Bucket Configuration

## Setup Instructions

### 1. Access Supabase Dashboard
Open your project dashboard

### 2. Navigate to Storage
- Click **Storage** in the left sidebar
- Click **Create a new bucket**

### 3. Configure Bucket Settings

| Setting | Value |
|---------|-------|
| Bucket Name | `products` |
| Public bucket | Enabled |
| File size limit | `5242880` (5MB) |
| Allowed MIME types | `image/jpeg, image/jpg, image/png, image/gif, image/webp` |

Click **Create bucket**

### 4. Configure Storage Policies

After creating the bucket, click on the **products** bucket, then click **Policies**:

**SELECT Policy (View images)**
```sql
bucket_id = 'products'
```

**INSERT Policy (Upload images)**
```sql
bucket_id = 'products' AND auth.role() = 'authenticated'
```

**DELETE Policy (Remove images)**
```sql
bucket_id = 'products'
```

### 5. Verify Setup

```bash
node test-connection.js
```

## Troubleshooting

**Images not displaying**
- Ensure bucket is set to PUBLIC
- Verify image URL format in products table
- Confirm CORS is enabled

**Upload failures**
- Check file size (max 5MB)
- Verify file type is an image
- Confirm user is authenticated
- Review storage policies

---

Built by Anoop
