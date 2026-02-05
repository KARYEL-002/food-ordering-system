# Frontend & Backend Integration Guide

## Overview
This document provides instructions for integrating and running the FoodHub food ordering system with both frontend and backend components.

## System Architecture

### Backend (Laravel + Sanctum)
- **Framework**: Laravel 10+
- **Authentication**: Laravel Sanctum (Token-based)
- **Database**: SQLite
- **Port**: 8000

### Frontend (React + Vite)
- **Framework**: React 18
- **Build Tool**: Vite
- **State Management**: Context API
- **HTTP Client**: Axios
- **Port**: 3000

## Prerequisites

Before starting, ensure you have:
- **PHP** 8.1 or higher
- **Composer** (PHP dependency manager)
- **Node.js** 18+ and npm
- **SQLite** support enabled in PHP

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
composer install
```

### 2. Generate Application Key
```bash
php artisan key:generate
```

### 3. Database Setup
```bash
# Create SQLite database
php artisan migrate

# Seed database with initial data (optional)
php artisan db:seed
```

### 4. Start Backend Server
```bash
php artisan serve
```
The backend will run on `http://localhost:8000`

## Frontend Setup

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Environment Configuration
Create a `.env` file in the frontend directory (already created):
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=FoodHub
VITE_APP_ENV=development
```

### 3. Start Frontend Development Server
```bash
npm run dev
```
The frontend will run on `http://localhost:3000`

## CORS Configuration

### Backend CORS Settings
The backend is configured to accept requests from:
- `http://localhost:3000` (production frontend port)
- `http://localhost:5173` (Vite default dev port)
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

These settings are configured in:
- `backend/config/cors.php`
- `backend/app/Http/Middleware/Cors.php`
- `backend/env` (SANCTUM_STATEFUL_DOMAINS)

## API Endpoints

### Public Endpoints
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/menu-items        - Get all menu items
GET    /api/menu-items/{id}   - Get single menu item
GET    /api/health            - Health check
```

### Protected Endpoints (Requires Authentication)
```
GET    /api/auth/me           - Get current user
POST   /api/auth/logout       - Logout user
POST   /api/orders            - Create new order
GET    /api/orders/my-orders  - Get user's orders
GET    /api/orders/{id}       - Get single order
```

### Admin Only Endpoints
```
POST   /api/menu-items        - Create menu item
PUT    /api/menu-items/{id}   - Update menu item
DELETE /api/menu-items/{id}   - Delete menu item
GET    /api/orders            - Get all orders
PUT    /api/orders/{id}/status - Update order status
```

## Authentication Flow

### 1. Register/Login
```javascript
// Frontend sends credentials
const response = await api.post('/auth/login', {
  email: 'user@example.com',
  password: 'password'
});

// Backend returns token and user
const { token, user } = response.data;

// Frontend stores token
localStorage.setItem('token', token);
```

### 2. Authenticated Requests
```javascript
// Token is automatically added to headers via axios interceptor
const response = await api.get('/orders/my-orders');
```

### 3. Token Handling
- Tokens are stored in `localStorage`
- Automatically included in request headers as `Authorization: Bearer {token}`
- On 401 response, user is redirected to login

## Testing the Integration

### 1. Start Both Servers
```bash
# Terminal 1 - Backend
cd backend
php artisan serve

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 2. Access the Application
Open browser and navigate to: `http://localhost:3000`

### 3. Test User Flows

#### Register New User
1. Click "Register" in navbar
2. Fill in registration form
3. Submit and verify redirect to home

#### Login
1. Click "Login" in navbar
2. Enter credentials
3. Verify authentication and user menu appears

#### Browse Menu
1. Navigate to "Menu" page
2. Verify menu items load from backend
3. Add items to cart

#### Place Order
1. Add items to cart
2. Click "Checkout"
3. Submit order
4. Verify order appears in "My Orders"

#### Admin Functions (if admin user)
1. Login as admin
2. Navigate to "Admin Dashboard"
3. Test CRUD operations on menu items
4. Manage order statuses

## Common Issues & Troubleshooting

### CORS Errors
**Problem**: `Access-Control-Allow-Origin` errors in browser console

**Solution**:
1. Verify backend is running on `http://localhost:8000`
2. Check `backend/config/cors.php` includes your frontend URL
3. Clear browser cache
4. Restart both servers

### 401 Unauthorized
**Problem**: All authenticated requests return 401

**Solution**:
1. Check token is stored in localStorage
2. Verify token format in Authorization header
3. Check `backend/env` SANCTUM_STATEFUL_DOMAINS setting
4. Try logging out and logging in again

### Database Errors
**Problem**: `SQLSTATE` errors or migration issues

**Solution**:
```bash
cd backend
php artisan migrate:fresh --seed
```

### Port Conflicts
**Problem**: Port already in use

**Solution**:
```bash
# Backend - use different port
php artisan serve --port=8001

# Frontend - update vite.config.js port setting
# Then update VITE_API_URL in .env
```

## Development Workflow

### Making API Changes
1. Update backend routes/controllers
2. Test with API client (Postman/Insomnia)
3. Update frontend API calls if needed
4. Test integration

### Adding New Features
1. Create backend endpoints
2. Test endpoints independently
3. Create frontend components
4. Connect frontend to backend
5. Test full flow

## Production Deployment

### Backend
```bash
# Build for production
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Frontend
```bash
# Build for production
npm run build

# Output will be in frontend/dist
# Deploy dist folder to web server
```

### Environment Variables
Update production URLs:
- Backend: Update `APP_URL` in `.env`
- Frontend: Update `VITE_API_URL` to production API URL
- Update CORS settings for production domain

## API Response Format

### Success Response
```json
{
  "data": { },
  "message": "Success message"
}
```

### Error Response
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Validation error"]
  }
}
```

## Security Considerations

1. **Authentication**: All sensitive operations require authentication
2. **Authorization**: Role-based access control (Admin, Chef, Customer)
3. **CSRF Protection**: Sanctum handles CSRF for stateful requests
4. **Input Validation**: All inputs validated on backend
5. **SQL Injection**: Using Eloquent ORM prevents SQL injection
6. **XSS Protection**: React automatically escapes output

## Next Steps

1. ✅ Backend API setup complete
2. ✅ Frontend React app setup complete
3. ✅ CORS configuration complete
4. ✅ Authentication integration complete
5. 🔲 Test all user flows
6. 🔲 Add payment integration (future enhancement)
7. 🔲 Deploy to production

## Support

For issues or questions:
1. Check this documentation
2. Review error logs in `backend/storage/logs`
3. Check browser console for frontend errors
4. Verify network requests in browser DevTools

---

**Last Updated**: February 2026
**Version**: 1.0.0
