import { drizzle } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { join } from 'path';
import * as schema from './schema';

// Get the project root directory
const projectRoot = join(import.meta.dir, '..', '..');

// Create SQLite database (file-based for persistence)
const dbPath = join(projectRoot, 'todos.db');
const sqlite = new Database(dbPath);

// Create drizzle database instance
export const db = drizzle(sqlite, { schema });

// Re-export schema types and tables
export * from './schema';

// Database initialized at dbPath
