#!/bin/bash

echo "🔄 Relief-Zone: Full Reset Script"
echo "=================================="
echo ""

echo "⏳ This will:"
echo "  1. Delete .next build cache"
echo "  2. Delete node_modules"
echo "  3. Delete package lock files"
echo "  4. Reinstall clean dependencies"
echo "  5. Run setup to create database"
echo ""

read -p "Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

echo ""
echo "🗑️  Cleaning build artifacts..."
rm -rf .next
echo "✓ Deleted .next"

echo ""
echo "🗑️  Cleaning node_modules..."
rm -rf node_modules
echo "✓ Deleted node_modules"

echo ""
echo "🗑️  Cleaning lock files..."
rm -f pnpm-lock.yaml package-lock.json yarn.lock
echo "✓ Deleted lock files"

echo ""
echo "📦 Installing fresh dependencies..."
if command -v pnpm &> /dev/null; then
    pnpm install
    PACKAGE_MANAGER="pnpm"
elif command -v npm &> /dev/null; then
    npm install
    PACKAGE_MANAGER="npm"
else
    echo "❌ Neither npm nor pnpm found!"
    exit 1
fi
echo "✓ Dependencies installed"

echo ""
echo "🗄️  Setting up database..."
$PACKAGE_MANAGER run setup

echo ""
echo "✅ Reset complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Clear browser cache (F12 → right-click reload → Empty cache and hard reload)"
echo "  2. Start dev server: npm run dev"
echo "  3. Go to http://localhost:3000/register to create an account"
echo ""
