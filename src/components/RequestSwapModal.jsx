import React, { useState, useEffect } from "react";
import { useSkillSwap } from "../context/SkillSwapContext";
import { Icon } from "./Icons";

export default function RequestSwapModal({ user, initialSkillToLearn = "", onClose }) {
  const { skillsOffered, sendSwapRequest } = useSkillSwap();

  // Derive initial values from the selected community user's skills
  const recipientSkills = (user.skillsOffered || []).filter(Boolean);
  const myOfferedSkills = (skillsOffered || []).filter(Boolean);

  const defaultSkillToLearn =
    initialSkillToLearn ||
    (recipientSkills.length > 0
      ? typeof recipientSkills[0] === "string"
        ? recipientSkills[0]
        : recipientSkills[0].name
      : "");

  const defaultSkillOffered =
    myOfferedSkills.length > 0 ? myOfferedSkills[0].name : "";

  const [skillToLearn, setSkillToLearn] = useState(defaultSkillToLearn);
  const [skillOffered, setSkillOffered] = useState(defaultSkillOffered);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Keep the intro message in sync with dropdown selections
  useEffect(() => {
    const learnPart = skillToLearn || "your skills";
    const teachPart = skillOffered || "my skills";
    setMessage(
      `Hi ${user.name}! I'd love to exchange skills with you.\nI can teach you ${teachPart} in return for learning ${learnPart}.`
    );
  }, [skillToLearn, skillOffered, user.name]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!skillToLearn) {
      setError("Please choose the skill you want to learn.");
      return;
    }

    if (!skillOffered) {
      setError(
        myOfferedSkills.length === 0
          ? "Add a skill you can teach before requesting a swap."
          : "Please select the skill you will teach in return."
      );
      return;
    }

    setIsSubmitting(true);
    const success = sendSwapRequest({
      recipientUser: user,
      skillToLearn,
      skillOffered,
      message,
    });

    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className={`avatar small ${user.avatarColor || "purple"}`}>
              {user.initials}
            </div>
            <div>
              <h3>Request Swap with {user.name}</h3>
              <p className="modal-subtitle">{user.role} • {user.location}</p>
            </div>
          </div>
          <button className="icon-close-btn" onClick={onClose} aria-label="Close modal">
            <Icon name="x" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="form-error-alert">{error}</div>}

          {/* Skill you want to learn — populated from recipient's offered skills */}
          <div className="form-group">
            <label htmlFor="skillToLearn">
              Skill you want to learn from {user.name}:
            </label>
            {recipientSkills.length > 0 ? (
              <select
                id="skillToLearn"
                value={skillToLearn}
                onChange={(e) => setSkillToLearn(e.target.value)}
                className="form-select"
                required
              >
                <option value="" disabled>
                  Select a skill…
                </option>
                {recipientSkills.map((s, idx) => {
                  const sName = typeof s === "string" ? s : s.name;
                  const sLevel = typeof s === "object" && s.level ? ` (${s.level})` : "";
                  return (
                    <option key={idx} value={sName}>
                      {sName}{sLevel}
                    </option>
                  );
                })}
              </select>
            ) : (
              <p className="form-hint-text">
                {user.name} has not listed any skills to offer yet.
              </p>
            )}
          </div>

          {/* Skill you offer in return — populated from current user's offered skills */}
          <div className="form-group">
            <label htmlFor="skillOffered">Skill you will teach in return:</label>
            {myOfferedSkills.length > 0 ? (
              <select
                id="skillOffered"
                value={skillOffered}
                onChange={(e) => setSkillOffered(e.target.value)}
                className="form-select"
                required
              >
                <option value="" disabled>
                  Select a skill…
                </option>
                {myOfferedSkills.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}{s.level ? ` (${s.level})` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <div className="form-hint-text" style={{ color: "var(--color-error, #ef4444)" }}>
                <Icon name="sparkles" size={14} />{" "}
                Add a skill you can teach on the{" "}
                <a href="/my-skills" style={{ color: "inherit", fontWeight: 600 }}>
                  My Skills
                </a>{" "}
                page before requesting a swap.
              </div>
            )}
          </div>

          {/* Introductory message — auto-updates, user can edit */}
          <div className="form-group">
            <label htmlFor="requestNote">Introductory Message:</label>
            <textarea
              id="requestNote"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain your goals, what you can teach, and how often you'd like to meet..."
              className="form-textarea"
            />
            <p className="form-hint-text">
              This message updates automatically when you change the skill dropdowns. Feel free to edit it.
            </p>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || myOfferedSkills.length === 0 || !skillToLearn}
            >
              {isSubmitting ? "Sending..." : "Send Swap Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
