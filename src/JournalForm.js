import React, { useState } from 'react';

function JournalForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content })
      });

      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null; // Nếu server trả HTML hoặc không phải JSON
      }

      if (res.ok) {
        alert('✅ Bài viết đã được lưu!');
        setTitle('');
        setContent('');
      } else {
        console.error('Phản hồi lỗi từ server:', data);
        alert('❌ Lỗi: ' + (data?.message || 'Không thể lưu bài viết'));
      }
    } catch (error) {
      console.error('Lỗi khi gửi bài viết:', error);
      alert('❌ Không thể kết nối tới server. Vui lòng kiểm tra lại.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>📝 Viết nhật ký</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          type="text"
          placeholder="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="form-control mb-2"
          rows="5"
          placeholder="Nội dung"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button className="btn btn-primary">Lưu bài viết</button>
      </form>
    </div>
  );
}

export default JournalForm;