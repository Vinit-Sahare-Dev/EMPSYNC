#!/bin/bash

# EMPSYNC Full Stack Docker Setup Script
# This script automates the entire Docker setup process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    fi
    print_success "Docker is installed"
}

# Check if Docker Compose is installed
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
}

# Check if Docker daemon is running
check_docker_running() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker daemon is not running. Please start Docker Desktop."
        exit 1
    fi
    print_success "Docker daemon is running"
}

# Prompt for Docker Hub username
get_docker_username() {
    read -p "Enter your Docker Hub username: " DOCKER_USERNAME
    if [ -z "$DOCKER_USERNAME" ]; then
        print_error "Docker Hub username cannot be empty"
        exit 1
    fi
    print_success "Docker Hub username set to: $DOCKER_USERNAME"
}

# Create project structure
create_project_structure() {
    print_header "Creating Project Structure"
    
    mkdir -p nginx/ssl
    mkdir -p empsync-backend/logs
    
    print_success "Project structure created"
}

# Create backend Dockerfile
create_backend_dockerfile() {
    print_header "Creating Backend Dockerfile"
    
    if [ ! -f "empsync-backend/Dockerfile" ]; then
        cat > empsync-backend/Dockerfile << 'EOF'
# Stage 1: Build Stage
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN mkdir -p /app/logs
EXPOSE 8888
ENV SPRING_PROFILES_ACTIVE=docker
ENV JAVA_OPTS="-Xmx512m -Xms256m"
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:8888/actuator/health || exit 1
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
EOF
        print_success "Backend Dockerfile created"
    else
        print_warning "Backend Dockerfile already exists, skipping"
    fi
}

# Create frontend Dockerfile
create_frontend_dockerfile() {
    print_header "Creating Frontend Dockerfile"
    
    if [ ! -f "empsync-frontend/Dockerfile" ]; then
        cat > empsync-frontend/Dockerfile << 'EOF'
# Stage 1: Build Stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ARG REACT_APP_API_URL=http://localhost:8888/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

# Stage 2: Production Stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:80 || exit 1
CMD ["nginx", "-g", "daemon off;"]
EOF
        print_success "Frontend Dockerfile created"
    else
        print_warning "Frontend Dockerfile already exists, skipping"
    fi
}

# Create docker-compose.yml
create_docker_compose() {
    print_header "Creating docker-compose.yml"
    
    cat > docker-compose.yml << EOF
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: empsync-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: Vinit@51
      MYSQL_DATABASE: employee_management_system
      MYSQL_USER: empsync_user
      MYSQL_PASSWORD: empsync_pass
    ports:
      - "3307:3306"
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - empsync-network
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-u", "root", "-pVinit@51"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 30s

  backend:
    build:
      context: ./empsync-backend
      dockerfile: Dockerfile
    image: ${DOCKER_USERNAME}/empsync-backend:latest
    container_name: empsync-backend
    restart: unless-stopped
    ports:
      - "8888:8888"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/employee_management_system
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: Vinit@51
      SPRING_JPA_HIBERNATE_DDL_AUTO: update
      SPRING_PROFILES_ACTIVE: docker
      JAVA_OPTS: -Xmx512m -Xms256m
    depends_on:
      mysql:
        condition: service_healthy
    networks:
      - empsync-network
    volumes:
      - ./empsync-backend/logs:/app/logs
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:8888/actuator/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

  frontend:
    build:
      context: ./empsync-frontend
      dockerfile: Dockerfile
      args:
        REACT_APP_API_URL: http://localhost:8888/api
    image: ${DOCKER_USERNAME}/empsync-frontend:latest
    container_name: empsync-frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - empsync-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s

volumes:
  mysql_data:
    driver: local

networks:
  empsync-network:
    driver: bridge
EOF
    
    print_success "docker-compose.yml created"
}

# Build images
build_images() {
    print_header "Building Docker Images"
    
    print_info "Building backend image..."
    docker-compose build backend
    print_success "Backend image built"
    
    if [ -d "empsync-frontend" ]; then
        print_info "Building frontend image..."
        docker-compose build frontend
        print_success "Frontend image built"
    else
        print_warning "Frontend directory not found, skipping frontend build"
    fi
}

# Push to Docker Hub
push_to_dockerhub() {
    print_header "Pushing Images to Docker Hub"
    
    read -p "Do you want to push images to Docker Hub? (y/n): " push_choice
    
    if [ "$push_choice" = "y" ] || [ "$push_choice" = "Y" ]; then
        print_info "Logging into Docker Hub..."
        docker login
        
        print_info "Pushing images..."
        docker-compose push
        print_success "Images pushed to Docker Hub"
        
        print_info "Your images are available at:"
        echo "  - https://hub.docker.com/r/$DOCKER_USERNAME/empsync-backend"
        echo "  - https://hub.docker.com/r/$DOCKER_USERNAME/empsync-frontend"
    else
        print_warning "Skipping Docker Hub push"
    fi
}

# Start services
start_services() {
    print_header "Starting Services"
    
    print_info "Starting all services..."
    docker-compose up -d
    
    print_info "Waiting for services to be healthy (this may take 30-60 seconds)..."
    sleep 30
    
    print_success "Services started"
}

# Check services status
check_services() {
    print_header "Checking Services Status"
    
    docker-compose ps
    
    echo ""
    print_info "Access your application at:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:8888/api"
    echo "  - Swagger UI: http://localhost:8888/swagger-ui.html"
    echo "  - Health Check: http://localhost:8888/actuator/health"
}

# Show logs
show_logs() {
    print_header "Service Logs"
    
    read -p "Do you want to view service logs? (y/n): " logs_choice
    
    if [ "$logs_choice" = "y" ] || [ "$logs_choice" = "Y" ]; then
        print_info "Showing logs (Press Ctrl+C to exit)..."
        docker-compose logs -f
    fi
}

# Main menu
main_menu() {
    clear
    print_header "EMPSYNC Docker Setup Menu"
    echo ""
    echo "1. Complete Setup (Recommended)"
    echo "2. Build Images Only"
    echo "3. Start Services"
    echo "4. Stop Services"
    echo "5. View Logs"
    echo "6. Check Status"
    echo "7. Clean Up (Remove All)"
    echo "8. Push to Docker Hub"
    echo "9. Exit"
    echo ""
    read -p "Enter your choice: " choice
    
    case $choice in
        1)
            complete_setup
            ;;
        2)
            build_images
            ;;
        3)
            start_services
            check_services
            ;;
        4)
            print_header "Stopping Services"
            docker-compose stop
            print_success "Services stopped"
            ;;
        5)
            docker-compose logs -f
            ;;
        6)
            check_services
            ;;
        7)
            print_header "Cleaning Up"
            read -p "This will remove all containers and volumes. Are you sure? (y/n): " confirm
            if [ "$confirm" = "y" ]; then
                docker-compose down -v
                print_success "Cleanup complete"
            fi
            ;;
        8)
            push_to_dockerhub
            ;;
        9)
            exit 0
            ;;
        *)
            print_error "Invalid choice"
            ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    main_menu
}

# Complete setup
complete_setup() {
    print_header "EMPSYNC Full Stack Docker Setup"
    echo ""
    
    # Check prerequisites
    check_docker
    check_docker_compose
    check_docker_running
    
    # Get Docker Hub username
    get_docker_username
    export DOCKER_USERNAME
    
    # Create project structure
    create_project_structure
    
    # Create Dockerfiles
    create_backend_dockerfile
    create_frontend_dockerfile
    
    # Create docker-compose.yml
    create_docker_compose
    
    # Build images
    build_images
    
    # Optional: Push to Docker Hub
    push_to_dockerhub
    
    # Start services
    start_services
    
    # Check status
    check_services
    
    # Show logs
    show_logs
    
    print_header "Setup Complete!"
    print_success "Your full stack application is now running!"
    echo ""
    print_info "Next steps:"
    echo "  1. Open http://localhost:3000 in your browser"
    echo "  2. Test the API at http://localhost:8888/api/employees"
    echo "  3. View logs with: docker-compose logs -f"
    echo "  4. Stop with: docker-compose stop"
    echo ""
}

# Run main menu
main_menu