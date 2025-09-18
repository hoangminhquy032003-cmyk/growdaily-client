import React, { useState, useEffect } from 'react';
import Stats from './Stats';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './Login.css';

function App() {
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [goals, setGoals] = useState([]);
  const [goalText, setGoalText] = useState('');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${API_URL}/journal`)
        .then(res => res.json())
        .then(data => setJournals(data))
        .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
    }
  }, [isLoggedIn]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
      } else {
        setError(data.message || 'Đăng nhập thất bại');
      }
    } catch (err) {
      setError('Không thể kết nối tới server');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData)
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('✅ Đăng ký thành công! Bạn có thể đăng nhập.');
        setRegisterData({ email: '', password: '' });
        setShowRegister(false);
      } else {
        setError(data.message || 'Đăng ký thất bại');
      }
    } catch (err) {
      setError('Không thể kết nối tới server');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung!');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/journal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || 'Lỗi không xác định');
      }
      const updated = await fetch(`${API_URL}/journal`).then(r => r.json());
      setJournals(updated);
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('❌ Lỗi khi gửi bài viết:', err);
      alert('Không thể gửi bài viết: ' + err.message);
    }
  };

  const handleAddGoal = () => {
    if (!goalText.trim()) return;
    setGoals(prev => [...prev, { text: goalText, done: false }]);
    setGoalText('');
  };

  const toggleGoal = (index) => {
    setGoals(prev => {
      const next = [...prev];
      next[index].done = !next[index].done;
      return next;
    });
  };

  // Giao diện đăng nhập / đăng ký
  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        {showRegister ? (
          <form className="login-card" onSubmit={handleRegister}>
            <h2>📝 Đăng ký tài khoản GrowDaily</h2>
            <input
              type="text"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              required
            />
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}
            <button type="submit">Đăng ký</button>
            <p style={{ textAlign: "center" }}>
              Đã có tài khoản?{" "}
              <button type="button" onClick={() => setShowRegister(false)}>Đăng nhập</button>
            </p>
          </form>
        ) : (
          <form className="login-card" onSubmit={handleLogin}>
            <h2>🔐 Đăng nhập GrowDaily</h2>
            <input
              type="text"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              required
            />
            {error && <p className="error">{error}</p>}
            <button type="submit">Đăng nhập</button>
            <p style={{ textAlign: "center" }}>
              Chưa có tài khoản?{" "}
              <button type="button" onClick={() => setShowRegister(true)}>Đăng ký ngay</button>
            </p>
          </form>
        )}
      </div>
    );
  }

  // Giao diện chính sau khi đăng nhập
  return (
    <div className="shell">
      <header className="topbar">
        <h1 className="brand">Nhật ký GrowDaily</h1>
        <p className="subtitle">Ghi lại hành trình mỗi ngày</p>
        <button onClick={handleLogout} className="btn btn-danger">Đăng xuất</button>
      </header>

      <main className="layout">
        <section className="column left">
          <div className="panel">
            <h2 className="panel-title">Viết nhật ký</h2>
            <form onSubmit={handleSubmit} className="form">
              <div className="field">
                <label>Tiêu đề</label>
                <input
                  className="input"
                  placeholder="Ví dụ: Điều nhỏ khiến mình mỉm cười"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="field">
                <label>Nội dung</label>
                <textarea
                  className="textarea lined"
                  placeholder="Viết cảm nhận, tiến bộ, điều biết ơn..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>

              <div className="actions">
                <button className="btn primary" type="submit">Lưu</button>
              </div>
            </form>
          </div>

          <div className="panel">
            <h2 className="panel-title">Bài viết gần đây</h2>
            {journals.length === 0 ? (
              <p className="muted">Chưa có bài viết nào.</p>
            ) : (
              <ul className="entries">
                {journals.map((entry) => (
                  <li key={entry._id || entry.title} className="entry">
                    <div className="entry-head">
                      <h3 className="entry-title">{entry.title}</h3>
                      {entry.createdAt && (
                        <time className="entry-time">
                          {new Date(entry.createdAt).toLocaleString()}
                        </time>
                      )}
                    </div>
                    <p className="entry