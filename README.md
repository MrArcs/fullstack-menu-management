# Menu Management System

A production-ready hierarchical menu management system built with NestJS, Prisma, PostgreSQL, Next.js, Docker, and Caddy reverse proxy with enterprise-grade security and performance features.

## Features

### Core Functionality

- **Hierarchical Menu Management**: Create and manage nested menu structures with unlimited depth
- **Draft/Publish Workflow**: Save drafts and publish menus with version control
- **Type-Safe Backend**: NestJS with Prisma ORM and PostgreSQL
- **Modern Frontend**: Next.js 15 with App Router, TailwindCSS, and shadcn/ui
- **Responsive Design**: Mobile-first, accessible UI with Redux state management

### Infrastructure & Security

- **Monorepo Architecture**: Organized workspace with shared dependencies and scripts
- **Containerized Deployment**: Multi-service Docker Compose setup with health checks
- **SSL/TLS Termination**: Automatic HTTPS with Let's Encrypt certificates via Caddy
- **Security Headers**: Comprehensive security headers (HSTS, CSP, XSS protection, etc.)
- **Rate Limiting**: API protection with configurable rate limits and burst protection
- **CORS Configuration**: Proper cross-origin resource sharing for production domains
- **Database Security**: Isolated database with connection pooling and health monitoring

### Performance & Monitoring

- **Reverse Proxy**: Caddy with gzip compression and health monitoring
- **Service Health Checks**: Automated health monitoring for all services
- **Structured Logging**: JSON-formatted logs with service-specific output
- **Database Optimization**: PostgreSQL with proper indexing and connection management
- **Static Asset Optimization**: Next.js production builds with optimized assets

### Development Experience

- **Hot Reload**: Development environment with live code reloading
- **Environment Management**: Separate development and production configurations
- **Database Migrations**: Automated schema management with Prisma
- **TypeScript**: Full type safety across frontend and backend
- **Linting & Formatting**: ESLint configuration for code quality

## Architecture

### Monorepo Structure

```
menu-management/
├── nst-backend/           # NestJS backend service
├── nxt-frontend/          # Next.js frontend service
├── caddy/                 # Caddy reverse proxy configuration
├── docker-compose.yml     # Production deployment
├── docker-compose.dev.yml # Development environment
└── package.json          # Workspace management
```

### Backend (NestJS)

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL 16 with Prisma ORM
- **API**: RESTful endpoints with validation and CORS
- **Features**: CRUD operations, tree building, reordering, health checks
- **Security**: Input validation, CORS configuration, rate limiting

### Frontend (Next.js)

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with shadcn/ui components
- **State**: Redux Toolkit for state management
- **Features**: Responsive design, accessibility, static optimization
- **Build**: Production-optimized static assets

### Infrastructure (Caddy + Docker)

- **Reverse Proxy**: Caddy with automatic SSL/TLS termination
- **Security**: Rate limiting, security headers, HTTPS enforcement
- **Monitoring**: Health checks, structured logging, service discovery
- **Performance**: Gzip compression, connection pooling, load balancing

### Database (PostgreSQL)

- **Engine**: PostgreSQL 16 with Alpine Linux
- **ORM**: Prisma with type-safe database access
- **Features**: Migrations, connection pooling, health monitoring
- **Security**: Isolated network, encrypted connections, backup strategy

### Deployment

- **Containerization**: Multi-service Docker Compose with health checks
- **SSL/TLS**: Automatic certificate management with Let's Encrypt
- **Platform**: DigitalOcean, AWS, or any Docker-compatible platform

## Quick Start

### Development (Local)

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment**:

   ```bash
   cp .env.example .env
   ```

3. **Start development servers**:

   ```bash
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api/v1

### Development (Docker)

1. **Start development environment with Docker Compose**:

   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

2. **Access the application**:
   - Frontend: http://localhost
   - Backend API: http://api.localhost
   - Database: localhost:5432

### Production Deployment

1. **Configure environment**:

   ```bash
   cp .env.example .env
   # Edit .env with your domain and database credentials
   ```

2. **Deploy with Docker Compose**:

   ```bash
   docker compose up --build -d
   ```

3. **Access the application**:
   - Application: https://your-domain.com
   - API: https://api.your-domain.com

## Project Structure

```
menu-management/
├── nst-backend/           # NestJS backend service
│   ├── src/
│   │   ├── menus/        # Menu management module
│   │   ├── prisma/       # Database service
│   │   └── common/       # Shared utilities
│   ├── prisma/           # Database schema and migrations
│   ├── Dockerfile        # Backend container configuration
│   └── package.json      # Backend dependencies
├── nxt-frontend/         # Next.js frontend service
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── store/        # Redux store
│   │   ├── components/   # UI components
│   │   └── lib/          # Utilities and API client
│   ├── Dockerfile        # Frontend container configuration
│   └── package.json      # Frontend dependencies
├── caddy/                # Caddy reverse proxy
│   ├── Caddyfile         # Production configuration
│   ├── Caddyfile.dev     # Development configuration
│   └── Dockerfile        # Caddy container configuration
├── docker-compose.yml     # Production deployment
├── docker-compose.dev.yml # Development environment
├── package.json          # Workspace management
└── README.md             # This file
```

## Security Features

### SSL/TLS & HTTPS

- **Automatic SSL**: Let's Encrypt certificates with auto-renewal
- **HTTPS Enforcement**: Automatic HTTP to HTTPS redirects
- **HSTS**: HTTP Strict Transport Security headers
- **Certificate Management**: Automated certificate provisioning and renewal

### Security Headers

- **Content Security Policy**: XSS protection with configurable policies
- **X-Frame-Options**: Clickjacking protection
- **X-Content-Type-Options**: MIME type sniffing protection
- **X-XSS-Protection**: Cross-site scripting protection
- **Server Headers**: Removed identifying server information

### Rate Limiting & DDoS Protection

- **API Rate Limiting**: 100 requests per minute per IP
- **Burst Protection**: 20 requests per second burst limit
- **IP-based Tracking**: Per-client rate limiting
- **Cloudflare Support**: Optional Cloudflare IP detection

### Network Security

- **CORS Configuration**: Proper cross-origin resource sharing
- **Database Isolation**: Internal network communication only
- **Firewall Rules**: UFW configuration for production
- **Service Discovery**: Internal Docker networking

## API Endpoints

### Menus

- `POST /api/v1/menus` - Create menu
- `GET /api/v1/menus` - List menus
- `GET /api/v1/menus/:slug` - Get menu
- `GET /api/v1/menus/:slug/tree` - Get menu tree
- `PATCH /api/v1/menus/:slug` - Update menu
- `DELETE /api/v1/menus/:slug` - Delete menu

### Menu Items

- `POST /api/v1/menus/:slug/items` - Add item
- `PATCH /api/v1/menus/:slug/items/:itemId` - Update item
- `DELETE /api/v1/menus/:slug/items/:itemId` - Delete item
- `POST /api/v1/menus/:slug/save` - Save/publish menu

### Health & Monitoring

- `GET /health` - API health check
- `GET /api/v1/menus` - API availability check

## Database Schema

### Menu

- `id`: Unique identifier
- `name`: Menu name
- `slug`: URL-friendly identifier
- `status`: DRAFT or PUBLISHED
- `createdAt`, `updatedAt`: Timestamps

### MenuItem

- `id`: Unique identifier
- `menuId`: Parent menu reference
- `parentId`: Parent item reference (null for root)
- `title`: Display text
- `url`: Optional link URL
- `type`: LINK, GROUP, or SEPARATOR
- `order`: Sibling ordering
- `createdAt`, `updatedAt`: Timestamps

## Development

### Monorepo Development

```bash
# Install all dependencies
npm install

# Start all services in development mode
npm run dev

# Build all services
npm run build

# Start production services
npm run start
```

### Individual Service Development

#### Backend Development

```bash
cd nst-backend
npm run start:dev
```

#### Frontend Development

```bash
cd nxt-frontend
npm run dev
```

### Docker Development

```bash
# Start development environment with Docker
docker compose -f docker-compose.dev.yml up --build

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop development environment
docker compose -f docker-compose.dev.yml down
```

### Database Management

```bash
# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Open Prisma Studio
npm run db:studio

# Database operations with Docker
docker compose exec api npx prisma migrate deploy
docker compose exec api npx prisma generate
docker compose exec postgres psql -U postgres -d menu_app
```

## Deployment

### Multi-Container Architecture

The application uses a multi-service Docker Compose setup with:

- **PostgreSQL**: Database service with health checks
- **NestJS API**: Backend service with health monitoring
- **Next.js Frontend**: Frontend service with static optimization
- **Caddy**: Reverse proxy with SSL termination and security features

### Environment Variables

#### Production Environment

```env
# Domain Configuration
DOMAIN_NAME=your-domain.com

# Database Configuration
POSTGRES_DB=menu_app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password

# Backend Environment
NODE_ENV=production
DATABASE_URL=postgresql://postgres:your-secure-password@postgres:5432/menu_app?schema=public
PORT=3001
CORS_ORIGIN=https://your-domain.com
```

#### Development Environment

```env
# Database Configuration
POSTGRES_DB=menu_app
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

# Backend Environment
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/menu_app?schema=public
PORT=3001
CORS_ORIGIN=http://localhost
```

### Production Deployment

1. **Configure environment variables**
2. **Deploy with Docker Compose**:
   ```bash
   docker compose up --build -d
   ```
3. **Run database migrations**:
   ```bash
   docker compose exec api npx prisma migrate deploy
   ```
4. **Verify deployment**:
   ```bash
   docker compose ps
   docker compose logs -f
   ```

## License

MIT License - see LICENSE file for details
