import Database from 'better-sqlite3';
import {
    CREATE_SUBSCRIBERS_TABLE,
    CREATE_EMAIL_PREFERENCES_TABLE,
    CREATE_ANALYTICS_EVENTS_TABLE,
    CREATE_AB_TEST_VARIANTS_TABLE
} from './schema';

// --- Database Connection ---
// Use a single, persistent database connection
const db = new Database('db.sqlite');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// --- Schema Initialization ---
function initializeSchema() {
    console.log('Initializing database schema...');
    db.exec(CREATE_SUBSCRIBERS_TABLE);
    db.exec(CREATE_EMAIL_PREFERENCES_TABLE);
    db.exec(CREATE_ANALYTICS_EVENTS_TABLE);
    db.exec(CREATE_AB_TEST_VARIANTS_TABLE);
    console.log('Schema initialized successfully.');
}

// Run schema initialization
initializeSchema();


// --- Exports ---
export const getDatabase = () => db;

// --- Cleanup ---
// Close the database connection when the process exits
process.on('exit', () => db.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));