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

### Prerequisites
List of software/tools required:
- Docker
- Kubernetes
- Node.js
- Python 3.x
- MongoDB/MySQL
- Any IDE (like VSCode)

### Installation
Step-by-step guide to set up the project locally:

1. **Clone the Repository:**
   ```
   git clone https://github.com/sheikhDipta003/CSE408-BUET-Software-Development.git TechShoppers
   cd TechShoppers
   ```

2. **Set Up Backend Services:**
   - Navigate to each microservice directory and build Docker containers.
     ```
     cd microservice-name
     docker build -t microservice-name .
     ```
   - Use Kubernetes to orchestrate the containers.
     ```
     kubectl apply -f deployment.yml
     ```

3. **Initialize Frontend:**
   ```
   cd frontend
   npm install
   npm start
   ```

4. **Access the Application:**
   - The website should be running on `http://localhost:3000` (or another port specified).

### Configuration
- Configure environment variables in `.env` files for each microservice.
- Adjust database connection settings, API keys, and other sensitive information.

## Usage
Describe how to use the website, including:
- How to search for products.
- How to compare prices.
- Managing user accounts.

## Running Tests
Instructions for running automated tests for this system.
```
cd microservice-name
npm test
```

## Deployment
Guidelines for deploying the application on a live system.

## Contributing
Please read [CONTRIBUTING.md](LINK_TO_CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning
We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](LINK_TO_TAGS).

## Authors
- **Sheikh Intiser Uddin Dipta** - *1905003* - [sheikhDipta003](https://github.com/sheikhDipta003)
- **Tanhiat Fatema Afnan** - *1905014* - [Afnan312](https://github.com/Afnan312)
- **Nazmus Sakib Sami** - *1905030* - [tormentor57](https://github.com/tormentor57)
