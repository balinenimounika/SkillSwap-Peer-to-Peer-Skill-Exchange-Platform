import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icons";

export default function Footer() {
  return (
    <footer className="footer-modern">
      <div className="footer-inner">
        <div className="footer-brand-column">
          <div className="brand-logo footer-logo">
            <div className="brand-icon">
              <Icon name="swap" size={18} />
            </div>
            <span className="brand-name">Skill<span>Swap</span></span>
          </div>
          <p className="footer-bio">
            The modern peer-to-peer skill exchange platform. Trade knowledge, expand your capabilities, and collaborate with passionate creators worldwide.
          </p>
          <div className="footer-badge-guarantee">
            <Icon name="shield-check" size={16} /> 100% Free Peer Learning Community
          </div>
        </div>

        <div className="footer-links-grid">
          <div className="footer-nav-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/find-skills">Find Skills</Link></li>
              <li><Link to="/my-skills">My Skills</Link></li>
              <li><Link to="/requests">Swap Requests</Link></li>
              <li><Link to="/dashboard">User Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Popular Categories</h4>
            <ul>
              <li><Link to="/find-skills">Web Development</Link></li>
              <li><Link to="/find-skills">UI/UX Design</Link></li>
              <li><Link to="/find-skills">AI & Machine Learning</Link></li>
              <li><Link to="/find-skills">Career Coaching</Link></li>
            </ul>
          </div>

          <div className="footer-nav-col">
            <h4>Community</h4>
            <ul>
              <li><Link to="/profile">My Profile</Link></li>
              <li><Link to="/messages">Direct Messages</Link></li>
              <li><Link to="/register">Join the Network</Link></li>
              <li><Link to="/login">Account Access</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p>© {new Date().getFullYear()} SkillSwap Inc. Built for continuous peer-to-peer growth.</p>
          <div className="footer-legal-links">
            <span>Community Guidelines</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Exchange</span>
          </div>
        </div>
      </div>
    </footer>
  );
}