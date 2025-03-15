import { usePlugin, renderWidget, SelectionType, useTracker } from '@remnote/plugin-sdk';
import React from 'react';
import { WordData } from '../models';
import { Pronunciations } from '../components/pronunciations';

const key = 'aacac1c1-1baa-4c9d-95fa-14ece447dcef';

function cleanSelectedText(s?: string) {
  return (
    s
      // Remove leading and trailing whitespace
      ?.trim()
      // Split on whitespace and take the first word
      ?.split(/(\s+)/)[0]
      // This removes non-alphabetic characters
      // including Chinese characters, Cyrillic etc.
      // But the Dictionary API in this plugin only
      // works with English, so this is okay.
      ?.replaceAll(/[^a-zA-Z]/g, '')
  );
}

// We use the `useDebounce` hook to limit the number of API calls
// made to the dictionary API to avoid getting rate limited by the API
export function useDebounce<T>(value: T, msDelay: number) {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, msDelay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, msDelay]);
  return debouncedValue;
}

function Pronouncify() {
  const plugin = usePlugin();

  // This stores the response from the dictionary API.
  const [wordData, setWordData] = React.useState<WordData | null>();

  // By wrapping the call to `useTracker` in
  // `useDebounce`, the `selTextRichText` value will only get set
  // *after* the user has stopped changing the selected text for 0.5 seconds.
  // Since the API gets called every time the value of `selTextRichText` /
  // `selText` change, debouncing limits unnecessary API calls.
  const searchTerm = useDebounce(
    useTracker(async (reactivePlugin) => {
      const sel = await reactivePlugin.editor.getSelection();
      if (sel?.type == SelectionType.Text) {
        return cleanSelectedText(await plugin.richText.toString(sel.richText));
      } else {
        return undefined;
      }
    }),
    500
  );

  // When the selText value changes, and it is not null or undefined,
  // call the dictionary API to get the definition of the selText.
  React.useEffect(() => {
    const getAndSetData = async () => {
      if (!searchTerm) {
        return;
      }
      try {
        const url =
          'https://dictionaryapi.com/api/v3/references/medical/json/' + searchTerm + `?key=${key}`;
        const response = await fetch(url);
        const json = await response.json();

        if (typeof json[0] === 'string') {
          setWordData({ suggested: json, word: { hwi: { hw: '', prs: [] } } });
        } else {
          setWordData({ suggested: [], word: json[0] });
        }
      } catch (e) {
        console.log('Error getting dictionary info: ', e);
      }
    };

    getAndSetData();
  }, [searchTerm]);

  return (
    <div className="min-h-[20px] max-h-[200px] overflow-y-scroll">
      <div className="m-4">{wordData && <Pronunciations wordData={wordData} />}</div>
    </div>
  );
}

renderWidget(Pronouncify);
