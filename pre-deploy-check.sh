#!/bin/bash

echo "🔍 Pre-Deployment Checklist for Render + Vercel"
echo "================================================"
echo ""

# Check if git repository is initialized
if [ -d .git ]; then
    echo "✅ Git repository initialized"
else
    echo "❌ Git repository not initialized"
    echo "   Run: git init && git add . && git commit -m 'Initial commit'"
fi

# Check if code is pushed to GitHub
if git remote -v | grep -q "github.com"; then
    echo "✅ GitHub remote configured"
else
    echo "⚠️  GitHub remote not configured"
    echo "   Run: git remote add origin <your-github-repo-url>"
fi

# Check if backend builds successfully
echo ""
echo "🔨 Testing backend build..."
cd backend
if mvn clean package -DskipTests > /dev/null 2>&1; then
    echo "✅ Backend builds successfully"
else
    echo "❌ Backend build failed - fix errors before deploying"
fi
cd ..

# Check if frontend builds successfully
echo ""
echo "🔨 Testing frontend build..."
cd frontend
if npm install > /dev/null 2>&1 && npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
else
    echo "❌ Frontend build failed - fix errors before deploying"
fi
cd ..

# Check environment files
echo ""
echo "📋 Environment files:"
if [ -f "backend/.env.example" ]; then
    echo "✅ backend/.env.example exists"
else
    echo "❌ backend/.env.example missing"
fi

if [ -f "frontend/.env.example" ]; then
    echo "✅ frontend/.env.example exists"
else
    echo "❌ frontend/.env.example missing"
fi

echo ""
echo "📚 Next Steps:"
echo "1. Ensure code is pushed to GitHub"
echo "2. Follow RENDER_DEPLOYMENT.md for detailed instructions"
echo "3. Deploy database on Render first"
echo "4. Deploy backend on Render second"
echo "5. Deploy frontend on Vercel last"
echo ""
echo "Happy deploying! 🚀"
