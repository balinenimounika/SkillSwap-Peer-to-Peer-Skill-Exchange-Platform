import React, { useState } from "react";
import { Icon } from "./Icons";

export default function RequestCard({
  request,
  onAccept,
  onReject,
  onCancel,
  onViewDetails,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isReceived = request.type === "received";
  const isPending = request.status === "pending";

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <span className="status-badge status-accepted">Accepted</span>;
      case "rejected":
        return <span className="status-badge status-rejected">Declined</span>;
      case "cancelled":
        return <span className="status-badge status-cancelled">Cancelled</span>;
      case "pending":
      default:
        return <span className="status-badge status-pending">Pending Review</span>;
    }
  };

  return (
    <article className="request-card-modern">
      <div className="request-card-header">
        <div className="request-user-meta">
          <div className={`avatar small ${request.senderColor || "purple"}`}>
            {isReceived ? request.senderAvatar : request.recipientAvatar || "SS"}
          </div>
          <div>
            <div className="request-names-row">
              <strong className="request-party-name">
                {isReceived ? request.senderName : `To: ${request.recipientName}`}
              </strong>
              {getStatusBadge(request.status)}
            </div>
            <p className="request-party-role">
              {isReceived ? request.senderRole : "Community Member"} • {request.timestamp}
            </p>
          </div>
        </div>
      </div>

      <div className="request-exchange-summary">
        <div className="exchange-pair">
          <div className="exchange-item">
            <span className="exchange-label">
              {isReceived ? "Wants to learn from you:" : "You requested to learn:"}
            </span>
            <div className="exchange-skill-pill learn-skill">
              <span className="dot dot-purple"></span>
              <strong>{request.skillToLearn}</strong>
            </div>
          </div>

          <div className="exchange-divider">
            <Icon name="swap" size={16} />
          </div>

          <div className="exchange-item">
            <span className="exchange-label">
              {isReceived ? "Offers to teach you:" : "You offered to teach:"}
            </span>
            <div className="exchange-skill-pill teach-skill">
              <span className="dot dot-green"></span>
              <strong>{request.skillOffered}</strong>
            </div>
          </div>
        </div>
      </div>

      {request.message && (
        <div className="request-message-box">
          <p className="message-quote">
            "{isExpanded ? request.message : request.message.length > 120 ? `${request.message.slice(0, 120)}...` : request.message}"
          </p>
          {request.message.length > 120 && (
            <button
              type="button"
              className="text-toggle-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Show less" : "Read full note"}
            </button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="request-card-footer">
        {isReceived && isPending && (
          <div className="request-action-group">
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => onReject && onReject(request.id)}
            >
              <Icon name="x" size={14} /> Decline
            </button>
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => onAccept && onAccept(request.id)}
            >
              <Icon name="check" size={14} /> Accept Swap
            </button>
          </div>
        )}

        {!isReceived && isPending && onCancel && (
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => onCancel(request.id)}
          >
            Cancel Request
          </button>
        )}

        {onViewDetails && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onViewDetails(request)}
          >
            View Details
          </button>
        )}
      </div>
    </article>
  );
}
