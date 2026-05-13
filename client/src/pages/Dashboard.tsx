import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Dashboard as DashboardData } from '../types';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalInput, setGoalInput] = useState(20);
  const [savingGoal, setSavingGoal] = useState(false);

  const fetchDashboard = useCallback(() => {
    api.get('/learning/dashboard').then((res) => setData(res.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  useEffect(() => {
    const onFocus = () => { fetchDashboard(); };
    window.addEventListener('focus', onFocus);
    return () => { window.removeEventListener('focus', onFocus); };
  }, [fetchDashboard]);

  if (!user) { navigate('/login'); return null; }

  const handleStartLearn = async () => {
    try {
      const res = await api.get('/user/word-books');
      const books = res.data.data;
      if (books && books.length > 0) {
        localStorage.setItem('current_word_book_id', books[0].id);
        navigate('/learn');
      } else {
        navigate('/vocabulary');
      }
    } catch {
      navigate('/vocabulary');
    }
  };

  const handleStartReview = async () => {
    try {
      const res = await api.get('/user/word-books');
      const books = res.data.data;
      if (books && books.length > 0) {
        localStorage.setItem('current_word_book_id', books[0].id);
        navigate('/review');
      } else {
        navigate('/vocabulary');
      }
    } catch {
      navigate('/vocabulary');
    }
  };

  const handleOpenGoalModal = () => {
    setGoalInput(data?.daily_goal || 20);
    setShowGoalModal(true);
  };

  const handleSaveGoal = async () => {
    if (goalInput < 1 || goalInput > 200) return;
    setSavingGoal(true);
    try {
      await api.put('/user/settings', { daily_goal: goalInput });
      setShowGoalModal(false);
      fetchDashboard();
    } catch {
      alert('保存失败，请重试');
    } finally {
      setSavingGoal(false);
    }
  };

  const progressPercent = data ? Math.min(100, Math.round((data.today_learned + data.today_reviewed) / data.daily_goal * 100)) : 0;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, color: '#1a1a2e' }}>你好，{user.nickname} 👋</h1>
          <p style={{ margin: '4px 0 0', color: '#888' }}>今天也要加油背单词哦</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/vocabulary')} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #6c63ff', backgroundColor: '#fff', color: '#6c63ff', cursor: 'pointer' }}>
            词库
          </button>
          <button onClick={logout} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer' }}>
            退出
          </button>
        </div>
      </div>

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            <div style={{ padding: 20, borderRadius: 12, backgroundColor: '#f0eeff', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#6c63ff' }}>{data.words_to_review}</div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>待复习</div>
            </div>
            <div style={{ padding: 20, borderRadius: 12, backgroundColor: '#e8f8f0', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#2ecc71' }}>{data.words_to_learn}</div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>待学习</div>
            </div>
            <div style={{ padding: 20, borderRadius: 12, backgroundColor: '#fff3e0', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 700, color: '#f39c12' }}>{data.streak_days}</div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>连续打卡</div>
            </div>
          </div>

          <div style={{ marginBottom: 16, backgroundColor: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h3 style={{ margin: 0 }}>今日目标</h3>
              <button
                onClick={handleOpenGoalModal}
                style={{ padding: '4px 12px', borderRadius: 6, border: '1px solid #6c63ff', backgroundColor: '#fff', color: '#6c63ff', cursor: 'pointer', fontSize: 13 }}
              >
                修改目标
              </button>
            </div>
            <div style={{ width: '100%', height: 14, backgroundColor: '#eee', borderRadius: 7, marginTop: 8 }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: progressPercent >= 100 ? '#2ecc71' : '#6c63ff', borderRadius: 7, transition: 'width 0.5s' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <span style={{ fontSize: 14, color: '#888' }}>
                已完成 {data.today_learned + data.today_reviewed} 词
                {data.today_learned > 0 && <span style={{ color: '#6c63ff', marginLeft: 8 }}>学 {data.today_learned}</span>}
                {data.today_reviewed > 0 && <span style={{ color: '#2ecc71', marginLeft: 8 }}>复 {data.today_reviewed}</span>}
              </span>
              <span style={{ fontSize: 14, color: '#888' }}>目标 {data.daily_goal} 词</span>
            </div>
            {progressPercent >= 100 && (
              <div style={{ marginTop: 8, padding: '8px 12px', backgroundColor: '#e8f8f0', borderRadius: 8, color: '#2ecc71', fontWeight: 600, fontSize: 14, textAlign: 'center' }}>
                🎉 恭喜完成今日目标！
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button onClick={handleStartLearn} style={{ flex: 1, padding: 16, borderRadius: 12, border: 'none', backgroundColor: '#6c63ff', color: '#fff', fontSize: 18, cursor: 'pointer', fontWeight: 600 }}>
              开始学习
            </button>
            <button onClick={handleStartReview} style={{ flex: 1, padding: 16, borderRadius: 12, border: 'none', backgroundColor: '#2ecc71', color: '#fff', fontSize: 18, cursor: 'pointer', fontWeight: 600 }}>
              开始复习
            </button>
          </div>
        </>
      )}

      {showGoalModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }} onClick={() => setShowGoalModal(false)}>
          <div style={{
            backgroundColor: '#fff', borderRadius: 16, padding: 32, width: 360, maxWidth: '90vw',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px', color: '#1a1a2e' }}>修改每日目标</h3>
            <p style={{ fontSize: 14, color: '#888', margin: '0 0 16px' }}>设置每天要学习/复习的单词数量</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <input
                type="number"
                min={1}
                max={200}
                value={goalInput}
                onChange={(e) => setGoalInput(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
                style={{
                  flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 18,
                  textAlign: 'center', fontWeight: 600, outline: 'none',
                }}
              />
              <span style={{ fontSize: 16, color: '#666' }}>词/天</span>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {[10, 20, 30, 50].map(v => (
                <button
                  key={v}
                  onClick={() => setGoalInput(v)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, border: goalInput === v ? '2px solid #6c63ff' : '1px solid #ddd',
                    backgroundColor: goalInput === v ? '#f0eeff' : '#fff', color: goalInput === v ? '#6c63ff' : '#666',
                    cursor: 'pointer', fontSize: 14, fontWeight: goalInput === v ? 600 : 400,
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowGoalModal(false)}
                style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: 15 }}
              >
                取消
              </button>
              <button
                onClick={handleSaveGoal}
                disabled={savingGoal}
                style={{
                  flex: 1, padding: 12, borderRadius: 8, border: 'none',
                  backgroundColor: savingGoal ? '#ccc' : '#6c63ff', color: '#fff', cursor: savingGoal ? 'not-allowed' : 'pointer', fontSize: 15, fontWeight: 600,
                }}
              >
                {savingGoal ? '保存中...' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
