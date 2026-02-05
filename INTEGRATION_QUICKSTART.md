# Quick Start Guide - Frontend & Backend Integration

## Run Both Servers

### Terminal 1 - Backend (Laravel)
```bash
cd backend
php artisan serve
```
Backend runs on: http://localhost:8000

### Terminal 2 - Frontend (React)
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:3000

## Test the Integration

1. **Open Browser**: Navigate to http://localhost:3000
2. **Register**: Create a new account
3. **Browse Menu**: View menu items loaded from backend
4. **Place Order**: Add items to cart and checkout
5. **View Orders**: Check your order history

## Files Modified for Integration

### Backend
- ✅ `backend/config/cors.php` - CORS configuration
- ✅ `backend/app/Http/Middleware/Cors.php` - Custom CORS middleware
- ✅ `backend/app/Http/Kernel.php` - Registered CORS middleware
- ✅ `backend/env` - Added CORS and Sanctum settings

### Frontend
- ✅ `frontend/.env` - API URL configuration
- ✅ `frontend/.env.example` - Environment template
- ✅ `frontend/src/utils/api.js` - Updated to use environment variables
- ✅ `frontend/vite.config.js` - Already configured with proxy

## Key Integration Points

### 1. API Base URL
```javascript
// frontend/src/utils/api.js
const baseURL = import.meta.env.VITE_API_URL || '/api';
```

### 2. CORS Headers
```php
// backend/app/Http/Middleware/Cors.php
'Access-Control-Allow-Origin': 'http://localhost:3000'
'Access-Control-Allow-Credentials': 'true'
```

### 3. Authentication Token
```javascript
// Stored in localStorage
// Automatically added to all requests via axios interceptor
localStorage.setItem('token', token);
```

## Default Test Credentials

After running `php artisan db:seed`, you can use:

**Admin User**:
- Email: admin@foodhub.com
- Password: password

**Customer User**:
- Email: customer@foodhub.com
- Password: password

## Troubleshooting

### CORS Error?
- Check both servers are running
- Verify URLs in `frontend/.env`
- Restart both servers

### Can't Login?
- Run `php artisan migrate:fresh --seed`
- Clear browser localStorage
- Check backend logs in `backend/storage/logs`

### Items Not Loading?
- Check backend API: http://localhost:8000/api/health
- Open browser DevTools Network tab
- Verify API calls are reaching backend

## Ready to Go! 🚀

Your frontend and backend are now integrated. Start both servers and begin testing!
