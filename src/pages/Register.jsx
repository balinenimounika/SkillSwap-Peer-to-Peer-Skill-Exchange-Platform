import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSkillSwap } from "../context/SkillSwapContext";
import { Icon } from "../components/Icons";

// Strong password validator
function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push("at least 8 characters");
  if (!/[A-Z]/.test(password)) errors.push("an uppercase letter");
  if (!/[a-z]/.test(password)) errors.push("a lowercase letter");
  if (!/[0-9]/.test(password)) errors.push("a number");
  if (!/[^A-Za-z0-9]/.test(password)) errors.push("a special character (e.g. @, #, !)");
  return errors;
}

export default function Register() {
  const { register } = useSkillSwap();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [primaryTeachSkill, setPrimaryTeachSkill] = useState("");
  const [primaryLearnSkill, setPrimaryLearnSkill] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const passwordErrors = validatePassword(password);
  const passwordIsValid = passwordErrors.length === 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password) {
      setError("Please complete all required fields.");
      return;
    }

    if (!passwordIsValid) {
      setError("Please choose a password that meets all requirements below.");
      setPasswordTouched(true);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = register({
        name: name.trim(),
        email: email.trim(),
        password,
        primaryTeachSkill: primaryTeachSkill.trim(),
        primaryLearnSkill: primaryLearnSkill.trim(),
      });
      setIsLoading(false);
      if (success) {
        navigate("/dashboard");
      }
    }, 450);
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-box">
        <div className="auth-header">
          <div className="brand-icon auth-logo-icon">
            <Icon name="swap" size={24} />
          </div>
          <h2>Join the SkillSwap Network</h2>
          <p className="auth-subtitle">Trade skills 1-on-1 for free and level up your career with peers.</p>
        </div>

        {error && <div className="form-error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-name">Full Name *</label>
            <input
              id="reg-name"
              type="text"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email Address *</label>
            <input
              id="reg-email"
              type="email"
              placeholder="alex@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password *</label>
            <input
              id="reg-password"
              type="password"
              placeholder="e.g. SkillSwap@123"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (!passwordTouched) setPasswordTouched(true);
              }}
              onBlur={() => setPasswordTouched(true)}
              className={`form-input ${
                passwordTouched
                  ? passwordIsValid
                    ? "input-valid"
                    : "input-invalid"
                  : ""
              }`}
              required
            />

            {/* Password requirements checklist */}
            <div className="password-requirements-box">
              <p className="pw-req-title">Password must contain:</p>
              <ul className="pw-req-list">
                {[
                  { label: "8+ characters", test: password.length >= 8 },
                  { label: "Uppercase letter (A–Z)", test: /[A-Z]/.test(password) },
                  { label: "Lowercase letter (a–z)", test: /[a-z]/.test(password) },
                  { label: "Number (0–9)", test: /[0-9]/.test(password) },
                  { label: "Special character (@, #, ! etc.)", test: /[^A-Za-z0-9]/.test(password) },
                ].map(({ label, test }) => (
                  <li
                    key={label}
                    className={`pw-req-item ${
                      password.length === 0
                        ? ""
                        : test
                        ? "pw-req-met"
                        : "pw-req-unmet"
                    }`}
                  >
                    <span className="pw-req-icon">
                      {password.length === 0 ? "○" : test ? "✓" : "✕"}
                    </span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="form-row-2col">
            <div className="form-group">
              <label htmlFor="reg-teach">What can you teach?</label>
              <input
                id="reg-teach"
                type="text"
                placeholder="e.g. Python, UI Design"
                value={primaryTeachSkill}
                onChange={(e) => setPrimaryTeachSkill(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="reg-learn">What do you want to learn?</label>
              <input
                id="reg-learn"
                type="text"
                placeholder="e.g. React, SEO, French"
                value={primaryLearnSkill}
                onChange={(e) => setPrimaryLearnSkill(e.target.value)}
                className="form-input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={isLoading || (passwordTouched && !passwordIsValid)}
          >
            {isLoading ? "Creating Account..." : "Create Free Account"}
          </button>
        </form>

        <div className="auth-footer-prompt">
          Already have an account? <Link to="/login">Sign in here</Link>
        </div>
      </div>
    </div>
  );
}
