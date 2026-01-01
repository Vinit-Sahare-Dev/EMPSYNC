# EMPSYNC - Production Deployment Guide

## 1. Environment Variables

### Frontend (.env)
Create a `.env` file in the `empsync-frontend` directory for production:

```env
# URL of the backend API
VITE_API_BASE_URL=https://your-production-domain.com/api
```

### Backend (System Environment Variables)
For the backend, set the following environment variables on your server or container:

- `DATABASE_URL`: JDBC URL for your production database
  - Example: `jdbc:mysql://prod-db:3306/empsync?useSSL=true`
- `DATABASE_USERNAME`: Database username
- `DATABASE_PASSWORD`: Database password
- `FRONTEND_URL`: URL of the deployed frontend (for CORS and email links)
  - Example: `https://your-frontend-domain.com`

## 2. Build & Run

### Frontend
1. Navigate to `empsync-frontend`.
2. Run `npm install`.
3. Run `npm run build` to generate the production build in `dist/`.
4. Serve the `dist/` folder using a static file server (e.g., Nginx, Apache, or serve).

### Backend
1. Navigate to `empsync-backend`.
2. Run `mvn clean package -DskipTests` to build the JAR file.
3. Run the JAR:
   ```bash
   java -jar target/empsync-0.0.1-SNAPSHOT.jar
   ```

## 3. Database
Ensure your production MySQL database is running and the database `employee_management_system` (or your configured name) exists. The application will automatically update the schema on startup.
