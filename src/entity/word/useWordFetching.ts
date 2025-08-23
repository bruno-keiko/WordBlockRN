import { useState, useEffect } from 'react';
import { WordRepository } from './repository';
import { Word } from './interface';

export function useWordFetching() {
  const [words, setWords] = useState<Word[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    
    setPage(p => p + 1);
  };

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      const newWords = await WordRepository.getAll({
        limit: 15,
        page,
      });
      setWords(prevWords => [...prevWords, ...newWords]);
      setLoading(false);
    };
    fetchWords();
  }, [page]);

  return {
    words,
    loadMore,
    loading,
  };
}
