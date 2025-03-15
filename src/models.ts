export interface WordData {
  suggested: any[];
  word: Word;
}

export interface Word {
  hwi: HeadwordInformation;
  vrs: Variation[];
}

export interface HeadwordInformation {
  hw: string;
  prs: Pronunciation[];
}

export interface Pronunciation {
  mw: string;
  sound: PronunciationSound;
}

export interface PronunciationSound {
  audio: string;
}

export interface Variation {
  prs: Pronunciation[];
}
