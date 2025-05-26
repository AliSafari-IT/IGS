# IGS Pharma Backend API

The **IGS Pharma Backend API** is a .NET Core Web API that powers the IGS Pharma e-commerce platform. It provides endpoints for user authentication, product management, order processing, and more. This backend is designed to work seamlessly with the React-based frontend and supports secure password reset flows, email notifications, and robust user management.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Password Reset Flow](#password-reset-flow)
- [Environment Variables](#environment-variables)
- [Security](#security)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- User registration, login, and JWT authentication
- Secure password reset with email notifications
- Product and category management
- Order processing and user account management
- Configurable email (SMTP) integration
- Environment-based configuration for development and production
- Health checks and logging

## Tech Stack
- **Backend:** .NET 7+ (ASP.NET Core Web API)
- **Database:** MySQL (configurable)
- **Email:** SMTP (configurable)
- **Authentication:** JWT Bearer Tokens
- **Frontend:** React (see separate repo)

## Getting Started

### Prerequisites
- [.NET 7 SDK or later](https://dotnet.microsoft.com/download)
- [MySQL](https://www.mysql.com/) or compatible database
- SMTP credentials for email sending

### Installation
1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd IGSPharma.API
   ```
2. **Restore NuGet packages:**
   ```bash
   dotnet restore
   ```
3. **Configure the environment:**
   - Edit `appsettings.json` and `appsettings.Development.json` as needed (see [Configuration](#configuration)).
4. **Apply database migrations:**
   ```bash
   dotnet ef database update
   ```

## Configuration

All configuration is managed via `appsettings.json` (and optionally environment variables).

### Key Settings
- **ConnectionStrings:DefaultConnection:** MySQL connection string
- **Jwt:** JWT authentication settings
- **EmailSettings:** SMTP and frontend URL settings

#### Example EmailSettings
```json
"EmailSettings": {
  "SmtpServer": "smtp.example.com",
  "SmtpPort": 587,
  "SmtpUsername": "your@email.com",
  "SmtpPassword": "yourpassword",
  "SenderEmail": "your@email.com",
  "SenderName": "IGS Pharma Support",
  "EnableSsl": true,
  "WebsiteBaseUrl": "https://localhost:5001",
  "FrontendBaseUrl": "http://localhost:3000",
  "FromDisplayName": "IGS Pharma Support"
}
```
- **FrontendBaseUrl** is used in password reset emails to generate links to the React frontend.

## Running the Application

**Development:**
```bash
dotnet run
```

**Production:**
Configure your production settings in `appsettings.Production.json` and use a production-ready database/SMTP server.

## API Endpoints

### Authentication
- `POST /api/Auth/login` — User login
- `POST /api/Auth/register` — User registration
- `POST /api/Auth/forgot-password` — Request password reset (sends email)
- `POST /api/Auth/reset-password` — Reset password using token and email
- `POST /api/Auth/change-password` — Change password (authenticated)

### Products & Categories
- `GET /api/Products` — List products
- `GET /api/Categories` — List categories

### User Account
- `GET /api/Auth/me` — Get current user info
- `PUT /api/Auth/me` — Update user profile

*...and more (see controllers for full list)*

## Password Reset Flow
1. **User requests password reset:**
   - `POST /api/Auth/forgot-password` with `{ email }`
2. **API sends email:**
   - Email contains a link to `${FrontendBaseUrl}/reset-password?email=...&token=...`
3. **User clicks link:**
   - Opens the React frontend's Reset Password page, where the user enters a new password
4. **Frontend calls API:**
   - `POST /api/Auth/reset-password` with `{ email, token, newPassword, confirmNewPassword }`
5. **Password is updated if token is valid and passwords match.**

## Environment Variables
- `ASPNETCORE_ENVIRONMENT` — Set to `Development` or `Production`
- `ConnectionStrings:DefaultConnection` — Database connection string
- `EmailSettings:FrontendBaseUrl` — URL of the frontend app (e.g., http://localhost:3000)
- `EmailSettings:SmtpServer`, `SmtpPort`, `SmtpUsername`, `SmtpPassword` — SMTP config
- `Jwt:SecretKey`, `Jwt:Issuer`, `Jwt:Audience`, `Jwt:ExpiryMinutes` — JWT auth settings

## Security
- Passwords are hashed and never stored in plain text
- JWT tokens are used for authentication
- Password reset tokens are time-limited and single-use
- Email and token parameters in reset links are URL-encoded

## Troubleshooting
- **Email not sending?**
  - Check SMTP settings in `appsettings.json`
  - Ensure your SMTP provider allows third-party apps
- **Reset link goes to backend, not frontend?**
  - Confirm `FrontendBaseUrl` is set correctly in `EmailSettings`
- **Database connection issues?**
  - Verify your connection string and database server

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)
