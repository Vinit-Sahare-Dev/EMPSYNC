# Employee Management System 🏢

A comprehensive full-stack Employee Management System built with modern technologies. Features a React + Vite frontend with a robust Spring Boot backend, connected to a MySQL database for efficient employee data management.

![Java](https://img.shields.io/badge/Java-17-orange?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql)
![Vite](https://img.shields.io/badge/Vite-4.0-purple?style=for-the-badge&logo=vite)
![Maven](https://img.shields.io/badge/Maven-3.6+-red?style=for-the-badge&logo=apache-maven)

## 🌟 Featured Capabilities

### 🎯 Core Functionality
- **Complete Employee Lifecycle Management** - From onboarding to offboarding
- **Real-time Data Synchronization** - Between frontend and backend
- **Advanced Search & Filtering** - Multi-criteria employee search
- **Bulk Operations** - Manage multiple employees simultaneously
- **Responsive Design** - Works seamlessly on desktop and mobile devices

### 💼 Business Features
- **Automated Payroll Calculations** - Bonus, PF, and tax computations
- **Department-wise Analytics** - Employee distribution and salary insights
- **Employment Status Tracking** - Active, Inactive, On Leave statuses
- **Comprehensive Reporting** - Export-ready employee data

## 🏗️ System Architecture

```mermaid
graph TB
    A[React Frontend] --> B[Spring Boot REST API]
    B --> C[MySQL Database]
    B --> D[JPA/Hibernate]
    C --> E[Employee Data]
    
    A --> F[LocalStorage Fallback]
    
    subgraph "Frontend Layer"
        A
        F
    end
    
    subgraph "Backend Layer"
        B
        D
    end
    
    subgraph "Data Layer"
        C
        E
    end
