import React, { useState } from "react";
import "./Login.css"; // dùng lại CSS của login

function Register({ onRegisterSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("✅ Đăng ký thành công! Bạn có thể đăng nhập ngay.");
        setEmail("");
        setPassword("");
        if (onRegisterSuccess) onRegisterSuccess();
      } else {
        setError(data.message || "Đăng ký thất bại");
      }
    } catch {
      setError("Không thể kết nối tới server");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-card" onSubmit={handleSubmit}>
        <h2>📝 Đăng ký tài khoản GrowDaily</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Đăng ký</button>
      </form>
    </div>
  );
}

export default Register;