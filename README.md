# IGS Pharma - Pharmacy Management System

## Overview

IGS Pharma is a comprehensive pharmacy management system with a modern React frontend and a .NET Core backend. The application follows clean architecture principles and provides a user-friendly interface for browsing and purchasing pharmaceutical products.

## Project Structure

The project is organized as a monorepo using pnpm workspaces:

```tree
IGS/
├── ECommerceApp/
│   ├── dotnet-backend-clean/    # .NET Core backend with Clean Architecture
│   └── ecommerce-frontend/      # React TypeScript frontend
├── packages/                    # Shared packages
└── package.json                 # Workspace configuration
```

## Technology Stack

### Frontend

- **Framework**: React with TypeScript
- **Routing**: React Router v6
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Styling**: CSS with component-based styling
- **Architecture**: Clean Architecture with presentation, application, domain, and infrastructure layers

### Backend

- **Framework**: .NET Core
- **Architecture**: Clean Architecture
- **API**: RESTful API with ASP.NET Core
- **Database**: Entity Framework Core

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (v10.11.0 or higher)
- .NET Core SDK (v7.0 or higher)
- SQL Server (for backend database)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AliSafari-IT/IGS.git
   cd IGS
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up the backend database:

   ```bash
   cd ECommerceApp/dotnet-backend-clean
   dotnet ef database update
   ```

### Running the Application

#### Start the Backend

```bash
pnpm backend
```

This will start the .NET Core backend at `https://localhost:5001` and `http://localhost:5000`.

#### Start the Frontend

```bash
pnpm frontend
```

This will start the React frontend at `http://localhost:3000`.

## Features

- Browse products by category
- Search for products
- View product details
- Add products to cart
- Checkout process
- User authentication
- Order history

## API Endpoints

### Products

- `GET /api/products` - Get all products with optional filtering
- `GET /api/products/search?query={query}` - Search products
- `GET /api/products/{id}` - Get product by ID

### Categories

- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID

## Development

### Frontend Development

The frontend follows a clean architecture approach with:

- **Domain Layer**: Core business models and interfaces
- **Application Layer**: Use cases and business logic
- **Infrastructure Layer**: External services and API communication
- **Presentation Layer**: React components and UI logic

### Backend Development

The backend follows clean architecture principles with:

- **Domain Layer**: Entities, value objects, and domain services
- **Application Layer**: Use cases, DTOs, and interfaces
- **Infrastructure Layer**: Database, external services, and API implementations
- **API Layer**: Controllers and middleware

## Troubleshooting

### Common Issues

- **Port Already in Use**: If you see an error like "address already in use", you may have another instance of the application running. Stop the process and try again.
- **API Connection Issues**: Ensure the backend is running and the frontend is configured to connect to the correct API URL.

## License

ISC

## Authors

IGS Pharma Team
