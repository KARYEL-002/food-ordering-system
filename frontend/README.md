# Food Ordering System - Frontend

A modern React-based frontend for the Food Ordering System built with Vite, React Router, and Tailwind CSS.

## Features

- **Customer Features:**
  - Browse menu with category filtering
  - Add items to cart with quantity management
  - Place orders with special instructions
  - View order history and track status

- **Admin Features:**
  - Manage menu items (create, update, delete)
  - View and manage all orders
  - Update order statuses

- **Chef Features:**
  - View active kitchen orders
  - Update order preparation status
  - Real-time order updates

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── MenuItemCard.jsx
│   ├── Cart.jsx
│   └── OrderCard.jsx
├── context/           # React context providers
│   └── AuthContext.jsx
├── pages/            # Page components
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Menu.jsx
│   ├── Orders.jsx
│   ├── admin/
│   │   ├── AdminMenu.jsx
│   │   └── AdminOrders.jsx
│   └── chef/
│       └── ChefOrders.jsx
├── utils/            # Utility functions
│   ├── api.js
│   └── helpers.js
├── App.jsx           # Main app component
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## API Integration

The frontend communicates with the backend API at `http://localhost:8000/api`. The API base URL is configured in `vite.config.js` as a proxy.

## Authentication

- JWT tokens are stored in localStorage
- Protected routes require authentication
- Role-based access control for admin and chef features

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

Create a `.env` file in the frontend directory if you need to customize the API URL:

```
VITE_API_URL=http://localhost:8000
```
