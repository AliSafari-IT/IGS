# IGS PHARMA E-Commerce Application - May 2025 Update

This document provides a detailed overview of the recent changes and improvements made to the IGS PHARMA E-Commerce application. Each entry includes commit information, feature descriptions, and key code snippets.

---

## [ace90f5] - 2025-05-28

### 🎨 Style: Update Changelog Pagination UI

**Developer:** Ali Safari

**Description:**
Updated the changelog pagination UI to display 3 items per page instead of 4, and improved the overall pagination controls for better user experience.

**Key Changes:**
- Reduced items per page from 4 to 3 for better readability
- Updated pagination controls styling
- Improved responsive behavior for different screen sizes

```tsx
// ChangelogFilesViewer.tsx
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 3; // Reduced from 4 to 3 items per page
```

---

## [ba93ebe] - 2025-05-28

### ✨ Feature: Enhanced Changelog UI with Improved Pagination

**Developer:** Ali Safari

**Description:**
Comprehensive update to the changelog UI with improved pagination controls and responsive layout adjustments.

**Key Improvements:**
- Redesigned pagination controls for better usability
- Added smooth transitions and hover effects
- Improved mobile responsiveness
- Enhanced visual hierarchy in the changelog items

---

## [9fef2ec] - 2025-05-28

### 🔒 Feature: Superadmin Role Support

**Developer:** Ali Safari

**Description:**
Added support for a superadmin role with enhanced admin panel visibility and access controls.

**Key Features:**
- New superadmin role with elevated privileges
- Improved admin panel visibility checks
- Enhanced user management capabilities

```csharp
// Migration: AddSuperAdminRole.cs
migrationBuilder.InsertData(
    table: "AspNetRoles",
    columns: new[] { "Id", "Name", "NormalizedName", "ConcurrencyStamp" },
    values: new object[] { 
        "1", 
        "SuperAdmin", 
        "SUPERADMIN", 
        Guid.NewGuid().ToString() 
    });
```

---

## [f3063e8] - 2025-05-28

### 📦 Chore: Package Management Updates

**Developer:** Ali Safari

**Description:**
Updated package.json files for both frontend and backend with the latest development scripts and dependencies.

**Key Updates:**
- Added new development scripts
- Updated dependency versions
- Improved project structure

---

## [e26b27b] - 2025-05-28

### ⚙️ Feature: Development Environment Configuration

**Developer:** Ali Safari

**Description:**
Updated ports and proxy configuration for local development environment.

**Key Changes:**
- Backend API now runs on ports 8100 (HTTP) and 8101 (HTTPS)
- Frontend runs on port 3006
- Configured CORS for development
- Added setupProxy.js for API request forwarding

```javascript
// setupProxy.js
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://localhost:8101',
      changeOrigin: true,
      secure: false
    })
  );
};
```

---

## [1e4edd5] - 2025-05-28

### 🚀 Feature: Deployment Automation

**Developer:** Ali Safari

**Description:**
Added deployment script and postinstall hooks with updated package configurations.

**Key Features:**
- Automated deployment script
- Postinstall hooks for dependency management
- Improved build process
- Backup functionality included

```bash
# deploy-igs-pharma.sh
echo "Starting deployment process..."
npm run build
# Additional deployment steps...
```

---

## Technical Notes

- All changes follow clean architecture principles
- Backend API uses .NET with Entity Framework Core
- Frontend is built with React and TypeScript
- Database: MySQL with root user (no password in development)
- CORS is configured to allow requests from http://localhost:8100, https://localhost:8101, and http://localhost:3006
