import { WordRepository } from '@/entity/word/repository';

export const createWord = async (word: string, definition: string) => {
  try {
    await WordRepository.addWord({ word, definition });
  } catch (error) {
    console.error('Failed to create word:', error);
    throw error;
  }
};
