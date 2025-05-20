# E-Commerce Application

A full-stack e-commerce application built with React + TypeScript for the frontend and ASP.NET Core for the backend, following clean architecture principles.

## Project Structure

### Backend (.NET Core)

The backend follows Clean Architecture with 4 layers:

- **Domain**: Contains entities and repository interfaces
- **Application**: Contains use cases and business logic
- **Infrastructure**: Contains repository implementations and database access
- **WebAPI**: Contains API controllers and dependency injection setup

### Frontend (React + TypeScript)

The frontend follows a layered architecture:

- **domain**: Models and interfaces
- **application**: Use cases (e.g., product fetching)
- **infrastructure**: API services
- **presentation**: UI components
- **main**: Entry point and routing

## Getting Started

### Backend Setup

1. Ensure you have .NET 8 SDK installed
2. Navigate to the backend directory:
   ```
   cd ECommerceApp
   ```
3. Run the database migrations:
   ```
   cd ECommerceApp.WebAPI
   dotnet ef database update
   ```
4. Start the backend server:
   ```
   dotnet run
   ```

### Frontend Setup

1. Ensure you have Node.js and npm installed
2. Navigate to the frontend directory:
   ```
   cd ECommerceApp/ecommerce-frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

## Features

- Product listing with images, names, and prices
- Responsive layout similar to newpharma.be
- Type-safe components using TypeScript
- Clean architecture in both frontend and backend
- RESTful API endpoints

## Technologies Used

### Backend
- ASP.NET Core 8
- Entity Framework Core
- SQL Server

### Frontend
- React 18
- TypeScript
- React Router
- Axios for API calls
