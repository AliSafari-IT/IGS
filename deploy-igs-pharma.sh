#!/bin/bash

# Set Variables
BASE_DIR="/var/www"
REPO_DIR="$BASE_DIR/asafarim-igs"
FRONTEND_DIR="$REPO_DIR/ECommerceApp/ecommerce-frontend"
BACKEND_DIR="$REPO_DIR/ECommerceApp/dotnet-backend-clean/IGSPharma.API"
FRONTEND_DEPLOY_DIR="$BASE_DIR/igs-pharma-frontend/public_html"
BACKEND_DEPLOY_DIR="$BASE_DIR/igs-pharma-api"
FRONTEND_BACKUP_DIR="$REPO_DIR/backups/frontend"
BACKEND_BACKUP_DIR="$REPO_DIR/backups/backend"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FRONTEND_BACKUP_FILE="igs-pharma-frontend_backup_${TIMESTAMP}.tar.gz"
BACKEND_BACKUP_FILE="igs-pharma-backend_backup_${TIMESTAMP}.tar.gz"
FRONTEND_BACKUP_PATH="$FRONTEND_BACKUP_DIR/$FRONTEND_BACKUP_FILE"
BACKEND_BACKUP_PATH="$BACKEND_BACKUP_DIR/$BACKEND_BACKUP_FILE"

SERVICE_NAME="igs-pharma-api"
SERVICE_FILE="/etc/systemd/system/$SERVICE_NAME.service"
MAX_RETRIES=5
HEALTH_CHECK_URL="http://localhost:5000/api/health"
LOG_DIR="$REPO_DIR/logs"

# Ensure log directory exists
mkdir -p "$LOG_DIR"
DEPLOY_LOG="$LOG_DIR/deploy_$(date +%Y%m%d_%H%M%S).log"

# Log function
log() {
  echo "$(date +"%Y-%m-%d %H:%M:%S") - $1" | tee -a "$DEPLOY_LOG"
}

# Clean old log files function
clean_old_logs() {
  local log_dir=$1
  local keep_count=2

  log "Cleaning old log files in $log_dir, keeping newest $keep_count for each type"

  # Get unique log file prefixes (everything before the timestamp)
  local prefixes=$(find "$log_dir" -type f -name "*.log" | sed -E 's/(.*)_[0-9]{8}_[0-9]{6}.log$/\1/' | sort -u)

  # For each prefix, keep only the most recent files
  for prefix in $prefixes; do
    local base_prefix=$(basename "$prefix")
    log "Processing logs with prefix: $base_prefix"

    # Count files for this prefix
    local file_count=$(find "$log_dir" -type f -name "${base_prefix}_*.log" | wc -l)

    if [ "$file_count" -gt "$keep_count" ]; then
      log "Keeping $keep_count of $file_count ${base_prefix} logs"
      find "$log_dir" -type f -name "${base_prefix}_*.log" | sort -r | tail -n +$((keep_count + 1)) | xargs -r rm
      log "Removed $(($file_count - $keep_count)) old ${base_prefix} logs"
    else
      log "No old ${base_prefix} logs to remove (found $file_count)"
    fi
  done
}

# Clean old logs after creating new log file
clean_old_logs "$LOG_DIR"

# Error handling function
handle_error() {
  log "ERROR: $1"
  if [ "$2" = "exit" ]; then
    log "Exiting due to critical error"
    exit 1
  fi
}

# Deploy Mode (multiple options can be selected with comma separation)
log "******* Deploying IGS Pharma Application *******"
echo ""
echo "Select deployment mode (comma-separated for multiple):"
echo "1. Frontend Only"
echo "2. Backend Only"
echo "3. Both Frontend and Backend"
echo "0. Exit"
echo ""
echo "You can select multiple options using commas (e.g., '1,2' to deploy Frontend and Backend)"
read -p "Enter deploy mode(s) (1-3, 0 to exit): " DEPLOY_MODES

# Exit if user selected 0
if [[ "$DEPLOY_MODES" == "0" ]]; then
  log "Exiting..."
  exit 0
fi

# Convert comma-separated input to array
IFS=',' read -ra DEPLOY_MODE_ARRAY <<<"$DEPLOY_MODES"
log "Selected deployment modes: $DEPLOY_MODES"

# Function to check if a git pull is needed
update_repo() {
  cd "$1" || handle_error "Directory not found - $1" "exit"

  # Check if there are updates on remote
  log "Checking for updates in $1..."
  CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
  git fetch origin "$CURRENT_BRANCH"

  LOCAL_COMMIT=$(git rev-parse HEAD)
  REMOTE_COMMIT=$(git rev-parse "origin/$CURRENT_BRANCH")

  if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
    log "Updates found! Pulling latest changes..."
    git pull origin "$CURRENT_BRANCH" || handle_error "Git pull failed!" "exit"
    return 0
  else
    log "No updates needed."
    return 1
  fi
}

# Function to check API health
check_health() {
  local retries=0
  local max_retries=30
  log "Starting health check at $HEALTH_CHECK_URL"

  # First check if the service is actually running
  local service_status=$(systemctl is-active $SERVICE_NAME)
  if [ "$service_status" != "active" ]; then
    log "ERROR: Service $SERVICE_NAME is not running (status: $service_status)"
    log "Attempting to start the service..."
    sudo systemctl start $SERVICE_NAME
    sleep 5
  fi

  # Check if port 5000 is actually in use
  if ! sudo lsof -i :5000 >/dev/null 2>&1; then
    log "WARNING: Nothing is listening on port 5000!"
    log "Checking service status again..."
    sudo systemctl status $SERVICE_NAME --no-pager >>"$DEPLOY_LOG"
  fi

  while [ $retries -lt $max_retries ]; do
    log "Health check attempt $((retries + 1))..."
    response=$(curl -sk "$HEALTH_CHECK_URL" -v 2>&1)
    curl_status=$?

    # Check for HTTP 200 status code in the response
    if [[ "$response" == *"HTTP/1.1 200"* ]] || [[ "$response" == *"HTTP/2 200"* ]]; then
      log "Health check passed! (HTTP 200 OK received)"
      return 0
    fi

    # Also check for the healthy status in JSON as a fallback
    if [[ "$response" == *"\"status\":\"healthy\""* ]] || [[ "$response" == *"\"status\":\"Healthy\""* ]]; then
      log "Health check passed! (healthy status found in response)"
      return 0
    fi

    # Log curl error codes for better diagnostics
    if [ $curl_status -ne 0 ]; then
      log "Curl failed with status $curl_status"
      case $curl_status in
      7) log "Failed to connect to host or proxy" ;;
      28) log "Operation timeout" ;;
      *) log "Curl error: $curl_status" ;;
      esac
    fi

    # Only show logs every 5 attempts to reduce noise
    if [ $((retries % 5)) -eq 0 ]; then
      log "Recent application logs:"
      sudo journalctl -u $SERVICE_NAME -n 20 --no-pager >>"$DEPLOY_LOG"
      log "Checking if service is still running..."
      sudo systemctl status $SERVICE_NAME --no-pager | head -n 3 >>"$DEPLOY_LOG"
    fi

    # Wait longer between retries as attempts increase
    sleep_time=$((1 + retries / 10))
    log "Waiting ${sleep_time} seconds before next attempt..."
    sleep $sleep_time
    retries=$((retries + 1))
  done

  log "Health check failed after $max_retries attempts"
  log "Final diagnostics:"
  log "Service status: $(systemctl is-active $SERVICE_NAME)"
  log "Port 5000 in use: $(if sudo lsof -i :5000 >/dev/null 2>&1; then echo 'Yes'; else echo 'No'; fi)"
  log "Last curl response: $response"
  return 1
}

# Function for rollback
rollback() {
  log "Rolling back deployment..."
  if [ -f "$BACKEND_BACKUP_PATH" ]; then
    log "Found backup at $BACKEND_BACKUP_PATH"
    log "Stopping service before rollback..."
    sudo systemctl stop $SERVICE_NAME
    sleep 3

    log "Clearing deployment directory..."
    rm -rf "$BACKEND_DEPLOY_DIR"/* || log "Warning: Failed to clear deployment directory"

    log "Extracting backup..."
    sudo tar -xzf "$BACKEND_BACKUP_PATH" -C "$BACKEND_DEPLOY_DIR" || handle_error "Failed to extract backup" "exit"

    log "Setting correct permissions..."
    sudo chown -R www-data:www-data "$BACKEND_DEPLOY_DIR"

    log "Restarting service after rollback..."
    sudo systemctl daemon-reload
    sudo systemctl start $SERVICE_NAME
    sleep 5

    if check_health; then
      log "Rollback successful"
    else
      log "WARNING: Rollback health check failed. Checking service status:"
      sudo systemctl status $SERVICE_NAME --no-pager >>"$DEPLOY_LOG"
      handle_error "Rollback failed - manual intervention required" "exit"
    fi
  else
    handle_error "No backup found for rollback at $BACKEND_BACKUP_PATH" "exit"
  fi
}

# Function to create systemd service file
create_service_file() {
  local service_file=$1
  local service_name=$2
  local working_dir=$3

  log "Creating systemd service file: $service_file"
  
  # API service uses .NET Core
  cat > "$service_file" << EOL
[Unit]
Description=IGS Pharma API Service
After=network.target

[Service]
WorkingDirectory=$working_dir
ExecStart=/usr/bin/dotnet IGSPharma.API.dll
User=www-data
Group=www-data
Restart=always
RestartSec=5
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=ASPNETCORE_URLS=http://localhost:5000

[Install]
WantedBy=multi-user.target
EOL

  if [ $? -ne 0 ]; then
    handle_error "Failed to create service file" "exit"
  fi

  # Set proper permissions
  sudo chown root:root "$service_file"
  sudo chmod 644 "$service_file"
}

# Ensure port 5000 is free
ensure_port_5000_free() {
  log "Ensuring port 5000 is free..."

  # First try to stop the service gracefully
  sudo systemctl stop $SERVICE_NAME
  sleep 2

  # Check if port is still in use
  PID=$(sudo lsof -t -i:5000)
  if [ -n "$PID" ]; then
    log "Port 5000 is still in use by process $PID, killing it..."
    sudo kill -9 $PID
    sleep 2

    # Verify port is free
    if sudo lsof -i :5000 >/dev/null 2>&1; then
      handle_error "Failed to free port 5000" "exit"
    fi
  fi

  log "Port 5000 is available"
}

# Create backup function
create_backup() {
  local source_dir=$1
  local backup_path=$2
  local backup_name=$3

  log "Creating $backup_name backup..."

  # Ensure backup directory exists with correct permissions
  sudo mkdir -p "$(dirname "$backup_path")" || true
  sudo chown -R root:root "$(dirname "$backup_path")" || true
  sudo chmod -R 755 "$(dirname "$backup_path")" || true

  # Verify source directory exists and has content
  if [ ! -d "$source_dir" ]; then
    log "Warning: Source directory $source_dir does not exist, creating it..."
    sudo mkdir -p "$source_dir"
    return 0
  fi

  if [ -z "$(ls -A $source_dir 2>/dev/null)" ]; then
    log "Warning: Source directory $source_dir is empty, skipping backup"
    return 0
  fi

  # Create backup
  log "Creating backup at $backup_path"
  if sudo tar -czf "$backup_path" -C "$source_dir" . >/dev/null 2>&1; then
    log "Backup created successfully"
    return 0
  else
    handle_error "Backup creation failed" "continue"
    return 1
  fi
}

# Clean old backups function
clean_old_backups() {
  local backup_dir=$1
  local keep_count=3

  log "Cleaning old backups in $backup_dir, keeping newest $keep_count"
  sudo mkdir -p "$backup_dir" || true

  # Count files
  file_count=$(ls -1 "$backup_dir"/*.tar.gz 2>/dev/null | wc -l)

  if [ "$file_count" -gt "$keep_count" ]; then
    log "Removing old backups..."
    ls -t "$backup_dir"/*.tar.gz | tail -n +$((keep_count + 1)) | xargs -r sudo rm
    log "Removed $(($file_count - $keep_count)) old backups"
  else
    log "No old backups to remove"
  fi
}

# Step 1: Check for updates in repository
update_repo "$REPO_DIR"

# *********************************************************************
# Frontend Deployment
# Check if frontend deployment (mode 1 or 3) is selected
if [[ " ${DEPLOY_MODE_ARRAY[*]} " =~ " 1 " ]] || [[ " ${DEPLOY_MODE_ARRAY[*]} " =~ " 3 " ]]; then
  log "Starting Frontend Deployment..."

  # Clean old backups
  clean_old_backups "$FRONTEND_BACKUP_DIR"

  # Create a backup of the current deployment
  create_backup "$FRONTEND_DEPLOY_DIR" "$FRONTEND_BACKUP_PATH" "frontend"

  # Navigate to frontend project
  cd "$FRONTEND_DIR" || handle_error "Frontend directory not found!" "exit"

  # Build the frontend
  log "Building frontend..."
  pnpm build || handle_error "Frontend build failed!" "exit"

  # Ensure Deployment Directory Exists
  log "Ensuring deployment directory exists..."
  sudo mkdir -p "$FRONTEND_DEPLOY_DIR" || true

  # Clear old files
  log "Cleaning old deployment files..."
  sudo rm -rf "$FRONTEND_DEPLOY_DIR"/* || true

  # Move new build files
  log "Deploying new build files..."
  if [ -d "build" ]; then
    sudo cp -r build/* "$FRONTEND_DEPLOY_DIR"/ || {
      log "Error: Moving files failed, rolling back..."
      sudo tar -xzf "$FRONTEND_BACKUP_PATH" -C "$FRONTEND_DEPLOY_DIR"
      handle_error "Frontend deployment failed" "exit"
    }
  else
    handle_error "Build directory 'build' not found" "exit"
  fi

  # Set correct permissions
  log "Setting correct file permissions..."
  sudo chown -R www-data:www-data "$FRONTEND_DEPLOY_DIR"
  sudo chmod -R 755 "$FRONTEND_DEPLOY_DIR"

  # Restart Nginx
  log "Restarting Nginx..."
  sudo systemctl restart nginx || handle_error "Failed to restart Nginx!" "exit"

  log "Frontend deployment completed successfully!"
fi

# *********************************************************************
# Backend Deployment
# Check if backend deployment (mode 2 or 3) is selected
if [[ " ${DEPLOY_MODE_ARRAY[*]} " =~ " 2 " ]] || [[ " ${DEPLOY_MODE_ARRAY[*]} " =~ " 3 " ]]; then
  log "Starting Backend Deployment..."

  # Ensure port 5000 is free
  ensure_port_5000_free

  # Clean old backups
  clean_old_backups "$BACKEND_BACKUP_DIR" || true

  # Create a backup of the current deployment
  create_backup "$BACKEND_DEPLOY_DIR" "$BACKEND_BACKUP_PATH" "backend"

  # Navigate to backend project
  cd "$BACKEND_DIR" || handle_error "Backend directory not found!" "exit"

  # Stop the service before deployment
  log "Stopping backend service..."
  sudo systemctl stop $SERVICE_NAME
  sleep 2

  # Ensure the publish directory exists
  log "Ensuring publish directory exists..."
  sudo mkdir -p "$BACKEND_DEPLOY_DIR" || true

  # Build and publish the backend
  log "Building and publishing backend..."
  dotnet publish --configuration Release --output "$BACKEND_DEPLOY_DIR" --verbosity normal || {
    log "Publish failed, rolling back..."
    rollback
    handle_error "Backend publish failed" "exit"
  }
  log "Backend published successfully to $BACKEND_DEPLOY_DIR"

  # Set correct permissions
  log "Setting correct permissions..."
  sudo chown -R www-data:www-data "$BACKEND_DEPLOY_DIR" || true
  sudo chmod -R 755 "$BACKEND_DEPLOY_DIR"
  log "Backend permissions set successfully"

  # Update systemd service
  log "Updating systemd service..."
  create_service_file "$SERVICE_FILE" "$SERVICE_NAME" "$BACKEND_DEPLOY_DIR"

  # Reload systemd
  log "Reloading systemd daemon..."
  sudo systemctl daemon-reload || true
  log "Systemd daemon reloaded successfully"

  # Restart backend service
  log "Restarting backend service..."
  sudo systemctl restart "$SERVICE_NAME" || handle_error "Failed to restart backend service!" "exit"
  log "Backend service restarted successfully"

  # Enable service to start at boot
  log "Enabling service to start at boot..."
  sudo systemctl enable "$SERVICE_NAME" || handle_error "Failed to enable backend service!" "continue"
  log "Backend service enabled successfully"

  # Check health
  if check_health; then
    log "Backend deployment completed successfully!"
  else
    log "Backend service is not responding to health checks, rolling back..."
    rollback
    handle_error "Backend deployment failed" "exit"
  fi
fi

# **Deployment Complete**
log "Deployment completed successfully!"
echo
echo "  IGS Pharma Deployment completed successfully!  "
echo "  Log file: $DEPLOY_LOG  "
echo
