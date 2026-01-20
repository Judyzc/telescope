import { cpSync, mkdirSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Clean dist
rmSync(resolve(__dirname, 'dist'), { recursive: true, force: true });

// Create dist directory
mkdirSync(resolve(__dirname, 'dist'), { recursive: true });

// Copy static files to dist
cpSync(resolve(__dirname, 'src/static'), resolve(__dirname, 'dist'), { recursive: true });

// Copy HTML pages to dist
cpSync(resolve(__dirname, 'src/pages'), resolve(__dirname, 'dist'), { recursive: true });

console.log('Build complete: dist/');
