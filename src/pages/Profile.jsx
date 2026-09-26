import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSkillSwap } from "../context/SkillSwapContext";
import { Icon } from "../components/Icons";
import { EXPERIENCE_LEVELS, AVAILABILITY_OPTIONS } from "../data/initialData";

export default function Profile() {
  const {
    currentUser,
    currentUserId,
    skillsOffered,
    skillsWanted,
    activeSwaps,
    updateProfile,
    getProfileCompleteness,
    getReviewsForUser,
    getAverageRating,
    submitReview,
    getUserById,
  } = useSkillSwap();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || "");
  const [role, setRole] = useState(currentUser?.role || "");
  const [location, setLocation] = useState(currentUser?.location || "");
  const [bio, setBio] = useState(currentUser?.bio || "");
  const [experienceLevel, setExperienceLevel] = useState(currentUser?.experienceLevel || "Intermediate");
  const [availability, setAvailability] = useState(currentUser?.availability || "");
  const [avatarColor, setAvatarColor] = useState(currentUser?.avatarColor || "purple");
  const [interestsString, setInterestsString] = useState(
    (currentUser?.interests || []).join(", ")
  );

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewTargetSwapId, setReviewTargetSwapId] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewTargetUserId, setReviewTargetUserId] = useState("");

  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setRole(currentUser.role || "");
      setLocation(currentUser.location || "");
      setBio(currentUser.bio || "");
      setExperienceLevel(currentUser.experienceLevel || "Intermediate");
      setAvailability(currentUser.availability || "");
      setAvatarColor(currentUser.avatarColor || "purple");
      setInterestsString((currentUser.interests || []).join(", "));
    }
  }, [currentUser]);

  const profileStatus = getProfileCompleteness();

  if (!currentUser) {
    return (
      <div className="profile-page-wrapper">
        <div className="empty-state-box" style={{ padding: "60px 20px" }}>
          <div className="empty-icon-wrap">
            <Icon name="user" size={32} />
          </div>
          <h2>Please Log In to View Your Profile</h2>
          <p>You need to be signed in to view and edit your profile.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
            <Link to="/login" className="btn btn-primary">Log In</Link>
            <Link to="/register" className="btn btn-outline">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  // Dynamic reviews & rating for this user
  const myReviews = getReviewsForUser(currentUserId);
  const avgRating = getAverageRating(currentUserId);

  const handleSave = (e) => {
    e.preventDefault();
    const updatedInterests = interestsString
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const initials = name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    updateProfile({
      name,
      role,
      initials: initials || currentUser.initials,
      location,
      bio,
      experienceLevel,
      availability,
      avatarColor,
      interests: updatedInterests,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(currentUser.name);
    setRole(currentUser.role);
    setLocation(currentUser.location || "");
    setBio(currentUser.bio || "");
    setExperienceLevel(currentUser.experienceLevel || "Intermediate");
    setAvailability(currentUser.availability || "");
    setAvatarColor(currentUser.avatarColor || "purple");
    setInterestsString((currentUser.interests || []).join(", "));
    setIsEditing(false);
  };

  const handleOpenReviewForm = (swapId, partnerId) => {
    setReviewTargetSwapId(swapId);
    setReviewTargetUserId(partnerId);
    setReviewRating(5);
    setReviewComment("");
    setShowReviewForm(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewTargetUserId) return;
    const success = submitReview({
      reviewedUserId: reviewTargetUserId,
      rating: reviewRating,
      comment: reviewComment,
      swapId: reviewTargetSwapId || null,
    });
    if (success) {
      setShowReviewForm(false);
    }
  };

  return (
    <div className="profile-page-wrapper">
      {/* Profile Banner */}
      <section className="profile-banner-card">
        <div className="profile-banner-backdrop"></div>
        <div className="profile-banner-inner">
          <div className="profile-avatar-stack">
            <div className={`avatar profile-avatar-xl ${currentUser.avatarColor || "purple"}`}>
              {currentUser.initials}
            </div>
          </div>

          <div className="profile-summary-header">
            <div className="profile-name-group">
              <h1 className="profile-full-name">{currentUser.name}</h1>
              <p className="profile-role-headline">{currentUser.role}</p>
              <div className="profile-meta-pills">
                <span className="info-pill">
                  <Icon name="map-pin" size={14} /> {currentUser.location}
                </span>
                {avgRating !== null ? (
                  <span className="info-pill rating-pill">
                    <Icon name="star" size={14} /> {avgRating} ({myReviews.length} peer review{myReviews.length !== 1 ? "s" : ""})
                  </span>
                ) : (
                  <span className="info-pill">
                    <Icon name="star" size={14} /> No reviews yet
                  </span>
                )}
                <span className="info-pill badge-level">
                  {currentUser.experienceLevel || "Experienced"}
                </span>
                <span className="info-pill">
                  <Icon name="clock" size={14} /> {currentUser.availability}
                </span>
              </div>
            </div>

            <div className="profile-actions-toolbar">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                <Icon name="edit" size={16} /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main 2-column layout */}
      <div className="profile-content-grid">
        {/* Left Column */}
        <div className="profile-primary-column">
          {/* About Me */}
          <div className="dashboard-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>About Me</h3>
              </div>
            </div>
            <p className="profile-bio-full">{currentUser.bio}</p>

            {currentUser.interests && currentUser.interests.length > 0 && (
              <div className="interests-tags-wrap">
                <h4>Topic Interests</h4>
                <div className="interests-cloud">
                  {currentUser.interests.map((interest, idx) => (
                    <span key={idx} className="interest-tag">
                      #{interest}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills Offered */}
          <div className="dashboard-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>Skills I Teach (Offered)</h3>
                <span className="count-pill">{skillsOffered.length} skills</span>
              </div>
              <Link to="/my-skills" className="header-view-all">
                Manage skills <Icon name="arrow-right" size={13} />
              </Link>
            </div>

            {skillsOffered.length > 0 ? (
              <div className="skills-grid-profile">
                {skillsOffered.map((skill) => (
                  <div key={skill.id} className="profile-skill-card">
                    <div className="skill-card-top">
                      <span className="skill-category-badge">{skill.category}</span>
                      <span className="skill-level-badge level-expert">{skill.level}</span>
                    </div>
                    <h4>{skill.name}</h4>
                    <p>{skill.description}</p>
                    {skill.hoursPerWeek && (
                      <span className="skill-time-info">
                        <Icon name="clock" size={12} /> {skill.hoursPerWeek} hrs/week
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-box">
                <p>No skills offered yet.</p>
                <Link to="/my-skills" className="btn btn-outline btn-sm">Add a Skill to Teach</Link>
              </div>
            )}
          </div>

          {/* Skills Wanted */}
          <div className="dashboard-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>Skills I Want to Learn (Wishlist)</h3>
                <span className="count-pill">{skillsWanted.length} skills</span>
              </div>
              <Link to="/my-skills" className="header-view-all">
                Update wishlist <Icon name="arrow-right" size={13} />
              </Link>
            </div>

            {skillsWanted.length > 0 ? (
              <div className="skills-grid-profile">
                {skillsWanted.map((skill) => (
                  <div key={skill.id} className="profile-skill-card wanted-border">
                    <div className="skill-card-top">
                      <span className="skill-category-badge">{skill.category}</span>
                      <span className="skill-level-badge level-beginner">Target: {skill.level}</span>
                    </div>
                    <h4>{skill.name}</h4>
                    <p>{skill.description}</p>
                    <span className="tag tag-learn">Priority: {skill.priority || "High"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-box">
                <p>No skills in your wishlist yet.</p>
                <Link to="/my-skills" className="btn btn-outline btn-sm">Add Skills to Learn</Link>
              </div>
            )}
          </div>

          {/* Community Endorsements & Reviews — DYNAMIC */}
          <div className="dashboard-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>Community Endorsements &amp; Reviews</h3>
                {avgRating !== null && (
                  <span className="count-pill">★ {avgRating} average</span>
                )}
              </div>
            </div>

            {myReviews.length > 0 ? (
              <div className="endorsements-list">
                {myReviews.map((review) => (
                  <div key={review.id} className="review-card-item">
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
                      <time className="review-date">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </time>
                    </div>
                    {review.comment && (
                      <p className="review-text">&quot;{review.comment}&quot;</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-box">
                <div className="empty-icon-wrap">
                  <Icon name="star" size={24} />
                </div>
                <h4>No reviews yet</h4>
                <p>Complete a skill exchange to receive your first review.</p>
              </div>
            )}

            {/* Leave a review for a swap partner */}
            {activeSwaps.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <h4 style={{ marginBottom: "10px", fontSize: "14px", color: "var(--text-secondary)" }}>
                  Review a swap partner:
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {activeSwaps.map((swap) => (
                    <button
                      key={swap.id}
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleOpenReviewForm(swap.id, swap.partnerId)}
                    >
                      <Icon name="star" size={13} /> Review {swap.partnerName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="profile-secondary-column">
          {/* Profile Completeness */}
          <div className="dashboard-card side-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>Profile Completeness</h3>
              </div>
              <span className="badge-soft-purple">{profileStatus.percentage}%</span>
            </div>

            <div className="progress-container">
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${profileStatus.percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="checklist-items-grid compact">
              {profileStatus.checks.map((check) => (
                <div
                  key={check.id}
                  className={`checklist-item ${check.done ? "item-completed" : "item-pending"}`}
                >
                  <div className="check-icon">
                    <Icon name={check.done ? "check" : "clock"} size={12} />
                  </div>
                  <span>{check.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Swap Performance Metrics */}
          <div className="dashboard-card side-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>Exchange Record</h3>
              </div>
            </div>

            <div className="profile-metrics-list">
              <div className="metric-row">
                <span className="metric-title">Completed Swaps</span>
                <strong className="metric-val">{currentUser.completedSwaps || 0} sessions</strong>
              </div>
              <div className="metric-row">
                <span className="metric-title">Overall Rating</span>
                <strong className="metric-val text-purple">
                  {avgRating !== null ? `★ ${avgRating}` : "No ratings yet"}
                </strong>
              </div>
              <div className="metric-row">
                <span className="metric-title">Total Reviews</span>
                <strong className="metric-val">{myReviews.length}</strong>
              </div>
              <div className="metric-row">
                <span className="metric-title">Member Since</span>
                <strong className="metric-val">{currentUser.joinedDate || "Recently Joined"}</strong>
              </div>
            </div>
          </div>

          {/* App Settings */}
          <div className="dashboard-card side-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>App Settings</h3>
              </div>
            </div>
            <p className="demo-hint-text">
              All your edits, requests, skills, messages, and reviews persist in your browser&apos;s local storage.
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="modal-backdrop" onClick={handleCancel} role="dialog" aria-modal="true">
          <div className="modal-box modal-box-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Your Profile</h3>
              <button className="icon-close-btn" onClick={handleCancel} aria-label="Close">
                <Icon name="x" size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="edit-name">Full Name *</label>
                  <input
                    id="edit-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-role">Headline / Professional Title *</label>
                  <input
                    id="edit-role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="edit-location">Location / Timezone</label>
                  <input
                    id="edit-location"
                    type="text"
                    placeholder="e.g. Brooklyn, NY (EST)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-avatar">Avatar Accent Color</label>
                  <select
                    id="edit-avatar"
                    value={avatarColor}
                    onChange={(e) => setAvatarColor(e.target.value)}
                    className="form-select"
                  >
                    <option value="purple">Purple Accent</option>
                    <option value="indigo">Indigo Accent</option>
                    <option value="violet">Violet Accent</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="edit-level">Experience Level</label>
                  <select
                    id="edit-level"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="form-select"
                  >
                    {EXPERIENCE_LEVELS.filter((l) => l !== "All Levels").map((lvl) => (
                      <option key={lvl} value={lvl}>{lvl}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-avail">Weekly Availability</label>
                  <select
                    id="edit-avail"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="form-select"
                  >
                    {AVAILABILITY_OPTIONS.filter((a) => a !== "All Availability").map((avail) => (
                      <option key={avail} value={avail}>{avail}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="edit-bio">Bio &amp; Background *</label>
                <textarea
                  id="edit-bio"
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="form-textarea"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="edit-interests">Topic Interests (comma-separated)</label>
                <input
                  id="edit-interests"
                  type="text"
                  placeholder="Design Systems, Prototyping, Frontend, AI"
                  value={interestsString}
                  onChange={(e) => setInterestsString(e.target.value)}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leave a Review Modal */}
      {showReviewForm && (
        <div
          className="modal-backdrop"
          onClick={() => setShowReviewForm(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Leave a Review</h3>
              <button
                className="icon-close-btn"
                onClick={() => setShowReviewForm(false)}
                aria-label="Close"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="modal-form">
              <div className="form-group">
                <label>Rating (1–5)</label>
                <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      style={{
                        fontSize: "24px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: star <= reviewRating ? "#f59e0b" : "#d1d5db",
                      }}
                      aria-label={`${star} star`}
                    >
                      ★
                    </button>
                  ))}
                  <span style={{ marginLeft: "8px", alignSelf: "center", fontWeight: 600 }}>
                    {reviewRating}/5
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="review-comment">Your Review (optional)</label>
                <textarea
                  id="review-comment"
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share what you learned or how the exchange went..."
                  className="form-textarea"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowReviewForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}