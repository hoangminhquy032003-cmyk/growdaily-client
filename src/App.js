import React, { useState, useEffect } from 'react';
import Stats from './Stats';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [journals, setJournals] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [goals, setGoals] = useState([]);
  const [goalText, setGoalText] = useState('');

  // Thêm state cho đăng nhập
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // Kiểm tra token khi load trang
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  // Lấy dữ liệu nhật ký khi đã đăng nhập
  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${API_URL}/journal`)
        .then(res => res.json())
        .then(data => setJournals(data))
        .catch(err => console.error('Lỗi khi lấy dữ liệu:', err));
    }
  }, [isLoggedIn]);

  // Xử lý đăng nhập
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

  // Xử lý đăng xuất
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

  // Nếu chưa đăng nhập → hiển thị form đăng nhập
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <h2>🔐 Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Đăng nhập</button>
        </form>
      </div>
    );
  }

  // Nếu đã đăng nhập → hiển thị giao diện nhật ký
  return (
    <div className="shell">
      <header className="topbar">
        <h1 className="brand">Nhật ký GrowDaily</h1>
        <p className="subtitle">Ghi lại hành trình mỗi ngày</p>
        <button onClick={handleLogout} className="btn btn-danger">Đăng xuất</button>
      </header>

      <main className="layout">
        {/* Cột trái */}
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
                    <p className="entry-content">{entry.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Cột phải */}
        <aside className="column right">
          <div className="panel sticky">
            <h2 className="panel-title">Mục tiêu cá nhân</h2>
            <div className="goal-input">
              <input
                className="input"
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                placeholder="Nhập mục tiêu..."
              />
              <button className="btn" onClick={handleAddGoal}>Thêm</button>
            </div>
            <ul className="goals">
              {goals.map((goal, index) => (
                <li
                  key={index}
                  className={`goal ${goal.done ? 'done' : ''}`}
                  onClick={() => toggleGoal(index)}
                >
                  <span className="goal-bullet">{goal.done ? '✓' : '○'}</span>
                  <span className="goal-text">{goal.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h2 className="panel-title">Thống kê</h2>
            <Stats journals={journals} goals={goals} />
          </div>
        </aside>
      </main>

      {/* Hình Bubu Dudu */}
      <img 
        src="/images/bubu-dudu.png" 
        alt="Bubu Dudu" 
        className="bubu-dudu"
      />
    </div>
  );
}

export default App;