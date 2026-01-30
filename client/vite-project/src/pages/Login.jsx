import { useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Login() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    // ✅ Client-side validation
    if (!email || !password) {
      setError("All fields are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      // ✅ Backend error handling
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Welcome Back 👋</h2>
        <p className="subtitle">Login to your dashboard</p>

        {/* ✅ Error Message */}
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={submit}>
          <input
            name="email"
            type="email"
            placeholder="Email address"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="footer-text">
          New user? <Link to="/register">Create an account</Link>
        </p>
      </div>

      {/* ===== FIXED CENTERING CSS ===== */}
      <style>{`
        * {
          box-sizing: border-box;
        }

        body, html {
          margin: 0;
          width: 100%;
          height: 100%;
        }

        .login-wrapper {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .login-card {
          width: 360px;
          background: #ffffff;
          padding: 32px;
          border-radius: 14px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.25);
          text-align: center;
        }

        .login-card h2 {
          margin-bottom: 6px;
        }

        .subtitle {
          color: #666;
          margin-bottom: 18px;
        }

        .error-text {
          color: #e53e3e;
          font-size: 14px;
          margin-bottom: 12px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        input {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ccc;
          font-size: 14px;
        }

        input:focus {
          outline: none;
          border-color: #667eea;
        }

        button {
          padding: 12px;
          border-radius: 8px;
          border: none;
          background: #667eea;
          color: #fff;
          font-size: 15px;
          cursor: pointer;
          margin-top: 5px;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        button:hover:not(:disabled) {
          background: #5a67d8;
        }

        .footer-text {
          margin-top: 18px;
          font-size: 14px;
        }

        .footer-text a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
