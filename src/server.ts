import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

export function serveDocs(specsPath: string, port: number = 3333) {
  const app = express();

  // Read the OpenAPI spec from file
  const openapiSpec = JSON.parse(fs.readFileSync(specsPath, 'utf-8'));

  // Custom Swagger UI options
  const swaggerOptions = {
    swaggerOptions: {
      url: '/swagger.json',
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai'
      },
      tryItOutEnabled: true,
      requestInterceptor: (req: any) => {
        // You can modify the request here if needed
        return req;
      },
      responseInterceptor: (res: any) => {
        // You can modify the response here if needed
        return res;
      }
    },
    customCss: '.swagger-ui .servers { display: none !important; } .swagger-ui .servers-title { display: none !important; }',
    customSiteTitle: 'Next.js API Documentation',
    customfavIcon: '/favicon.ico'
  };

  // Serve the OpenAPI spec as JSON
  app.get('/swagger.json', (req, res) => {
    res.json(openapiSpec);
  });

  // Serve Swagger UI with custom options
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, swaggerOptions));

  app.listen(port, () => console.log(`📘 Swagger UI at http://localhost:${port}/docs`));
}
