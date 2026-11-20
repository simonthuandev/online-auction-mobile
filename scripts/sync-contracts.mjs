import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import openapiTS, { astToString } from 'openapi-typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const sourceDir = path.join(rootDir, 'contracts', 'openapi');
const targetDir = path.join(rootDir, 'src', 'contracts', 'openapi');
const outputFile = path.join(rootDir, 'src', 'contracts', 'api.generated.ts');

async function syncContracts() {
  console.log('🔄 Syncing contracts...');

  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Contracts directory not found: ${sourceDir}`);
  }

  fs.mkdirSync(targetDir, { recursive: true });

  const files = fs.readdirSync(sourceDir).filter((file) => file.endsWith('.json'));

  const merged = {
    openapi: '3.1.0',
    info: {
      title: 'Online Auction API',
      version: '1.0.0',
    },
    paths: {},
    components: {
      schemas: {},
      securitySchemes: {},
    },
  };

  for (const file of files) {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(targetDir, file);
    fs.copyFileSync(srcPath, destPath);

    const doc = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

    if (doc.paths) {
      Object.assign(merged.paths, doc.paths);
    }
    if (doc.components?.schemas) {
      Object.assign(merged.components.schemas, doc.components.schemas);
    }
    if (doc.components?.securitySchemes) {
      Object.assign(merged.components.securitySchemes, doc.components.securitySchemes);
    }
  }

  // Also copy socket.json if present
  const socketSrc = path.join(rootDir, 'contracts', 'socket.json');
  if (fs.existsSync(socketSrc)) {
    fs.copyFileSync(socketSrc, path.join(rootDir, 'src', 'contracts', 'socket.json'));
  }

  console.log(`📑 Loaded and copied ${files.length} OpenAPI contract files.`);

  const ast = await openapiTS(merged);
  let tsContent = astToString(ast);

  // Add convenience helper exports
  tsContent += `\n
export type ApiPaths = paths;
export type ApiComponents = components;
export type ApiSchemas = components extends { schemas: Record<string, unknown> } ? components['schemas'] : Record<string, unknown>;
`;

  fs.writeFileSync(outputFile, tsContent, 'utf8');
  console.log(`✅ Generated types successfully written to ${path.relative(rootDir, outputFile)}`);
}

syncContracts().catch((err) => {
  console.error('❌ Failed to sync contracts:', err);
  process.exit(1);
});
