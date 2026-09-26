import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSkillSwap } from "../context/SkillSwapContext";
import { Icon } from "../components/Icons";

export default function Login() {
  const { login } = useSkillSwap();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = login(email.trim(), password);
      setIsLoading(false);
      if (success) {
        navigate("/dashboard");
      } else {
        // Toast is shown by context; also show inline error
        setError("Invalid email or password.");
      }
    }, 300);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box">
        <div className="auth-header">
          <div className="brand-icon auth-logo-icon">
            <Icon name="swap" size={24} />
          </div>
          <h2>Welcome back to SkillSwap</h2>
          <p className="auth-subtitle">Log in to access your personal dashboard, skills, and swaps.</p>
        </div>

        {error && <div className="form-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="e.g. you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In to Your Dashboard"}
          </button>
        </form>

        <div className="auth-footer-prompt">
          Don&apos;t have an account yet? <Link to="/register">Create a new account</Link>
        </div>
      </div>
    </div>
  );
}
