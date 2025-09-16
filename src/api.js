// src/api.js
const API = process.env.REACT_APP_API_URL;

async function toJSON(res, defaultMessage) {
  let data = null;
  try { data = await res.json(); } catch { /* server có thể trả HTML */ }
  if (!res.ok) {
    throw new Error(data?.message || defaultMessage || `HTTP ${res.status}`);
  }
  return data;
}

export async function getPosts() {
  const res = await fetch(`${API}/api/posts`);
  return toJSON(res, "Lỗi khi lấy bài viết");
}

export async function addPost(title, content) {
  const res = await fetch(`${API}/api/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });
  return toJSON(res, "Lỗi khi lưu bài viết");
}

export async function updatePost(id, title, content) {
  const res = await fetch(`${API}/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content })
  });
  return toJSON(res, "Lỗi khi cập nhật bài viết");
}

export async function deletePost(id) {
  const res = await fetch(`${API}/api/posts/${id}`, { method: "DELETE" });
  return toJSON(res, "Lỗi khi xóa bài viết");
}