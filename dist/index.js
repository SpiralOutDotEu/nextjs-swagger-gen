#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const scanner_1 = require("./scanner");
const generator_1 = require("./generator");
const server_1 = require("./server");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name('nextjs-swagger-gen')
    .description('Generate OpenAPI Swagger specs from Next.js App Router API routes')
    .version('1.0.0')
    .requiredOption('-a, --app-path <path>', 'Path to your Next.js app directory (can be absolute or relative)')
    .option('-o, --output <path>', 'Path where to save the OpenAPI spec file (can be absolute or relative)', 'swagger-spec.json')
    .option('-p, --port <number>', 'Port to run the Swagger UI server', '3000')
    .option('-s, --serve', 'Start the Swagger UI server after generating the spec', true)
    .action(async (options) => {
    try {
        console.log(chalk_1.default.blue('🔍 Scanning Next.js API routes...'));
        // Resolve paths relative to current working directory if they're not absolute
        const appPath = path_1.default.resolve(process.cwd(), options.appPath);
        const outputPath = path_1.default.resolve(process.cwd(), options.output);
        // Verify app path exists
        if (!fs_1.default.existsSync(appPath)) {
            console.error(chalk_1.default.red(`Error: App path does not exist: ${appPath}`));
            process.exit(1);
        }
        const routes = await (0, scanner_1.scanRoutes)(appPath);
        console.log(chalk_1.default.green(`✅ Found ${routes.length} API routes`));
        const openapi = (0, generator_1.generateSwaggerSpec)(routes);
        // Ensure the directory exists
        const outputDir = path_1.default.dirname(outputPath);
        if (outputDir !== '.') {
            await fs_1.default.promises.mkdir(outputDir, { recursive: true });
        }
        // Save the spec to file
        await fs_1.default.promises.writeFile(outputPath, JSON.stringify(openapi, null, 2));
        console.log(chalk_1.default.green(`✅ OpenAPI spec generated and saved to ${outputPath}`));
        if (options.serve) {
            console.log(chalk_1.default.blue(`🚀 Starting Swagger UI server on port ${options.port}...`));
            (0, server_1.serveDocs)(outputPath, parseInt(options.port));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('Error:'), error instanceof Error ? error.message : 'Unknown error occurred');
        process.exit(1);
    }
});
program.parse();
