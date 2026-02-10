# 📅 DAY 2 — Development
**Focus: Building with structure**

---

## Overview
Day 2 focuses on implementing the core backend and frontend functionality with proper layered architecture and basic API integration. Two parallel sessions will handle backend development and frontend development respectively.

### System Architecture

The Food Ordering System is built on a **client-server architecture** with clear separation of concerns. The **Laravel REST API backend** serves as the single source of truth for all data operations, managing user authentication, product inventory, order processing, and payment tracking through a well-defined database schema with proper relationships and migrations. The **React frontend** communicates exclusively with this API through HTTP requests, handling presentation logic, user interactions, and state management for a responsive user experience. This decoupled design ensures scalability, maintainability, and allows the two teams to work independently: backend engineers focus on business logic, data validation, and security through authentication middleware and role-based access control, while frontend engineers concentrate on UI/UX, form handling, and seamless integration with the API endpoints. The entire workflow—from customer browsing products, adding items to cart, completing checkout, to admin management of menu items and order status—is driven by this API contract between frontend and backend, ensuring consistency and reliability across the application.

---

## 🟦 Session 1: Backend Development
**Role: Backend Engineer**

### Requirements
- **Framework**: Laravel (PHP) with layered architecture
- **Architecture Pattern**: MVC with Service Layer
  - Controllers (HTTP layer)
  - Services (business logic)
  - Models (data layer)
  - Middleware (request processing)

### Features to Implement

#### 1. User Authentication & Authorization
- **User Login**
  - Mock authentication allowed for initial development
  - Email/password based login
  - Session token generation
  - Endpoint: `POST /api/login`
  
- **Role-Based Access Control (RBAC)**
  - Two roles: Admin, User
  - Middleware to enforce role-based access
  - User role assignment on registration
  - Endpoint: `POST /api/register`

#### 2. Product Management (CRUD)
- **Create Product** (Admin only)
  - Name, description, price, category, image
  - Endpoint: `POST /api/products`

- **Read Products**
  - List all products with filters
  - Get single product details
  - Endpoints: `GET /api/products`, `GET /api/products/{id}`

- **Update Product** (Admin only)
  - Update product details
  - Endpoint: `PUT /api/products/{id}`

- **Delete Product** (Admin only)
  - Soft or hard delete
  - Endpoint: `DELETE /api/products/{id}`

#### 3. Order Management
- **Order Creation**
  - Create order with multiple items
  - Calculate total price
  - Assign user to order
  - Endpoint: `POST /api/orders`

- **Order Retrieval**
  - Get user's orders
  - Get order details
  - Endpoints: `GET /api/orders`, `GET /api/orders/{id}`

- **Order Status Tracking**
  - Status states: Pending, Processing, Completed, Cancelled
  - Update order status
  - Endpoint: `PUT /api/orders/{id}/status`

### Database Schema

**Tables Required:**
- `users` - User accounts with role assignment
- `roles` - Admin, User role definitions
- `products` (menu_items) - Food items with pricing
- `orders` - Customer orders
- `order_items` - Items within orders
- `order_status_history` - Track order status changes
- `payments` - Payment records

**Key Relationships:**
- User → Order (1:Many)
- Order → OrderItem (1:Many)
- OrderItem → Product (Many:1)
- User → Role (Many:1)

### Implementation Steps

1. **Set up Database**
   - Create migrations for all tables
   - Define relationships in models
   - Run migrations: `php artisan migrate`

2. **Create Models & Controllers**
   - User model with relationships
   - Product model
   - Order & OrderItem models
   - Create ResourceControllers for each entity

3. **Implement Service Layer**
   - AuthService - handle authentication logic
   - ProductService (MenuItemService) - product operations
   - OrderService - order creation and management
   - Business logic isolated from controllers

4. **Add Authentication**
   - Implement login controller
   - Generate and validate tokens (Sanctum)
   - Create middleware for protected routes

5. **Implement Authorization**
   - Create RoleMiddleware
   - Gate or Policy for admin-only operations
   - Protect admin endpoints

6. **Create API Routes**
   - Group routes by resource
   - Apply middleware for authentication/authorization
   - Use consistent naming conventions

### Deliverables Checklist

- [ ] Database migrations created
- [ ] All models with relationships defined
- [ ] Controllers for User, Product, Order
- [ ] Service layer for business logic
- [ ] Authentication endpoints working
- [ ] Role-based access enforced
- [ ] CRUD operations for products
- [ ] Order creation and retrieval working
- [ ] Database schema documentation
- [ ] API endpoint documentation

---

## 🟨 Session 2: Frontend Development
**Role: Frontend Engineer**

### Requirements
- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **State Management**: Context API or simple state hooks
- **Functional UI** (design simplicity is acceptable)

### Screens to Build

#### 1. Login Page
**Components:**
- Email input field
- Password input field
- Login button
- Link to registration
- Error message display

**Functionality:**
- Form validation (email format, password length)
- API call to `/api/login`
- Store authentication token
- Redirect to dashboard on success
- Display error messages on failure

**Route:** `/login`

#### 2. Product Listing Page
**Components:**
- Product grid/list display
- Product cards with:
  - Image
  - Name
  - Description
  - Price
  - "Add to Cart" button
- Search/filter functionality
- Category filter (optional for Day 2)

**Functionality:**
- Fetch products from `/api/products`
- Display products in responsive grid
- Add products to cart (local state)
- Basic search capability

**Route:** `/products` or `/dashboard`

#### 3. Order Checkout Page
**Components:**
- Cart summary
  - List of selected items
  - Quantity selectors
  - Remove item buttons
  - Subtotal, tax, total calculations
- Checkout form
  - Delivery address
  - Special instructions
  - Payment method selection
  - Place order button
- Order confirmation

**Functionality:**
- Calculate order total
- Form validation
- Submit order to `/api/orders`
- Display order confirmation
- Clear cart after successful order

**Route:** `/checkout`

#### 4. Admin Product Management Page
**Components:**
- Product table/list with columns:
  - Product name
  - Category
  - Price
  - Status
  - Action buttons
- Add Product modal/form
  - Name, description, price, category, image upload
- Edit Product modal
  - Update product details
- Delete confirmation
- Search/filter products

**Functionality:**
- Fetch products with admin view
- Create new product via form
- Edit existing products
- Delete products with confirmation
- Show success/error messages
- Role-based visibility (admin only)

**Route:** `/admin/products` (protected)

### Implementation Steps

1. **Setup Authentication Context**
   - Create AuthContext for managing user and token
   - Implement login/logout logic
   - Persist token in localStorage

2. **Create Layout Components**
   - Header/Navigation with user menu
   - Sidebar (if needed)
   - Footer
   - Protected route wrapper

3. **Build Login Page**
   - Form with validation
   - API integration
   - Token storage
   - Navigation on success

4. **Implement Product Listing**
   - Fetch from backend
   - Display in grid/list
   - Add to cart functionality
   - Simple filtering

5. **Build Checkout Page**
   - Cart state management
   - Form for order details
   - Order submission
   - Confirmation screen

6. **Create Admin Panel**
   - Admin-only route protection
   - Product management forms
   - Modal components for add/edit
   - Confirmation dialogs

7. **Integrate State Management**
   - Use Context API for global state
   - Manage cart items
   - Manage user authentication
   - Handle loading states

8. **Add Error Handling**
   - API error display
   - User-friendly error messages
   - Loading indicators
   - Form validation feedback

### Deliverables Checklist

- [ ] Login page functional
- [ ] Product listing page with API integration
- [ ] Shopping cart functionality
- [ ] Checkout page with order creation
- [ ] Order confirmation screen
- [ ] Admin product management page
- [ ] Protected routes for authenticated users
- [ ] Role-based route protection
- [ ] Error handling and loading states
- [ ] Responsive design
- [ ] Context/state management implemented

---

## Integration Points

### Backend → Frontend API Contracts

**Authentication**
```
POST /api/login
Body: { email, password }
Response: { token, user: { id, name, email, role } }

POST /api/register
Body: { name, email, password, password_confirmation }
Response: { token, user }
```

**Products**
```
GET /api/products
Response: [{ id, name, description, price, category, image }]

GET /api/products/{id}
Response: { id, name, description, price, category, image }

POST /api/products (Admin)
Body: { name, description, price, category, image }
Response: { id, ... }

PUT /api/products/{id} (Admin)
Body: { name, description, price, category, image }
Response: { id, ... }

DELETE /api/products/{id} (Admin)
Response: { message: "success" }
```

**Orders**
```
POST /api/orders
Body: { items: [{ product_id, quantity }], address, special_instructions }
Response: { id, order_number, total, status, items }

GET /api/orders
Response: [{ id, order_number, total, status, created_at }]

GET /api/orders/{id}
Response: { id, order_number, items, total, status, created_at }

PUT /api/orders/{id}/status (Admin)
Body: { status }
Response: { id, status }
```

---

## Success Criteria

✅ **Backend**
- All migrations run successfully
- Authentication works with mock data
- CRUD operations fully functional
- Role-based access enforced
- All endpoints tested and documented

✅ **Frontend**
- All pages load and display correctly
- Login redirects to product listing
- Products display from API
- Cart functionality working
- Checkout submits order successfully
- Admin page shows only to admins
- Error messages display appropriately

✅ **Integration**
- Frontend successfully calls backend APIs
- Token-based authentication works
- Role-based authorization enforced on frontend
- Order flow from listing to checkout complete

---

## Timeline
- **Session 1 (Backend)**: 2-3 hours
- **Session 2 (Frontend)**: 2-3 hours
- **Testing & Integration**: 1 hour

**Total: 5-7 hours of focused development**

---

## Notes & Best Practices

**Backend:**
- Keep controllers thin; move logic to services
- Use Laravel conventions for naming
- Implement proper error handling
- Add API documentation comments
- Use migrations for schema versioning
- Implement request validation

**Frontend:**
- Component-based architecture
- Separate concerns (components, context, utils)
- Use proper prop validation
- Implement loading and error states
- Make API calls in useEffect, not during render
- Store auth token securely (localStorage for now)

---

## Next Steps
After Day 2 completion, proceed to:
- Day 3: Testing & Refinement
- Day 4: Deployment & Documentation
