# 📖 FoodHub - User Manual

Welcome to FoodHub, a complete food ordering system! This manual will guide you through all features and functionalities based on your user role.

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Customer Guide](#customer-guide)
4. [Admin Guide](#admin-guide)
5. [Chef/Staff Guide](#chefstaff-guide)
6. [Common Features](#common-features)
7. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## Overview

### What is FoodHub?

FoodHub is a modern food ordering system that allows customers to browse menus, place orders, and track their status in real-time. Administrators can manage the menu and orders, while kitchen staff can monitor and update order preparation status.

### Key Features

- 🔐 **Secure Authentication** - Register and login with role-based access
- 🍽️ **Dynamic Menu** - Browse food items with descriptions and prices
- 🛒 **Interactive Cart** - Add items, adjust quantities, and checkout
- 📦 **Order Tracking** - Real-time status updates on your orders
- 👨‍💼 **Admin Dashboard** - Complete menu and order management
- 👨‍🍳 **Kitchen Dashboard** - Real-time order preparation interface
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices

### User Roles

#### 🛍️ Customer
- Browse and search menu items
- Add items to cart and checkout
- Track order status
- View order history

#### 👨‍💼 Administrator
- Manage menu items (add, edit, delete)
- View all customer orders
- Update order statuses
- Dashboard overview

#### 👨‍🍳 Chef/Staff
- View active kitchen orders
- Update preparation status
- Real-time order monitoring

---

## Getting Started

### Accessing FoodHub

1. Open your browser
2. Navigate to: **http://localhost:3000**
3. You will see the FoodHub homepage

### Creating an Account (Registration)

**For New Customers:**

1. Click the **"Register"** button in the navigation bar
2. Fill in the registration form:
   - **Name**: Enter your full name
   - **Email**: Enter a valid email address
   - **Password**: Create a strong password (min 8 characters recommended)
   - **Confirm Password**: Re-enter password to confirm
3. Click **"Register"** button
4. A success message will appear
5. You will be redirected to the login page

### Logging In

1. Click the **"Login"** button in the navigation bar
2. Enter your credentials:
   - **Email**: Your registered email
   - **Password**: Your password
3. Click **"Login"** button
4. On successful login, you will be redirected to your dashboard

### Demo Accounts

You can test the system with these pre-configured accounts:

**Admin Account:**
- Email: `admin@foodhub.com`
- Password: `password`

**Customer Account:**
- Email: `customer@foodhub.com`
- Password: `password`

---

## Customer Guide

### 1. Browsing the Menu

**Accessing the Menu:**
1. After login, click **"Menu"** in the navigation bar
2. You will see all available food items displayed as cards

**Menu Item Information:**
Each item card shows:
- 📸 Item image
- 📝 Item name
- 📋 Description
- 💲 Price
- ✅ Availability status

**Searching & Filtering:**
- Use the search bar to find specific items by name
- Items are organized by category
- Click category filters to narrow down selections

### 2. Adding Items to Cart

**To Add an Item:**
1. Browse the menu and find your desired item
2. Click **"Add to Cart"** button on the item card
3. A quantity selector will appear
4. Select the desired quantity
5. Click **"Add"** to confirm

**Quantity Options:**
- Use **+** and **-** buttons to adjust quantity
- Minimum quantity: 1
- Maximum quantity: Based on order limits

**Cart Notifications:**
- A success notification will appear confirming the item was added
- The cart icon will update showing the number of items

### 3. Managing Your Cart

**Viewing Cart:**
1. Click the **"🛒 Cart"** icon in the navigation bar, or
2. Click **"View Cart"** button after adding an item

**Cart Display:**
- List of all items you added
- Quantity for each item
- Unit price and item total
- Subtotal amount

**Modifying Cart Items:**
1. To increase quantity: Click **"+"** button next to the item
2. To decrease quantity: Click **"-"** button next to the item
3. To remove item: Click **"Remove"** or **"X"** button

**Cart Total:**
- Subtotal is automatically calculated
- Any applicable taxes/fees are added
- Final total amount is displayed

### 4. Checkout & Payment

**Proceeding to Checkout:**
1. Review items in your cart
2. Ensure all quantities are correct
3. Click **"Proceed to Checkout"** button

**Checkout Page:**
- Review order summary
- Confirm delivery address
- Review total amount
- Select payment method (if available)

**Placing Order:**
1. Verify all details are correct
2. Click **"Place Order"** button
3. Wait for confirmation message
4. Order is now placed!

**Order Confirmation:**
- You will receive a confirmation message with order number
- Order details are displayed on the new page
- Confirmation may also be sent to your email

### 5. Tracking Orders

**Accessing Your Orders:**
1. Click **"Orders"** in the navigation bar
2. You will see all your previous and current orders

**Order Information:**
Each order shows:
- 📋 Order ID/Number
- 📅 Order Date and Time
- 💲 Order Total Amount
- 🟡 Current Status (Pending, Confirmed, Preparing, Ready, Delivered)
- 📦 Items in the order with quantities

**Order Status:**

| Status | Meaning |
|--------|---------|
| **Pending** | Order received, waiting for confirmation |
| **Confirmed** | Order confirmed by restaurant |
| **Preparing** | Kitchen is preparing your order |
| **Ready** | Order is ready for pickup/delivery |
| **Delivered** | Order has been delivered to you |
| **Cancelled** | Order has been cancelled (if applicable) |

**Real-time Updates:**
- Order status updates automatically
- Page auto-refreshes every 30 seconds
- Notifications alert you to status changes

**Order Details:**
Click on any order to see:
- Itemized list with quantities and prices
- Order timestamps
- Delivery/pickup information
- Payment details

### 6. Account Settings

**Accessing Settings:**
1. Click your **"Profile"** or name in the navigation bar
2. Select **"Settings"**

**Available Options:**
- View your account information
- Update profile details
- Change password
- Profile preferences
- Logout

---

## Admin Guide

### 1. Admin Dashboard

**Accessing Admin Panel:**
1. Login with admin account
2. Click **"Admin"** in the navigation bar
3. You will see the admin dashboard

**Dashboard Overview:**
- Total number of customers
- Total orders count
- Revenue statistics
- Recent orders
- Quick action buttons

### 2. Menu Management

**Accessing Menu Management:**
1. From admin dashboard, click **"Manage Menu"** or **"Menu Items"**
2. You will see list of all menu items

#### Adding New Menu Item

**Steps:**
1. Click **"Add New Item"** or **"+ New Item"** button
2. Fill in the form:
   - **Name**: Item name (e.g., "Margherita Pizza")
   - **Description**: Item details and ingredients
   - **Price**: Item cost in currency
   - **Category**: Select from available categories
   - **Image**: Upload item image
   - **Availability**: Toggle availability status
3. Click **"Save"** or **"Create"** button
4. New item appears in menu immediately

#### Editing Menu Item

**Steps:**
1. Find item in menu list
2. Click **"Edit"** button on the item
3. Update desired fields
4. Click **"Save"** or **"Update"** button
5. Changes take effect immediately

#### Deleting Menu Item

**Steps:**
1. Find item in menu list
2. Click **"Delete"** button
3. Confirm deletion in popup
4. Item is removed from menu

**Warning**: Deleted items cannot be recovered

#### Managing Availability

**To Mark Item as Available/Unavailable:**
1. From menu list, find the item
2. Click **"Availability"** toggle or **"Edit"**
3. Set availability status (Available/Unavailable)
4. Save changes

**Effect**: Unavailable items won't appear in customer menu

### 3. Order Management

**Accessing Orders:**
1. From admin dashboard, click **"View All Orders"** or **"Orders"**
2. You will see all orders from all customers

**Order List Display:**
- Order ID
- Customer name
- Order date
- Total amount
- Current status
- Action buttons

#### Viewing Order Details

**Steps:**
1. Click on order ID or **"View Details"** button
2. See complete order information:
   - Customer name and contact
   - Ordered items with quantities
   - Order total and payment status
   - Current order status
   - Timeline of status updates

#### Updating Order Status

**Steps:**
1. Find order in list or open order details
2. Click **"Update Status"** button
3. Select new status from dropdown:
   - Pending
   - Confirmed
   - Preparing
   - Ready
   - Delivered
   - Cancelled (if needed)
4. Optionally add notes
5. Click **"Save"** or **"Update"** button
6. Status is updated immediately

**Best Practices:**
- Confirm orders when you receive them
- Update status to "Preparing" when kitchen starts
- Change to "Ready" when order is complete
- Set to "Delivered" when customer receives
- Add notes for any issues or special requests

#### Filtering Orders

**Filter by:**
- Status (Pending, Confirmed, etc.)
- Date range
- Customer name
- Amount range
- Payment status

**Sorting Options:**
- Most recent first (default)
- Oldest first
- Highest amount
- Lowest amount

### 4. Reports & Analytics

**Accessing Reports:**
1. Click **"Reports"** or **"Analytics"** in admin menu
2. View various reports:

**Available Reports:**
- Daily sales summary
- Top-selling items
- Customer statistics
- Revenue trends
- Order volume by status

**Exporting Data:**
- Click **"Export"** to download reports as CSV
- Use downloaded data for external analysis

---

## Chef/Staff Guide

### 1. Accessing Kitchen Dashboard

**Steps:**
1. Login with chef/staff credentials
2. Click **"Kitchen"** or **"Orders"** in navigation
3. Kitchen dashboard loads with active orders

### 2. Kitchen Order Display

**Orders Shown:**
- Only orders with status "Confirmed" or "Preparing"
- Organized in queue by time received
- Real-time updates automatically

**Each Order Card Shows:**
- 📋 Order ID
- 📅 Time received (how long it's been waiting)
- 👤 Customer name
- 📦 Items to prepare with quantities
- 🔥 Urgency indicator (color coded)

**Color Priority System:**
- 🔴 **Red**: Order is delayed/priority (over 20 mins)
- 🟡 **Yellow**: Order in normal queue (10-20 mins)
- 🟢 **Green**: New order (under 10 mins)

### 3. Updating Order Status

**Marking as Preparing:**
1. When you start preparing an order, click **"Start Preparing"** button
2. Order status updates to "Preparing"
3. Timer starts showing preparation duration

**Marking as Ready:**
1. When order is complete, click **"Mark Ready"** button
2. Status changes to "Ready" for pickup/delivery
3. Customer is notified automatically
4. Order moved to ready queue

**Cancelling Order:**
If there's an issue:
1. Click **"Issues"** or **"Flag for Manager"**
2. Add reason for cancellation
3. Manager reviews and takes action

### 4. Kitchen Dashboard Features

**Auto-Refresh:**
- Orders automatically update every 30 seconds
- New orders appear in real-time
- Completed orders disappear from queue

**Search Orders:**
- Search by order ID if needed
- Filter by status

**Preparation Times:**
- Keep track of preparation time shown for each order
- Aim to keep items under 20 minutes
- Use timer to manage multiple orders

**Communication:**
- Special requests shown in order details
- Customer preferences highlighted
- Notes from admin displayed

---

## Common Features

### 1. Notifications

**Types of Notifications:**
- ✅ Success: Action completed (item added, order placed)
- ⚠️ Warning: Important information
- ❌ Error: Something went wrong, action details provided
- ℹ️ Info: Helpful messages and updates

**Notification Behavior:**
- Appear at top/bottom of screen
- Auto-dismiss after 5 seconds
- Can be manually dismissed
- Stack if multiple appear

### 2. Search Functionality

**Menu Search (Customer):**
- Type item name in search bar
- Results filter in real-time
- Press Enter or click search icon
- Clear search to see all items

**Order Search (Admin/Chef):**
- Search by order ID
- Search by customer name
- Results appear in list

### 3. Sorting & Filtering

**Sorting Options:**
- Date created
- Name (alphabetical)
- Price (low to high, high to low)
- Status

**Filtering Options:**
- By category
- By status
- By date range
- By price range

### 4. Responsive Design

**Desktop Usage:**
- Full feature access
- Optimized layout
- All features visible

**Tablet Usage:**
- Touch-friendly buttons
- Responsive layout
- Readable text

**Mobile Usage:**
- Single-column layout
- Large touch targets
- Simplified navigation
- Bottom navigation bar

### 5. Logout

**To Logout:**
1. Click your **name** or **profile icon** in top-right
2. Select **"Logout"** option
3. Confirm logout if prompted
4. Redirected to login page

**Session Information:**
- You are logged out from all devices
- Session tokens are invalidated
- Must login again to access account

---

## FAQ & Troubleshooting

### Frequently Asked Questions

**Q: I forgot my password. What should I do?**
A: Click "Forgot Password" on login page. Enter your email and follow the reset instructions sent to your email.

**Q: Can I edit an order after placing it?**
A: Once an order is confirmed, it cannot be edited. Contact the restaurant for modifications.

**Q: How long does delivery take?**
A: Delivery time depends on current orders. You can track status in your orders section for estimated time.

**Q: Can I cancel an order?**
A: Yes, you can cancel an order if it hasn't started preparation yet. Contact customer service immediately.

**Q: How do I view my credit/loyalty points?**
A: Loyalty features may be available in your profile/rewards section depending on the restaurant's system.

**Q: Why can't I add items to my cart?**
A: Items may be unavailable (check status), or there may be an order limit. Try refreshing page or contact support.

### Common Issues & Solutions

#### **Issue: Can't Login**

**Possible Causes & Solutions:**
1. **Wrong credentials**
   - Verify email and password
   - Try forgot password option
   
2. **Account not activated**
   - Check email for activation link
   - Click activation link and retry
   
3. **Browser cache issue**
   - Clear browser cache and cookies
   - Try in incognito/private window
   
4. **Server not running**
   - Verify backend is running on http://localhost:8000
   - Verify frontend is running on http://localhost:3000

#### **Issue: Items Not Showing in Menu**

**Possible Causes & Solutions:**
1. **Items are unavailable**
   - Admin may have marked items unavailable
   - Check with restaurant
   
2. **Menu not loaded**
   - Refresh browser (Ctrl+R or Cmd+R)
   - Check internet connection
   
3. **Category filter applied**
   - Click "All" or "All Categories"
   - Remove active filters

#### **Issue: Order Not Placed Successfully**

**Possible Causes & Solutions:**
1. **Empty cart**
   - Add items to cart before checkout
   
2. **Network issue**
   - Check internet connection
   - Try again in few seconds
   
3. **Payment failed**
   - Verify payment method
   - Try different payment option
   
4. **Session expired**
   - Login again
   - Re-add items and checkout

#### **Issue: Cart Items Disappeared**

**Possible Causes & Solutions:**
1. **Session expired**
   - Login again and rebuild cart
   - Items not saved if logged out
   
2. **Browser cache cleared**
   - Re-add items manually
   
3. **Different device**
   - Items are specific to device/browser
   - Add items on the device you'll checkout with

#### **Issue: Order Status Not Updating**

**Possible Causes & Solutions:**
1. **Page not refreshing**
   - Manually refresh page (Ctrl+R)
   - Page should auto-refresh every 30 seconds
   
2. **Status was updated**
   - Refresh to see latest status
   - Check order details for timeline
   
3. **Server issue**
   - Try again in few minutes
   - Contact support if persistent

#### **Issue: Payment Problems**

**Possible Causes & Solutions:**
1. **Invalid card details**
   - Verify card number, expiry, CVV
   - Ensure cards are not expired
   
2. **Insufficient funds**
   - Check account balance
   - Try different payment method
   
3. **Payment gateway down**
   - Try again in few minutes
   - Use alternative payment option if available

### Contacting Support

If you encounter issues not covered in this guide:

1. **In-App Support**: Look for "Help" or "Support" option in menu
2. **Email**: Contact restaurant support email
3. **Phone**: Call restaurant's customer service number
4. **Live Chat**: Available on website during business hours

### System Requirements

**Browser Compatibility:**
- Chrome/Edge/Firefox (latest versions)
- Safari 12+
- Mobile browsers (iOS Safari, Chrome Mobile)

**Recommended Requirements:**
- Internet speed: 2+ Mbps
- Screen resolution: 1024x768 or higher
- JavaScript enabled in browser
- Cookies enabled for session management

---

## Tips & Best Practices

### For Customers

1. ⭐ **Check item descriptions** before ordering to understand portions
2. ⏰ **Order during off-peak hours** for faster preparation (if known)
3. 📱 **Keep your contact info updated** for delivery notifications
4. 💳 **Save payment method** for faster checkout
5. 📝 **Add special requests** in notes during checkout
6. 🔔 **Enable notifications** to get status updates
7. 💬 **Leave feedback** to help improve service

### For Admin

1. 📊 **Regularly update menu** to reflect availability
2. ⚡ **Process orders quickly** to keep customers happy
3. 📝 **Add detailed descriptions** to menu items
4. 💸 **Review pricing** periodically for accuracy
5. 👥 **Respond to customer inquiries** promptly
6. 📈 **Monitor sales trends** from reports
7. 🔍 **Review customer feedback** regularly

### For Kitchen Staff

1. ⏱️ **Monitor preparation times** to stay efficient
2. 📋 **Check special requests** for each order
3. 🧹 **Keep station organized** between orders
4. 💬 **Communicate with manager** about delays
5. 🎯 **Prioritize older orders** first (FIFO)
6. ✅ **Double-check orders** before marking ready
7. 📞 **Coordinate with delivery** for timing

---

## Accessibility Features

### Keyboard Navigation
- Use **Tab** key to navigate between elements
- Use **Enter** to activate buttons/links
- Use **Escape** to close popups/modals
- Use **Arrow keys** in dropdowns/menus

### Screen Reader Support
- All images have alt text
- Buttons labeled descriptively
- Form fields properly labeled
- Links have meaningful text

### Visual Adjustments
- **Zoom**: Use Ctrl/Cmd + Plus(+) to zoom in/out
- **Dark Mode**: Available in settings (if configured)
- **Font Size**: Adjustable in browser settings
- **High Contrast**: Supported by modern browsers

---

## Version Information

- **System**: FoodHub v1.0
- **Last Updated**: February 2026
- **Documentation Version**: 1.0

---

## Document Notice

This user manual covers all features of FoodHub. Features and functionality may vary based on specific restaurant configuration. Always refer to in-app messages and notifications for the most current information.

For the latest version of this manual and reporting improvements, visit the system help section or contact support.

---

**Thank you for using FoodHub! Enjoy your food ordering experience.** 🍽️
