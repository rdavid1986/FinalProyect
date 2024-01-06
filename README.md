# Final proyect David Rodriguez
&nbsp;

﻿# BackEnd NodeJS server configuration

This is the backend of an ecommerce system designed to provide essential functionalities for running an online business. It provides endpoint APIs to manage products, shopping carts, and more.

### To run it run the following command

```
npm start

```

# CoderHouse Ecommerce API

This is a Node.js and Express.js-based API for a CoderHouse Ecommerce application. It includes features such as product management, user authentication, shopping carts, and a real-time chat system using Socket.io.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running
- [Configure your MongoDB connection](#configure-mongo)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/tuusuario/tuproyecto.git
   cd tuproyecto
Install dependencies:

bash
Copy code
npm install
Start the server:

bash
Copy code
npm start
Visit http://localhost:8080 in your browser.

Configure MongoDB
Make sure to configure your MongoDB connection by updating the config.js file with your MongoDB URL:

javascript
Copy code
// File: config/config.js

export default {
    port: 8080,
    mongoUrl: "your-mongodb-url",
    // ... other configurations
};
API Documentation
Explore the API endpoints and documentation at http://localhost:8080/api/docs using Swagger UI.

Features
Products: Manage products with CRUD operations.
Users: User authentication and management.
Carts: Shopping cart functionality.
Chat: Real-time chat system using Socket.io.
Logger Test: Endpoint for testing logging functionality.
Restore Password: Endpoints for restoring and managing passwords.
Dependencies
Express.js
Socket.io
MongoDB (Mongoose)
Passport.js
Handlebars
Swagger for API documentation
Contributing
Feel free to contribute to the project by opening issues or creating pull requests.

License
This project is licensed under the MIT License.
