# nextjs-swagger-gen

Generate OpenAPI Swagger specs from Next.js App Router API routes. This tool automatically generates OpenAPI documentation from your Next.js API routes, including:

- Route paths and methods
- Query parameters
- JSDoc comments and descriptions
- Response types and descriptions

## 🎯 Features

- 🔍 Automatic route detection
- 📝 JSDoc comment parsing
- 🔄 Query parameter extraction
- 🎨 Interactive Swagger UI
- 📦 Works with npx
- 🔧 Configurable output and server options

## 📦 Installation

### Using npx (Recommended)

```bash
npx nextjs-swagger-gen -a /path/to/your/app
```

### Global Installation

```bash
npm install -g nextjs-swagger-gen
nextjs-swagger-gen -a /path/to/your/app
```

### Running from Repository

1. Clone the repository:

   ```bash
   git clone https://github.com/youruser/nextjs-swagger-gen.git
   cd nextjs-swagger-gen
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the project:

   ```bash
   npm run build
   ```

4. Run the tool:

   ```bash
   # Using npm script
   npm run start -- -a /path/to/your/app

   # Or directly with ts-node
   ts-node src/index.ts -a /path/to/your/app
   ```

## 🚀 Usage

```bash
npx nextjs-swagger-gen -a /path/to/your/app [options]
```

### Options

- `-a, --app-path <path>`: Path to your Next.js app directory (required)
- `-o, --output <path>`: Path where to save the OpenAPI spec file (default: swagger-spec.json)
- `-p, --port <number>`: Port to run the Swagger UI server (default: 3000)
- `-s, --serve`: Start the Swagger UI server after generating the spec (default: true)
- `-h, --help`: Display help information
- `-V, --version`: Display version information

### Examples

Basic usage:

```bash
npx nextjs-swagger-gen -a ./my-nextjs-app
```

Custom output and port:

```bash
npx nextjs-swagger-gen -a ./my-nextjs-app -o ./api-docs.json -p 8080
```

Generate spec without serving:

```bash
npx nextjs-swagger-gen -a ./my-nextjs-app --no-serve
```

Running from repository:

```bash
# Basic usage
npm run start -- -a ./my-nextjs-app

# Custom output and port
npm run start -- -a ./my-nextjs-app -o ./api-docs.json -p 8080

# Generate spec without serving
npm run start -- -a ./my-nextjs-app --no-serve
```

## 📝 JSDoc Support

The tool parses JSDoc comments to enhance the API documentation. Example:

```typescript
/**
 * API route to fetch a user's voting power within a DAO
 *
 * @route GET /api/[network]/[daoAddress]/voting-power
 *
 * @param {NextRequest} request - The Next.js request object
 * @param {Object} params - Route parameters
 * @param {Promise<Object>} params.params - Dynamic route parameters
 * @param {string} params.params.network - Blockchain network identifier
 * @param {string} params.params.daoAddress - Address of the DAO
 *
 * @queryParam {string} userAddress - Ethereum address of the user (required)
 * @queryParam {string} tokenAddress - Address of the governance token (required)
 *
 * @returns {Promise<NextResponse>} JSON response containing:
 *   - On success: { success: true, data: { votingPower, daoAddress, ... } }
 *   - On error: { error: string } with appropriate status code
 */
```

## 🤝 Contributing

Contributions are welcome! This project is specifically designed for Next.js App Router with TypeScript, but we're open to contributions that support other flavors or add new features.

### Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies:
   ```bash
   npm install
   ```
4. Make your changes
5. Run tests (if available)
6. Submit a pull request

### Contributing Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Use conventional commits
- Keep PRs focused and manageable

## 📄 License

MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI](https://www.openapis.org/)
