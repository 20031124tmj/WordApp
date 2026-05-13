import React from 'react';
import { WordBook } from '../types';

interface WordBookCardProps {
  wordBook: WordBook;
  onSubscribe?: (id: string) => void;
  onClick?: (id: string) => void;
}

const WordBookCard: React.FC<WordBookCardProps> = ({ wordBook, onSubscribe, onClick }) => {
  return (
    <div
      onClick={() => onClick?.(wordBook.id)}
      style={{
        border: '1px solid #eee',
        borderRadius: 12,
        padding: 20,
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        backgroundColor: '#fff',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, color: '#1a1a2e' }}>{wordBook.name}</h3>
          <p style={{ margin: '4px 0 0', fontSize: 14, color: '#888' }}>{wordBook.description}</p>
        </div>
        {wordBook.is_official && (
          <span style={{ fontSize: 12, backgroundColor: '#6c63ff', color: '#fff', padding: '2px 8px', borderRadius: 4 }}>
            官方
          </span>
        )}
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 14, color: '#666' }}>
        <span>{wordBook.word_count} 词</span>
        <span>{wordBook.language_pair}</span>
      </div>
      {!wordBook.subscribed && onSubscribe && (
        <button
          onClick={(e) => { e.stopPropagation(); onSubscribe(wordBook.id); }}
          style={{
            marginTop: 12,
            padding: '6px 16px',
            borderRadius: 8,
            border: 'none',
            backgroundColor: '#6c63ff',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 14,
          }}
        >
          订阅学习
        </button>
      )}
    </div>
  );
};

export default WordBookCard;
