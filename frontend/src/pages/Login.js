import React, { useState} from "react";
import {Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/auth.css";

export default function Login() {
  const { login, loading} = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.preventDefault();
        const ok = await login(form.email, form.password);
        if (ok) {
            window.location.href = "/dashboard"; // Hard reload
        }
    
  };

  /*useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);*/

  return (
    <div className="auth-container fade-in">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button className="btn-primary" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <p>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
