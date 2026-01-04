# EMPSYNC - Employee Management System

A comprehensive workforce management solution built with modern web technologies.

## 🚀 Features

### Core Modules
- **Employee Management**: Complete CRUD operations with advanced filtering and search
- **Attendance Tracking**: Real-time check-in/check-out with automated calculations
- **Performance Monitoring**: Multi-criteria evaluation system with analytics
- **Analytics Dashboard**: Comprehensive insights and reporting

### Technical Stack

### Frontend
- **React 18**: Modern UI framework with hooks
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **Axios**: HTTP client for API communication

### Backend
- **Spring Boot 3.5.6**: Java-based REST API
- **PostgreSQL**: Robust relational database
- **Spring Security**: Authentication and authorization
- **Spring Data JPA**: Database ORM
- **Springdoc OpenAPI**: Interactive API documentation

## 🎨 UI/UX Features
- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern Glassmorphism**: Contemporary design with blur effects
- **Dark Theme**: Professional dark color scheme
- **Smooth Animations**: Engaging micro-interactions
- **Accessibility**: WCAG 2.1 compliant

## 📊 Analytics & Reporting
- **Real-time Metrics**: Live dashboard updates
- **Performance Analytics**: Employee performance tracking
- **Attendance Statistics**: Comprehensive attendance reports
- **Department Analytics**: Team distribution insights
- **Salary Analytics**: Budget and compensation tracking

## 🔒 Security Features
- **Role-based Access**: Admin and employee roles
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Sanitized user inputs
- **CORS Configuration**: Secure cross-origin requests

## 🚀 Production Ready

### Build Configuration
- **Optimized Build**: Tree-shaking and code splitting
- **Asset Optimization**: Image and resource optimization
- **Bundle Analysis**: Performance monitoring
- **Source Maps**: Debug-friendly builds
- **Type Checking**: Strict TypeScript configuration

### Deployment Options
- **Static Hosting**: Compatible with any static hosting service
- **Docker Support**: Containerized deployment
- **Environment Variables**: Secure configuration management
- **Health Checks**: Application monitoring endpoints

## 📱 Responsive Design
- **Desktop**: Full-featured experience (1200px+)
- **Tablet**: Optimized tablet experience (768px-1200px)
- **Mobile**: Mobile-first responsive design (<768px)
- **Touch Support**: Optimized for touch interactions

## 🛠 Development Workflow

### Prerequisites
- Node.js 16+ 
- npm 8+
- PostgreSQL 12+

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run type checking
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Environment Setup
1. Copy `.env.production` to `.env`
2. Ensure PostgreSQL is running on port 5432
3. Update API base URL in environment variables
4. Run database migrations: `psql -d empsync -f setup-*.sql`

### Production Deployment
1. Build the application: `npm run build`
2. Deploy `dist` folder to your hosting service
3. Configure environment variables
4. Ensure API endpoint is accessible
5. Set up reverse proxy if needed

## 📚 API Documentation
- **Interactive Docs**: Available at `/api/docs` when running
- **OpenAPI Spec**: Complete API specification
- **Postman Collection**: Import ready API collection

---

## 🏗 Project Structure

```
empsync-frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── employees/
│   │   ├── departments/
│   │   ├── attendance/
│   │   ├── performance/
│   │   └── profile/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   └── assets/
├── package.json
├── vite.config.js
├── tsconfig.json
├── .eslintrc.json
└── README.md
```

---

**Version**: 1.0.0  
**License**: MIT  
**Author**: EMPSYNC Team
