import React, { useState } from "react";
import { Icon } from "./Icons";
import RequestSwapModal from "./RequestSwapModal";

export default function SkillCard({ skill, teacher, onRequestSwap }) {
  const [showSwapModal, setShowSwapModal] = useState(false);

  const skillName = typeof skill === "string" ? skill : skill.name;
  const category = skill.category || "General";
  const level = skill.level || "Intermediate";
  const description = skill.description || "Looking to share knowledge and practical experience with committed learners.";
  const hours = skill.hoursPerWeek ? `${skill.hoursPerWeek} hrs/wk` : null;

  return (
    <>
      <article className="skill-card-modern">
        <div className="skill-card-top">
          <span className="skill-category-badge">{category}</span>
          <span className={`skill-level-badge level-${level.toLowerCase()}`}>
            {level}
          </span>
        </div>

        <h3 className="skill-card-title">{skillName}</h3>
        <p className="skill-card-description">{description}</p>

        {hours && (
          <div className="skill-card-availability">
            <Icon name="clock" size={13} /> Available: {hours}
          </div>
        )}

        {teacher && (
          <div className="skill-card-footer">
            <div className="teacher-info">
              <div className={`avatar mini ${teacher.avatarColor || "purple"}`}>
                {teacher.initials}
              </div>
              <div>
                <span className="teacher-name">{teacher.name}</span>
                {teacher.rating && (
                  <span className="teacher-rating">
                    <Icon name="star" size={11} /> {teacher.rating}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary btn-xs"
              onClick={() => {
                if (onRequestSwap) {
                  onRequestSwap(teacher, skillName);
                } else {
                  setShowSwapModal(true);
                }
              }}
            >
              <Icon name="swap" size={13} /> Swap
            </button>
          </div>
        )}
      </article>

      {showSwapModal && teacher && (
        <RequestSwapModal
          user={teacher}
          initialSkillToLearn={skillName}
          onClose={() => setShowSwapModal(false)}
        />
      )}
    </>
  );
}
