import React, { useState, useMemo } from "react";
import { useSkillSwap } from "../context/SkillSwapContext";
import { Icon } from "../components/Icons";
import UserCard from "../components/UserCard";
import SkillCard from "../components/SkillCard";
import RequestSwapModal from "../components/RequestSwapModal";
import { CATEGORIES, EXPERIENCE_LEVELS, AVAILABILITY_OPTIONS } from "../data/initialData";

export default function FindSkills() {
  const { communityUsers, skillsWanted, skillsOffered, getAverageRating } = useSkillSwap();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedAvailability, setSelectedAvailability] = useState("All Availability");
  const [sortBy, setSortBy] = useState("recommended");
  const [viewMode, setViewMode] = useState("users"); // "users" or "skills"

  // For modal triggered from skill card
  const [activeModalTeacher, setActiveModalTeacher] = useState(null);
  const [activeModalSkill, setActiveModalSkill] = useState("");

  // Flatten skills for "skills" view
  const allSkills = useMemo(() => {
    const list = [];
    communityUsers.forEach((user) => {
      (user.skillsOffered || []).forEach((skill) => {
        list.push({
          id: `${user.id}-${skill.name}`,
          skill,
          teacher: user,
        });
      });
    });
    return list;
  }, [communityUsers]);

  // Filter users
  const filteredUsers = useMemo(() => {
    // Build wanted/offered skill name sets for smart matching
    const wantedNames = skillsWanted.map((s) => s.name.toLowerCase());
    const offeredNames = skillsOffered.map((s) => s.name.toLowerCase());

    const computeMatchScore = (user) => {
      let score = 0;
      const userOfferedNames = (user.skillsOffered || []).map((s) =>
        (typeof s === "string" ? s : s.name).toLowerCase()
      );
      const userWantedNames = (user.skillsWanted || []).map((s) =>
        (typeof s === "string" ? s : s.name).toLowerCase()
      );
      // Primary: user offers what we want
      wantedNames.forEach((w) => {
        if (userOfferedNames.some((o) => o.includes(w) || w.includes(o))) score += 10;
      });
      // Secondary: user wants what we can teach
      offeredNames.forEach((o) => {
        if (userWantedNames.some((uw) => uw.includes(o) || o.includes(uw))) score += 5;
      });
      return score;
    };

    return communityUsers.filter((user) => {
      // Search term matching user name, role, bio, or skills offered/wanted
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query) ||
        (user.bio && user.bio.toLowerCase().includes(query)) ||
        (user.skillsOffered || []).some((s) => (typeof s === "string" ? s : s.name).toLowerCase().includes(query)) ||
        (user.skillsWanted || []).some((s) => (typeof s === "string" ? s : s.name).toLowerCase().includes(query));

      // Category matching
      const matchesCategory =
        selectedCategory === "All Categories" ||
        (user.skillsOffered || []).some(
          (s) => s.category && s.category.toLowerCase() === selectedCategory.toLowerCase()
        );

      // Experience level matching
      const matchesLevel =
        selectedLevel === "All Levels" ||
        user.experienceLevel === selectedLevel ||
        (user.skillsOffered || []).some((s) => s.level === selectedLevel);

      // Availability matching
      const matchesAvailability =
        selectedAvailability === "All Availability" ||
        (user.availability &&
          user.availability.toLowerCase().includes(selectedAvailability.toLowerCase()));

      return matchesSearch && matchesCategory && matchesLevel && matchesAvailability;
    }).sort((a, b) => {
      if (sortBy === "recommended") {
        const scoreA = computeMatchScore(a);
        const scoreB = computeMatchScore(b);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === "rating") return (getAverageRating(b.id) || b.rating || 0) - (getAverageRating(a.id) || a.rating || 0);
      if (sortBy === "swaps") return (b.swapsCount || 0) - (a.swapsCount || 0);
      if (sortBy === "alpha") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [communityUsers, skillsWanted, skillsOffered, searchTerm, selectedCategory, selectedLevel, selectedAvailability, sortBy, getAverageRating]);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return allSkills.filter(({ skill, teacher }) => {
      const query = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !query ||
        skill.name.toLowerCase().includes(query) ||
        teacher.name.toLowerCase().includes(query) ||
        (skill.description && skill.description.toLowerCase().includes(query));

      const matchesCategory =
        selectedCategory === "All Categories" ||
        (skill.category && skill.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesLevel =
        selectedLevel === "All Levels" || skill.level === selectedLevel;

      const matchesAvailability =
        selectedAvailability === "All Availability" ||
        (teacher.availability &&
          teacher.availability.toLowerCase().includes(selectedAvailability.toLowerCase()));

      return matchesSearch && matchesCategory && matchesLevel && matchesAvailability;
    }).sort((a, b) => {
      if (sortBy === "rating") return (b.teacher.rating || 0) - (a.teacher.rating || 0);
      if (sortBy === "swaps") return (b.teacher.swapsCount || 0) - (a.teacher.swapsCount || 0);
      if (sortBy === "alpha") return a.skill.name.localeCompare(b.skill.name);
      return 0;
    });
  }, [allSkills, searchTerm, selectedCategory, selectedLevel, selectedAvailability, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All Categories");
    setSelectedLevel("All Levels");
    setSelectedAvailability("All Availability");
    setSortBy("recommended");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedCategory !== "All Categories" ||
    selectedLevel !== "All Levels" ||
    selectedAvailability !== "All Availability";

  return (
    <div className="find-skills-page">
      {/* Page Header */}
      <section className="page-header-banner">
        <div className="banner-content">
          <span className="badge-soft-purple">Discover Community Skills</span>
          <h1>Find Skills to Learn & Trade</h1>
          <p>
            Connect with skilled engineers, designers, strategists, and linguists ready to trade real knowledge without money.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="find-search-bar-wrap">
          <div className="search-input-field">
            <Icon name="search" size={20} className="search-icon-decor" />
            <input
              type="text"
              placeholder="Search by skill (e.g. React, UX, Python) or member name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="main-search-input"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm("")}
                aria-label="Clear search"
              >
                <Icon name="x" size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <section className="filter-controls-section">
        <div className="filter-chips-row">
          {/* Category Dropdown */}
          <div className="filter-select-wrapper">
            <label htmlFor="cat-filter">Category:</label>
            <select
              id="cat-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level Dropdown */}
          <div className="filter-select-wrapper">
            <label htmlFor="level-filter">Level:</label>
            <select
              id="level-filter"
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="filter-select"
            >
              {EXPERIENCE_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Dropdown */}
          <div className="filter-select-wrapper">
            <label htmlFor="avail-filter">Availability:</label>
            <select
              id="avail-filter"
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="filter-select"
            >
              {AVAILABILITY_OPTIONS.map((avail) => (
                <option key={avail} value={avail}>
                  {avail}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="filter-select-wrapper">
            <label htmlFor="sort-filter">Sort by:</label>
            <select
              id="sort-filter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="recommended">Recommended Match</option>
              <option value="rating">Highest Rated</option>
              <option value="swaps">Most Swaps</option>
              <option value="alpha">Alphabetical (A-Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-ghost btn-sm clear-filters-btn"
              onClick={clearFilters}
            >
              <Icon name="x" size={14} /> Reset Filters
            </button>
          )}
        </div>

        {/* View Mode Toggle and Results Counter */}
        <div className="view-toggle-bar">
          <div className="results-count-text">
            Showing{" "}
            <strong>
              {viewMode === "users" ? filteredUsers.length : filteredSkills.length}
            </strong>{" "}
            {viewMode === "users" ? "members ready to swap" : "skills available to learn"}
          </div>

          <div className="view-mode-tabs">
            <button
              type="button"
              className={`view-tab-btn ${viewMode === "users" ? "active" : ""}`}
              onClick={() => setViewMode("users")}
            >
              <Icon name="users" size={15} /> Members
            </button>
            <button
              type="button"
              className={`view-tab-btn ${viewMode === "skills" ? "active" : ""}`}
              onClick={() => setViewMode("skills")}
            >
              <Icon name="book" size={15} /> Individual Skills
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="find-results-container">
        {viewMode === "users" ? (
          filteredUsers.length > 0 ? (
            <div className="users-card-grid">
              {filteredUsers.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          ) : (
            <div className="no-results-box">
              <div className="no-results-icon">
                <Icon name="search" size={32} />
              </div>
              <h3>No matching members found</h3>
              <p>
                We couldn't find anyone matching your exact filter combination. Try resetting your filters or broadening your search keywords.
              </p>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={clearFilters}
              >
                Clear All Filters
              </button>
            </div>
          )
        ) : filteredSkills.length > 0 ? (
          <div className="skills-card-grid">
            {filteredSkills.map(({ id, skill, teacher }) => (
              <SkillCard
                key={id}
                skill={skill}
                teacher={teacher}
                onRequestSwap={(t, sName) => {
                  setActiveModalTeacher(t);
                  setActiveModalSkill(sName);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="no-results-box">
            <div className="no-results-icon">
              <Icon name="book" size={32} />
            </div>
            <h3>No matching skills found</h3>
            <p>Try searching for a different skill topic or clearing the active filters.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={clearFilters}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>

      {/* Modal triggered from individual skill card */}
      {activeModalTeacher && (
        <RequestSwapModal
          user={activeModalTeacher}
          initialSkillToLearn={activeModalSkill}
          onClose={() => {
            setActiveModalTeacher(null);
            setActiveModalSkill("");
          }}
        />
      )}
    </div>
  );
}