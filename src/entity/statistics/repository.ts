import { getDBConnection } from '@/shared/lib/utils/Database';
import { LearningStats } from './interface';

export class LearningStatsRepository {
  static async ensureDefault(): Promise<void> {
    const db = await getDBConnection();
    const [result] = await db.executeSql(
      'SELECT COUNT(*) as count FROM learning_stats',
    );
    const count = result.rows.item(0).count;

    if (count === 0) {
      await db.executeSql(
        `INSERT INTO learning_stats (learned_words_count, time_spent, last_learned_at)
             VALUES (0, 0, NULL)`
      );
    }
  }

  static async get(): Promise<LearningStats | null> {
    const db = await getDBConnection();
    const [result] = await db.executeSql(
      'SELECT * FROM learning_stats LIMIT 1',
    );
    const rows = result.rows.raw();
    return rows.length > 0 ? rows[0] : null;
  }

  static async incrementLearnedWord(
    timeSpent: number,
    date: string,
  ): Promise<void> {
    const db = await getDBConnection();
    await db.executeSql(
      `UPDATE learning_stats 
       SET learned_words_count = learned_words_count + 1, 
           time_spent = time_spent + ?, 
           last_learned_at = ?`,
      [timeSpent, date],
    );
  }

  static async decrementLearnedWord(
    timeSpent: number,
    date: string,
  ): Promise<void> {
    const db = await getDBConnection();
    await db.executeSql(
      `UPDATE learning_stats 
       SET learned_words_count = CASE 
            WHEN learned_words_count > 0 THEN learned_words_count - 1 
            ELSE 0 END,
           time_spent = time_spent + ?, 
           last_learned_at = ?`,
      [timeSpent, date],
    );
  }

  static async resetStats(): Promise<void> {
    const db = await getDBConnection();
    await db.executeSql('DELETE FROM learning_stats');
    await this.ensureDefault();
  }
}
