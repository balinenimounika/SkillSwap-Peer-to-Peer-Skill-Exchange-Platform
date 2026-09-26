import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icons";
import RequestSwapModal from "./RequestSwapModal";
import UserProfileModal from "./UserProfileModal";
import { useSkillSwap } from "../context/SkillSwapContext";

export default function UserCard({ user }) {
  const navigate = useNavigate();
  const { currentUserId, startOrOpenConversation } = useSkillSwap();
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const isSelf = currentUserId && user.id === currentUserId;

  // Normalize skills
  const offered = user.skillsOffered || (user.skills ? user.skills.map((s) => ({ name: s, level: "Proficient" })) : []);
  const wanted = user.skillsWanted || [];

  const handleStartConversation = () => {
    if (!currentUserId || isSelf) return;
    startOrOpenConversation(user.id);
    navigate("/messages", { state: { openConversationWith: user.id } });
  };

  return (
    <>
      <article className="user-card-modern">
        {/* Top Header */}
        <div className="user-card-header">
          <div className="user-avatar-wrap">
            <div className={`avatar ${user.avatarColor || user.color || "purple"}`}>
              {user.initials}
            </div>
            <span className="online-indicator" title="Active on SkillSwap"></span>
          </div>

          <div className="user-header-info">
            <div className="user-name-row">
              <h3 className="user-name">{user.name}</h3>
            </div>
            <p className="user-role-title">{user.role}</p>
            <div className="user-meta-sub">
              {user.location && (
                <span className="meta-loc">
                  <Icon name="map-pin" size={13} /> {user.location}
                </span>
              )}
              {user.experienceLevel && (
                <span className="experience-badge">{user.experienceLevel}</span>
              )}
            </div>
          </div>
        </div>

        {/* Bio preview */}
        {user.bio && (
          <p className="user-card-bio">
            {user.bio.length > 95 ? `${user.bio.slice(0, 95)}...` : user.bio}
          </p>
        )}

        {/* Skills Section */}
        <div className="user-skills-container">
          <div className="skill-group">
            <div className="skill-group-label">
              <span className="dot dot-green"></span>
              <span>Can Teach</span>
            </div>
            <div className="skills-tag-list">
              {offered.slice(0, 3).map((s, idx) => (
                <span key={idx} className="tag tag-teach">
                  {typeof s === "string" ? s : s.name}
                </span>
              ))}
              {offered.length > 3 && (
                <span className="tag tag-more">+{offered.length - 3}</span>
              )}
            </div>
          </div>

          <div className="skill-group">
            <div className="skill-group-label">
              <span className="dot dot-purple"></span>
              <span>Wants to Learn</span>
            </div>
            <div className="skills-tag-list">
              {wanted.length > 0 ? (
                <>
                  {wanted.slice(0, 2).map((s, idx) => (
                    <span key={idx} className="tag tag-learn">
                      {typeof s === "string" ? s : s.name}
                    </span>
                  ))}
                  {wanted.length > 2 && (
                    <span className="tag tag-more">+{wanted.length - 2}</span>
                  )}
                </>
              ) : (
                <span className="tag-muted">Open to suggestions</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="user-card-actions">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => setShowProfileModal(true)}
          >
            View Profile
          </button>
          {!isSelf && (
            <>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={handleStartConversation}
              >
                <Icon name="message" size={14} /> Message
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowSwapModal(true)}
              >
                <Icon name="swap" size={14} /> Request Swap
              </button>
            </>
          )}
        </div>
      </article>

      {showSwapModal && (
        <RequestSwapModal
          user={user}
          onClose={() => setShowSwapModal(false)}
        />
      )}

      {showProfileModal && (
        <UserProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </>
  );
}
