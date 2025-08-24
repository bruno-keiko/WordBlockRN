interface Word {
  id: number;
  word: string;
  definition: string;
  learned: boolean; // 0 or 1 in DB
}

export type RootStackParamList = {
  DictionaryPage: undefined;
  WordPage: { word: Word };
};
