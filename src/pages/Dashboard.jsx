import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSkillSwap } from "../context/SkillSwapContext";
import { Icon } from "../components/Icons";
import UserCard from "../components/UserCard";
import RequestCard from "../components/RequestCard";

export default function Dashboard() {
  const {
    currentUser,
    currentUserId,
    stats,
    skillsOffered,
    skillsWanted,
    communityUsers,
    swapRequests,
    activeSwaps,
    upcomingSessions,
    myConversations,
    recentActivity,
    respondToRequest,
    getProfileCompleteness,
    isAuthenticated,
    startOrOpenConversation,
  } = useSkillSwap();

  const navigate = useNavigate();
  const [selectedRequestDetails, setSelectedRequestDetails] = useState(null);

  const profileStatus = getProfileCompleteness();
  const pendingReceivedRequests = swapRequests.filter(
    (r) => r.type === "received" && r.status === "pending"
  );

  // Dynamic Recommended Matches: Find community members offering skills that current user wants!
  const recommendedMatches = useMemo(() => {
    if (!communityUsers || communityUsers.length === 0) return [];

    const wantedSkillNames = skillsWanted.map((s) => s.name.toLowerCase());

    // Score users by matching offered skills against current user's wanted skills
    const scored = communityUsers.map((user) => {
      let score = 0;
      const userOffered = (user.skillsOffered || []).map((s) =>
        (typeof s === "string" ? s : s.name).toLowerCase()
      );

      wantedSkillNames.forEach((w) => {
        if (userOffered.some((o) => o.includes(w) || w.includes(o))) {
          score += 10;
        }
      });

      return { user, score };
    });

    // Sort by match score first, then rating
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (b.user.rating || 0) - (a.user.rating || 0);
    });

    return scored.slice(0, 3).map((item) => item.user);
  }, [communityUsers, skillsWanted]);

  // If not authenticated, prompt to log in
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="dashboard-page">
        <div className="empty-state-box" style={{ padding: "60px 20px" }}>
          <div className="empty-icon-wrap">
            <Icon name="user" size={32} />
          </div>
          <h2>Please Log In to View Your Dashboard</h2>
          <p>You need to be signed in to see your personalized skills, swap requests, and sessions.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
            <Link to="/login" className="btn btn-primary">
              Log In
            </Link>
            <Link to="/register" className="btn btn-outline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* 1. Personalized Welcome Section */}
      <section className="dashboard-welcome-banner">
        <div className="welcome-content">
          <div className="welcome-tag">
            <span className="live-pulse"></span> Peer-to-Peer Skill Exchange
          </div>
          <h1 className="welcome-title">
            Welcome back, <span className="highlight-text">{currentUser.name}</span>!
          </h1>
          <p className="welcome-subtext">
            You're currently offering <strong className="text-purple">{stats.skillsOfferedCount} skill{stats.skillsOfferedCount === 1 ? "" : "s"}</strong> and looking to learn <strong className="text-purple">{stats.skillsWantedCount} skill{stats.skillsWantedCount === 1 ? "" : "s"}</strong>.
          </p>
        </div>

        <div className="welcome-actions">
          <Link to="/find-skills" className="btn btn-primary">
            <Icon name="search" size={16} /> Discover Matches
          </Link>
          <Link to="/my-skills" className="btn btn-outline">
            <Icon name="plus" size={16} /> Add a Skill
          </Link>
        </div>
      </section>

      {/* 2. Four Dynamic Statistic Cards Grid */}
      <section className="stats-cards-grid" aria-label="Overview statistics">
        {/* Skills Offered Card */}
        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Icon name="sparkles" size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.skillsOfferedCount}</span>
            <span className="stat-label">Skills Offered</span>
          </div>
          <Link to="/my-skills" className="stat-link" aria-label="Manage offered skills">
            Manage <Icon name="arrow-right" size={13} />
          </Link>
        </div>

        {/* Skills Wanted Card */}
        <div className="stat-card">
          <div className="stat-icon-wrapper indigo">
            <Icon name="book" size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.skillsWantedCount}</span>
            <span className="stat-label">Skills Wanted</span>
          </div>
          <Link to="/my-skills" className="stat-link" aria-label="Manage wanted skills">
            Wishlist <Icon name="arrow-right" size={13} />
          </Link>
        </div>

        {/* Pending Requests Card */}
        <div className="stat-card">
          <div className="stat-icon-wrapper amber">
            <Icon name="swap" size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.pendingRequestsCount}</span>
            <span className="stat-label">Pending Requests</span>
          </div>
          <Link to="/requests" className="stat-link" aria-label="Review pending requests">
            Review <Icon name="arrow-right" size={13} />
          </Link>
        </div>

        {/* Active Swaps Card */}
        <div className="stat-card">
          <div className="stat-icon-wrapper emerald">
            <Icon name="users" size={22} />
          </div>
          <div className="stat-data">
            <span className="stat-value">{stats.activeSwapsCount}</span>
            <span className="stat-label">Active Swaps</span>
          </div>
          <span className="stat-badge-active">
            {stats.activeSwapsCount > 0 ? "In Progress" : "None Active"}
          </span>
        </div>
      </section>

      {/* Main Dashboard Layout: Two Columns */}
      <div className="dashboard-grid-layout">
        {/* Left Column (Profile card, Pending Requests, Matches, Active Swaps) */}
        <div className="dashboard-primary-col">
          {/* 3. Dynamic Profile Completion Card */}
          <div className="dashboard-card profile-completion-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <span className="badge-soft-purple">Profile Status</span>
                <h3>Complete Your Profile</h3>
              </div>
              <Link to="/profile" className="btn btn-outline btn-sm">
                <Icon name="edit" size={14} /> Edit Profile
              </Link>
            </div>

            <div className="progress-container">
              <div className="progress-info-row">
                <span className="progress-text">
                  <strong>{profileStatus.percentage}% completed</strong> ({profileStatus.completedCount} of {profileStatus.totalCount} items finished)
                </span>
                <span className="progress-status-badge">
                  {profileStatus.percentage === 100 ? "100% Ready for swaps" : `${profileStatus.percentage}% done`}
                </span>
              </div>
              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${profileStatus.percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="checklist-items-grid">
              {profileStatus.checks.map((check) => (
                <div
                  key={check.id}
                  className={`checklist-item ${check.done ? "item-completed" : "item-pending"}`}
                >
                  <div className="check-icon">
                    <Icon name={check.done ? "check" : "clock"} size={13} />
                  </div>
                  <span>{check.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Pending Requests Section */}
          <div className="dashboard-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>Pending Swap Requests</h3>
                <span className="count-pill">{pendingReceivedRequests.length} incoming</span>
              </div>
              <Link to="/requests" className="header-view-all">
                View all requests <Icon name="arrow-right" size={13} />
              </Link>
            </div>

            {pendingReceivedRequests.length > 0 ? (
              <div className="requests-stack">
                {pendingReceivedRequests.map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    onAccept={(id) => respondToRequest(id, "accept")}
                    onReject={(id) => respondToRequest(id, "reject")}
                    onViewDetails={(r) => setSelectedRequestDetails(r)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state-box">
                <div className="empty-icon-wrap">
                  <Icon name="check" size={26} />
                </div>
                <h4>All caught up!</h4>
                <p>You have no pending incoming requests right now.</p>
                <Link to="/find-skills" className="btn btn-outline btn-sm">
                  Propose an Exchange
                </Link>
              </div>
            )}
          </div>

          {/* 5. Recommended Matches For You */}
          <div className="dashboard-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>Recommended Skills / Matches for You</h3>
                <p className="card-subtitle">Community members matching your learning interests</p>
              </div>
              <Link to="/find-skills" className="header-view-all">
                Explore all members <Icon name="arrow-right" size={13} />
              </Link>
            </div>

            {recommendedMatches.length > 0 ? (
              <div className="matches-cards-grid">
                {recommendedMatches.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            ) : (
              <div className="empty-state-box">
                <div className="empty-icon-wrap">
                  <Icon name="search" size={24} />
                </div>
                <h4>No matches yet</h4>
                <p>Add more skills you want to learn to discover better matches.</p>
                <Link to="/my-skills" className="btn btn-primary btn-sm">
                  Add Skills
                </Link>
              </div>
            )}
          </div>

          {/* 6. Active Skill Swaps Section */}
          <div className="dashboard-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>Active Skill Swaps</h3>
                <span className="count-pill">{activeSwaps.length} ongoing</span>
              </div>
            </div>

            {activeSwaps.length > 0 ? (
              <div className="active-swaps-list">
                {activeSwaps.map((swap) => (
                  <div key={swap.id} className="active-swap-row">
                    <div className="swap-partner-col">
                      <div className={`avatar small ${swap.partnerColor || "purple"}`}>
                        {swap.partnerAvatar}
                      </div>
                      <div>
                        <strong className="partner-name">{swap.partnerName}</strong>
                        <div className="partner-role">{swap.partnerRole}</div>
                      </div>
                    </div>

                    <div className="swap-skills-col">
                      <div className="exchange-mini-pill">
                        <span className="mini-label">You teach:</span>
                        <span className="skill-name-bold">{swap.mySkill}</span>
                      </div>
                      <Icon name="swap" size={14} className="swap-arrow" />
                      <div className="exchange-mini-pill">
                        <span className="mini-label">You learn:</span>
                        <span className="skill-name-bold">{swap.theirSkill}</span>
                      </div>
                    </div>

                    <div className="swap-progress-col">
                      <div className="progress-details">
                        <span>Sessions: {swap.completedSessions}/{swap.totalSessions}</span>
                        <span>{swap.progress}%</span>
                      </div>
                      <div className="mini-progress-bar">
                        <div
                          className="mini-progress-fill"
                          style={{ width: `${swap.progress}%` }}
                        ></div>
                      </div>
                      <span className="swap-next-time">
                        <Icon name="calendar" size={12} /> {swap.nextSession}
                      </span>
                    </div>

                    <div className="swap-action-col">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          startOrOpenConversation(swap.partnerId);
                          navigate("/messages", { state: { openConversationWith: swap.partnerId } });
                        }}
                      >
                        <Icon name="message" size={13} /> Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-box">
                <div className="empty-icon-wrap">
                  <Icon name="swap" size={24} />
                </div>
                <h4>No active swaps</h4>
                <p>You have no ongoing skill exchanges. Review pending requests or discover new members to trade skills with.</p>
                <Link to="/find-skills" className="btn btn-outline btn-sm">
                  Find Skills to Swap
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Upcoming Sessions, Recent Messages, Recent Activity) */}
        <div className="dashboard-secondary-col">
          {/* 7. Dynamic Upcoming Sessions */}
          <div className="dashboard-card side-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>Upcoming Sessions</h3>
              </div>
              <span className="badge-live-sessions">{upcomingSessions.length} Scheduled</span>
            </div>

            {upcomingSessions.length > 0 ? (
              <div className="sessions-vertical-stack">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="session-item-card">
                    <div className="session-type-stripe"></div>
                    <div className="session-main">
                      <div className="session-top">
                        <span className="session-badge-type">
                          {session.exchangeType === "Teaching" ? "Teaching Session" : "Learning Session"}
                        </span>
                        <span className="session-status-confirmed">
                          <Icon name="check" size={12} /> Confirmed
                        </span>
                      </div>

                      <h4 className="session-skill-title">{session.skill}</h4>

                      <div className="session-partner-row">
                        <div className={`avatar mini ${session.partnerColor || "purple"}`}>
                          {session.partnerAvatar}
                        </div>
                        <span>with <strong>{session.partnerName}</strong></span>
                      </div>

                      <div className="session-time-block">
                        <div className="time-line">
                          <Icon name="calendar" size={14} /> {session.date}
                        </div>
                        <div className="time-line">
                          <Icon name="clock" size={14} /> {session.time} ({session.duration || "60 mins"})
                        </div>
                      </div>

                      <a
                        href={session.meetLink || "https://meet.google.com"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm btn-block session-join-btn"
                      >
                        <Icon name="external-link" size={14} /> Join Video Call
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-box">
                <div className="empty-icon-wrap">
                  <Icon name="calendar" size={24} />
                </div>
                <h4>No upcoming sessions</h4>
                <p>When you and an exchange partner confirm a swap, your scheduled sessions will appear here.</p>
              </div>
            )}
          </div>

          {/* 8. Recent Messages */}
          <div className="dashboard-card side-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>Recent Messages</h3>
              </div>
              <Link to="/messages" className="header-view-all">
                Open inbox <Icon name="arrow-right" size={13} />
              </Link>
            </div>

            {myConversations.length > 0 ? (
              <div className="messages-preview-list">
                {myConversations.slice(0, 3).map((conv) => {
                  const otherId = conv.participantIds?.find((id) => id !== currentUserId);
                  const other = otherId ? (communityUsers.find((u) => u.id === otherId) || null) : null;
                  const lastMsg = (conv.messages || []).slice(-1)[0];
                  const unreadCount = (conv.messages || []).filter(
                    (m) => m.senderId !== currentUserId && !m.read
                  ).length;
                  return (
                    <div
                      key={conv.id}
                      className={`message-preview-item ${unreadCount > 0 ? "has-unread" : ""}`}
                      onClick={() => navigate("/messages", { state: { openConversationWith: otherId } })}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="avatar-with-badge">
                        <div className={`avatar small ${other?.avatarColor || "purple"}`}>
                          {other?.initials || "?"}
                        </div>
                      </div>

                      <div className="message-preview-body">
                        <div className="msg-preview-header">
                          <span className="msg-name">{other?.name || "Unknown"}</span>
                          <time className="msg-time">
                            {lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                          </time>
                        </div>
                        <p className="msg-snippet">
                          {lastMsg
                            ? (lastMsg.senderId === currentUserId ? "You: " : "") + lastMsg.text
                            : "No messages yet"}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <span className="unread-dot-counter">{unreadCount}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state-box">
                <p>No messages yet. Connect with a peer to start a conversation.</p>
                <Link to="/find-skills" className="btn btn-outline btn-sm" style={{ marginTop: "8px" }}>
                  Find Skills
                </Link>
              </div>
            )}
          </div>

          {/* 9. Recent Activity */}
          <div className="dashboard-card side-card">
            <div className="card-header-clean">
              <div className="card-title-group">
                <h3>Recent Activity</h3>
              </div>
            </div>

            {recentActivity.length > 0 ? (
              <div className="activity-timeline">
                {recentActivity.slice(0, 5).map((act) => (
                  <div key={act.id} className="timeline-node">
                    <div className={`timeline-icon-wrap ${act.type}`}>
                      <Icon name={act.iconName || "sparkles"} size={14} />
                    </div>
                    <div className="timeline-content">
                      <strong className="timeline-title">{act.title}</strong>
                      <p className="timeline-desc">{act.description}</p>
                      <time className="timeline-time">{act.time}</time>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state-box">
                <p>No recent activity. Actions like adding skills or sending requests will show up here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal if View Details was clicked on a request */}
      {selectedRequestDetails && (
        <div className="modal-backdrop" onClick={() => setSelectedRequestDetails(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Swap Request Details</h3>
              <button
                className="icon-close-btn"
                onClick={() => setSelectedRequestDetails(null)}
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <div className="modal-body-content">
              <div className="request-modal-meta">
                <div className={`avatar medium ${selectedRequestDetails.senderColor || "purple"}`}>
                  {selectedRequestDetails.senderAvatar}
                </div>
                <div>
                  <h4>{selectedRequestDetails.senderName}</h4>
                  <p>{selectedRequestDetails.senderRole} • {selectedRequestDetails.timestamp}</p>
                </div>
              </div>
              <div className="details-exchange-spec">
                <div className="spec-row">
                  <span>They Want to Learn:</span>
                  <strong>{selectedRequestDetails.skillToLearn}</strong>
                </div>
                <div className="spec-row">
                  <span>They Offer in Return:</span>
                  <strong>{selectedRequestDetails.skillOffered}</strong>
                </div>
              </div>
              <div className="details-note-box">
                <h5>Proposal Message:</h5>
                <p>"{selectedRequestDetails.message}"</p>
              </div>
            </div>
            <div className="modal-actions">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedRequestDetails(null)}
              >
                Close
              </button>
              {selectedRequestDetails.status === "pending" && (
                <>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => {
                      respondToRequest(selectedRequestDetails.id, "reject");
                      setSelectedRequestDetails(null);
                    }}
                  >
                    Decline
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      respondToRequest(selectedRequestDetails.id, "accept");
                      setSelectedRequestDetails(null);
                    }}
                  >
                    Accept Exchange
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}