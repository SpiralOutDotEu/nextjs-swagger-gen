import fg from 'fast-glob';
import path from 'path';
import fs from 'fs';
function parseJSDoc(content) {
    const jsDocMatch = content.match(/\/\*\*([\s\S]*?)\*\//);
    if (!jsDocMatch)
        return {};
    const jsDoc = jsDocMatch[1];
    const lines = jsDoc.split('\n').map(line => line.trim().replace(/^\s*\*\s?/, ''));
    const result = {};
    // Extract description
    const descriptionLines = [];
    for (const line of lines) {
        if (line.startsWith('@'))
            break;
        if (line)
            descriptionLines.push(line);
    }
    if (descriptionLines.length > 0) {
        result.description = descriptionLines.join(' ').trim();
    }
    // Extract query parameters
    const queryParams = [];
    for (const line of lines) {
        if (line.startsWith('@queryParam')) {
            const match = line.match(/@queryParam\s+{([^}]+)}\s+(\w+)\s+-\s+(.+)/);
            if (match) {
                queryParams.push({
                    name: match[2],
                    description: match[3].trim()
                });
            }
        }
    }
    if (queryParams.length > 0) {
        result.queryParams = queryParams;
    }
    // Extract path parameters
    const pathParams = [];
    for (const line of lines) {
        if (line.startsWith('@param') && line.includes('params.params.')) {
            const match = line.match(/@param\s+{([^}]+)}\s+params\.params\.(\w+)\s+-\s+(.+)/);
            if (match) {
                pathParams.push({
                    name: match[2],
                    description: match[3].trim()
                });
            }
        }
    }
    if (pathParams.length > 0) {
        result.pathParams = pathParams;
    }
    // Extract response descriptions
    const responses = {};
    let currentResponse = null;
    let responseDescription = [];
    for (const line of lines) {
        if (line.startsWith('@returns')) {
            const match = line.match(/@returns\s+{([^}]+)}\s+(.+)/);
            if (match) {
                currentResponse = '200';
                responseDescription = [match[2].trim()];
            }
        }
        else if (currentResponse && line && !line.startsWith('@')) {
            // Continue collecting description lines until we hit another tag
            responseDescription.push(line.trim());
        }
        else if (currentResponse && (line.startsWith('@') || !line)) {
            // Save the collected description and reset
            responses[currentResponse] = {
                description: responseDescription.join(' ').trim()
            };
            currentResponse = null;
            responseDescription = [];
        }
    }
    // Save any remaining response description
    if (currentResponse && responseDescription.length > 0) {
        responses[currentResponse] = {
            description: responseDescription.join(' ').trim()
        };
    }
    if (Object.keys(responses).length > 0) {
        result.responses = responses;
    }
    return result;
}
function extractPathParams(routePath) {
    const pathParams = [];
    const segments = routePath.split('/');
    for (const segment of segments) {
        if (segment.startsWith('[') && segment.endsWith(']')) {
            const paramName = segment.slice(1, -1);
            pathParams.push({ name: paramName });
        }
    }
    return pathParams;
}
export async function scanRoutes(appDir) {
    const files = await fg(['**/route.ts'], { cwd: appDir, absolute: true });
    return Promise.all(files.map(async (fullPath) => {
        const relativePath = path.relative(appDir, path.dirname(fullPath));
        const routePath = '/' + relativePath.replace(/\\/g, '/');
        const content = await fs.promises.readFile(fullPath, 'utf-8');
        // Extract query parameters
        const queryParams = [];
        const searchParamsRegex = /searchParams\.get\(['"]([^'"]+)['"]\)/g;
        const requiredCheckRegex = /if\s*\(\s*!([^)]+)\s*\)/g;
        let match;
        while ((match = searchParamsRegex.exec(content)) !== null) {
            const paramName = match[1];
            const isRequired = content.includes(`if (!${paramName})`);
            queryParams.push({
                name: paramName,
                required: isRequired
            });
        }
        // Extract path parameters from the route path
        const pathParams = extractPathParams(routePath);
        // Parse JSDoc
        const jsDocInfo = parseJSDoc(content);
        // Merge JSDoc descriptions with query params
        if (jsDocInfo.queryParams) {
            for (const param of queryParams) {
                const docParam = jsDocInfo.queryParams.find(p => p.name === param.name);
                if (docParam) {
                    param.description = docParam.description;
                }
            }
        }
        // Merge JSDoc descriptions with path params
        if (jsDocInfo.pathParams) {
            for (const param of pathParams) {
                const docParam = jsDocInfo.pathParams.find(p => p.name === param.name);
                if (docParam) {
                    param.description = docParam.description;
                }
            }
        }
        return {
            path: routePath,
            method: 'get',
            file: fullPath,
            queryParams: queryParams.length > 0 ? queryParams : undefined,
            pathParams: pathParams.length > 0 ? pathParams : undefined,
            description: jsDocInfo.description,
            responses: jsDocInfo.responses
        };
    }));
}
