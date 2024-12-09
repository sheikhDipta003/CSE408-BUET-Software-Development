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

- **Frontend**: React js, Tailwind css
- **Backend**: Express js
- **Database**: Supabase (PostgreSQL)


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
   - Create a `.env` file in the `backend` directory and set up your these environment variables:
      ```HOST = localhost```

      ```PORT = 5432 (postgres database server will be exposed via this port)```

      ```LOCALPORT = 5000 (this is the port where the server of TechShopers will run)```

      ```USER = postgres```

      ```PASSWORD = <your-postgres-password>```

4. **Run the Application locally:**
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

   # Run the scrapper to get updated information from startech and ryanscomputers
   cd backend
   node scrapper\startech_laptop.js
   node scrapper\startech_desktop.js
   node scrapper\ryans_laptop.js
   node scrapper\ryans_desktop.js
   ... ... ... ... ... ... ... ...
   node scrapper\jsonTODB.cjs
   ```

5. **Open in Browser:**
   Open your browser and navigate to [http://localhost:3000/home](http://localhost:3000/home) to access homepage of TechShoppers.


## Demo

- [Navigating](https://youtu.be/krloJzYuYs0?si=HUokKF4Q1mNNCTRP) through the products-sort,search,filter

- [Users](https://youtu.be/xZZz1ywUoRc?si=y90pDNx-oFq0zoG0) can add products to wishlist, get product recommendations and top offers, set price alert, get notified when price drops below threshold, follow/unfollow events and more

- [Collaborators](https://youtu.be/eVoZVsXA36U?si=g0xcqd1q9fak9yrG) can promote their own products so that they appear in Top Offers list of users, they can create and manage events and vouchers and more

- [Admins](https://youtu.be/wqLi1nNQ16c?si=i5zD3Fp6kJnuJP7x) can view overall statistics of TechShoppers, approve/disapprove events and reviews, add/remove users, collaborators and other admins


## API Documentation

- The API documentation, ERD and System Architecture details can be found in the [system-design](system-design) directory.


## Additional Information

- Since the supbase project has been paused and cannot be restored via dashboard, [follow these instructions]() in order to restore the backup database and run the project
- Credentials for 3 different kinds of users are given below. You may login as one of them or you may register as a new user:
   1. *customer/normal user:*

      **username:** jerry

      **password:** 12345aA@

   2. *admin:*

      **username:** dipta

      **password:** 12345aA@

   3. *collaborator:*

      **username:** afnanCollab

      **password:** 12345aA@


## Authors
- **Sheikh Intiser Uddin Dipta** - *1905003* - [sheikhDipta003](https://github.com/sheikhDipta003)
- **Tanhiat Fatema Afnan** - *1905014* - [Afnan312](https://github.com/Afnan312)
- **Nazmus Sakib Sami** - *1905030* - [mahito57](https://github.com/mahito57)
