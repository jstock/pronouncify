import React, { EventHandler } from 'react';
import { Pronunciation, WordData } from '../models';

const alphaRegex = '^[a-zA-z].*';

const getAudioString = (audio: string) => {
  let subDir = '';
  if (audio.startsWith('bix')) {
    subDir = 'bix';
  } else if (audio.startsWith('gg')) {
    subDir = 'gg';
  } else if (!audio.match(alphaRegex)) {
    subDir = 'number';
  } else {
    subDir = audio.charAt(0);
  }

  return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subDir}/${audio}.mp3`;
};

const getPronounciation = (pr: Pronunciation, i: number) => {
  if (!pr.sound) {
    return null;
  }

  return (
    <div key={i} className="inline-flex mr-4">
      <div className="text-lg font-semibold">{pr.mw}</div>
      <div
        className="w-4 h-4 cursor-pointer"
        onClick={(handler) => new Audio(getAudioString(pr.sound.audio)).play()}
      >
        🔊
      </div>
    </div>
  );
};

interface WordPreviewProps {
  wordData: WordData;
}

export const Pronunciations: React.FC<WordPreviewProps> = (props) => {
  if (props.wordData.suggested && props.wordData.suggested.length > 0) {
    return (
      <div>
        Word not found, did you mean one of the following?
        {props.wordData.suggested.map((term) => {
          return <div>{term}</div>;
        })}
      </div>
    );
  }
  const {
    hwi: { hw, prs },
    vrs,
  } = props.wordData.word;

  return (
    <div>
      <div>
        {prs?.map((pr, i) => {
          return getPronounciation(pr, i);
        })}
        {vrs?.map((vr, i) => {
          return vr.prs?.map((pr) => getPronounciation(pr, i));
        })}
      </div>
    </div>
  );
};
