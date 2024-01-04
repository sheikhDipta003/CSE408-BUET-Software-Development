# TechShoppers - Your One-Stop Tech Shop for Price Comparsion accross the Web

## Introduction
Welcome to the repository for our Price Comparison Website. This platform is designed to help users find the best prices for products across various online retailers. We leverage a microservices architecture to ensure scalability and reliability.

## Features
- Search functionality for a wide range of products.
- Real-time price comparison from multiple online retailers.
- User account creation and management.
- Product reviews and ratings.
- Price drop alerts and notifications.
- Secure user authentication and authorization.

## Getting Started

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/TechShoppers.git
   cd TechShoppers
   ```

2. **Install Dependencies:**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the `backend` directory and set up your MongoDB connection string, e.g., `MONGODB_URI=your-mongodb-uri`.

4. **Run the Application:**
   ```bash
   # Start the backend server
   cd backend
   npm start

   # Start the backend server (uses the node package named 'json-server'; fetch sample data for temporary use in the frontend)
   cd frontend
   npx json-server -p 3500 -w .\data\products.json

   # Start the frontend development server
   cd ../frontend
   npm start
   ```

5. **Open in Browser:**
   Open your browser and navigate to [http://localhost:3000](http://localhost:3000) to access TechShoppers.

### Configuration
- Configure environment variables in `.env` files for database connection settings, API keys, and other sensitive information.

## API Documentation

- The API documentation, ERD and System Architecture details can be found in the `system-design` directory.

## Running Tests
Instructions for running automated tests for this system.
```
cd microservice-name
npm test
```

## Authors
- **Sheikh Intiser Uddin Dipta** - *1905003* - [sheikhDipta003](https://github.com/sheikhDipta003)
- **Tanhiat Fatema Afnan** - *1905014* - [Afnan312](https://github.com/Afnan312)
- **Nazmus Sakib Sami** - *1905030* - [mahito57](https://github.com/mahito57)
