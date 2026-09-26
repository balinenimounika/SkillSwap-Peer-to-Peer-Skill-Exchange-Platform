import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSkillSwap } from "../context/SkillSwapContext";
import { Icon } from "../components/Icons";
import { CATEGORIES, EXPERIENCE_LEVELS } from "../data/initialData";

export default function MySkills() {
  const {
    currentUser,
    isAuthenticated,
    skillsOffered,
    skillsWanted,
    addSkillOffered,
    updateSkillOffered,
    deleteSkillOffered,
    addSkillWanted,
    updateSkillWanted,
    deleteSkillWanted,
  } = useSkillSwap();

  const [activeTab, setActiveTab] = useState("offered"); // "offered" | "wanted"

  // Modal State
  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [targetType, setTargetType] = useState("offered"); // 'offered' | 'wanted'
  const [editingSkillId, setEditingSkillId] = useState(null);

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="my-skills-page">
        <div className="empty-state-box" style={{ padding: "60px 20px" }}>
          <div className="empty-icon-wrap">
            <Icon name="book" size={32} />
          </div>
          <h2>Please Log In to Manage Your Skills</h2>
          <p>You need to be signed in to add and manage your skills.</p>
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

  // Form Fields
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Design");
  const [level, setLevel] = useState("Intermediate");
  const [description, setDescription] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState(3);
  const [formErrors, setFormErrors] = useState({});

  // Delete Confirmation State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null);

  const openAddModal = (type) => {
    setTargetType(type);
    setModalMode("add");
    setEditingSkillId(null);
    setName("");
    setCategory("Design");
    setLevel("Intermediate");
    setDescription("");
    setHoursPerWeek(3);
    setFormErrors({});
  };

  const openEditModal = (skill, type) => {
    setTargetType(type);
    setModalMode("edit");
    setEditingSkillId(skill.id);
    setName(skill.name);
    setCategory(skill.category || "Design");
    setLevel(skill.level || "Intermediate");
    setDescription(skill.description || "");
    setHoursPerWeek(skill.hoursPerWeek || 3);
    setFormErrors({});
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingSkillId(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) {
      errors.name = "Skill name is required.";
    } else if (name.trim().length < 2) {
      errors.name = "Skill name must be at least 2 characters.";
    }

    if (!category) {
      errors.category = "Please choose a category.";
    }

    if (!description.trim()) {
      errors.description = "Please provide a short description.";
    } else if (description.trim().length < 10) {
      errors.description = "Description should be at least 10 characters long.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const skillData = {
      name: name.trim(),
      category,
      level,
      description: description.trim(),
      hoursPerWeek: Number(hoursPerWeek),
      tags: [name.trim(), category],
    };

    if (targetType === "offered") {
      if (modalMode === "add") {
        addSkillOffered(skillData);
      } else {
        updateSkillOffered(editingSkillId, skillData);
      }
    } else {
      if (modalMode === "add") {
        addSkillWanted(skillData);
      } else {
        updateSkillWanted(editingSkillId, skillData);
      }
    }

    closeModal();
  };

  const handleDelete = (id, type) => {
    if (type === "offered") {
      deleteSkillOffered(id);
    } else {
      deleteSkillWanted(id);
    }
    setDeleteConfirmTarget(null);
  };

  return (
    <div className="my-skills-page">
      {/* Header Banner */}
      <section className="page-header-banner">
        <div className="banner-content">
          <span className="badge-soft-purple">Exchange Inventory</span>
          <h1>My Skill Portfolio</h1>
          <p>
            Manage the skills you're offering to teach others and keep track of the capabilities you want to learn in exchange.
          </p>
        </div>

        <div className="banner-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openAddModal(activeTab)}
          >
            <Icon name="plus" size={16} />
            {activeTab === "offered" ? "Add Skill to Teach" : "Add Skill to Learn"}
          </button>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="skills-tabs-container">
        <button
          type="button"
          className={`skills-tab-button ${activeTab === "offered" ? "active" : ""}`}
          onClick={() => setActiveTab("offered")}
        >
          <span className="tab-icon-dot green"></span>
          <span>Skills I Can Teach (Offered)</span>
          <span className="tab-badge">{skillsOffered.length}</span>
        </button>

        <button
          type="button"
          className={`skills-tab-button ${activeTab === "wanted" ? "active" : ""}`}
          onClick={() => setActiveTab("wanted")}
        >
          <span className="tab-icon-dot purple"></span>
          <span>Skills I Want to Learn (Wishlist)</span>
          <span className="tab-badge">{skillsWanted.length}</span>
        </button>
      </div>

      {/* Skills Tab Content */}
      <section className="skills-tab-content">
        {activeTab === "offered" ? (
          <div>
            <div className="tab-info-header">
              <div>
                <h2>Skills You Can Share</h2>
                <p>These will be presented to other exchangers when they search or browse your profile.</p>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => openAddModal("offered")}
              >
                <Icon name="plus" size={14} /> Add Skill
              </button>
            </div>

            {skillsOffered.length > 0 ? (
              <div className="my-skills-cards-grid">
                {skillsOffered.map((skill) => (
                  <div key={skill.id} className="my-skill-item-card">
                    <div className="item-card-top">
                      <span className="skill-category-badge">{skill.category}</span>
                      <span className={`skill-level-badge level-${(skill.level || "intermediate").toLowerCase()}`}>
                        {skill.level}
                      </span>
                    </div>

                    <h3 className="my-skill-name">{skill.name}</h3>
                    <p className="my-skill-desc">{skill.description}</p>

                    <div className="my-skill-meta">
                      {skill.hoursPerWeek && (
                        <span className="meta-hours">
                          <Icon name="clock" size={13} /> {skill.hoursPerWeek} hrs/week
                        </span>
                      )}
                    </div>

                    <div className="my-skill-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        onClick={() => openEditModal(skill, "offered")}
                      >
                        <Icon name="edit" size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-xs"
                        onClick={() => setDeleteConfirmTarget({ id: skill.id, name: skill.name, type: "offered" })}
                      >
                        <Icon name="trash" size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-skills-view">
                <div className="empty-icon-wrap">
                  <Icon name="book" size={32} />
                </div>
                <h3>No teaching skills listed yet</h3>
                <p>Listing what you know helps other community members find you and propose great trades!</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => openAddModal("offered")}
                >
                  <Icon name="plus" size={16} /> Add Your First Skill to Teach
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="tab-info-header">
              <div>
                <h2>Skills You Wish to Learn</h2>
                <p>We use this list to compute your automated match recommendations and suggestions.</p>
              </div>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => openAddModal("wanted")}
              >
                <Icon name="plus" size={14} /> Add Wishlist Skill
              </button>
            </div>

            {skillsWanted.length > 0 ? (
              <div className="my-skills-cards-grid">
                {skillsWanted.map((skill) => (
                  <div key={skill.id} className="my-skill-item-card wanted-border">
                    <div className="item-card-top">
                      <span className="skill-category-badge">{skill.category}</span>
                      <span className="skill-level-badge level-beginner">
                        Aiming for: {skill.level || "Any"}
                      </span>
                    </div>

                    <h3 className="my-skill-name">{skill.name}</h3>
                    <p className="my-skill-desc">{skill.description}</p>

                    <div className="my-skill-meta">
                      <span className="tag tag-learn">Priority: {skill.priority || "Medium"}</span>
                    </div>

                    <div className="my-skill-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-xs"
                        onClick={() => openEditModal(skill, "wanted")}
                      >
                        <Icon name="edit" size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-xs"
                        onClick={() => setDeleteConfirmTarget({ id: skill.id, name: skill.name, type: "wanted" })}
                      >
                        <Icon name="trash" size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-skills-view">
                <div className="empty-icon-wrap">
                  <Icon name="sparkles" size={32} />
                </div>
                <h3>Your wishlist is empty</h3>
                <p>Add skills you want to learn so community mentors know what to offer you in return!</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => openAddModal("wanted")}
                >
                  <Icon name="plus" size={16} /> Add Skill to Wishlist
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Add / Edit Skill Modal Dialog */}
      {modalMode && (
        <div className="modal-backdrop" onClick={closeModal} role="dialog" aria-modal="true">
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                {modalMode === "add" ? "Add Skill" : "Edit Skill"}{" "}
                {targetType === "offered" ? "(I Can Teach)" : "(I Want to Learn)"}
              </h3>
              <button className="icon-close-btn" onClick={closeModal} aria-label="Close dialog">
                <Icon name="x" size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-form">
              {/* Skill Name */}
              <div className="form-group">
                <label htmlFor="skill-name-input">Skill Title *</label>
                <input
                  id="skill-name-input"
                  type="text"
                  placeholder="e.g. Next.js 14, UI Prototyping, Spanish Conversation"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                  }}
                  className={`form-input ${formErrors.name ? "input-error" : ""}`}
                />
                {formErrors.name && <span className="field-error-text">{formErrors.name}</span>}
              </div>

              {/* Category & Proficiency Level in 2 cols */}
              <div className="form-row-2col">
                <div className="form-group">
                  <label htmlFor="category-select">Category *</label>
                  <select
                    id="category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select"
                  >
                    {CATEGORIES.filter((c) => c !== "All Categories").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="level-select">
                    {targetType === "offered" ? "Your Proficiency Level *" : "Desired Skill Level *"}
                  </label>
                  <select
                    id="level-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="form-select"
                  >
                    {EXPERIENCE_LEVELS.filter((l) => l !== "All Levels").map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hours per week commitment (if offered) */}
              {targetType === "offered" && (
                <div className="form-group">
                  <label htmlFor="hours-input">Estimated Availability (Hours/Week)</label>
                  <input
                    id="hours-input"
                    type="number"
                    min="1"
                    max="20"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    className="form-input"
                  />
                </div>
              )}

              {/* Description */}
              <div className="form-group">
                <label htmlFor="desc-input">
                  {targetType === "offered"
                    ? "What will you cover / teach? *"
                    : "What are your specific learning goals? *"}
                </label>
                <textarea
                  id="desc-input"
                  rows={3}
                  placeholder={
                    targetType === "offered"
                      ? "Describe what topics, hands-on exercises, or frameworks you can walk your peer through..."
                      : "Describe what you would love to accomplish or understand in your exchange sessions..."
                  }
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    if (formErrors.description) setFormErrors({ ...formErrors, description: null });
                  }}
                  className={`form-textarea ${formErrors.description ? "input-error" : ""}`}
                />
                {formErrors.description && (
                  <span className="field-error-text">{formErrors.description}</span>
                )}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modalMode === "add" ? "Save Skill" : "Update Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmTarget && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirmTarget(null)} role="dialog" aria-modal="true">
          <div className="modal-box modal-box-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Skill Removal</h3>
              <button
                className="icon-close-btn"
                onClick={() => setDeleteConfirmTarget(null)}
                aria-label="Close"
              >
                <Icon name="x" size={20} />
              </button>
            </div>
            <div className="modal-body-content">
              <p>
                Are you sure you want to remove <strong>"{deleteConfirmTarget.name}"</strong> from your{" "}
                {deleteConfirmTarget.type === "offered" ? "offered skills" : "wanted skills"}?
              </p>
            </div>
            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setDeleteConfirmTarget(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => handleDelete(deleteConfirmTarget.id, deleteConfirmTarget.type)}
              >
                Delete Skill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}