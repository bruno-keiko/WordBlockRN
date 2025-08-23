import { getDBConnection } from '@/shared/lib/utils/Database';
import { Word } from './interface';

export class WordRepository {
  static async getAll({
    limit = 20,
    page = 1,
    query = '',
  }: {
    limit?: number;
    page?: number;
    query?: string;
  }): Promise<Word[]> {
    const db = await getDBConnection();
    const trimmedQuery = query.trim();
    console.log(query);

    if (trimmedQuery === '') {
      const [result] = await db.executeSql(
        `SELECT * FROM words LIMIT ? OFFSET ?`,
        [limit, (page - 1) * limit],
      );
      return result.rows
        .raw()
        .map((row: any) => ({ ...row, learned: !!row.learned }));
    }

    const [result] = await db.executeSql(
      `SELECT * FROM words 
       WHERE LOWER(word) LIKE LOWER(?)
       ORDER BY CASE
         WHEN LOWER(word) = LOWER(?) THEN 0  -- Exact match first
         WHEN LOWER(word) LIKE LOWER(?) || '%' THEN 1  -- Starts with next
         ELSE 2  -- Contains anywhere last
       END, word ASC
       LIMIT ? OFFSET ?`,
      [`%${trimmedQuery}%`, trimmedQuery, trimmedQuery, limit, (page - 1) * limit],
    );
    console.log(result.rows.raw());

    return result.rows
      .raw()
      .map((row: any) => ({ ...row, learned: !!row.learned }));
  }
}