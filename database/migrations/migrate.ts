/**
 * MongoDB Migration Runner
 * 
 * This utility runs all migrations in the migrations directory.
 * Usage: npx ts-node database/migrations/migrate.ts [up|down]
 */

import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/stanford-medicine';
const MIGRATIONS_DIR = __dirname;

interface Migration {
  up: (db: any, client: MongoClient) => Promise<void>;
  down: (db: any, client: MongoClient) => Promise<void>;
}

async function runMigrations(direction: 'up' | 'down' = 'up') {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✓ Connected to MongoDB');

    const db = client.db();

    // Get all migration files
    const files = fs
      .readdirSync(MIGRATIONS_DIR)
      .filter(f => f.match(/^\d+_.*\.js$/))
      .sort();

    if (files.length === 0) {
      console.log('No migrations found');
      return;
    }

    for (const file of files) {
      const filePath = path.join(MIGRATIONS_DIR, file);
      console.log(`\nRunning migration: ${file}`);

      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const migration: Migration = require(filePath);

        if (direction === 'up' && migration.up) {
          await migration.up(db, client);
        } else if (direction === 'down' && migration.down) {
          await migration.down(db, client);
        }

        console.log(`✓ Migration ${file} completed`);
      } catch (error) {
        console.error(`✗ Migration ${file} failed:`, error);
        throw error;
      }
    }

    console.log('\n✓ All migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

// Run migrations
const direction = (process.argv[2] as 'up' | 'down') || 'up';
runMigrations(direction).catch(console.error);
