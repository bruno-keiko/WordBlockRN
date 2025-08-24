import { WordRepository } from '@/entity/word/repository';

export const updateLearned = async (id: number, learned: boolean) => {
  try {
    return await WordRepository.updateLearned(id, learned);
  } catch (error) {
    console.error('Failed to update learned status:', error);
    throw error;
  }
};
