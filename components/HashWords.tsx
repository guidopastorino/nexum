import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface HashWordsProps {
  text: string;
  maskedId?: string; // for "show more" links
}

const HashWords: React.FC<HashWordsProps> = ({ text, maskedId }) => {
  const [showMore, setShowMore] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const words = text.split(/(\s+)/);

  const isOnlyLink = (): boolean => {
    const urlRegex = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/;
    return words.length === 1 && urlRegex.test(words[0].trim());
  };

  const transformWord = (word: string) => {
    const urlRegex = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/;

    if (urlRegex.test(word)) {
      const link = word.startsWith('http') ? word : `https://${word}`
      return <Link href={link} className='w-full text-blue-500 hover:underline break-all'>{link}</Link>
    } else if (word.startsWith('#')) {
      return (
        <a key={word} href={`/hashtags/${word.substring(1)}`} className="text-blue-500 hover:underline">
          {word}
        </a>
      );
    } else if (word.startsWith('@')) {
      return (
        <a key={word} href={`/${word.substring(1)}`} className="text-blue-500 hover:underline">
          {word}
        </a>
      );
    }

    return word;
  };

  // Verifica si el contenido excede 5 líneas.
  useEffect(() => {
    if (contentRef.current && !isOnlyLink()) {
      const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight || '1.2');
      const maxHeight = lineHeight * 5; // Altura para 5 líneas.
      setIsOverflowing(contentRef.current.scrollHeight > maxHeight);
    }
  }, [text]);

  return (
    <div className="w-full break-words overflow-hidden whitespace-pre-wrap">
      <div
        ref={contentRef}
        style={{
          display: '-webkit-box',
          WebkitLineClamp: showMore ? undefined : 5,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {words.map((word, index) => (
          <React.Fragment key={index}>{transformWord(word)}</React.Fragment>
        ))}
      </div>
      {isOverflowing && !showMore && !isOnlyLink() && (
        <Link
          href={`/post/${maskedId}`}
          className="mt-2 text-blue-500 hover:underline inline-block"
        >
          Show more
        </Link>
      )}
    </div>
  );
};

export default HashWords;