import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Achievement } from '../types';

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    api.get('/achievements/mine').then((res) => setAchievements(res.data.data)).catch(() => {});
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <h1 style={{ color: '#1a1a2e' }}>成就</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 24 }}>
        {achievements.map((a) => (
          <div key={a.id} style={{
            padding: 20, borderRadius: 12, border: '1px solid #eee',
            opacity: a.unlocked ? 1 : 0.5, backgroundColor: a.unlocked ? '#f0eeff' : '#f5f5f5',
          }}>
            <div style={{ fontSize: 32, textAlign: 'center' }}>{a.icon}</div>
            <h3 style={{ textAlign: 'center', margin: '8px 0 4px', color: a.unlocked ? '#6c63ff' : '#999' }}>{a.name}</h3>
            <p style={{ textAlign: 'center', fontSize: 14, color: '#888', margin: 0 }}>{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
