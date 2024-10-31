import { forwardRef } from 'react';
import ReactD3WordCloud from 'react-d3-cloud';
import styles from './WordCloud.module.css';

interface Word {
  text: string;
  value: number;
}
export interface WordCloudProps {
  words: Word[];
}

const MIN_FONT_SIZE = 30;
const MAX_FONT_SIZE = 200;
const MIN_FONT_WEIGHT = 400;
const MAX_FONT_WEIGHT = 700;

export const WordCloud = forwardRef<HTMLElement, WordCloudProps>(
  ({ words }, ref) => {
    const sortedWords = words.sort(
      (wordA, wordB) => wordA.value - wordB.value,
    );
    const minOccurences = Math.min(
      ...sortedWords.map((word) => word.value),
    );
    const maxOccurences = Math.max(
      ...sortedWords.map((word) => word.value),
    );
    function calculateFontSize(word: Word) {
      const normalizedValue =
        (word.value - minOccurences) /
        (maxOccurences - minOccurences);
      const fontSize =
        MIN_FONT_SIZE +
        normalizedValue * (MAX_FONT_SIZE - MIN_FONT_SIZE);
      return Math.round(fontSize);
    }
    function calculateFontWeight(word: Word) {
      const normalizedValue =
        (word.value - minOccurences) /
        (maxOccurences - minOccurences);
      const fontWeight =
        MIN_FONT_WEIGHT +
        normalizedValue * (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT);
      return Math.round(fontWeight);
    }

    return (
      <section ref={ref} className={styles.wrapper}>
        <ReactD3WordCloud
          data={sortedWords}
          width={2000}
          height={1400}
          rotate={0}
          padding={1}
          random={() => 0.5}
          font={'Poppins'}
          fontSize={calculateFontSize}
          fontWeight={calculateFontWeight}
        />
      </section>
    );
  },
);
