// src/api.js
const API_URL = process.env.REACT_APP_API_URL;

// Lấy tất cả bài viết
export async function getPosts() {
  const res = await fetch(`${API_URL}/api/posts`);
  if (!res.ok) throw new Error("Lỗi khi lấy bài viết");
  return res.json();
}

// Thêm bài viết mới
export async function addPost(title, content) {
  const res = await fetch(`${API_URL}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });
  if (!res.ok) throw new Error("Lỗi khi lưu bài viết");
  return res.json();
}

// Cập nhật bài viết
export async function updatePost(id, title, content) {
  const res = await fetch(`${API_URL}/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });
  if (!res.ok) throw new Error("Lỗi khi cập nhật bài viết");
  return res.json();
}

// Xóa bài viết
export async function deletePost(id) {
  const res = await fetch(`${API_URL}/api/posts/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Lỗi khi xóa bài viết");
  return res.json();
}