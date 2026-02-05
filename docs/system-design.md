# Food Ordering System (System Design)

## High-Level Architecture
### Front End
- Reactjs for framework
- 

### Backend API
- laravel
- RESTful API


### Database
- mysql


## Database Design (ER Diagram)

### users
- id (pk)
- name
- email
- password
- role_FK (fk)
- created_at

### roles
- id (pk)
- name (Admin, Customer)

### menu_items
- id (pk)
- name
- description
- price
- image_url
- availability_status

### orders
- id (pk)
- user_id(fk)
- total_amount
- status
- created_at

### order_items
- id (pk)
- order_id (fk)
- menu_item_id (fk)
- quantity
- price

### payments 
- id (pk)
- order_id (fk)
- payment_method
- amount
- payment_status
- payment_dateorder_items

## API List
