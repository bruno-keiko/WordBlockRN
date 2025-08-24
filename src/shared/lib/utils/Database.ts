import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'words.db';
let db: SQLiteDatabase | undefined;

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabase({
      name: DB_NAME,
      location: 'default',
      createFromLocation: '~www/words.db',
    });
    console.log('Database connection opened successfully.');
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
