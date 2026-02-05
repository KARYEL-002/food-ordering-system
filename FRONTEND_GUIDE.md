# Food Ordering System - Quick Start Guide

## Frontend Setup Complete! ✅

Your React frontend with Tailwind CSS is now ready to use.

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation bar with role-based menu
│   │   ├── ProtectedRoute.jsx  # Route protection HOC
│   │   ├── MenuItemCard.jsx    # Menu item display card
│   │   ├── Cart.jsx            # Shopping cart component
│   │   └── OrderCard.jsx       # Order display card
│   ├── context/
│   │   └── AuthContext.jsx     # Authentication state management
│   ├── pages/               # Page components
│   │   ├── Home.jsx            # Landing page
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration page
│   │   ├── Menu.jsx            # Customer menu browsing
│   │   ├── Orders.jsx          # Customer order history
│   │   ├── admin/
│   │   │   ├── AdminMenu.jsx   # Admin menu management
│   │   │   └── AdminOrders.jsx # Admin order management
│   │   └── chef/
│   │       └── ChefOrders.jsx  # Chef kitchen dashboard
│   ├── utils/
│   │   ├── api.js              # Axios API client with interceptors
│   │   └── helpers.js          # Utility functions
│   ├── App.jsx                 # Main app with routing
│   ├── main.jsx                # Entry point
│   └── index.css               # Tailwind CSS + custom styles
├── package.json                # Dependencies
├── vite.config.js              # Vite configuration
└── tailwind.config.js          # Tailwind CSS configuration
```

## Available Commands

### Development
```bash
cd frontend
npm run dev
```
Access at: http://localhost:3000

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Features Implemented

### 🔐 Authentication
- Login/Register with JWT tokens
- Protected routes based on user roles
- Automatic token refresh handling
- Logout functionality

### 👤 Customer Features
- Browse menu with category filters
- Add items to cart
- Adjust quantities
- Place orders
- View order history
- Track order status

### 👨‍💼 Admin Features
- Full menu management (CRUD)
- View all orders
- Update order statuses
- Manage availability

### 👨‍🍳 Chef Features
- View active kitchen orders
- Update preparation status
- Real-time order monitoring

## Key Technologies

- **React 18** - Modern React with hooks
- **Vite** - Lightning-fast build tool
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP requests
- **React Hot Toast** - Beautiful notifications

## API Integration

The frontend is configured to proxy API requests to `http://localhost:8000/api`

- Authentication: `/api/auth/login`, `/api/auth/register`
- Menu Items: `/api/menu-items`
- Orders: `/api/orders`

## Styling

### Custom Tailwind Classes
- `.btn` - Base button style
- `.btn-primary` - Primary action button
- `.btn-secondary` - Secondary action button
- `.btn-danger` - Destructive action button
- `.input` - Form input style
- `.card` - Card container style

### Color Scheme
- Primary: Red shades (customizable in tailwind.config.js)
- Background: Gray-50
- Text: Gray-900

## Next Steps

1. **Start the backend server** (port 8000)
2. **Start the frontend** with `npm run dev`
3. **Test the application:**
   - Register a new customer account
   - Browse the menu
   - Add items to cart
   - Place an order

## Testing Different Roles

You'll need to create users with different roles in your backend:

- **Customer**: Can browse menu and place orders
- **Admin**: Can manage menu items and all orders
- **Chef**: Can view and update kitchen orders

## Environment Variables (Optional)

Create `.env` file in frontend folder:
```
VITE_API_URL=http://localhost:8000
```

## Troubleshooting

### Port Already in Use
Change port in `vite.config.js`:
```js
server: {
  port: 3001, // Change to any available port
}
```

### API Connection Issues
- Ensure backend is running on port 8000
- Check CORS settings in backend
- Verify proxy configuration in vite.config.js

## Development Tips

1. Hot reload is enabled - changes appear instantly
2. Check browser console for errors
3. Use React DevTools for debugging
4. Toast notifications show API response messages

Enjoy building your Food Ordering System! 🍕
