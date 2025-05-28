# IGS Pharma Deployment Guide for igs.asafarim.com

This guide outlines the steps to deploy the IGS Pharma application to igs.asafarim.com, following clean architecture principles.

## Prerequisites

- Access to the igs.asafarim.com server
- SSH access or FTP credentials for file transfer
- Proper DNS configuration for igs.asafarim.com
- Web server (Nginx or IIS) configured on the server
- .NET runtime installed on the server (for backend)

## Deployment Process

### 1. Prepare the Deployment Package

Run the deployment script to create a deployment package:

```powershell
# From the project root
./deploy-to-asafarim.ps1
```

This script will:
- Build the React frontend using pnpm
- Build and publish the .NET backend
- Create a deployment package with both components

### 2. Upload to Server

Upload the generated deployment package to your server using SCP, SFTP, or any file transfer method:

```bash
# Example using SCP
scp IGSPharma-Deployment-*.zip user@igs.asafarim.com:/path/to/deployment/
```

### 3. Extract the Package on the Server

SSH into your server and extract the deployment package:

```bash
ssh user@igs.asafarim.com

# Navigate to deployment directory
cd /path/to/deployment/

# Extract the package
unzip IGSPharma-Deployment-*.zip -d ./extracted
```

### 4. Configure Web Server

#### For Nginx:

Create an Nginx configuration for your application:

```nginx
# Frontend configuration
server {
    listen 80;
    server_name igs.asafarim.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name igs.asafarim.com;
    
    # SSL configuration
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # Frontend static files
    location / {
        root /path/to/deployment/frontend;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
            expires 30d;
            add_header Cache-Control "public, max-age=2592000";
        }
    }
    
    # Backend API proxy
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### For IIS:

1. Create a new website in IIS for the frontend
2. Set the physical path to the frontend deployment directory
3. Configure URL Rewrite to handle React routing
4. Create a separate application pool for the backend API
5. Set up the backend as an application under IIS

### 5. Configure and Start the Backend

Create a service for the .NET backend:

```bash
# Create a systemd service file (for Linux)
sudo nano /etc/systemd/system/igspharma-api.service
```

Add the following content:

```
[Unit]
Description=IGS Pharma API
After=network.target

[Service]
WorkingDirectory=/path/to/deployment/backend
ExecStart=/usr/bin/dotnet /path/to/deployment/backend/IGSPharma.API.dll
Restart=always
RestartSec=10
SyslogIdentifier=igspharma-api
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5000

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl enable igspharma-api.service
sudo systemctl start igspharma-api.service
```

### 6. Verify Deployment

1. Check if the backend service is running:
   ```bash
   sudo systemctl status igspharma-api.service
   ```

2. Verify the frontend is accessible by visiting https://igs.asafarim.com

3. Test the API by visiting https://igs.asafarim.com/api/products

## Troubleshooting

### Backend Issues

- Check logs: `sudo journalctl -u igspharma-api.service`
- Verify database connection in appsettings.json
- Ensure proper permissions for files and directories

### Frontend Issues

- Check browser console for errors
- Verify the API URL in the frontend build
- Check Nginx/IIS logs for any errors

## Maintenance

### Updating the Application

1. Pull the latest changes from the repository
2. Run the deployment script again
3. Upload and extract the new package
4. Restart the backend service:
   ```bash
   sudo systemctl restart igspharma-api.service
   ```

## Security Considerations

- Ensure SSL is properly configured
- Use environment variables for sensitive information
- Regularly update dependencies using pnpm
- Implement proper authentication and authorization
- Set up proper CORS configuration in the backend

## Backup Strategy

- Regularly backup the database
- Create snapshots of the server
- Maintain version control of deployment packages
