# SajiloMartt - E-Commerce Platform

A full-stack e-commerce application built with Node.js, Express, React, and Vite. SajiloMartt provides a complete shopping experience with product browsing, user authentication, cart management, and Khalti payment integration.

## 🚀 Features

- **Product Management** - Browse products organized by categories
- **User Authentication** - Secure user registration and login
- **Shopping Cart** - Add/remove products and manage quantities
- **Order Management** - Track and manage customer orders
- **Payment Integration** - Khalti payment gateway integration
- **File Uploads** - Support for product images and media
- **Responsive Design** - Mobile-friendly UI with Tailwind CSS

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: Configured in backend/config/db.js

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Linting**: ESLint

## 📁 Project Structure

```
.
├── backend/                 # Express server & API
│   ├── index.js            # Entry point
│   ├── config/             # Configuration files
│   ├── controllers/        # Business logic
│   ├── middlewares/        # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── utils/              # Utility functions
├── frontend/               # React application
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── vite.config.js     # Vite configuration
├── uploads/               # User uploaded files
└── .env                   # Environment variables
```

## 🛠️ Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
```

### Frontend Setup

```bash
cd frontend
npm install
```

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL=your_database_url

# Server Configuration
PORT=5000
NODE_ENV=development

# Khalti Payment Gateway
KHALTI_SECRET_KEY=your_khalti_secret_key
KHALTI_PUBLIC_KEY=your_khalti_public_key

# Frontend
VITE_API_URL=http://localhost:5000
```

## 🚀 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend).

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order by ID

### Users
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Payments
- `POST /api/khalti/initiate` - Initiate Khalti payment
- `POST /api/khalti/verify` - Verify Khalti payment

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please contact the development team.

---

**Happy Shopping with SajiloMartt! 🛍️**
