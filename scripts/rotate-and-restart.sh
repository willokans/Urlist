#!/bin/zsh

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Change to project directory
cd "$PROJECT_DIR"

echo "Starting JWT secret rotation..."

# Run the rotation script
npm run rotate-jwt

# Check if rotation was successful
if [ $? -eq 0 ]; then
    echo "Restarting application..."
    
    # Find the application process and stop it
    pkill -f "node.*astro"
    
    # Start the application in the background
    npm run dev > logs/app.log 2>&1 &
    
    echo "Application restarted successfully!"
else
    echo "Error: JWT rotation failed. Check logs/jwt-rotation.log for details."
    exit 1
fi
