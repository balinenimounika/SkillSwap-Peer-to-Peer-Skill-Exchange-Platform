import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "./Icons";
import RequestSwapModal from "./RequestSwapModal";
import { useSkillSwap } from "../context/SkillSwapContext";

export default function UserProfileModal({ user, onClose }) {
  const navigate = useNavigate();
  const { currentUserId, startOrOpenConversation, getReviewsForUser, getAverageRating } = useSkillSwap();
  const [showSwapModal, setShowSwapModal] = useState(false);

  // Safety: do not allow actions on own profile
  const isSelf = currentUserId && user.id === currentUserId;

  // Reviews for this community user
  const userReviews = getReviewsForUser ? getReviewsForUser(user.id) : [];
  const avgRating = getAverageRating ? getAverageRating(user.id) : null;

  const handleStartConversation = () => {
    if (!currentUserId || isSelf) return;
    startOrOpenConversation(user.id);
    onClose();
    navigate("/messages", { state: { openConversationWith: user.id } });
  };

  if (showSwapModal) {
    return (
      <RequestSwapModal
        user={user}
        onClose={() => {
          setShowSwapModal(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box profile-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="profile-modal-top">
            <div className={`avatar large ${user.avatarColor || "purple"}`}>
              {user.initials}
            </div>
            <div className="profile-modal-meta">
              <h3>{user.name}</h3>
              <p className="user-role-text">{user.role}</p>
              <div className="user-tags-row">
                <span className="info-pill">
                  <Icon name="map-pin" size={14} /> {user.location}
                </span>
                {avgRating !== null ? (
                  <span className="info-pill rating-pill">
                    <Icon name="star" size={14} /> {avgRating} ({userReviews.length} review{userReviews.length !== 1 ? "s" : ""})
                  </span>
                ) : (
                  <span className="info-pill">
                    <Icon name="star" size={14} /> No reviews yet
                  </span>
                )}
                <span className="info-pill badge-level">
                  {user.experienceLevel || "Experienced"}
                </span>
              </div>
            </div>
          </div>
          <button className="icon-close-btn" onClick={onClose} aria-label="Close modal">
            <Icon name="x" size={20} />
          </button>
        </div>

        <div className="profile-modal-body">
          {/* Bio */}
          <div className="profile-section">
            <h4>About</h4>
            <p className="profile-bio-text">
              {user.bio || "Passionate about trading real-world skills and collaborating on great projects."}
            </p>
          </div>

          {/* Availability */}
          <div className="profile-section">
            <h4>Availability</h4>
            <p className="profile-availability-text">
              <Icon name="clock" size={15} /> {user.availability || "Flexible (5-10 hrs/week)"}
            </p>
          </div>

          {/* Skills Offered */}
          <div className="profile-section">
            <h4>Skills Offered (Can Teach)</h4>
            <div className="skills-badge-grid">
              {(user.skillsOffered || user.skills || []).map((skill, i) => {
                const sName = typeof skill === "string" ? skill : skill.name;
                const sLevel = typeof skill === "object" ? skill.level : "Expert";
                return (
                  <div key={i} className="skill-pill offered">
                    <span className="pill-dot green"></span>
                    <span className="pill-name">{sName}</span>
                    {sLevel && <span className="pill-level">{sLevel}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills Wanted */}
          <div className="profile-section">
            <h4>Skills Wanted (Looking to Learn)</h4>
            <div className="skills-badge-grid">
              {(user.skillsWanted || []).map((skill, i) => {
                const sName = typeof skill === "string" ? skill : skill.name;
                const sLevel = typeof skill === "object" ? skill.level : "Beginner";
                return (
                  <div key={i} className="skill-pill wanted">
                    <span className="pill-dot purple"></span>
                    <span className="pill-name">{sName}</span>
                    {sLevel && <span className="pill-level">{sLevel}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews */}
          {userReviews.length > 0 && (
            <div className="profile-section">
              <h4>Community Reviews</h4>
              {userReviews.slice(0, 2).map((review) => (
                <div key={review.id} className="review-card-item" style={{ marginBottom: "8px" }}>
                  <div className="review-card-header">
                    <div className={`avatar mini ${review.reviewerAvatarColor || "purple"}`}>
                      {review.reviewerInitials}
                    </div>
                    <div>
                      <strong>{review.reviewerName}</strong>
                      <div className="review-stars">
                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                      </div>
                    </div>
                  </div>
                  {review.comment && (
                    <p className="review-text">&quot;{review.comment}&quot;</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          {!isSelf && (
            <>
              <button
                className="btn btn-outline"
                onClick={handleStartConversation}
              >
                <Icon name="message" size={16} /> Start Conversation
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowSwapModal(true)}
              >
                <Icon name="swap" size={16} /> Request Skill Swap
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
