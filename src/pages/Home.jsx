import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icons";
import { useSkillSwap } from "../context/SkillSwapContext";

export default function Home() {
  const { stats } = useSkillSwap();

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="home-hero-wrapper">
          <div className="home-hero-badge">
            <span className="hero-sparkle-dot">✦</span> Over 1,200+ Active Skills Exchanged
          </div>

          <h1 className="home-hero-headline">
            Learn Practical Skills. <br />
            Teach What You Know. <br />
            <span className="text-gradient">Zero Money Exchanged.</span>
          </h1>

          <p className="home-hero-subtext">
            SkillSwap is the modern peer-to-peer exchange network where professionals, developers, and creatives trade knowledge 1-on-1. Exchange 1 hour of your expertise for 1 hour of theirs.
          </p>

          <div className="home-hero-cta-buttons">
            <Link to="/find-skills" className="btn btn-primary btn-lg">
              <Icon name="search" size={18} /> Find a Skill to Learn
            </Link>
            <Link to="/dashboard" className="btn btn-outline btn-lg">
              <Icon name="sparkles" size={18} /> Open SaaS Dashboard
            </Link>
          </div>

          {/* Social Proof Stats Banner */}
          <div className="home-stats-strip">
            <div className="strip-item">
              <strong>98%</strong>
              <span>Positive Exchange Rating</span>
            </div>
            <div className="strip-divider"></div>
            <div className="strip-item">
              <strong>400+</strong>
              <span>Verified Categories</span>
            </div>
            <div className="strip-divider"></div>
            <div className="strip-item">
              <strong>1-on-1</strong>
              <span>Focused Sessions</span>
            </div>
            <div className="strip-divider"></div>
            <div className="strip-item">
              <strong>$0</strong>
              <span>Cost Forever</span>
            </div>
          </div>
        </div>
      </section>

      {/* How SkillSwap Works */}
      <section className="home-steps-section">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="badge-soft-purple">Simple & Fair</span>
            <h2>How SkillSwap Works</h2>
            <p className="section-subtext">
              Trade your craft with peers in three straightforward steps.
            </p>
          </div>

          <div className="home-steps-grid">
            <div className="home-step-card">
              <div className="step-num-bubble">1</div>
              <h3>List Your Skills</h3>
              <p>
                List what you excel at (coding, UX design, marketing, languages) and what you are eager to master next.
              </p>
            </div>

            <div className="home-step-card featured">
              <div className="step-num-bubble">2</div>
              <h3>Match & Propose Swap</h3>
              <p>
                Find exchangers with complementary skills. Send a personalized proposal indicating what you offer in return.
              </p>
            </div>

            <div className="home-step-card">
              <div className="step-num-bubble">3</div>
              <h3>Collaborate & Level Up</h3>
              <p>
                Hop on a video session, work through challenges together, and unlock new abilities without paying tuition.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why SkillSwap? Features */}
      <section className="home-features-section">
        <div className="section-container">
          <div className="section-header-centered">
            <span className="badge-soft-purple">Platform Advantages</span>
            <h2>Why Learn Through Skill Exchange?</h2>
            <p className="section-subtext">
              Traditional courses are passive. Live peer exchanges are personalized, interactive, and reciprocal.
            </p>
          </div>

          <div className="home-features-grid">
            <div className="home-feature-card">
              <div className="feature-icon-box purple">
                <Icon name="users" size={24} />
              </div>
              <h3>Hands-On 1-on-1 Mentorship</h3>
              <p>
                Get real-time feedback and direct answers to your unique questions instead of generic pre-recorded video lectures.
              </p>
            </div>

            <div className="home-feature-card">
              <div className="feature-icon-box indigo">
                <Icon name="swap" size={24} />
              </div>
              <h3>Reciprocal Mutual Value</h3>
              <p>
                Both partners are equally invested in each other's success. When teaching, you reinforce your own expertise.
              </p>
            </div>

            <div className="home-feature-card">
              <div className="feature-icon-box emerald">
                <Icon name="shield-check" size={24} />
              </div>
              <h3>Accountable & Verified Peers</h3>
              <p>
                Ratings, reviews, and detailed session histories ensure you connect with respectful, dependable collaborators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="home-cta-banner">
        <div className="cta-banner-content">
          <h2>Ready to Expand Your Skills Today?</h2>
          <p>
            Join hundreds of curious professionals already trading knowledge every week.
          </p>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-white btn-lg">
              Create Free Account
            </Link>
            <Link to="/find-skills" className="btn btn-outline-white btn-lg">
              Explore Available Skills
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}