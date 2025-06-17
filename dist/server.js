"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.serveDocs = serveDocs;
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
function serveDocs(specsPath, port = 3000) {
    const app = (0, express_1.default)();
    // Read the OpenAPI spec from file
    const openapiSpec = JSON.parse(fs_1.default.readFileSync(specsPath, 'utf-8'));
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpec));
    app.listen(port, () => console.log(`📘 Swagger UI at http://localhost:${port}/docs`));
}
