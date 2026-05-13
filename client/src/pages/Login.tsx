import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      await login(email, password);
      navigate('/');
    } catch (any: any) {
      setErr(any.response?.data?.error?.message || '登录失败');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '80px auto', padding: 32 }}>
      <h1 style={{ textAlign: 'center', color: '#1a1a2e' }}>WordMaster</h1>
      <h2 style={{ textAlign: 'center', color: '#666', fontWeight: 400 }}>登录</h2>
      {err && <div style={{ color: '#e74c3c', textAlign: 'center', marginBottom: 16 }}>{err}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <input type="email" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }} required />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input type="password" placeholder="密码" value={password} onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #ddd', fontSize: 16, boxSizing: 'border-box' }} required />
        </div>
        <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', backgroundColor: '#6c63ff', color: '#fff', fontSize: 16, cursor: 'pointer' }}>
          登录
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 16, color: '#888' }}>
        还没有账号？<Link to="/register" style={{ color: '#6c63ff' }}>注册</Link>
      </p>
    </div>
  );
};

export default Login;
