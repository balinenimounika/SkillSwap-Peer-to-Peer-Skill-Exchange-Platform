import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSkillSwap } from "../context/SkillSwapContext";
import { Icon } from "../components/Icons";

export default function Messages() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    currentUserId,
    isAuthenticated,
    myConversations,
    sendMessage,
    markConversationRead,
    getUserById,
    startOrOpenConversation,
    makeConversationId,
  } = useSkillSwap();

  const [activeConvId, setActiveConvId] = useState(null);
  const [inputText, setInputText] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-open conversation if navigated here with state
  useEffect(() => {
    const targetUserId = location.state?.openConversationWith;
    if (targetUserId && currentUserId) {
      const convId = makeConversationId(currentUserId, targetUserId);
      setActiveConvId(convId);
      // Clear the navigation state so back-navigation doesn't re-trigger
      navigate("/messages", { replace: true, state: {} });
    }
  }, [location.state, currentUserId, makeConversationId, navigate]);

  // Default to first conversation if none selected
  useEffect(() => {
    if (!activeConvId && myConversations.length > 0) {
      setActiveConvId(myConversations[0].id);
    }
  }, [myConversations, activeConvId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvId, myConversations]);

  // Mark conversation read when opened
  useEffect(() => {
    if (activeConvId) {
      markConversationRead(activeConvId);
    }
  }, [activeConvId, markConversationRead]);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="messages-page-wrapper">
        <div className="empty-state-box" style={{ padding: "60px 20px" }}>
          <div className="empty-icon-wrap">
            <Icon name="messages" size={32} />
          </div>
          <h2>Please Log In to View Messages</h2>
          <p>You need to be signed in to message your exchange partners.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
            <Link to="/login" className="btn btn-primary">Log In</Link>
            <Link to="/register" className="btn btn-outline">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }

  const activeConversation = myConversations.find((c) => c.id === activeConvId) || null;

  // Resolve the other participant for the active conversation
  const getOtherParticipant = (conv) => {
    if (!conv || !conv.participantIds) return null;
    const otherId = conv.participantIds.find((id) => id !== currentUserId);
    if (!otherId) return null;
    return getUserById(otherId);
  };

  const otherUser = activeConversation ? getOtherParticipant(activeConversation) : null;

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;
    sendMessage(activeConvId, inputText.trim());
    setInputText("");
  };

  // Filter conversations matching search
  const filteredConversations = myConversations.filter((conv) => {
    const q = searchFilter.toLowerCase().trim();
    if (!q) return true;
    const other = getOtherParticipant(conv);
    const otherName = other?.name || "";
    const lastMsg = (conv.messages || []).slice(-1)[0]?.text || "";
    return (
      otherName.toLowerCase().includes(q) ||
      lastMsg.toLowerCase().includes(q)
    );
  });

  const formatTime = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString();
  };

  const getUnreadCount = (conv) => {
    return (conv.messages || []).filter(
      (m) => m.senderId !== currentUserId && !m.read
    ).length;
  };

  const getLastMessage = (conv) => {
    const msgs = conv.messages || [];
    return msgs.length > 0 ? msgs[msgs.length - 1] : null;
  };

  return (
    <div className="messages-page-wrapper">
      <div className="messages-layout-box">
        {/* Left Pane: Conversations List */}
        <aside className="conversations-sidebar">
          <div className="conversations-header">
            <div className="inbox-title-row">
              <h2>Messages</h2>
              <span className="inbox-badge">{myConversations.length} chat{myConversations.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="conversation-search-input">
              <Icon name="search" size={16} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="conversations-list">
            {myConversations.length === 0 ? (
              <div style={{ padding: "24px 16px", textAlign: "center" }}>
                <div className="empty-icon-wrap" style={{ marginBottom: "10px" }}>
                  <Icon name="messages" size={28} />
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  No conversations yet.
                </p>
                <Link
                  to="/find-skills"
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: "10px" }}
                >
                  Find Skills
                </Link>
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{ padding: "16px", textAlign: "center", color: "var(--text-secondary)", fontSize: "13px" }}>
                No conversations match your search.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = activeConvId === conv.id;
                const other = getOtherParticipant(conv);
                const lastMsg = getLastMessage(conv);
                const unreadCount = getUnreadCount(conv);
                return (
                  <div
                    key={conv.id}
                    className={`conversation-item ${isSelected ? "selected" : ""} ${
                      unreadCount > 0 ? "has-unread" : ""
                    }`}
                    onClick={() => setActiveConvId(conv.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && setActiveConvId(conv.id)}
                  >
                    <div className="avatar-wrap-pos">
                      <div className={`avatar small ${other?.avatarColor || "purple"}`}>
                        {other?.initials || "?"}
                      </div>
                    </div>

                    <div className="conv-item-meta">
                      <div className="conv-top-row">
                        <strong className="conv-name">{other?.name || "Unknown"}</strong>
                        <span className="conv-time">
                          {lastMsg ? formatTime(lastMsg.timestamp) : formatTime(conv.updatedAt)}
                        </span>
                      </div>
                      <p className="conv-snippet">
                        {lastMsg
                          ? (lastMsg.senderId === currentUserId ? "You: " : "") + lastMsg.text
                          : "No messages yet"}
                      </p>
                    </div>

                    {unreadCount > 0 && (
                      <span className="conv-unread-pill">{unreadCount}</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Pane: Active Chat Window */}
        <section className="active-chat-area">
          {activeConversation && otherUser ? (
            <>
              {/* Chat Header */}
              <div className="chat-active-header">
                <div className="chat-partner-meta">
                  <div className="avatar-wrap-pos">
                    <div className={`avatar ${otherUser.avatarColor || "purple"}`}>
                      {otherUser.initials}
                    </div>
                  </div>
                  <div>
                    <h3 className="partner-chat-name">{otherUser.name}</h3>
                    <p className="partner-chat-role">
                      {otherUser.role}
                    </p>
                  </div>
                </div>

                <div className="chat-header-actions">
                  <Link to="/requests" className="btn btn-outline btn-xs">
                    <Icon name="swap" size={13} /> View Swaps
                  </Link>
                </div>
              </div>

              {/* Chat Message History */}
              <div className="chat-messages-scroll">
                <div className="chat-safety-notice">
                  <Icon name="shield-check" size={14} /> Messages are private and stored securely in your browser.
                </div>

                {(activeConversation.messages || []).length === 0 ? (
                  <div className="no-chat-selected" style={{ flex: 1 }}>
                    <div className="empty-icon-wrap">
                      <Icon name="message" size={32} />
                    </div>
                    <h3>Start a conversation with {otherUser.name}</h3>
                    <p>Send your first message below to kick off the exchange!</p>
                  </div>
                ) : (
                  (activeConversation.messages || []).map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                      <div
                        key={msg.id}
                        className={`message-bubble-row ${isMe ? "msg-sent" : "msg-received"}`}
                      >
                        {!isMe && (
                          <div className={`avatar mini ${otherUser.avatarColor || "purple"}`}>
                            {otherUser.initials}
                          </div>
                        )}
                        <div className="message-bubble-content">
                          <div className="bubble-text">{msg.text}</div>
                          <span className="bubble-timestamp">{formatTime(msg.timestamp)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="chat-input-toolbar">
                <input
                  type="text"
                  placeholder={`Message ${otherUser.name}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="chat-text-input"
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn btn-primary chat-send-btn"
                  disabled={!inputText.trim()}
                >
                  <Icon name="send" size={16} />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : myConversations.length === 0 ? (
            // No conversations at all
            <div className="no-chat-selected">
              <div className="empty-icon-wrap">
                <Icon name="messages" size={36} />
              </div>
              <h3>No conversations yet</h3>
              <p>Find a skill partner and start a conversation.</p>
              <Link to="/find-skills" className="btn btn-primary btn-sm" style={{ marginTop: "14px" }}>
                Find Skills
              </Link>
            </div>
          ) : (
            // Conversations exist but none selected
            <div className="no-chat-selected">
              <div className="empty-icon-wrap">
                <Icon name="messages" size={36} />
              </div>
              <h3>Select a conversation</h3>
              <p>Choose an exchange partner from the left menu to read messages and reply.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}