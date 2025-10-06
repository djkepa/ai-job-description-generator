# 🧠 AI Job Description Generator

A professional full-stack demonstration application showcasing senior-level development practices, AI integration, and modern web technologies. Built with React, Node.js, and OpenAI GPT-4o-mini to generate professional job descriptions.

## 🎯 Project Overview

This application demonstrates:
- **Senior Full-Stack Development**: Clean architecture, TypeScript, separation of concerns
- **AI Integration**: OpenAI GPT-4o-mini for intelligent job description generation
- **Production-Ready Code**: Comprehensive testing, linting, error handling, caching
- **Modern Development Practices**: CI/CD, Docker, microservices architecture

## 🏗️ Architecture

```
ai-job-description-generator/
├── backend/           # Node.js + Express API
├── frontend/          # React + Vite SPA
├── docker-compose.yml # Multi-service deployment
├── .github/workflows/ # CI/CD automation
└── docs/             # Architecture documentation
```

### Tech Stack

**Frontend:**
- React 18 + TypeScript + Vite
- TailwindCSS for styling
- React Query for state management
- Lucide React for icons
- Axios for API communication

**Backend:**
- Node.js + Express + TypeScript
- OpenAI SDK integration
- In-memory caching with cleanup
- Zod for request validation
- Structured logging

**Development & DevOps:**
- ESLint + Prettier for code quality
- Jest for testing with 95%+ coverage
- Husky for pre-commit hooks
- GitHub Actions for CI/CD
- Docker for containerization

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- OpenAI API key

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd ai-job-description-generator
npm install
```

### 2. Environment Setup

**Backend (.env):**
```bash
# Copy example and add your API key
cp backend/.env.example backend/.env

# Edit backend/.env:
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
NODE_ENV=development
```

**Frontend (.env):**
```bash
# Create frontend/.env:
VITE_API_BASE_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

### 3. Development Mode

```bash
# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🧪 Quality Assurance

This project maintains high code quality with comprehensive tooling:

### ✅ All Tests Passing
```bash
npm test                 # Run all tests
npm run test:coverage    # Generate coverage report
```
- **Coverage**: 95%+ across all modules
- **Unit Tests**: Core business logic
- **Integration Tests**: API endpoints
- **Frontend Tests**: React components and hooks

### ✅ Code Quality Checks
```bash
npm run lint             # ESLint validation
npm run format          # Prettier formatting
npm run type-check      # TypeScript validation
```
- **Zero ESLint errors**
- **Consistent formatting** with Prettier
- **Strict TypeScript** configuration
- **Pre-commit hooks** enforce quality

### ✅ Performance & Security
- **Request timeout handling** (35s limit)
- **Rate limiting** (10 requests/minute)
- **Input validation** with Zod schemas
- **Error boundaries** in React
- **Caching layer** for API responses
- **Structured logging** throughout

## 📖 Usage

1. **Enter Job Title**: Type any job position (e.g., "Senior React Developer")
2. **Select Options**: Choose seniority level and company type (optional)
3. **Generate**: Click "Generate Description" 
4. **Review & Copy**: Generated description appears with copy functionality

### Example Input/Output

**Input:** "Restaurant Manager"

**Output:**
> We are seeking a Restaurant Manager to oversee daily operations and ensure exceptional customer experiences. You will manage staff, optimize workflow, maintain quality standards, and drive profitability while fostering a positive team environment...

## 🔧 Advanced Features

### Caching System
- **In-memory caching** with automatic cleanup
- **Cache stats** available via `/health` endpoint
- **TTL-based expiration** (5 minutes default)

### Error Handling
- **Centralized error middleware** 
- **Structured error responses**
- **Request ID tracking**
- **Graceful degradation**

### Performance Monitoring
- **Request/response timing**
- **Memory usage tracking**
- **Health check endpoint**
- **Performance utilities**

## 🐋 Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# Or individual services
docker build -f Dockerfile.backend -t job-generator-backend .
docker build -f Dockerfile.frontend -t job-generator-frontend .
```

Access via Nginx reverse proxy at http://localhost

## 📊 API Documentation

### POST `/api/generate`

Generate a job description using AI.

**Request:**
```json
{
  "title": "Senior React Developer",
  "seniority": "senior",
  "company_type": "startup"
}
```

**Response:**
```json
{
  "description": "Generated job description...",
  "metadata": {
    "model": "gpt-4o-mini",
    "cache_hit": false,
    "generation_time": "2.3s",
    "timestamp": "2024-10-06T12:00:00.000Z"
  },
  "request_id": "req_123456789"
}
```

### GET `/api/health`

System health and statistics.

**Response:**
```json
{
  "status": "healthy",
  "uptime": "0:15:32",
  "cache": {
    "size": 5,
    "hits": 12,
    "misses": 3
  },
  "timestamp": "2024-10-06T12:00:00.000Z"
}
```

## 🚦 CI/CD Pipeline

GitHub Actions automatically:
- ✅ **Lints** code (ESLint)
- ✅ **Formats** code (Prettier) 
- ✅ **Type checks** (TypeScript)
- ✅ **Runs tests** with coverage
- ✅ **Builds** production bundles
- ✅ **Creates** Docker images

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/         # Environment & configuration
│   │   ├── constants/      # Application constants
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API route handlers
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
│   ├── __tests__/          # Test files
│   └── dist/               # Compiled JavaScript
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API communication
│   │   ├── types/          # TypeScript definitions
│   │   ├── utils/          # Utility functions
│   │   └── providers/      # React context providers
│   └── dist/               # Production build
├── .github/workflows/      # CI/CD configuration
├── docs/                   # Architecture documentation
├── docker-compose.yml      # Multi-service setup
└── nginx.conf             # Load balancer config
```

## 🎨 Design Philosophy

This project follows **clean code principles**:

- **KISS**: Keep it simple, stupid
- **DRY**: Don't repeat yourself
- **SOLID**: Object-oriented design principles
- **Separation of Concerns**: Clear boundaries between layers
- **Type Safety**: Comprehensive TypeScript usage
- **Error Handling**: Graceful degradation everywhere
- **Performance**: Optimized for production use

## 🤝 Contributing

This is a demonstration project showcasing professional development practices. The codebase serves as a reference for:
- Modern full-stack architecture
- AI integration patterns
- Testing strategies
- DevOps practices
- Code quality standards

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ to demonstrate senior-level full-stack development practices**

*For questions about implementation details or architectural decisions, please refer to the comprehensive documentation in the `docs/` directory or examine the extensively commented codebase.*