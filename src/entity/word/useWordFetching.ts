import { useState, useEffect } from 'react';
import { WordRepository } from './repository';
import { Word } from './interface';

export function useWordFetching() {
  const [words, setWords] = useState<Word[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isMounted, setIsMounted] = useState(true);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(p => p + 1);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    
    let isCancelled = false;
    
    const fetchWords = async () => {
      try {
        setLoading(true);
        const newWords = await WordRepository.getAll({
          limit: 15,
          page,
        });

        if (!isCancelled && isMounted) {
          setWords(prevWords => {
            // Filter out duplicates by checking word IDs
            const existingIds = new Set(prevWords.map(w => w.id));
            const uniqueNewWords = newWords.filter(word => !existingIds.has(word.id));
            return [...prevWords, ...uniqueNewWords];
          });

          // If we got fewer items than requested, we've reached the end
          if (newWords.length < 15) {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error('Error fetching words:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchWords();

    return () => {
      isCancelled = true;
    };
  }, [page, isMounted]);

  return {
    words,
    loadMore,
    loading,
  };
}
