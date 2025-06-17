export function generateSwaggerSpec(routes) {
    const paths = {};
    for (const route of routes) {
        // Convert path parameters in the route path to OpenAPI format
        let openApiPath = route.path;
        if (route.pathParams) {
            for (const param of route.pathParams) {
                openApiPath = openApiPath.replace(`[${param.name}]`, `{${param.name}}`);
            }
        }
        const parameters = [
            // Add path parameters
            ...(route.pathParams?.map(param => ({
                name: param.name,
                in: 'path',
                required: true,
                schema: {
                    type: 'string'
                },
                description: param.description
            })) || []),
            // Add query parameters
            ...(route.queryParams?.map(param => ({
                name: param.name,
                in: 'query',
                required: param.required,
                schema: {
                    type: 'string'
                },
                description: param.description
            })) || [])
        ];
        const responses = {
            200: {
                description: route.responses?.['200']?.description || 'Success'
            },
            400: {
                description: 'Bad Request - Missing required parameters'
            },
            500: {
                description: 'Internal Server Error'
            }
        };
        // Merge custom response descriptions
        if (route.responses) {
            Object.assign(responses, route.responses);
        }
        paths[openApiPath] = {
            [route.method]: {
                summary: route.description || `Handler for ${openApiPath}`,
                description: route.description,
                parameters,
                responses
            }
        };
    }
    return {
        openapi: '3.0.0',
        info: {
            title: 'Next.js API',
            version: '1.0.0'
        },
        paths
    };
}
