import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from '@/shared/ui';
import { Word } from '@/entity/word/interface';
import { Typography } from '@/shared/ui';
import { updateLearned } from '../model/updateLearned';

const LearnWord = ({ word }: { word: Word }) => {
  const [learned, setLearned] = React.useState(word.learned);
  const [time, setTime] = React.useState(learned ? 0 : 20);

  const handleLearn = async () => {
    await updateLearned(word.id, true);
    setLearned(true);
  };

  const handleNotLearn = async () => {
    await updateLearned(word.id, false);
    setLearned(false);
    setTime(20);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (time === 0) {
        return;
      }
      setTime(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [learned, time]);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        {learned ? (
          <Typography size={18} color="primary">
            You have learned this word
          </Typography>
        ) : (
          <Typography size={18} color="red">
            You have not learned this word
          </Typography>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          style={[
            styles.learnButton,
            { backgroundColor: time > 0 ? 'gray' : 'white' },
          ]}
          disabled={time > 0}
          title={
            learned
              ? 'Mark as not learned'
              : time > 0
              ? 'Wait'
              : 'Mark as learned'
          }
          onPress={() => {
            learned ? handleNotLearn() : handleLearn();
          }}
        />
      </View>
      {time > 0 && (
        <Typography style={styles.time} size={18} color="white">
          You can mark learned after {time}s
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonContainer: {
    paddingHorizontal: 4,
  },
  learnButton: {
    marginTop: 0,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  time: {
    marginTop: 24,
    textAlign: 'center',
  },
});

export default LearnWord;
