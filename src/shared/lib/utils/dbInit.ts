import { getDBConnection } from './Database';

export const initDB = async (): Promise<void> => {
  try {
    console.log('Attempting to open database...');

    const db = await getDBConnection();

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
  }
};  