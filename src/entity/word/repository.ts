import { getDBConnection } from '@/shared/lib/utils/Database';
import { Word } from './interface';

export class WordRepository {
  static async getAll({
    limit = 20,
    page = 1,
    query = '',
    filter = 'all',
  }: {
    limit?: number;
    page?: number;
    query?: string;
    filter?: 'all' | 'learned' | 'notLearned';
  }): Promise<Word[]> {
    const db = await getDBConnection();
    const trimmedQuery = query.trim();
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM words';
    const whereClauses: string[] = [];
    const params: any[] = [];

    if (filter === 'learned') {
      whereClauses.push('learned = 1');
    } else if (filter === 'notLearned') {
      whereClauses.push('learned = 0');
    }

    if (trimmedQuery !== '') {
      whereClauses.push('LOWER(word) LIKE LOWER(?)');
      params.push(`%${trimmedQuery}%`);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    if (trimmedQuery !== '') {
      sql += `
        ORDER BY CASE
          WHEN LOWER(word) = LOWER(?) THEN 0
          WHEN LOWER(word) LIKE LOWER(?) || '%' THEN 1
          ELSE 2
        END, word ASC
      `;
      params.push(trimmedQuery, trimmedQuery);
    } else {
      sql += ' ORDER BY word ASC';
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [result] = await db.executeSql(sql, params);

    return result.rows
      .raw()
      .map((row: any) => ({ ...row, learned: !!row.learned }));
  }

  static async updateLearned(id: number, learned: boolean): Promise<void> {
    const db = await getDBConnection();
    await db.executeSql('UPDATE words SET learned = ? WHERE id = ?', [
      learned,
      id,
    ]);
  }

  static async getRandomUnlearnedWord(): Promise<Word | null> {
    const db = await getDBConnection();
    const [result] = await db.executeSql(
      'SELECT * FROM words WHERE learned = 0 ORDER BY RANDOM() LIMIT 1',
    );
    return result.rows.raw()[0] || null;
  }

  static async addWord(word: Omit<Word, 'id' | 'learned'>): Promise<void> {
    const db = await getDBConnection();
    await db.executeSql(
      'INSERT INTO words (word, definition, learned) VALUES (?, ?, ?)',
      [word.word, word.definition, false],
    );
  }
}
