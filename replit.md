# replit.md

## Overview

SKU Pulse is a comprehensive Consumer Packaged Goods (CPG) product launch management platform built for brand managers, regional insights teams, and global marketing teams. The system provides real-time behavioral analytics, survey management, brand health monitoring, and insights timeline tracking to support successful product launches.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Build Tool**: Vite for development and production builds
- **Theme**: Light/dark mode support via next-themes

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js 20
- **Development**: tsx for TypeScript execution
- **Production**: esbuild for bundling

### Database Architecture
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Connection**: @neondatabase/serverless for database connectivity
- **Schema**: Shared schema definition across client and server

## Key Components

### Authentication System
- Demo-based authentication with predefined user roles
- Role-based access control (Brand Manager, Regional Insights, Global Marketing)
- Protected routes with guest access fallback
- Session management using React Context

### Data Models
- **Users**: Authentication and role management
- **SKUs**: Product management with regional/market segmentation
- **Behavioral Metrics**: Real-time product performance tracking
- **Surveys**: Dynamic survey creation and management
- **Brand Health Metrics**: Brand performance monitoring
- **Timeline Events**: Chronological insights tracking
- **Anomaly Detection**: Automated performance threshold monitoring

### UI Components
- Comprehensive design system based on Radix UI primitives
- Responsive layouts with mobile-first design
- Data visualization using Recharts
- Form handling with react-hook-form and Zod validation
- Toast notifications and modal dialogs

## Data Flow

1. **Frontend Requests**: React components use TanStack Query for API calls
2. **API Layer**: Express.js routes handle business logic and data validation
3. **Database Layer**: Drizzle ORM manages PostgreSQL interactions
4. **Real-time Updates**: Query invalidation ensures fresh data
5. **State Management**: Client-side caching with automatic background updates

## External Dependencies

### Frontend Dependencies
- **UI Components**: Radix UI ecosystem for accessible components
- **Data Fetching**: TanStack Query for server state management
- **Forms**: react-hook-form with Zod validation
- **Styling**: Tailwind CSS with class-variance-authority
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date manipulation

### Backend Dependencies
- **Database**: Drizzle ORM with PostgreSQL driver
- **Validation**: Zod schemas for type-safe validation
- **Session Management**: connect-pg-simple for PostgreSQL sessions

## Deployment Strategy

### Development Environment
- **Platform**: Replit with automatic environment setup
- **Database**: PostgreSQL 16 with automatic provisioning
- **Hot Reload**: Vite HMR for frontend, tsx watch mode for backend
- **Port Configuration**: Backend on 5000, frontend proxy through Vite

### Production Build
- **Frontend**: Vite build with output to dist/public
- **Backend**: esbuild bundle to dist/index.js
- **Static Assets**: Served through Express static middleware
- **Environment**: Production mode with optimized builds

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Deployment**: Autoscale deployment target
- **Workflows**: Parallel execution of package installation and server startup

## Changelog

Changelog:
- June 14, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.