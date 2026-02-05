# 🍽️ FoodHub - Food Ordering System

A complete full-stack food ordering system built with React (frontend) and Laravel (backend).

## ✨ Features

- 🔐 **User Authentication** - Register, login, and role-based access
- 🍕 **Menu Management** - Browse menu items with images and prices
- 🛒 **Shopping Cart** - Add items and checkout
- 📦 **Order Management** - Track orders with real-time status
- 👨‍💼 **Admin Dashboard** - Manage menu items and orders
- 👨‍🍳 **Chef/Staff Interface** - View and update kitchen orders
- 🎨 **Modern UI** - Responsive design with Tailwind CSS

## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with Vite
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Notifications**: React Hot Toast

### Backend
- **Framework**: Laravel 10+
- **Authentication**: Laravel Sanctum (Token-based)
- **Database**: SQLite (dev), MySQL/PostgreSQL (production)
- **API**: RESTful JSON API

## 🚀 Quick Start

### Prerequisites
- PHP 8.1+
- Composer
- Node.js 18+
- npm

### Backend Setup

```bash
cd backend
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

Backend runs on: **http://localhost:8000**

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:3000**

### Test the Integration

```powershell
# Run automated API tests
.\test-integration.ps1
```

## 📚 Documentation

- **[Integration Complete](INTEGRATION_COMPLETE.md)** - ✅ Integration status and checklist
- **[Quick Start Guide](INTEGRATION_QUICKSTART.md)** - Fast setup instructions
- **[Integration Guide](docs/integration-guide.md)** - Detailed integration documentation
- **[Backend Guide](BACKEND_COMPLETE.md)** - Backend API documentation
- **[Frontend Guide](FRONTEND_GUIDE.md)** - Frontend structure documentation

## 🔑 Default Credentials

After running `php artisan db:seed`:

**Admin User**
- Email: `admin@foodhub.com`
- Password: `password`

**Customer User**
- Email: `customer@foodhub.com`
- Password: `password`

## 📡 API Endpoints

### Public
```
POST /api/auth/register      - Register user
POST /api/auth/login         - Login user
GET  /api/menu-items         - Get menu items
GET  /api/health             - Health check
```

### Protected (Requires Authentication)
```
GET  /api/auth/me            - Get current user
POST /api/auth/logout        - Logout
POST /api/orders             - Create order
GET  /api/orders/my-orders   - Get user's orders
GET  /api/orders/{id}        - Get order details
```

### Admin Only
```
POST   /api/menu-items       - Create menu item
PUT    /api/menu-items/{id}  - Update menu item
DELETE /api/menu-items/{id}  - Delete menu item
GET    /api/orders           - Get all orders
PUT    /api/orders/{id}/status - Update order status
```

## 🎯 User Roles

- **Customer** - Browse menu, place orders, view order history
- **Chef/Staff** - View kitchen orders, update order status
- **Admin** - Full access to menu and order management

## 🗂️ Project Structure

```
food-ordering-system/
├── backend/                 # Laravel backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/  # API controllers
│   │   │   └── Middleware/       # CORS, Auth middleware
│   │   ├── Models/              # Eloquent models
│   │   └── Services/            # Business logic
│   ├── config/                  # Configuration files
│   ├── database/
│   │   ├── migrations/          # Database migrations
│   │   └── seeders/             # Database seeders
│   └── routes/
│       └── api.php              # API routes
│
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Context providers
│   │   ├── pages/          # Page components
│   │   │   ├── admin/      # Admin pages
│   │   │   └── staff/      # Staff pages
│   │   ├── utils/          # Utilities (API client)
│   │   └── assets/         # Images, styles
│   ├── .env                # Environment variables
│   └── vite.config.js      # Vite configuration
│
└── docs/                   # Documentation files
```

## 🛠️ Development

### Run Backend Tests
```bash
cd backend
php artisan test
```

### Run Frontend Dev Server
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
# Backend
cd backend
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache

# Frontend
cd frontend
npm run build
```

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend is running on port 8000
- Check `backend/config/cors.php` includes frontend URL
- Restart both servers

### 401 Unauthorized
- Check token in localStorage
- Try logging out and logging in again
- Verify `SANCTUM_STATEFUL_DOMAINS` in backend `.env`

### Database Errors
```bash
cd backend
php artisan migrate:fresh --seed
```

## 🔒 Security Features

- ✅ Token-based authentication (Laravel Sanctum)
- ✅ Role-based authorization
- ✅ CSRF protection
- ✅ Input validation
- ✅ SQL injection prevention (Eloquent ORM)
- ✅ XSS protection (React auto-escaping)

## 🚦 Integration Status

| Component | Status |
|-----------|--------|
| Backend API | ✅ Complete |
| Frontend UI | ✅ Complete |
| CORS Setup | ✅ Complete |
| Authentication | ✅ Complete |
| Menu Management | ✅ Complete |
| Order System | ✅ Complete |
| Admin Dashboard | ✅ Complete |

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues or questions, please check the documentation in the `docs/` folder or open an issue.

---

**Version**: 1.0.0  
**Last Updated**: February 2026  
**Status**: ✅ Ready for Development & Testing
