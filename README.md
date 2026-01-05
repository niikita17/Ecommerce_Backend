# Ecommerce_Backend
 Live: https://ecommerce-backend-yjy2.onrender.com/
 
A RESTful E-commerce Backend built using Node.js, Express, MongoDB, implementing authentication, authorization, products, cart, orders, and payments.
This project is designed following real-world backend practices and showcases clean architecture, role-based access, and secure payment flow.
#Tech Stack
Backend: Node.js, Express.js
Database: MongoDB, Mongoose
Authentication: JWT
Authorization: Role-based (Admin / Customer)
Payments: Online Payment + COD
API Testing: Postman

Architecture: MVC (Controller-Service-Model)


#Project Structure 
ecommerce-backend/
│
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── cartController.js
│   ├── orderController.js
│   └── paymentController.js
│
├── models/
│   ├── user.js
│   ├── product.js
│   ├── cart.js
│   └── order.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── productRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   └── paymentRoutes.js
│
├── middlewares/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
│
├── config/
│   └── db.js
│
├── app.js
├── package.json
└── README.md

