import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { StatsOverview } from '../types';

const Stats: React.FC = () => {
  const [overview, setOverview] = useState<StatsOverview | null>(null);

  useEffect(() => {
    api.get('/stats/overview').then((res) => setOverview(res.data.data)).catch(() => {});
  }, []);

  if (!overview) return <div style={{ textAlign: 'center', marginTop: 80 }}>加载中...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1 style={{ color: '#1a1a2e' }}>学习统计</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 24 }}>
        <div style={{ padding: 24, borderRadius: 12, backgroundColor: '#f0eeff' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#6c63ff' }}>{overview.total_words_learned}</div>
          <div style={{ fontSize: 14, color: '#666' }}>已学单词</div>
        </div>
        <div style={{ padding: 24, borderRadius: 12, backgroundColor: '#e8f8f0' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#2ecc71' }}>{overview.total_words_mastered}</div>
          <div style={{ fontSize: 14, color: '#666' }}>已掌握</div>
        </div>
        <div style={{ padding: 24, borderRadius: 12, backgroundColor: '#fff3e0' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#f39c12' }}>{overview.total_learning_days}</div>
          <div style={{ fontSize: 14, color: '#666' }}>学习天数</div>
        </div>
        <div style={{ padding: 24, borderRadius: 12, backgroundColor: '#fce4ec' }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#e74c3c' }}>{overview.average_accuracy}%</div>
          <div style={{ fontSize: 14, color: '#666' }}>正确率</div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
