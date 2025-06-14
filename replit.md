# replit.md

## Overview

SKU Insights is a comprehensive Consumer Packaged Goods (CPG) product launch management platform built for brand managers, regional insights teams, and global marketing teams. The system provides real-time behavioral analytics, survey management, brand health monitoring, and insights timeline tracking to support successful product launches.

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

## Recent Changes

- June 14, 2025: Advanced UX Improvements Implementation
  - Added guided onboarding flow with welcome banner for first-time users
  - Implemented contextual tooltips explaining key concepts throughout platform
  - Created simplified header with secondary menu for advanced controls (Export, Filters)
  - Enhanced smart prioritization with color coding and urgent metric highlighting
  - Improved information architecture with progressive disclosure and clear section headers
  - Added WelcomeBanner component with step-by-step product setup guidance
  - Created SimplifiedHeader component with time range selector and dropdown menu for advanced functions
  - Integrated TooltipHelp component for contextual assistance across dashboard elements
  - Reorganized SKU Upload center from dashboard to SKU Management page for better workflow alignment
  - Implemented consistent left navigation sidebar across all pages with collapsible functionality
  - Enhanced responsive design for optimal viewing on laptop, tablet, and mobile screen sizes
  - Completed Step 4 "Trigger Feedback & Optimization" page with smart triggers, automated surveys, sentiment analysis, and product adjustment tracking
- June 14, 2025: Complete Workflow-First Architecture Implementation
  - Restructured platform from feature-based to sequential workflow-based navigation (Pre-Launch → Launch → Post-Launch → Executive)
  - Implemented sticky workflow header with progress tracking across all 4 phases
  - Created smart automation engine with one-click approval for trigger-based micro surveys
  - Added automated alerts and notifications with rule engine for performance thresholds
  - Built executive summary layer with cross-phase performance tracking, decision history, and AI recommendations engine
  - Pre-launch validation now redirects to external platform (https://survfast.xyz/)
  - Launch execution includes real-time SKU monitoring with platform integrations (Amazon, Walmart, Carrefour)
  - Post-launch optimization features feedback-driven improvements with micro surveys and sentiment analysis
  - Executive dashboard provides comprehensive lifecycle overview with actionable insights
- June 14, 2025: Connected User Flows and Role-Based Navigation Implementation
  - Implemented role-based navigation that adapts to user types (Brand Manager, Regional Insights Lead, Global Marketing Operations)
  - Added connected user flows linking problem identification to specific actions
  - Enhanced metric cards with quick action buttons that trigger relevant workflows
  - Timeline events now include actionable next steps connecting each event to relevant tools
  - Survey Builder includes contextual banners explaining connection to performance issues
  - Fixed authentication type compatibility issues across components
  - Created seamless paths from "seeing a problem" to "taking action" throughout the platform
- June 14, 2025: Dashboard UX improvements and content hierarchy fixes
  - Removed dual dashboard views (Workflow vs Analytics) to eliminate decision paralysis
  - Created single focused dashboard with primary action section and collapsible filters
  - Added clear filter explanation and always-visible reset button
  - Enhanced navigation with visual distinctions: "📊 Analytics & Monitoring" vs "⚙️ Management & Actions"
  - Added performance indicators to metric cards (excellent/good/average/poor) with color coding
  - Implemented contextual guidance with benchmarks and actionable hints for each metric
  - Grouped navigation into logical sections: Overview, Analytics, Management, Settings
  - Moved "Insights Timeline" to Overview section for better information hierarchy
  - Combined analytics features (Behavioral Intelligence + Brand Health) under Analytics
  - Consolidated management features (SKU Management + Survey Builder + User Management)
  - Simplified Settings to focus on Account Settings only
  - Updated filter system from "Market" to "Retailer" with multi-select functionality
  - Added explanatory tooltips for Brand Lift Score, Purchase Intent, and Net Sentiment metrics
- January 14, 2025: Complete landing page redesign with new marketing sections
  - Hero: "Launch Winning CPG Products with Confidence"
  - Problem section highlighting 80% SKU failure rate
  - Three Intelligence Engines: Marketplace Intelligence, Consumer Sentiment Engine, SKU Pulse
  - Market stats section positioning as "Bloomberg for CPG"
  - Audience targeting tiles for Brand, Insights, and Commercial teams
  - Enhanced testimonials and CTA footer with multiple action buttons
- January 14, 2025: Company rebranding from "SKU Pulse" to "SKU Insights" across all pages
- January 14, 2025: Updated all CTA buttons to redirect to LinkedIn profile
- January 14, 2025: Fixed navigation flows and DOM nesting issues

## Changelog

Changelog:
- June 14, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.