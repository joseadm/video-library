# Video Library

A full-stack TypeScript application for browsing and managing a video library. Built with Next.js App Router, Fastify backend, Prisma ORM, and comprehensive testing.

## 🚀 Tech Stack

### Frontend
- **Next.js 15** (App Router, React Server Components) - Modern React framework with excellent performance
- **TypeScript** - Type safety across the entire application
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **React Testing Library** - Component testing with user-centric approach

### Backend
- **Fastify** - High-performance Node.js web framework
- **Prisma** - Type-safe database ORM with SQLite
- **Zod** - Runtime type validation and schema definition
- **Jest** - Comprehensive testing framework for backend services

### Database
- **SQLite** - Lightweight, file-based database for development
- **Prisma Migrations** - Database schema management and versioning

### Development Tools
- **ESLint** - Code quality and consistency
- **Docker** - Containerized development environment
- **pnpm** - Fast, disk space efficient package manager

## 🔧 Setup Instructions

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Docker & Docker Compose (optional)

### Option 1: Local Development

#### Backend Setup
```bash
# Navigate to backend directory
cd api

# Install dependencies
pnpm install

# Set up environment variables
# Create .env file with the following content:
echo 'DATABASE_URL="file:./dev.db"' > .env

# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate dev --name init

# Seed the database (optional)
npx ts-node prisma/seed.ts

# Start the backend server
pnpm dev
```

The backend will be available at `http://localhost:4000`

**Important Notes:**
- The database file will be created in the `prisma/` directory as `dev.db`
- Make sure to run migrations before starting the server
- If you get migration errors, you may need to delete the `prisma/migrations/` folder and start fresh

#### Frontend Setup
```bash
# In a new terminal, navigate to root directory
cd ..

# Install dependencies
pnpm install

# Set environment variables
# Create .env.local file with the following content:
echo 'NEXT_PUBLIC_API_URL=http://localhost:4000' > .env.local
echo 'NEXT_DOCKER_API_URL=http://host.docker.internal:4000' > .env.local

# Start the frontend development server
pnpm dev
```

The frontend will be available at `http://localhost:3000`

**Important Notes:**
- The frontend needs to know where the API is running
- Make sure the backend is running before starting the frontend
- If port 3000 is in use, Next.js will automatically use the next available port

### Option 2: Docker Compose (Recommended)

```bash
# Start both frontend and backend services
docker-compose up -d

# Wait for services to start, then set up the database
docker-compose exec api npx prisma migrate dev --name init
docker-compose exec api npx ts-node prisma/seed.ts

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**Important Notes:**
- Docker services need database setup after first startup
- The frontend will be available at `http://localhost:3000`
- The API will be available at `http://localhost:4000`
- Both services use SQLite databases (separate from local development)

### Running Tests

#### Backend Tests
```bash
cd api
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
```

#### Frontend Tests
```bash
# From root directory
pnpm test              # Run all tests
pnpm test:watch        # Run tests in watch mode
pnpm test:coverage     # Run tests with coverage report
```

### Code Quality

#### Linting
```bash
# Backend
cd api
pnpm lint              # Run ESLint
pnpm lint:fix          # Auto-fix linting issues

# Frontend
pnpm lint              # Run ESLint
pnpm lint:fix          # Auto-fix linting issues
```

#### Type Checking
```bash
# Backend
cd api
pnpm type-check        # Run TypeScript compiler check

# Frontend
pnpm type-check        # Run TypeScript compiler check
```

## 📘 Assumptions & Trade-offs

### Intentional Simplifications
- **SQLite Database**: Used for development simplicity; production would use PostgreSQL/MySQL
- **No Authentication**: Simplified for demo purposes; production would include JWT/auth middleware
- **Basic Pagination**: Simple offset/limit pagination; production could use cursor-based pagination
- **File Upload**: No actual video file handling; only thumbnail URLs are stored
- **Search**: Basic text search; production could use Elasticsearch or similar

### Technical Decisions
- **Fastify over Express**: Better performance and built-in TypeScript support
- **Prisma over raw SQL**: Type safety and developer experience
- **Next.js App Router**: Latest React patterns and server components
- **Tailwind CSS**: Rapid development without custom CSS maintenance

### Performance Considerations
- **No Caching**: In-memory caching could be added for production
- **No CDN**: Static assets served directly; production would use CDN
- **Database Queries**: Basic optimization; production would include query optimization and indexing

## 🚀 Future Improvements

### Testing & Quality
- **Unit Test Coverage**: Expand to 90%+ coverage across all layers
- **Integration Tests**: Add API endpoint testing with test database
- **End-to-End Testing**: Implement Playwright for full user journey testing
- **Performance Testing**: Add Lighthouse CI and Core Web Vitals monitoring

### User Experience
- **Video Details Modal**: Click-to-expand video information without page navigation
- **Inline Editing and Deleting**: Edit and delete video titles and tags directly in the grid
- **Bulk Operations**: Multi-select videos for batch tag updates or deletion
- **Advanced Search**: Filter by duration, views, and date ranges
- **Tag Management**: Dedicated tags page with usage statistics

### Technical Enhancements
- **Real-time Updates**: WebSocket integration for live video updates
- **Image Optimization**: Automatic thumbnail generation and WebP conversion
- **Progressive Web App**: Offline support and mobile app-like experience
- **Internationalization**: Multi-language support with i18n
- **Dark Mode**: Theme switching with system preference detection

### Production Readiness
- **Database Migration**: PostgreSQL with proper indexing and optimization
- **Authentication System**: JWT-based auth with role-based access control
- **API Rate Limiting**: Protect against abuse with proper rate limiting
- **Monitoring & Logging**: Structured logging with error tracking
- **CI/CD Pipeline**: Automated testing and deployment workflows

### Scalability
- **Microservices**: Split into separate services for videos, tags, and users
- **Message Queues**: Async processing for video uploads and processing
- **Caching Layer**: Redis for session management and API response caching
- **Load Balancing**: Horizontal scaling with proper load distribution

## 📁 Project Structure

```
video-library/
├── src/                    # Frontend Next.js application
│   ├── app/               # App Router pages and layouts
│   ├── components/        # Reusable React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions and constants
│   └── types/            # TypeScript type definitions
├── api/                   # Backend Fastify application
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # Data access layer
│   │   ├── schemas/      # Zod validation schemas
│   │   └── routes/       # API route definitions
│   └── prisma/           # Database schema and migrations
├── docker-compose.yml     # Docker development environment
└── README.md             # This file
```

## 🔗 API Documentation

### Endpoints

- `GET /videos` - List videos with filtering, sorting, and pagination
- `POST /videos` - Create a new video
- `GET /health` - Health check endpoint
- `GET /ready` - Database readiness check
- `GET /docs` - Swagger API documentation

### Query Parameters

- `q` - Search by title
- `tag` - Filter by tag
- `sort` - Sort by created_at (asc/desc)
- `page` - Page number for pagination
- `perPage` - Items per page (max 100)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
