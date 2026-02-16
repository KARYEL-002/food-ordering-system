# Laravel Food Ordering System - Backend

## Project Structure

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── MenuItemController.php
│   │   │   └── OrderController.php
│   │   ├── Middleware/
│   │   │   └── CheckRole.php
│   │   └── Requests/
│   ├── Models/
│   │   ├── User.php
│   │   ├── Role.php
│   │   ├── MenuItem.php
│   │   ├── Order.php
│   │   ├── OrderItem.php
│   │   └── Payment.php
│   └── Services/
│       ├── AuthService.php
│       ├── MenuItemService.php
│       └── OrderService.php
├── database/
│   ├── migrations/
│   │   ├── 2024_01_01_000001_create_roles_table.php
│   │   ├── 2024_01_01_000002_create_users_table.php
│   │   ├── 2024_01_01_000003_create_menu_items_table.php
│   │   ├── 2024_01_01_000004_create_orders_table.php
│   │   ├── 2024_01_01_000005_create_order_items_table.php
│   │   └── 2024_01_01_000006_create_payments_table.php
│   └── seeders/
├── routes/
│   └── api.php
├── composer.json
├── .env.example
└── README.md
```

## Prerequisites

- PHP 8.1+
- Composer
- XAMPP (or LAMP/LEMP stack)

## Setup Instructions

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
composer install
```

### 3. Copy Environment File
```bash
copy .env.example .env
```

### 4. Generate Application Key
```bash
php artisan key:generate
```

### 5. Run Migrations
```bash
php artisan migrate
```

### 6. Create Seed Data (Optional)
```bash
php artisan db:seed
```

### 7. Start Laravel Development Server
```bash
php artisan serve
```

Server runs on `http://localhost:8000`

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/health` - Health check

### Authentication (Protected)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Menu Items
- `GET /api/menu-items` - Get all menu items (public)
- `GET /api/menu-items/{id}` - Get menu item by ID (public)
- `POST /api/menu-items` - Create menu item (Admin only)
- `PUT /api/menu-items/{id}` - Update menu item (Admin only)
- `DELETE /api/menu-items/{id}` - Delete menu item (Admin only)

### Orders
- `POST /api/orders` - Create new order (Protected)
- `GET /api/orders/my-orders` - Get user's orders (Protected)
- `GET /api/orders/{id}` - Get order details (Protected)
- `GET /api/orders` - Get all orders (Admin only)
- `PUT /api/orders/{id}/status` - Update order status (Admin only)

## Architecture

### Layered Architecture
1. **Controllers** - Handle HTTP requests/responses
2. **Services** - Contains business logic
3. **Models** - Eloquent ORM for database operations

### Database Schema
- **roles** - Role types (Admin, Customer)
- **users** - User accounts with role references
- **menu_items** - Food items with pricing
- **orders** - Customer orders
- **order_items** - Items within orders
- **payments** - Payment information

## Authentication

Uses Laravel Sanctum for API authentication:
- Token included in `Authorization: Bearer <token>` header
- Tokens stored with users, can be revoked anytime
- Role-based access control protects admin endpoints

## Example Usage

### Register
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123","role":"Customer"}'
```

### Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Menu Items
```bash
curl http://localhost:8000/api/menu-items
```

### Create Order (Requires Auth)
```bash
curl -X POST http://localhost:8000/api/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"menu_item_id":1,"quantity":2}]}'
```

## Configuration

Edit `.env` file to configure:
- `APP_URL` - Application URL
- `DB_CONNECTION` - Database connection (mysql)
- `DB_DATABASE` - Database file/name
- `SANCTUM_STATEFUL_DOMAINS` - Domains for Sanctum authentication

## Notes

- To use MySQL/PostgreSQL, change `DB_CONNECTION` in `.env`
- Admin role required for menu management and order status updates
- Customer role assigned by default on registration
