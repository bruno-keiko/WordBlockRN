import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DB_NAME = 'words.db';

let db: SQLiteDatabase | undefined;

export const getDBConnection = async (): Promise<SQLiteDatabase> => {
  if (db === undefined) {
    db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
    console.log('Database connection opened successfully.');
  }
  return db;
};
