import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

export function serveDocs(specsPath: string, port: number = 3000) {
  const app = express();

  // Read the OpenAPI spec from file
  const openapiSpec = JSON.parse(fs.readFileSync(specsPath, 'utf-8'));

  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
  app.listen(port, () => console.log(`📘 Swagger UI at http://localhost:${port}/docs`));
}
