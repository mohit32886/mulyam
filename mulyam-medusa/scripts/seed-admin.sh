#!/bin/bash
echo "Creating admin user..."
cd "$(dirname "$0")/.." && npx medusa user -e admin@mulyamjewels.com -p admin123
echo "Admin user created! Login at http://localhost:9000/app"
