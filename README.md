# Computer Store Management System

A full-stack web application for managing a computer store's inventory, suppliers, sales, reporting, and user management.

## Features

- **Inventory Management**: Track products, stock levels, pricing, and categories
- **Supplier Management**: Manage supplier information and relationships
- **Sales Tracking**: Record and monitor sales transactions
- **Reporting**: Generate financial and inventory reports
- **Employee Management**: Track employee information and performance
- **User Role Management**: Role-based access control (Admin, Karyawan/Employee, Owner)

## Tech Stack

- **Frontend**: React.js with Material UI
- **Backend**: Node.js with Express
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: Session-based authentication

## Project Structure

### Backend

```
server/
├── config/         # Configuration files (database, env)
├── controllers/    # Request handlers
├── middleware/     # Custom middleware (auth, validation)
├── models/         # Database models
└── routes/         # API routes
```

### Frontend

```
client/
├── public/         # Static files
└── src/
    ├── components/ # Reusable UI components
    ├── context/    # React context (auth, etc.)
    ├── pages/      # Application pages
    └── utils/      # Helper functions
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd central-computers
   ```

2. Install backend dependencies
   ```
   npm install
   ```

3. Install frontend dependencies
   ```
   cd client
   npm install
   cd ..
   ```

4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   DB_NAME=toko_komputer_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   SESSION_SECRET=your_session_secret
   ```

5. Create the PostgreSQL database
   ```
   createdb toko_komputer_db
   ```

### Running the Application

1. Run both frontend and backend concurrently
   ```
   npm run dev:full
   ```

2. Run backend only
   ```
   npm run dev
   ```

3. Run frontend only
   ```
   npm run client
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/low-stock` - Get low stock products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get supplier by ID
- `POST /api/suppliers` - Create new supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

## User Roles

- **Admin**: Full access to all features
- **Karyawan (Employee)**: Limited access to inventory and sales features
- **Owner**: Full access with additional reporting features

## License

[MIT License](LICENSE)

## Acknowledgments

- Material UI for the component library
- Sequelize for the ORM
- Express for the backend framework 