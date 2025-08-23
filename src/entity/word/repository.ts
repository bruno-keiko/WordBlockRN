import { getDBConnection } from '@/shared/lib/utils/Database';
import { Word } from './interface';

export class WordRepository {
  static async getAll({
    limit = 100,
    page = 1,
  }: {
    limit?: number;
    page?: number;
  }): Promise<Word[]> {
    const db = await getDBConnection();

    const [result] = await db.executeSql(
      `SELECT * FROM words LIMIT ? OFFSET ?`,
      [limit, (page - 1) * limit],
    );
    return result.rows
      .raw()
      .map((row: any) => ({ ...row, learned: !!row.learned }));
  }
}
