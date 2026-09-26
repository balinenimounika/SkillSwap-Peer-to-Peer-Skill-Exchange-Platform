import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import {
  initialUsersDatabase,
  initialCommunityUsers,
} from "../data/initialData";

const SkillSwapContext = createContext(null);

export const CURRENT_USER_KEY = "skillswap_current_user";
export const USERS_DB_KEY = "skillswap_users_db";
export const CONVERSATIONS_KEY = "skillswap_conversations";
export const REVIEWS_KEY = "skillswap_reviews";

// ============================================================
// Helper: generate a deterministic conversation ID from two user IDs
// Sorting ensures conv(A,B) === conv(B,A)
// ============================================================
export function makeConversationId(idA, idB) {
  return [idA, idB].sort().join("__");
}

// ============================================================
// Helper: format timestamp for display
// ============================================================
function formatTimestamp(isoString) {
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
}

export function SkillSwapProvider({ children }) {
  // ---- 1. Users database (registered users + their data) ----
  const [usersDb, setUsersDb] = useState(() => {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Remove legacy demo accounts if they somehow exist
        delete parsed["user-maya"];
        delete parsed["user-navya"];
        return parsed;
      }
    } catch (e) {
      console.warn("Could not load users DB from localStorage", e);
    }
    return initialUsersDatabase;
  });

  // ---- 2. Current user ID ----
  const [currentUserId, setCurrentUserId] = useState(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const id = typeof parsed === "string" ? parsed : parsed.id;
          // Don't restore legacy demo account sessions
          if (id === "user-maya" || id === "user-navya") return null;
          return id;
        } catch {
          if (stored === "user-maya" || stored === "user-navya") return null;
          return stored;
        }
      }
    } catch (e) {
      console.warn("Could not load current user from localStorage", e);
    }
    return null;
  });

  // ---- 3. Conversations (cross-user, keyed by conversationId) ----
  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem(CONVERSATIONS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Could not load conversations from localStorage", e);
    }
    return {};
  });

  // ---- 4. Reviews (array of review objects, global) ----
  const [reviews, setReviews] = useState(() => {
    try {
      const stored = localStorage.getItem(REVIEWS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Could not load reviews from localStorage", e);
    }
    return [];
  });

  const [toast, setToast] = useState(null);

  // ---- Persist to localStorage on every change ----
  useEffect(() => {
    try {
      const dbCopy = { ...usersDb };
      // Remove any legacy demo accounts that may still exist
      delete dbCopy["user-maya"];
      delete dbCopy["user-navya"];
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(dbCopy));
    } catch (e) {
      console.warn("Failed to persist users DB to localStorage", e);
    }
  }, [usersDb]);

  useEffect(() => {
    try {
      if (currentUserId) {
        localStorage.setItem(CURRENT_USER_KEY, currentUserId);
      } else {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    } catch (e) {
      console.warn("Failed to persist current user ID", e);
    }
  }, [currentUserId]);

  useEffect(() => {
    try {
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.warn("Failed to persist conversations to localStorage", e);
    }
  }, [conversations]);

  useEffect(() => {
    try {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.warn("Failed to persist reviews to localStorage", e);
    }
  }, [reviews]);

  const showToast = (message, type = "success") => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => setToast(null), 3800);
  };

  // ---- Derived current user data ----
  const activeUserData = currentUserId && usersDb[currentUserId] ? usersDb[currentUserId] : null;
  const currentUser = activeUserData?.profile || null;
  const skillsOffered = activeUserData?.skillsOffered || [];
  const skillsWanted = activeUserData?.skillsWanted || [];
  const swapRequests = activeUserData?.requests || [];
  const activeSwaps = activeUserData?.swaps || [];
  const upcomingSessions = activeUserData?.sessions || [];
  const recentActivity = activeUserData?.activity || [];
  const isAuthenticated = Boolean(currentUserId && currentUser);

  // ---- Conversations for current user ----
  const myConversations = useMemo(() => {
    if (!currentUserId) return [];
    return Object.values(conversations)
      .filter((conv) => conv.participantIds && conv.participantIds.includes(currentUserId))
      .sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
  }, [conversations, currentUserId]);

  // ---- Reviews helpers ----
  const getReviewsForUser = useCallback((userId) => {
    return reviews.filter((r) => r.reviewedUserId === userId);
  }, [reviews]);

  const getAverageRating = useCallback((userId) => {
    const userReviews = reviews.filter((r) => r.reviewedUserId === userId);
    if (userReviews.length === 0) return null;
    const sum = userReviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / userReviews.length) * 100) / 100;
  }, [reviews]);

  // ---- Helper: add activity for current user ----
  const addActivity = (title, description, type = "general", iconName = "sparkles") => {
    if (!currentUserId) return;
    const newAct = {
      id: `act-${Date.now()}`,
      title,
      description,
      time: "Just now",
      type,
      iconName,
    };
    setUsersDb((prev) => {
      const u = prev[currentUserId];
      if (!u) return prev;
      return {
        ...prev,
        [currentUserId]: {
          ...u,
          activity: [newAct, ...(u.activity || []).slice(0, 9)],
        },
      };
    });
  };

  // =========================================================================
  // Profile Management
  // =========================================================================
  const updateProfile = (updatedProfile) => {
    if (!currentUserId) return;
    setUsersDb((prev) => {
      const u = prev[currentUserId];
      if (!u) return prev;
      return {
        ...prev,
        [currentUserId]: {
          ...u,
          profile: { ...u.profile, ...updatedProfile },
        },
      };
    });
    addActivity("Profile updated", "You modified your profile details", "profile", "edit");
    showToast("Profile updated successfully!");
  };

  // =========================================================================
  // Skills Offered (Can Teach)
  // =========================================================================
  const addSkillOffered = (skill) => {
    if (!currentUserId) return;
    const newSkill = {
      ...skill,
      id: `offered-${Date.now()}`,
      tags: skill.tags || [skill.name, skill.category],
    };
    setUsersDb((prev) => {
      const u = prev[currentUserId];
      if (!u) return prev;
      return {
        ...prev,
        [currentUserId]: {
          ...u,
          skillsOffered: [newSkill, ...(u.skillsOffered || [])],
        },
      };
    });
    addActivity("Skill offered added", `Added '${newSkill.name}' to teach`, "skill", "sparkles");
    showToast(`Added '${newSkill.name}' to your offered skills!`);
  };

  const updateSkillOffered = (id, updatedSkill) => {
    if (!currentUserId) return;
    setUsersDb((prev) => {
      const u = prev[currentUserId];
      if (!u) return prev;
      return {
        ...prev,
        [currentUserId]: {
          ...u,
          skillsOffered: (u.skillsOffered || []).map((s) =>
            s.id === id ? { ...s, ...updatedSkill } : s
          ),
        },
      };
    });
    showToast(`Updated '${updatedSkill.name}'`);
  };

  const deleteSkillOffered = (id) => {
    if (!currentUserId) return;
    const skillToDelete = skillsOffered.find((s) => s.id === id);
    setUsersDb((prev) => {
      const u = prev[currentUserId];
      if (!u) return prev;
      return {
        ...prev,
        [currentUserId]: {
          ...u,
          skillsOffered: (u.skillsOffered || []).filter((s) => s.id !== id),
        },
      };
    });
    if (skillToDelete) {
      showToast(`Removed '${skillToDelete.name}' from your offered skills`);
    }
  };

  // =========================================================================
  // Skills Wanted (Learning Wishlist)
  // =========================================================================
  const addSkillWanted = (skill) => {
    if (!currentUserId) return;
    const newSkill = {
      ...skill,
      id: `wanted-${Date.now()}`,
      tags: skill.tags || [skill.name, skill.category],
    };
    setUsersDb((prev) => {
      const u = prev[currentUserId];
      if (!u) return prev;
      return {
        ...prev,
        [currentUserId]: {
          ...u,
          skillsWanted: [newSkill, ...(u.skillsWanted || [])],
        },
      };
    });
    addActivity("Skill wanted added", `Looking to learn '${newSkill.name}'`, "skill", "book");
    showToast(`Added '${newSkill.name}' to your learning wishlist!`);
  };

  const updateSkillWanted = (id, updatedSkill) => {
    if (!currentUserId) return;
    setUsersDb((prev) => {
      const u = prev[currentUserId];
      if (!u) return prev;
      return {
        ...prev,
        [currentUserId]: {
          ...u,
          skillsWanted: (u.skillsWanted || []).map((s) =>
            s.id === id ? { ...s, ...updatedSkill } : s
          ),
        },
      };
    });
    showToast(`Updated '${updatedSkill.name}'`);
  };

  const deleteSkillWanted = (id) => {
    if (!currentUserId) return;
    const skillToDelete = skillsWanted.find((s) => s.id === id);
    setUsersDb((prev) => {
      const u = prev[currentUserId];
      if (!u) return prev;
      return {
        ...prev,
        [currentUserId]: {
          ...u,
          skillsWanted: (u.skillsWanted || []).filter((s) => s.id !== id),
        },
      };
    });
    if (skillToDelete) {
      showToast(`Removed '${skillToDelete.name}' from your wanted skills`);
    }
  };

  // =========================================================================
  // Swap Requests (Cross-user syncing)
  // =========================================================================
  const sendSwapRequest = ({ recipientUser, skillToLearn, skillOffered, message }) => {
    if (!currentUserId || !currentUser) return false;

    const isDuplicate = swapRequests.some(
      (req) =>
        req.type === "sent" &&
        req.recipientId === recipientUser.id &&
        req.skillToLearn === skillToLearn &&
        req.status === "pending"
    );

    if (isDuplicate) {
      showToast(`You already have a pending request with ${recipientUser.name} for this skill!`, "error");
      return false;
    }

    const reqId = `req-${Date.now()}`;
    const sentReq = {
      id: reqId,
      senderId: currentUserId,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.initials,
      senderColor: currentUser.avatarColor || "purple",
      recipientId: recipientUser.id,
      recipientName: recipientUser.name,
      recipientAvatar: recipientUser.initials,
      skillToLearn,
      skillOffered,
      message: message || `Hi ${recipientUser.name}, I would love to exchange skills with you!`,
      timestamp: "Just now",
      status: "pending",
      type: "sent",
    };

    const receivedReq = {
      ...sentReq,
      type: "received",
    };

    setUsersDb((prev) => {
      const senderData = prev[currentUserId] || {};
      let nextDb = {
        ...prev,
        [currentUserId]: {
          ...senderData,
          requests: [sentReq, ...(senderData.requests || [])],
        },
      };

      if (prev[recipientUser.id]) {
        const recipData = prev[recipientUser.id];
        nextDb[recipientUser.id] = {
          ...recipData,
          requests: [receivedReq, ...(recipData.requests || [])],
        };
      }

      return nextDb;
    });

    addActivity("Swap request sent", `Sent request to ${recipientUser.name} for ${skillToLearn}`, "request", "swap");
    showToast(`Swap request sent to ${recipientUser.name}!`);
    return true;
  };

  const respondToRequest = (requestId, action) => {
    if (!currentUserId || !currentUser) return;
    const req = swapRequests.find((r) => r.id === requestId);
    if (!req) return;

    if (action === "accept") {
      const newSwap = {
        id: `swap-${Date.now()}`,
        partnerId: req.senderId,
        partnerName: req.senderName,
        partnerRole: req.senderRole || "Skill Exchanger",
        partnerAvatar: req.senderAvatar,
        partnerColor: req.senderColor || "purple",
        mySkill: req.skillToLearn,
        theirSkill: req.skillOffered,
        status: "In Progress",
        progress: 10,
        nextSession: "Tomorrow, 5:00 PM",
        completedSessions: 0,
        totalSessions: 4,
      };

      const newSession = {
        id: `session-${Date.now()}`,
        skill: `${req.skillToLearn} & ${req.skillOffered}`,
        partnerName: req.senderName,
        partnerAvatar: req.senderAvatar,
        partnerColor: req.senderColor || "purple",
        partnerRole: req.senderRole || "Exchanger",
        date: "Tomorrow (5:00 PM)",
        time: "5:00 PM - 6:00 PM",
        duration: "60 mins",
        status: "Confirmed",
        exchangeType: "Collaborative",
        meetLink: "https://meet.google.com/ssw-live-session",
      };

      setUsersDb((prev) => {
        const curData = prev[currentUserId] || {};
        const updatedRequests = (curData.requests || []).map((r) =>
          r.id === requestId ? { ...r, status: "accepted" } : r
        );

        let nextDb = {
          ...prev,
          [currentUserId]: {
            ...curData,
            requests: updatedRequests,
            swaps: [newSwap, ...(curData.swaps || [])],
            sessions: [newSession, ...(curData.sessions || [])],
          },
        };

        if (prev[req.senderId]) {
          const senderData = prev[req.senderId];
          const senderSwap = {
            id: `swap-${Date.now()}-s`,
            partnerId: currentUserId,
            partnerName: currentUser.name,
            partnerRole: currentUser.role,
            partnerAvatar: currentUser.initials,
            partnerColor: currentUser.avatarColor || "purple",
            mySkill: req.skillOffered,
            theirSkill: req.skillToLearn,
            status: "In Progress",
            progress: 10,
            nextSession: "Tomorrow, 5:00 PM",
            completedSessions: 0,
            totalSessions: 4,
          };
          const senderSession = {
            id: `session-${Date.now()}-s`,
            skill: `${req.skillOffered} & ${req.skillToLearn}`,
            partnerName: currentUser.name,
            partnerAvatar: currentUser.initials,
            partnerColor: currentUser.avatarColor || "purple",
            partnerRole: currentUser.role,
            date: "Tomorrow (5:00 PM)",
            time: "5:00 PM - 6:00 PM",
            duration: "60 mins",
            status: "Confirmed",
            exchangeType: "Collaborative",
            meetLink: "https://meet.google.com/ssw-live-session",
          };

          nextDb[req.senderId] = {
            ...senderData,
            requests: (senderData.requests || []).map((r) =>
              r.id === requestId ? { ...r, status: "accepted" } : r
            ),
            swaps: [senderSwap, ...(senderData.swaps || [])],
            sessions: [senderSession, ...(senderData.sessions || [])],
          };
        }

        return nextDb;
      });

      addActivity("Swap accepted", `Accepted exchange request from ${req.senderName}`, "swap", "check");
      showToast(`Accepted exchange request from ${req.senderName}!`);
    } else if (action === "reject") {
      setUsersDb((prev) => {
        const curData = prev[currentUserId] || {};
        let nextDb = {
          ...prev,
          [currentUserId]: {
            ...curData,
            requests: (curData.requests || []).map((r) =>
              r.id === requestId ? { ...r, status: "rejected" } : r
            ),
          },
        };

        if (prev[req.senderId]) {
          const senderData = prev[req.senderId];
          nextDb[req.senderId] = {
            ...senderData,
            requests: (senderData.requests || []).map((r) =>
              r.id === requestId ? { ...r, status: "rejected" } : r
            ),
          };
        }

        return nextDb;
      });
      showToast(`Declined exchange request from ${req.senderName}`, "info");
    }
  };

  const cancelSentRequest = (requestId) => {
    if (!currentUserId) return;
    const req = swapRequests.find((r) => r.id === requestId);
    setUsersDb((prev) => {
      const curData = prev[currentUserId] || {};
      return {
        ...prev,
        [currentUserId]: {
          ...curData,
          requests: (curData.requests || []).map((r) =>
            r.id === requestId ? { ...r, status: "cancelled" } : r
          ),
        },
      };
    });
    showToast(`Cancelled request to ${req ? req.recipientName : "user"}`);
  };

  // =========================================================================
  // Messaging / Conversations
  // Structure: conversations[convId] = {
  //   id, participantIds, messages: [{id, senderId, text, timestamp, read}],
  //   updatedAt, createdAt
  // }
  // =========================================================================

  /**
   * startOrOpenConversation: finds or creates a conversation between current user
   * and targetUserId. Returns the conversation ID.
   * NOTE: Uses makeConversationId for deduplication.
   */
  const startOrOpenConversation = useCallback((targetUserId) => {
    if (!currentUserId || !targetUserId || currentUserId === targetUserId) return null;

    const convId = makeConversationId(currentUserId, targetUserId);

    setConversations((prev) => {
      if (prev[convId]) return prev; // already exists, no change needed
      const now = new Date().toISOString();
      return {
        ...prev,
        [convId]: {
          id: convId,
          participantIds: [currentUserId, targetUserId],
          messages: [],
          updatedAt: now,
          createdAt: now,
        },
      };
    });

    return convId;
  }, [currentUserId]);

  /**
   * sendMessage: sends a message in a conversation.
   */
  const sendMessage = useCallback((conversationId, text) => {
    if (!currentUserId || !text.trim() || !conversationId) return;

    const now = new Date().toISOString();
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      text: text.trim(),
      timestamp: now,
      read: false,
    };

    setConversations((prev) => {
      const conv = prev[conversationId];
      if (!conv) return prev;
      return {
        ...prev,
        [conversationId]: {
          ...conv,
          messages: [...(conv.messages || []), newMsg],
          updatedAt: now,
        },
      };
    });
  }, [currentUserId]);

  /**
   * markConversationRead: marks all messages from the other person as read.
   */
  const markConversationRead = useCallback((conversationId) => {
    if (!currentUserId || !conversationId) return;
    setConversations((prev) => {
      const conv = prev[conversationId];
      if (!conv) return prev;
      return {
        ...prev,
        [conversationId]: {
          ...conv,
          messages: (conv.messages || []).map((m) =>
            m.senderId !== currentUserId ? { ...m, read: true } : m
          ),
        },
      };
    });
  }, [currentUserId]);

  // =========================================================================
  // Reviews
  // =========================================================================
  const submitReview = ({ reviewedUserId, rating, comment, swapId }) => {
    if (!currentUserId || !reviewedUserId || !rating) return false;

    // Prevent duplicate reviews for same swap
    if (swapId) {
      const exists = reviews.some(
        (r) => r.swapId === swapId && r.reviewerId === currentUserId
      );
      if (exists) {
        showToast("You have already reviewed this swap.", "error");
        return false;
      }
    }

    const newReview = {
      id: `review-${Date.now()}`,
      reviewerId: currentUserId,
      reviewerName: currentUser?.name || "Anonymous",
      reviewerInitials: currentUser?.initials || "?",
      reviewerAvatarColor: currentUser?.avatarColor || "purple",
      reviewedUserId,
      rating: Number(rating),
      comment: comment?.trim() || "",
      createdAt: new Date().toISOString(),
      swapId: swapId || null,
    };

    setReviews((prev) => [newReview, ...prev]);
    addActivity("Review submitted", `You rated a skill exchange partner`, "review", "star");
    showToast("Review submitted successfully!");
    return true;
  };

  // =========================================================================
  // Authentication
  // =========================================================================
  const login = (email, password) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = password || "";

    // Block legacy demo accounts
    if (
      cleanEmail === "maya.chen@designcraft.io" ||
      cleanEmail === "navya.sharma@skillswap.io"
    ) {
      showToast("These demo accounts have been removed. Please register a new account.", "error");
      return false;
    }

    // Search registered users in usersDb — must match email AND password
    const foundUserId = Object.keys(usersDb).find(
      (uid) => usersDb[uid]?.profile?.email?.toLowerCase() === cleanEmail
    );

    if (!foundUserId) {
      showToast("Invalid email or password.", "error");
      return false;
    }

    // Validate password against stored hash
    const storedPassword = usersDb[foundUserId]?.password;
    if (!storedPassword || storedPassword !== cleanPassword) {
      showToast("Invalid email or password.", "error");
      return false;
    }

    setCurrentUserId(foundUserId);
    const userName = usersDb[foundUserId]?.profile?.name || "Member";
    showToast(`Welcome back, ${userName}!`);
    return true;
  };

  const register = (userData) => {
    const newUserId = `user-${Date.now()}`;
    const cleanName = (userData.name || "New Explorer").trim();
    const cleanEmail = (userData.email || "").trim().toLowerCase();
    const cleanPassword = userData.password || "";

    // Check for existing email
    const existingUser = Object.values(usersDb).find(
      (u) => u?.profile?.email?.toLowerCase() === cleanEmail
    );
    if (existingUser) {
      showToast("An account with this email already exists. Please log in.", "error");
      return false;
    }

    const initials = cleanName
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newProfile = {
      id: newUserId,
      name: cleanName,
      email: cleanEmail,
      role: userData.role || "Passionate Learner",
      initials: initials || "NE",
      avatarColor: "purple",
      location: userData.location || "Remote",
      bio: userData.bio || "Excited to trade skills and learn from the community!",
      experienceLevel: "Intermediate",
      availability: "Flexible (3-5 hrs/week)",
      joinedDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
      interests: ["Learning", "Mentorship"],
    };

    const initialOffered = userData.primaryTeachSkill?.trim()
      ? [
          {
            id: `offered-${Date.now()}`,
            name: userData.primaryTeachSkill.trim(),
            category: "General",
            level: "Intermediate",
            description: "Skill I can teach during exchange sessions",
            hoursPerWeek: 3,
            tags: [userData.primaryTeachSkill.trim()],
          },
        ]
      : [];

    const initialWanted = userData.primaryLearnSkill?.trim()
      ? [
          {
            id: `wanted-${Date.now() + 1}`,
            name: userData.primaryLearnSkill.trim(),
            category: "General",
            level: "Beginner",
            description: "Skill I am eager to learn from a peer",
            priority: "High",
            tags: [userData.primaryLearnSkill.trim()],
          },
        ]
      : [];

    setUsersDb((prev) => ({
      ...prev,
      [newUserId]: {
        profile: newProfile,
        password: cleanPassword, // stored in plain text (frontend-only, no backend)
        skillsOffered: initialOffered,
        skillsWanted: initialWanted,
        requests: [],
        swaps: [],
        sessions: [],
        activity: [
          {
            id: `act-${Date.now()}`,
            title: "Joined SkillSwap",
            description: "Account created successfully",
            time: "Just now",
            type: "general",
            iconName: "sparkles",
          },
        ],
      },
    }));

    setCurrentUserId(newUserId);
    showToast(`Welcome to SkillSwap, ${cleanName}!`);
    return true;
  };

  const logout = () => {
    setCurrentUserId(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    showToast("You have been signed out.", "info");
  };

  // =========================================================================
  // Profile Completion
  // =========================================================================
  const getProfileCompleteness = () => {
    if (!currentUser) {
      return { percentage: 0, completedCount: 0, totalCount: 8, checks: [] };
    }

    const checks = [
      {
        id: "name",
        label: "Set full name",
        done: Boolean(currentUser.name && currentUser.name.trim().length > 1),
      },
      {
        id: "avatar",
        label: "Profile avatar & initials",
        done: Boolean(currentUser.initials && currentUser.initials.length >= 1),
      },
      {
        id: "bio",
        label: "Add personal bio & experience",
        done: Boolean(currentUser.bio && currentUser.bio.trim().length > 15),
      },
      {
        id: "experience",
        label: "Set experience level",
        done: Boolean(currentUser.experienceLevel && currentUser.experienceLevel !== "All Levels"),
      },
      {
        id: "location",
        label: "Specify location & timezone",
        done: Boolean(currentUser.location && currentUser.location.trim().length > 0),
      },
      {
        id: "availability",
        label: "Set weekly availability",
        done: Boolean(currentUser.availability && currentUser.availability.trim().length > 0),
      },
      {
        id: "offered",
        label: "List at least 1 skill you can teach",
        done: skillsOffered.length > 0,
      },
      {
        id: "wanted",
        label: "List at least 1 skill you want to learn",
        done: skillsWanted.length > 0,
      },
    ];

    const completed = checks.filter((c) => c.done).length;
    const percentage = Math.round((completed / checks.length) * 100);

    return { percentage, completedCount: completed, totalCount: checks.length, checks };
  };

  // =========================================================================
  // Dynamic Statistics
  // =========================================================================
  const stats = useMemo(() => {
    const unreadCount = myConversations.reduce((acc, conv) => {
      const unread = (conv.messages || []).filter(
        (m) => m.senderId !== currentUserId && !m.read
      ).length;
      return acc + unread;
    }, 0);

    return {
      skillsOfferedCount: skillsOffered.length,
      skillsWantedCount: skillsWanted.length,
      pendingRequestsCount: swapRequests.filter(
        (r) => r.type === "received" && r.status === "pending"
      ).length,
      activeSwapsCount: activeSwaps.filter(
        (s) => s.status === "In Progress" || s.status === "Active"
      ).length,
      upcomingSessionsCount: upcomingSessions.length,
      unreadMessagesCount: unreadCount,
    };
  }, [skillsOffered, skillsWanted, swapRequests, activeSwaps, upcomingSessions, myConversations, currentUserId]);

  // =========================================================================
  // Community Users (excluding current user)
  // =========================================================================
  const communityUsers = useMemo(() => {
    const list = [];
    const seen = new Set();

    // Registered users in usersDb
    Object.keys(usersDb).forEach((uid) => {
      if (uid !== currentUserId && usersDb[uid]?.profile) {
        const u = usersDb[uid];
        seen.add(uid);
        seen.add(u.profile.email?.toLowerCase());
        list.push({
          ...u.profile,
          skillsOffered: u.skillsOffered || [],
          skillsWanted: u.skillsWanted || [],
        });
      }
    });

    // Seed community users (not already registered)
    initialCommunityUsers.forEach((seedUser) => {
      if (
        seedUser.id !== currentUserId &&
        !seen.has(seedUser.id) &&
        !seen.has(seedUser.email?.toLowerCase())
      ) {
        list.push(seedUser);
      }
    });

    return list;
  }, [usersDb, currentUserId]);

  // =========================================================================
  // Helper: resolve a user profile by ID (from usersDb or community seed)
  // =========================================================================
  const getUserById = useCallback((userId) => {
    if (!userId) return null;
    if (usersDb[userId]?.profile) {
      const u = usersDb[userId];
      return {
        ...u.profile,
        skillsOffered: u.skillsOffered || [],
        skillsWanted: u.skillsWanted || [],
      };
    }
    return initialCommunityUsers.find((u) => u.id === userId) || null;
  }, [usersDb]);

  return (
    <SkillSwapContext.Provider
      value={{
        usersDb,
        currentUserId,
        currentUser,
        skillsOffered,
        skillsWanted,
        swapRequests,
        activeSwaps,
        upcomingSessions,
        myConversations,
        conversations,
        recentActivity,
        reviews,
        isAuthenticated,
        stats,
        communityUsers,
        toast,
        showToast,
        updateProfile,
        addSkillOffered,
        updateSkillOffered,
        deleteSkillOffered,
        addSkillWanted,
        updateSkillWanted,
        deleteSkillWanted,
        sendSwapRequest,
        respondToRequest,
        cancelSentRequest,
        startOrOpenConversation,
        sendMessage,
        markConversationRead,
        submitReview,
        getReviewsForUser,
        getAverageRating,
        getUserById,
        login,
        register,
        logout,
        getProfileCompleteness,
        makeConversationId,
        formatTimestamp,
      }}
    >
      {children}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`} role="alert">
          <div className="toast-icon">
            {toast.type === "success" && "✓"}
            {toast.type === "error" && "✕"}
            {toast.type === "info" && "ℹ"}
          </div>
          <span className="toast-message">{toast.message}</span>
        </div>
      )}
    </SkillSwapContext.Provider>
  );
}

export function useSkillSwap() {
  const context = useContext(SkillSwapContext);
  if (!context) {
    throw new Error("useSkillSwap must be used within a SkillSwapProvider");
  }
  return context;
}
