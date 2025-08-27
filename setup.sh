#!/bin/bash

echo "🚀 Setting up Ecommerce Admin Panel..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if backend is running
echo "⚠️  Make sure the backend API is running on http://localhost:5000"
echo "   See ECommerce-Backend project for backend setup"

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🎉 Admin Panel setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Make sure the backend API is running: npm run dev (in ECommerce-Backend)"
echo "2. Start the admin panel: npm start"
echo "3. Access the admin panel at: http://localhost:3000"
echo "4. Login with: admin@example.com / admin123"
echo ""
echo "🔒 Remember to change the default admin credentials in production!"
echo ""
echo "💡 The admin panel connects to the backend API at http://localhost:5000"
