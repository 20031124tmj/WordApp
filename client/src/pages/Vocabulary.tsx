import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { WordBook } from '../types';

const Vocabulary: React.FC = () => {
  const navigate = useNavigate();
  const [wordBooks, setWordBooks] = useState<WordBook[]>([]);
  const [subscribedIds, setSubscribedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState<string>('');
  const [confirmUnsub, setConfirmUnsub] = useState<string>('');

  useEffect(() => {
    api.get('/word-books').then((res) => setWordBooks(res.data.data || [])).catch(() => {});
    api.get('/user/word-books').then((res) => {
      const ids = new Set<string>((res.data.data || []).map((b: any) => b.id as string));
      setSubscribedIds(ids);
    }).catch(() => {});
  }, []);

  const handleSubscribe = async (id: string) => {
    if (loading) return;
    setLoading(id);
    try {
      await api.post(`/word-books/${id}/subscribe`);
      setSubscribedIds(new Set<string>(Array.from(subscribedIds).concat(id)));
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert('请先登录');
        navigate('/login');
      } else {
        alert('订阅失败，请重试');
      }
    } finally {
      setLoading('');
    }
  };

  const handleUnsubscribe = async (id: string) => {
    if (loading) return;
    setLoading(id);
    try {
      await api.delete(`/word-books/${id}/subscribe`);
      const newIds = new Set<string>(Array.from(subscribedIds).filter(i => i !== id));
      setSubscribedIds(newIds);
      setConfirmUnsub('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        alert('请先登录');
        navigate('/login');
      } else {
        alert('取消订阅失败，请重试');
      }
    } finally {
      setLoading('');
    }
  };

  const handleSelect = (id: string) => {
    localStorage.setItem('current_word_book_id', id);
    navigate('/learn');
  };

  const filtered = wordBooks.filter((wb) => wb.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#1a1a2e', margin: 0 }}>词库</h1>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: 14 }}>
          返回首页
        </button>
      </div>
      <input
        type="text" placeholder="搜索词库..." value={search} onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, marginBottom: 24, boxSizing: 'border-box' }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {filtered.map((wb) => {
          const isSubscribed = subscribedIds.has(wb.id);
          const isLoading = loading === wb.id;
          const showConfirm = confirmUnsub === wb.id;
          return (
            <div key={wb.id} style={{
              border: '1px solid #eee', borderRadius: 12, padding: 20, backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: '#1a1a2e' }}>{wb.name}</h3>
                  <p style={{ margin: '4px 0 0', fontSize: 14, color: '#888' }}>{wb.description}</p>
                </div>
                {wb.is_official && (
                  <span style={{ fontSize: 12, backgroundColor: '#6c63ff', color: '#fff', padding: '2px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>官方</span>
                )}
              </div>
              <div style={{ marginTop: 12, display: 'flex', gap: 16, fontSize: 14, color: '#666' }}>
                <span>{wb.word_count} 词</span>
                <span>{wb.language_pair}</span>
              </div>
              <div style={{ marginTop: 16 }}>
                {isSubscribed ? (
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button onClick={() => handleSelect(wb.id)} style={{
                      padding: '8px 20px', borderRadius: 8, border: 'none',
                      backgroundColor: '#2ecc71', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600,
                    }}>
                      开始学习
                    </button>
                    {showConfirm ? (
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 13, color: '#e74c3c' }}>确认取消？</span>
                        <button
                          onClick={() => handleUnsubscribe(wb.id)}
                          disabled={!!isLoading}
                          style={{
                            padding: '4px 12px', borderRadius: 6, border: 'none',
                            backgroundColor: isLoading ? '#ccc' : '#e74c3c', color: '#fff', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: 13,
                          }}
                        >
                          {isLoading ? '处理中...' : '确认'}
                        </button>
                        <button
                          onClick={() => setConfirmUnsub('')}
                          style={{
                            padding: '4px 12px', borderRadius: 6, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#666',
                          }}
                        >
                          取消
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmUnsub(wb.id)}
                        style={{
                          padding: '4px 12px', borderRadius: 6, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: 13, color: '#999',
                        }}
                      >
                        取消订阅
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(wb.id)}
                    disabled={!!isLoading}
                    style={{
                      padding: '8px 20px', borderRadius: 8, border: 'none',
                      backgroundColor: isLoading ? '#ccc' : '#6c63ff', color: '#fff', cursor: isLoading ? 'not-allowed' : 'pointer', fontSize: 14,
                    }}
                  >
                    {isLoading ? '订阅中...' : '订阅学习'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>没有找到词库</div>
      )}
    </div>
  );
};

export default Vocabulary;
