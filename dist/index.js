#!/usr/bin/env node
import { scanRoutes } from './scanner.js';
import { generateSwaggerSpec } from './generator.js';
import { serveDocs } from './server.js';
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import chalk from 'chalk';
const program = new Command();
program
    .name('nextjs-swagger-gen')
    .description('Generate OpenAPI Swagger specs from Next.js App Router API routes')
    .version('1.0.0')
    .requiredOption('-a, --app-path <path>', 'Path to your Next.js app directory (can be absolute or relative)')
    .option('-o, --output <path>', 'Path where to save the OpenAPI spec file (can be absolute or relative)', 'swagger-spec.json')
    .option('-p, --port <number>', 'Port to run the Swagger UI server', '3333')
    .option('-b, --base-url <url>', 'Base URL for the API (e.g., https://api.example.com)', 'http://localhost:3000')
    .option('-s, --serve', 'Start the Swagger UI server after generating the spec', true)
    .action(async (options) => {
    try {
        console.log(chalk.blue('🔍 Scanning Next.js API routes...'));
        // Resolve paths relative to current working directory if they're not absolute
        const appPath = path.resolve(process.cwd(), options.appPath);
        const outputPath = path.resolve(process.cwd(), options.output);
        // Verify app path exists
        if (!fs.existsSync(appPath)) {
            console.error(chalk.red(`Error: App path does not exist: ${appPath}`));
            process.exit(1);
        }
        const routes = await scanRoutes(appPath);
        console.log(chalk.green(`✅ Found ${routes.length} API routes`));
        const openapi = generateSwaggerSpec(routes, options.baseUrl);
        // Ensure the directory exists
        const outputDir = path.dirname(outputPath);
        if (outputDir !== '.') {
            await fs.promises.mkdir(outputDir, { recursive: true });
        }
        // Save the spec to file
        await fs.promises.writeFile(outputPath, JSON.stringify(openapi, null, 2));
        console.log(chalk.green(`✅ OpenAPI spec generated and saved to ${outputPath}`));
        if (options.serve) {
            console.log(chalk.blue(`🚀 Starting Swagger UI server on port ${options.port}...`));
            serveDocs(outputPath, parseInt(options.port));
        }
    }
    catch (error) {
        console.error(chalk.red('Error:'), error instanceof Error ? error.message : 'Unknown error occurred');
        process.exit(1);
    }
});
program.parse();
