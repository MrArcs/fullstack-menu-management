# Menu Management System

A hierarchical menu management system built with NestJS, Prisma, PostgreSQL, Next.js, and Docker.

## Features

- **Hierarchical Menu Management**: Create and manage nested menu structures
- **Type-Safe Backend**: NestJS with Prisma ORM and PostgreSQL
- **Modern Frontend**: Next.js 14 with App Router, TailwindCSS, and shadcn/ui
- **Single Container Deployment**: All services in one Docker container
- **Draft/Publish Workflow**: Save drafts and publish menus
- **Responsive Design**: Mobile-first, accessible UI

## Architecture

### Backend (NestJS)

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful endpoints with validation
- **Features**: CRUD operations, tree building, reordering

### Frontend (Next.js)

- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS with shadcn/ui components
- **State**: Redux Toolkit for state management
- **Features**: Responsive design, accessibility

### Deployment

- **Container**: Single Docker container
- **Services**: PostgreSQL + NestJS + Next.js
- **Platform**: DigitalOcean or similar

## Quick Start

### Development

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

### Docker Deployment

1. **Build and run with Docker Compose**:

   ```bash
   npm run docker:compose
   ```

2. **Access the application**:
   - Application: http://localhost:3000

## Project Structure

```
menu-management/
├── nst-backend/           # NestJS backend
│   ├── src/
│   │   ├── menus/        # Menu management module
│   │   ├── prisma/       # Database service
│   │   └── common/       # Shared utilities
│   └── prisma/           # Database schema
├── nxt-frontend/         # Next.js frontend
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── store/        # Redux store
│   │   ├── components/   # UI components
│   │   └── lib/          # Utilities and API client
├── Dockerfile            # Single container build
├── docker-compose.yml    # Development setup
└── start.sh             # Container startup script
```

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

### Backend Development

```bash
cd nst-backend
npm run start:dev
```

### Frontend Development

```bash
cd nxt-frontend
npm run dev
```

### Database Management

```bash
# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Open Prisma Studio
npm run db:studio
```

## Deployment

### Single Container

The application is designed to run in a single Docker container with:

- PostgreSQL database
- NestJS backend API
- Next.js frontend (static build)

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Application port (default: 3000)
- `NODE_ENV`: Environment (development/production)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
