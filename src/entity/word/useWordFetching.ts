import { useState, useEffect, useRef } from 'react';
import { WordRepository } from './repository';
import { Word } from './interface';

export function useWordFetching({
  query,
  filter = 'all',
}: {
  query: string;
  filter: 'all' | 'learned' | 'notLearned';
}) {
  const [words, setWords] = useState<Word[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const isMounted = useRef<boolean>(false);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(p => p + 1);
    }
  };

  useEffect(() => {
    setWords([]);
    setPage(1);
    setHasMore(true);
  }, [query, filter]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;

    let isCancelled = false;

    const fetchWords = async () => {
      try {
        setLoading(true);
        const newWords = await WordRepository.getAll({
          limit: 30,
          page,
          query,
          filter,
        });

        if (!isCancelled && isMounted.current) {
          setWords(prevWords => {
            const existingIds = new Set(prevWords.map(w => w.id));
            const uniqueNewWords = newWords.filter(
              word => !existingIds.has(word.id),
            );
            return [...prevWords, ...uniqueNewWords];
          });

          if (newWords.length < 15) {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error('Error fetching words:', error);
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchWords();

    return () => {
      isCancelled = true;
    };
  }, [page, query, filter]);

  return {
    words,
    loadMore,
    loading,
  };
}
