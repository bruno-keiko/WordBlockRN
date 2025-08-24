import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'words.db';
let db: SQLiteDatabase | undefined;

const createTables = async (database: SQLiteDatabase) => {
  // Create learning_stats table if it doesn't exist
  await database.executeSql(`
    CREATE TABLE IF NOT EXISTS learning_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      learned_words_count INTEGER NOT NULL DEFAULT 0,
      time_spent INTEGER NOT NULL DEFAULT 0,
      last_learned_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabase({
      name: DB_NAME,
      location: 'default',
      createFromLocation: '~www/words.db',
    });
    console.log('Database connection opened successfully.');
    
    // Create tables if they don't exist
    await createTables(db);
  }
  return db;
};

export const closeDBConnection = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = undefined;
    console.log('Database connection closed.');
  }
};
