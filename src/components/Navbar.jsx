import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSkillSwap } from "../context/SkillSwapContext";
import { Icon } from "./Icons";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, stats, isAuthenticated, logout } = useSkillSwap();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile drawer upon navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar-container">
      <nav className="navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" aria-label="SkillSwap Home">
          <div className="brand-icon">
            <Icon name="swap" size={20} />
          </div>
          <span className="brand-name">
            Skill<span>Swap</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-desktop-links">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/find-skills"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Find Skills
          </NavLink>

          <NavLink
            to="/my-skills"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            My Skills
          </NavLink>

          <NavLink
            to="/requests"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Requests
            {stats.pendingRequestsCount > 0 && (
              <span className="nav-counter-badge" title={`${stats.pendingRequestsCount} pending requests`}>
                {stats.pendingRequestsCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/messages"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Messages
            {stats.unreadMessagesCount > 0 && (
              <span className="nav-counter-badge pulse" title={`${stats.unreadMessagesCount} unread messages`}>
                {stats.unreadMessagesCount}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Profile
          </NavLink>
        </div>

        {/* User Account / Auth Actions */}
        <div className="nav-user-actions">
          {isAuthenticated && currentUser ? (
            <div className="auth-user-menu">
              <Link to="/profile" className="user-profile-chip" title="View Profile">
                <div className={`avatar mini ${currentUser.avatarColor || "purple"}`}>
                  {currentUser.initials}
                </div>
                <span className="chip-name">{(currentUser.name || "Member").split(" ")[0]}</span>
              </Link>

              <button
                type="button"
                className="logout-action-btn"
                onClick={handleLogout}
                title="Log out"
              >
                <Icon name="logout" size={16} />
                <span className="logout-text">Log out</span>
              </button>
            </div>
          ) : (
            <div className="guest-action-buttons">
              <Link to="/login" className="btn btn-ghost btn-sm">
                Log in
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Icon name={mobileMenuOpen ? "x" : "menu"} size={22} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-user-info">
                {isAuthenticated && currentUser ? (
                  <>
                    <div className={`avatar medium ${currentUser.avatarColor || "purple"}`}>
                      {currentUser.initials}
                    </div>
                    <div>
                      <div className="drawer-user-name">{currentUser.name}</div>
                      <div className="drawer-user-role">{currentUser.role}</div>
                    </div>
                  </>
                ) : (
                  <div className="drawer-brand">
                    <span className="brand-name">Skill<span>Swap</span></span>
                  </div>
                )}
              </div>
              <button
                type="button"
                className="icon-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <div className="drawer-nav-list">
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `drawer-item ${isActive ? "active" : ""}`}
              >
                <Icon name="sparkles" size={18} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/find-skills"
                className={({ isActive }) => `drawer-item ${isActive ? "active" : ""}`}
              >
                <Icon name="search" size={18} />
                <span>Find Skills</span>
              </NavLink>

              <NavLink
                to="/my-skills"
                className={({ isActive }) => `drawer-item ${isActive ? "active" : ""}`}
              >
                <Icon name="book" size={18} />
                <span>My Skills</span>
                <span className="drawer-pill">{stats.skillsOfferedCount}</span>
              </NavLink>

              <NavLink
                to="/requests"
                className={({ isActive }) => `drawer-item ${isActive ? "active" : ""}`}
              >
                <Icon name="swap" size={18} />
                <span>Requests</span>
                {stats.pendingRequestsCount > 0 && (
                  <span className="drawer-pill badge-alert">{stats.pendingRequestsCount}</span>
                )}
              </NavLink>

              <NavLink
                to="/messages"
                className={({ isActive }) => `drawer-item ${isActive ? "active" : ""}`}
              >
                <Icon name="messages" size={18} />
                <span>Messages</span>
                {stats.unreadMessagesCount > 0 && (
                  <span className="drawer-pill badge-alert">{stats.unreadMessagesCount}</span>
                )}
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) => `drawer-item ${isActive ? "active" : ""}`}
              >
                <Icon name="user" size={18} />
                <span>Profile</span>
              </NavLink>
            </div>

            <div className="drawer-footer">
              {isAuthenticated ? (
                <button
                  type="button"
                  className="btn btn-outline-danger btn-block"
                  onClick={handleLogout}
                >
                  <Icon name="logout" size={16} /> Log Out
                </button>
              ) : (
                <div className="drawer-auth-buttons">
                  <Link to="/login" className="btn btn-outline btn-block">
                    Log In
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-block">
                    Sign Up Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}