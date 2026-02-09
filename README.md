# Azure Functions v4 Monorepo

A minimal Azure Functions v4 monorepo built with pnpm workspaces, TypeScript project references, and ESM-only architecture.

## Features

- **Azure Functions v4** with Node.js 22 runtime
- **pnpm workspaces** for monorepo management
- **TypeScript project references** for efficient builds
- **ESM-only** (module/moduleResolution: nodenext)
- **Rolldown bundling** for optimized deployment
- **Biome** for linting and formatting
- **Vitest** for testing
- **Security scanning** with pnpm audit, Snyk, and SonarCloud
- **Azure Pipelines** CI/CD configuration

## Prerequisites

- **Node.js 22.x** (with Corepack enabled)
- **Azure Functions Core Tools v4** (`npm install -g azure-functions-core-tools@4 --unsafe-perm true`)
- **pnpm** (via Corepack: `corepack enable`)

## Project Structure

```
.
├── packages/
│   ├── interfaces/         # @app/interfaces - TimeProvider interface
│   ├── time-impl/          # @app/time-impl - TimeProvider implementation
│   └── core-functions/     # @app/core-functions - Azure Functions handlers
├── deploy/                 # Deployment output (generated)
│   ├── host.json
│   ├── package.json
│   ├── time/
│   │   └── function.json
│   └── dist/
│       └── index.js
├── rolldown.config.mjs     # Bundler configuration
├── prepare-deploy.mjs      # Deployment preparation script
└── azure-pipelines.yml     # CI/CD pipeline
```

## Installation

```bash
# Enable Corepack (if not already enabled)
corepack enable

# Install dependencies
pnpm install

# Initialize Husky git hooks
pnpm prepare
```

## Development

### Local Development

Start the development server with TypeScript watch mode:

```bash
pnpm dev
```

This runs TypeScript compiler in watch mode. To start the Azure Functions host, you need Azure Functions Core Tools v4 installed globally:

```bash
# Install Functions Core Tools globally
npm install -g azure-functions-core-tools@4 --unsafe-perm true

# After building, start the Functions host
cd deploy && func start --worker-runtime node
```

The HTTP trigger will be available at: `http://localhost:7071/api/time`

### Building

Build the entire project (TypeScript compilation → Rolldown bundling → deployment preparation):

```bash
pnpm build
```

### Testing

Run all tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

### Code Quality

Check code formatting and linting:

```bash
pnpm biome:check
```

Auto-fix formatting and linting issues:

```bash
pnpm biome:fix
```

Check for unused dependencies:

```bash
pnpm knip
```

### Security Scanning

Run pnpm audit:

```bash
pnpm audit
```

Run Snyk (requires SNYK_TOKEN environment variable and Snyk CLI):

```bash
# Install Snyk CLI globally
npm install -g snyk

# Run Snyk
export SNYK_TOKEN=your-token
snyk test
```

Run SonarCloud (requires SONAR_TOKEN environment variable and sonar-scanner):

```bash
# Install sonar-scanner globally or use via Docker
npm install -g sonarqube-scanner

# Run SonarCloud
export SONAR_TOKEN=your-token
sonar-scanner
```

## Deployment

### Building for Deployment

The build process creates a `deploy/` directory with:
- `host.json` - Azure Functions host configuration
- `package.json` - Runtime dependencies
- `dist/index.js` - Bundled function code
- `time/function.json` - HTTP trigger configuration

### Deploy to Azure

Using Azure CLI:

```bash
# Build the project
pnpm build

# Install production dependencies in deploy directory
cd deploy && npm install --production && cd ..

# Create a zip file
cd deploy && zip -r ../functionapp.zip . && cd ..

# Deploy to Azure Functions
az functionapp deployment source config-zip \
  --resource-group <resource-group-name> \
  --name <function-app-name> \
  --src functionapp.zip
```

### Testing the Deployment

After deployment, test the HTTP endpoint:

```bash
curl https://<function-app-name>.azurewebsites.net/api/time
```

Expected response:

```json
{
  "serverTime": "2024-01-15T10:30:45.123Z",
  "message": "ok"
}
```

## API Endpoints

### GET /api/time

Returns the current server time in ISO 8601 format.

**Response:**
- **Status:** 200 OK
- **Content-Type:** application/json

```json
{
  "serverTime": "2024-01-15T10:30:45.123Z",
  "message": "ok"
}
```

## Package Details

### @app/interfaces

Core interface definitions. Provides the `TimeProvider` interface.

```typescript
export interface TimeProvider {
  getServerTime(): string;
}
```

### @app/time-impl

Implementation of `TimeProvider` that returns ISO 8601 formatted timestamps.

```typescript
export class ISOTimeProvider implements TimeProvider {
  getServerTime(): string {
    return new Date().toISOString();
  }
}
```

### @app/core-functions

Azure Functions HTTP triggers. Contains the `timeHandler` function that:
- Uses the `TimeProvider` to get the current time
- Returns JSON response with proper Content-Type header
- Sets `context.res` as required by Functions v4 host model

## CI/CD Pipeline

The Azure Pipelines configuration (`azure-pipelines.yml`) runs:

1. **Setup:** Node.js 22 with Corepack and pnpm
2. **Build:** TypeScript compilation and bundling
3. **Test:** Unit tests with Vitest
4. **Quality:** Biome linting and Knip unused dependency check
5. **Security:** pnpm audit, Snyk (optional), SonarCloud (optional)
6. **Artifact:** ZIP archive of `deploy/` directory

### Required Pipeline Variables

- `SNYK_TOKEN` (optional) - For Snyk security scanning
- `SONAR_TOKEN` (optional) - For SonarCloud analysis

## TypeScript Configuration

The project uses TypeScript project references for efficient incremental builds:

- **Root tsconfig.json:** References all packages
- **Each package:** Configured with `composite: true`, `incremental: true`, `declaration: true`
- **Module system:** ESM with `module: nodenext` and `moduleResolution: nodenext`

## Scripts Reference

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server with watch mode |
| `pnpm build` | Build all packages and prepare deployment |
| `pnpm test` | Run all tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm biome:check` | Check code formatting and linting |
| `pnpm biome:fix` | Auto-fix formatting and linting issues |
| `pnpm knip` | Check for unused dependencies |
| `pnpm audit` | Run pnpm security audit |

## Git Hooks

Husky and lint-staged are configured to run Biome on pre-commit:

- **Pre-commit:** Runs `biome check --write` on staged files

## License

MIT