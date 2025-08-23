import { useState, useEffect } from 'react';
import { WordRepository } from './repository';
import { Word } from './interface';

export function useWordFetching() {
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const fetchWords = async () => {
      const words = await WordRepository.getAll({
        limit: 100,
        page: 1,
      });
      setWords(words);
    };
    fetchWords();
  }, []);

  return {
    words,
  };
}
