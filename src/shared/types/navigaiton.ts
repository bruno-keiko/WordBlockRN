export interface Word {
  id: number;
  word: string;
  definition: string;
  learned: boolean; // 0 or 1 in DB
}

export type TabParamList = {
  DictionaryPage: undefined;
  AddWordPage: undefined;
  Stats: undefined;
  DevelopmentSettings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  WordPage: { word: Word };
  BlockScreen: { word: Word };
};
