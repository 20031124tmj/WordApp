import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Word } from '../types';
import FlashCard from '../components/FlashCard';
import RatingButtons from '../components/RatingButtons';
import ProgressBar from '../components/ProgressBar';

const Learn: React.FC = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string>('');
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wordBookId = localStorage.getItem('current_word_book_id');
    if (!wordBookId) { navigate('/vocabulary'); return; }
    api.post('/learning/session/start', { word_book_id: wordBookId, type: 'learn' })
      .then((res) => {
        setWords(res.data.data.words);
        setSessionId(res.data.data.session_id);
        setLoading(false);
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  const handleRate = useCallback(async (answerType: 'again' | 'hard' | 'good' | 'easy') => {
    if (!sessionId || currentIndex >= words.length) return;
    const word = words[currentIndex];
    await api.post(`/learning/session/${sessionId}/answer`, { word_id: word.id, answer_type: answerType });

    if (currentIndex + 1 >= words.length) {
      await api.post(`/learning/session/${sessionId}/end`);
      navigate('/');
    } else {
      setCurrentIndex(currentIndex + 1);
      setFlipped(false);
    }
  }, [sessionId, currentIndex, words, navigate]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80, fontSize: 18, color: '#888' }}>加载中...</div>;
  if (words.length === 0) return <div style={{ textAlign: 'center', marginTop: 80 }}><p>没有新单词了</p><button onClick={() => navigate('/')} style={{ padding: '8px 24px', borderRadius: 8, border: 'none', backgroundColor: '#6c63ff', color: '#fff', cursor: 'pointer', fontSize: 16 }}>返回首页</button></div>;

  const currentWord = words[currentIndex];

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 32px', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 48px)' }}>
      <ProgressBar current={currentIndex + 1} total={words.length} />
      <div style={{ marginTop: 20, flex: '0 0 auto' }}>
        <FlashCard word={currentWord} flipped={flipped} onFlip={() => setFlipped(true)} />
      </div>
      <div style={{ marginTop: 20, flex: '0 0 auto' }}>
        {flipped ? (
          <RatingButtons onRate={handleRate} />
        ) : (
          <p style={{ textAlign: 'center', color: '#999', fontSize: 14, marginTop: 16 }}>点击卡片翻转查看释义</p>
        )}
      </div>
    </div>
  );
};

export default Learn;
