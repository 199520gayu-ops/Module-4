import { useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

export default function Register() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    // ✅ Client-side validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (name.length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setError("");
      setLoading(true);

      await API.post("/auth/register", { name, email, password });

      alert("Registration successful");
      window.location.href = "/";
    } catch (err) {
      // ✅ Backend error handling
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p className="subtitle">Sign up to manage your tasks</p>

        {/* ✅ Error message */}
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={submit}>
          <input name="name" placeholder="Full Name" />
          <input name="email" type="email" placeholder="Email Address" />
          <input name="password" type="password" placeholder="Password" />
          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="switch">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>

      {/* ================= STYLES ================= */}
      <style>{`
        * {
          box-sizing: border-box;
          font-family: 'Segoe UI', sans-serif;
          width:100%;
        }

        html, body {
          margin: 0;
          height: 100%;
        }

        .auth-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: linear-gradient(-45deg, #667eea, #764ba2, #43cea2, #185a9d);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
        }

        .auth-card {
          width: 400px;
          background: rgba(255, 255, 255, 0.95);
          padding: 40px 32px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .auth-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 25px 50px rgba(0,0,0,0.3);
        }

        .auth-card h2 {
          margin-bottom: 8px;
          font-size: 26px;
          color: #333;
          text-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }

        .subtitle {
          color: #555;
          font-size: 14px;
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
          gap: 16px;
        }

        input {
          padding: 14px 16px;
          font-size: 15px;
          border-radius: 10px;
          border: 1px solid #ccc;
          outline: none;
          transition: 0.3s;
          background: #fafafa;
        }

        input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102,126,234,0.2);
        }

        button {
          margin-top: 10px;
          padding: 14px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: 0.3s;
        }

        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        button:hover:not(:disabled) {
          background: #5a67d8;
          transform: scale(1.03);
        }

        .switch {
          margin-top: 20px;
          font-size: 14px;
        }

        .switch a {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: 0.2s;
        }

        .switch a:hover {
          text-decoration: underline;
          color: #5a67d8;
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}






