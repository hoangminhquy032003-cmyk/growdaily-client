// src/JournalForm.js
import React, { useState } from 'react';
import { addPost } from './api';

function JournalForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addPost(title, content);
      alert('✅ Bài viết đã được lưu!');
      setTitle('');
      setContent('');
    } catch (err) {
      console.error('Lỗi khi gửi bài viết:', err);
      alert('❌ ' + err.message);
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