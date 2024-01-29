# TechShoppers - Your One-Stop Tech Shop for Price Comparsion accross the Web

## Introduction
Welcome to the repository for our Price Comparison Website. This platform is designed to help users find the best prices for products across various online retailers. We leverage an MVC architecture for ease of implementation, modularity and separation of concerns.

## Features
- Search functionality for a wide range of products.
- Real-time price comparison from multiple online retailers.
- User account creation and management.
- Product reviews and ratings.
- Price drop alerts and notifications.
- Secure user authentication and authorization.

## Getting Started

## Technology Stack

- **Frontend**: React.js, Tailwind css
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Supabase; access and use with sequelize library of npmjs

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
   npm update(optional)

   # Install frontend dependencies
   cd ../frontend
   npm install
   npm update(optional)
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the `backend` directory and set up your PostgreSQL DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME and other settings.

4. **Run the Application:**
   ```bash
   # Start the backend server
   cd backend
   npm run dev (or, nodemon server or node server)

   # Start the backend server (uses the node package named 'json-server'; fetch sample data for temporary use in the frontend)
   cd frontend
   npm run jsonserver

   # Start the frontend development server
   cd ../frontend
   npm run start

   # format all the js files with proper spacing and alignment for better readability
   npm run prettier
   ```

5. **Open in Browser:**
   Open your browser and navigate to [http://localhost:3000/home](http://localhost:3000/home) to access homepage of TechShoppers.

### Configuration
- Need to create an account in [Supabase](https://supabase.com/)
- Configure environment variables in `.env` files for database connection settings, API keys, and other sensitive information.

## API Documentation

- The API documentation, ERD and System Architecture details can be found in the `system-design` directory.

## Authors
- **Sheikh Intiser Uddin Dipta** - *1905003* - [sheikhDipta003](https://github.com/sheikhDipta003)
- **Tanhiat Fatema Afnan** - *1905014* - [Afnan312](https://github.com/Afnan312)
- **Nazmus Sakib Sami** - *1905030* - [mahito57](https://github.com/mahito57)
