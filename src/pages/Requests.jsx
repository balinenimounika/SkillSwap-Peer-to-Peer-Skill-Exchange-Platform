import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSkillSwap } from "../context/SkillSwapContext";
import { Icon } from "../components/Icons";
import RequestCard from "../components/RequestCard";

export default function Requests() {
  const { currentUser, isAuthenticated, swapRequests, respondToRequest, cancelSentRequest } = useSkillSwap();

  const [activeTab, setActiveTab] = useState("received"); // "received" | "sent"
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "pending" | "accepted" | "rejected" | "cancelled"
  const [selectedDetails, setSelectedDetails] = useState(null);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="requests-page">
        <div className="empty-state-box" style={{ padding: "60px 20px" }}>
          <div className="empty-icon-wrap">
            <Icon name="swap" size={32} />
          </div>
          <h2>Please Log In to View Swap Requests</h2>
          <p>You need to be signed in to view, accept, or decline requests.</p>
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

  const receivedRequests = swapRequests.filter((r) => r.type === "received");
  const sentRequests = swapRequests.filter((r) => r.type === "sent");

  const currentList = activeTab === "received" ? receivedRequests : sentRequests;

  const filteredRequests = currentList.filter((req) => {
    if (statusFilter === "all") return true;
    return req.status === statusFilter;
  });

  const pendingReceivedCount = receivedRequests.filter((r) => r.status === "pending").length;
  const pendingSentCount = sentRequests.filter((r) => r.status === "pending").length;

  return (
    <div className="requests-page">
      {/* Banner */}
      <section className="page-header-banner">
        <div className="banner-content">
          <span className="badge-soft-purple">Exchange Inquiries</span>
          <h1>Skill Swap Requests</h1>
          <p>
            Track incoming proposals from peers wanting to learn from you and manage requests you have sent across the community.
          </p>
        </div>

        <div className="banner-actions">
          <Link to="/find-skills" className="btn btn-primary">
            <Icon name="search" size={16} /> Explore New Matches
          </Link>
        </div>
      </section>

      {/* Tabs Row */}
      <div className="requests-controls-wrapper">
        <div className="skills-tabs-container">
          <button
            type="button"
            className={`skills-tab-button ${activeTab === "received" ? "active" : ""}`}
            onClick={() => setActiveTab("received")}
          >
            <Icon name="arrow-right" size={16} className="rotate-down" />
            <span>Received Requests</span>
            {pendingReceivedCount > 0 && (
              <span className="tab-badge badge-alert">{pendingReceivedCount} pending</span>
            )}
          </button>

          <button
            type="button"
            className={`skills-tab-button ${activeTab === "sent" ? "active" : ""}`}
            onClick={() => setActiveTab("sent")}
          >
            <Icon name="send" size={16} />
            <span>Sent Requests</span>
            {pendingSentCount > 0 && (
              <span className="tab-badge">{pendingSentCount} pending</span>
            )}
          </button>
        </div>

        {/* Status Filters */}
        <div className="status-filter-pills">
          <button
            type="button"
            className={`filter-pill-btn ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All ({currentList.length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${statusFilter === "pending" ? "active" : ""}`}
            onClick={() => setStatusFilter("pending")}
          >
            Pending ({currentList.filter((r) => r.status === "pending").length})
          </button>
          <button
            type="button"
            className={`filter-pill-btn ${statusFilter === "accepted" ? "active" : ""}`}
            onClick={() => setStatusFilter("accepted")}
          >
            Accepted ({currentList.filter((r) => r.status === "accepted").length})
          </button>
          {activeTab === "received" ? (
            <button
              type="button"
              className={`filter-pill-btn ${statusFilter === "rejected" ? "active" : ""}`}
              onClick={() => setStatusFilter("rejected")}
            >
              Declined ({currentList.filter((r) => r.status === "rejected").length})
            </button>
          ) : (
            <button
              type="button"
              className={`filter-pill-btn ${statusFilter === "cancelled" ? "active" : ""}`}
              onClick={() => setStatusFilter("cancelled")}
            >
              Cancelled ({currentList.filter((r) => r.status === "cancelled").length})
            </button>
          )}
        </div>
      </div>

      {/* Requests List */}
      <section className="requests-container-section">
        {filteredRequests.length > 0 ? (
          <div className="requests-grid-stack">
            {filteredRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                onAccept={(id) => respondToRequest(id, "accept")}
                onReject={(id) => respondToRequest(id, "reject")}
                onCancel={(id) => cancelSentRequest(id)}
                onViewDetails={(r) => setSelectedDetails(r)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-requests-view">
            <div className="empty-icon-wrap">
              <Icon name="swap" size={32} />
            </div>
            <h3>No requests found in this category</h3>
            <p>
              {activeTab === "received"
                ? "You don't have any requests matching your status filter."
                : "You haven't sent any requests in this state yet."}
            </p>
            {activeTab === "sent" && (
              <Link to="/find-skills" className="btn btn-primary btn-sm">
                Browse Community & Request a Swap
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Request Details Modal */}
      {selectedDetails && (
        <div className="modal-backdrop" onClick={() => setSelectedDetails(null)} role="dialog" aria-modal="true">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Swap Request Summary</h3>
              <button
                className="icon-close-btn"
                onClick={() => setSelectedDetails(null)}
                aria-label="Close"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <div className="modal-body-content">
              <div className="request-modal-meta">
                <div className={`avatar medium ${selectedDetails.senderColor || "purple"}`}>
                  {selectedDetails.type === "received" ? selectedDetails.senderAvatar : selectedDetails.recipientAvatar || "SS"}
                </div>
                <div>
                  <h4>
                    {selectedDetails.type === "received"
                      ? selectedDetails.senderName
                      : `Recipient: ${selectedDetails.recipientName}`}
                  </h4>
                  <p>
                    {selectedDetails.type === "received" ? selectedDetails.senderRole : "Member"} •{" "}
                    {selectedDetails.timestamp}
                  </p>
                </div>
              </div>

              <div className="details-exchange-spec">
                <div className="spec-row">
                  <span>Skill to Learn:</span>
                  <strong>{selectedDetails.skillToLearn}</strong>
                </div>
                <div className="spec-row">
                  <span>Skill Offered:</span>
                  <strong>{selectedDetails.skillOffered}</strong>
                </div>
                <div className="spec-row">
                  <span>Current Status:</span>
                  <span className={`status-badge status-${selectedDetails.status}`}>
                    {selectedDetails.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {selectedDetails.message && (
                <div className="details-note-box">
                  <h5>Introductory Proposal:</h5>
                  <p>"{selectedDetails.message}"</p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedDetails(null)}
              >
                Close
              </button>
              {selectedDetails.type === "received" && selectedDetails.status === "pending" && (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                      respondToRequest(selectedDetails.id, "reject");
                      setSelectedDetails(null);
                    }}
                  >
                    Decline
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => {
                      respondToRequest(selectedDetails.id, "accept");
                      setSelectedDetails(null);
                    }}
                  >
                    Accept Exchange
                  </button>
                </>
              )}
              {selectedDetails.type === "sent" && selectedDetails.status === "pending" && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => {
                    cancelSentRequest(selectedDetails.id);
                    setSelectedDetails(null);
                  }}
                >
                  Cancel Request
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}