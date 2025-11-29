#!/bin/bash

# Munificent School - Development Server Startup Script

echo "========================================="
echo "  Munificent School Development Setup"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get current IP
CURRENT_IP=$(ip addr show | grep "inet " | grep -v "127.0.0.1" | head -n 1 | awk '{print $2}' | cut -d'/' -f1)

echo -e "${BLUE}📡 Detected IP Address: ${GREEN}$CURRENT_IP${NC}"
echo ""

# Start backend
echo -e "${YELLOW}🚀 Starting Django Backend...${NC}"
cd backend
python3 manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://127.0.0.1:8000/api/token/ > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Backend running at http://$CURRENT_IP:8000${NC}"
else
    echo -e "${YELLOW}⚠ Backend may not be fully started yet${NC}"
fi

echo ""
echo -e "${YELLOW}🎨 Starting React Frontend...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
sleep 3

echo ""
echo "========================================="
echo -e "${GREEN}✓ Development servers started!${NC}"
echo "========================================="
echo ""
echo -e "${BLUE}Backend:${NC}  http://$CURRENT_IP:8000"
echo -e "${BLUE}Frontend:${NC} http://localhost:5173"
echo -e "${BLUE}Admin:${NC}    http://$CURRENT_IP:8000/admin"
echo ""
echo -e "${YELLOW}Test Credentials:${NC}"
echo "  Admin:    admin@school.kz / admin123"
echo "  Teacher:  aigerim@school.kz / teacher123"
echo "  Student:  student1@school.kz / student123"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user interrupt
wait
