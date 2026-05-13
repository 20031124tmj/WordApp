import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface WordResult {
  id: string;
  word: string;
  phonetic: string;
  definitions: Array<{
    pos: string;
    meaning: string;
    examples: Array<{ en: string; zh: string }>;
  }>;
}

const WordSearch: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<WordResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const doSearch = useCallback(async (q: string, p: number = 1) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await api.get('/word-books/search/words', { params: { q: q.trim(), page: p, page_size: 20 } });
      setResults(res.data.data?.data || []);
      setTotal(res.data.data?.total || 0);
      setPage(p);
      setSearched(true);
    } catch {
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query, 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      doSearch(query, 1);
    }
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#1a1a2e', margin: 0 }}>单词搜索</h1>
        <button onClick={() => navigate('/')} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', backgroundColor: '#fff', cursor: 'pointer', fontSize: 14 }}>
          返回首页
        </button>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        <input
          type="text"
          placeholder="输入英文单词..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          style={{
            flex: 1, padding: '12px 16px', borderRadius: 8, border: '1px solid #ddd',
            fontSize: 16, outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          style={{
            padding: '12px 24px', borderRadius: 8, border: 'none',
            backgroundColor: loading || !query.trim() ? '#ccc' : '#6c63ff',
            color: '#fff', cursor: loading || !query.trim() ? 'not-allowed' : 'pointer', fontSize: 16, fontWeight: 600,
          }}
        >
          {loading ? '搜索中...' : '搜索'}
        </button>
      </form>

      {searched && !loading && results.length === 0 && (
        <div style={{ textAlign: 'center', color: '#999', marginTop: 40, fontSize: 16 }}>
          未找到与 "{query}" 相关的单词
        </div>
      )}

      {results.length > 0 && (
        <>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>
            找到 {total} 个结果
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.map((w) => {
              const isExpanded = expandedId === w.id;
              return (
                <div
                  key={w.id}
                  onClick={() => setExpandedId(isExpanded ? null : w.id)}
                  style={{
                    border: '1px solid #eee', borderRadius: 12, padding: '16px 20px',
                    backgroundColor: '#fff', cursor: 'pointer',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>{w.word}</span>
                    {w.phonetic && <span style={{ fontSize: 14, color: '#6c63ff' }}>{w.phonetic}</span>}
                    <span style={{ fontSize: 13, color: '#aaa', marginLeft: 'auto' }}>
                      {isExpanded ? '收起 ▲' : '展开 ▼'}
                    </span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    {w.definitions.slice(0, isExpanded ? undefined : 2).map((def, i) => (
                      <div key={i} style={{ marginBottom: isExpanded ? 10 : 4 }}>
                        <span style={{ color: '#6c63ff', fontWeight: 600, fontSize: 13, backgroundColor: '#f0eeff', padding: '1px 6px', borderRadius: 3, marginRight: 6 }}>{def.pos}</span>
                        <span style={{ fontSize: 15, color: '#333' }}>{def.meaning}</span>
                        {isExpanded && def.examples && def.examples.map((ex, j) => (
                          <div key={j} style={{ marginTop: 4, paddingLeft: 12, borderLeft: '2px solid #f0eeff' }}>
                            <div style={{ fontSize: 13, color: '#555', lineHeight: 1.5 }}>{ex.en}</div>
                            {ex.zh && <div style={{ fontSize: 13, color: '#999', lineHeight: 1.5 }}>{ex.zh}</div>}
                          </div>
                        ))}
                      </div>
                    ))}
                    {!isExpanded && w.definitions.length > 2 && (
                      <span style={{ fontSize: 13, color: '#aaa' }}>...还有 {w.definitions.length - 2} 条释义</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
              <button
                onClick={() => doSearch(query, page - 1)}
                disabled={page <= 1}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', backgroundColor: page <= 1 ? '#f5f5f5' : '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
              >
                上一页
              </button>
              <span style={{ padding: '8px 12px', fontSize: 14, color: '#666' }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => doSearch(query, page + 1)}
                disabled={page >= totalPages}
                style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', backgroundColor: page >= totalPages ? '#f5f5f5' : '#fff', cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WordSearch;
