#!/bin/bash

echo "🧹 Cleaning Next.js build cache..."
rm -rf .next
echo "✅ Cache cleared!"
echo ""
echo "🚀 Starting development server..."
echo "   The app will rebuild from scratch."
echo "   Go to http://localhost:3000/register when ready!"
echo ""
npm run dev
