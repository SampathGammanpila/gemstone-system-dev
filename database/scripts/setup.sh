#!/bin/bash

# Script to set up the database and run migrations
# Usage: ./setup.sh [environment]
# Example: ./setup.sh development

# Set default environment to development
ENV=${1:-development}
echo "Setting up database for $ENV environment"

# Load environment variables
if [ "$ENV" = "production" ]; then
  ENV_FILE="../../packages/backend/.env.production"
else
  ENV_FILE="../../packages/backend/.env.development"
fi

# Extract database credentials from .env file
if [ -f "$ENV_FILE" ]; then
  source <(grep -E '^DB_' "$ENV_FILE" | sed 's/^/export /')
else
  echo "Error: Environment file not found: $ENV_FILE"
  exit 1
fi

# Set default values if not defined in .env
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-gemstone_system_dev}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}

# Export for psql
export PGPASSWORD="$DB_PASSWORD"

# Check if PostgreSQL is running
if ! pg_isready -h $DB_HOST -p $DB_PORT > /dev/null 2>&1; then
  echo "Error: PostgreSQL is not running on $DB_HOST:$DB_PORT"
  exit 1
fi

# Check if database exists
DB_EXISTS=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -t -c "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | xargs)

# Create database if it doesn't exist
if [ "$DB_EXISTS" != "1" ]; then
  echo "Creating database $DB_NAME..."
  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -c "CREATE DATABASE $DB_NAME"
  if [ $? -ne 0 ]; then
    echo "Error: Failed to create database $DB_NAME"
    exit 1
  fi
  echo "Database $DB_NAME created successfully"
else
  echo "Database $DB_NAME already exists"
fi

# Get migrations directory
MIGRATIONS_DIR="$(dirname "$0")/../migrations"

# Check if migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "Error: Migrations directory not found: $MIGRATIONS_DIR"
  exit 1
fi

# Run migrations in order
echo "Running migrations..."
for migration in $(ls -v "$MIGRATIONS_DIR"/*.sql); do
  MIGRATION_NAME=$(basename "$migration")
  echo "Applying migration: $MIGRATION_NAME"
  
  # Check if migration has already been applied
  APPLIED=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM schema_migrations WHERE version='${MIGRATION_NAME%.*}'" 2>/dev/null | xargs)
  
  # If schema_migrations table doesn't exist yet, consider no migrations have been applied
  if [ $? -ne 0 ]; then
    APPLIED=0
  fi
  
  if [ "$APPLIED" = "1" ]; then
    echo "Migration $MIGRATION_NAME already applied, skipping"
  else
    # Apply migration
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$migration"
    
    if [ $? -ne 0 ]; then
      echo "Error: Failed to apply migration $MIGRATION_NAME"
      exit 1
    fi
    
    echo "Migration $MIGRATION_NAME applied successfully"
  fi
done

echo "Database setup completed successfully"

# Create upload directories if they don't exist
UPLOADS_DIR="../../packages/backend/public/uploads"
mkdir -p "$UPLOADS_DIR/gemstones"
mkdir -p "$UPLOADS_DIR/rough-stones"
mkdir -p "$UPLOADS_DIR/jewelry"
mkdir -p "$UPLOADS_DIR/documents"
mkdir -p "$UPLOADS_DIR/users"
mkdir -p "$UPLOADS_DIR/temp"

echo "Created upload directories"
echo "Setup completed successfully!"