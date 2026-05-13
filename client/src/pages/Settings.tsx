import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(user?.daily_goal || 20);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await api.put('/user/settings', { daily_goal: dailyGoal });
    await api.put('/user/profile', { nickname });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 32 }}>
      <h1 style={{ color: '#1a1a2e' }}>设置</h1>
      <div style={{ marginTop: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, color: '#666' }}>昵称</label>
        <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
          style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }} />
      </div>
      <div style={{ marginTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 8, color: '#666' }}>每日学习目标</label>
        <input type="number" value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))}
          style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }} min={5} max={200} />
      </div>
      <button onClick={handleSave} style={{ marginTop: 24, padding: '12px 32px', borderRadius: 8, border: 'none', backgroundColor: '#6c63ff', color: '#fff', fontSize: 16, cursor: 'pointer' }}>
        {saved ? '已保存 ✓' : '保存'}
      </button>
    </div>
  );
};

export default Settings;
