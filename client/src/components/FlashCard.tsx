import React from 'react';
import { Word } from '../types';

interface FlashCardProps {
  word: Word;
  flipped: boolean;
  onFlip: () => void;
}

const FlashCard: React.FC<FlashCardProps> = ({ word, flipped, onFlip }) => {
  return (
    <div
      onClick={onFlip}
      style={{
        width: '100%',
        maxWidth: 520,
        height: 320,
        perspective: 1000,
        cursor: 'pointer',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            padding: 24,
          }}
        >
          <h1 style={{ fontSize: 44, margin: 0, color: '#1a1a2e', fontWeight: 700 }}>{word.word}</h1>
          {word.phonetic && (
            <p style={{ fontSize: 18, color: '#6c63ff', marginTop: 10, fontWeight: 500 }}>{word.phonetic}</p>
          )}
          <p style={{ fontSize: 14, color: '#aaa', marginTop: 24 }}>点击翻转查看释义</p>
        </div>
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
            padding: 20,
            overflowY: 'auto',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, borderBottom: '1px solid #f0f0f0', paddingBottom: 10, marginBottom: 10 }}>
            <h2 style={{ fontSize: 26, margin: 0, color: '#1a1a2e', fontWeight: 700 }}>{word.word}</h2>
            {word.phonetic && <span style={{ fontSize: 15, color: '#6c63ff' }}>{word.phonetic}</span>}
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {word.definitions.map((def, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ color: '#6c63ff', fontWeight: 700, fontSize: 14, backgroundColor: '#f0eeff', padding: '2px 8px', borderRadius: 4 }}>{def.pos}</span>
                  <span style={{ fontSize: 17, color: '#333', fontWeight: 500 }}>{def.meaning}</span>
                </div>
                {def.examples && def.examples.map((ex, j) => (
                  <div key={j} style={{ marginTop: 6, paddingLeft: 12, borderLeft: '2px solid #f0eeff' }}>
                    <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{ex.en}</div>
                    <div style={{ fontSize: 13, color: '#999', lineHeight: 1.5 }}>{ex.zh}</div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
