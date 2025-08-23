import SQLite from 'react-native-sqlite-storage';
import { getDBConnection } from './Database';

SQLite.enablePromise(true);

export const initDB = async (): Promise<void> => {
  let db;
  try {
    console.log('Attempting to open database...');

    db = await SQLite.openDatabase({
      name: 'words.db',
      location: 'default',
      createFromLocation: '~www/words.db',
    });

    console.log('Database opened successfully');

    const [result] = await db.executeSql(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='words';",
    );

    if (result.rows.length === 0) {
      throw new Error(
        "VERIFICATION FAILED: The 'words' table was not found. The database was not copied from assets correctly.",
      );
    }

    console.log(
      "VERIFICATION SUCCEEDED: The 'words' table was found. Database is ready.",
    );
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  } finally {
    if (db) {
      await db.close();
    }
  }

  await getDBConnection();
};
