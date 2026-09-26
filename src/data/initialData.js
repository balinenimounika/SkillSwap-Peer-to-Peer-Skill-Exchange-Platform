// Base seed definitions for SkillSwap multi-user database
// NOTE: Maya Chen (user-maya) and Navya Sharma (user-navya) have been removed.
// All demo/fake data has been removed. Only genuine community seed users remain.

export const initialUsersDatabase = {};

// Community members available in the directory for skill discovery.
// These are seed community users (NOT demo/test accounts — no quick-login buttons).
export const initialCommunityUsers = [
  {
    id: "community-1",
    name: "Jordan Bell",
    email: "jordan.bell@frontend.dev",
    role: "Senior Frontend Engineer",
    initials: "JB",
    avatarColor: "indigo",
    location: "Austin, TX",
    experienceLevel: "Expert",
    availability: "Weekends & Evenings",
    rating: null,
    reviewsCount: 0,
    swapsCount: 0,
    bio: "Frontend architect at a high-growth tech startup. Passionate about web accessibility, clean React architecture, and performance optimization.",
    skillsOffered: [
      { name: "React & Next.js", level: "Expert", category: "Web Development" },
      { name: "TypeScript", level: "Expert", category: "Programming" },
      { name: "Tailwind CSS", level: "Advanced", category: "Web Development" }
    ],
    skillsWanted: [
      { name: "UX Research", level: "Beginner", category: "Design" },
      { name: "Figma Prototyping", level: "Intermediate", category: "Design" }
    ]
  },
  {
    id: "community-2",
    name: "Priya Nair",
    email: "priya.nair@growth.io",
    role: "Content Strategist & SEO Lead",
    initials: "PN",
    avatarColor: "purple",
    location: "Toronto, CA",
    experienceLevel: "Advanced",
    availability: "Weekdays (Flexible)",
    rating: null,
    reviewsCount: 0,
    swapsCount: 0,
    bio: "10+ years in organic growth and content strategy. I help startups build content engines that rank high on Google and actually convert.",
    skillsOffered: [
      { name: "SEO Strategy", level: "Expert", category: "Marketing" },
      { name: "Copywriting & Storytelling", level: "Expert", category: "Marketing" },
      { name: "Newsletter Growth", level: "Advanced", category: "Marketing" }
    ],
    skillsWanted: [
      { name: "Brand Strategy", level: "Intermediate", category: "Marketing" },
      { name: "Figma Basics", level: "Beginner", category: "Design" }
    ]
  },
  {
    id: "community-3",
    name: "Sam Rivera",
    email: "sam.rivera@careers.co",
    role: "Executive Career & Tech Coach",
    initials: "SR",
    avatarColor: "violet",
    location: "Chicago, IL",
    experienceLevel: "Expert",
    availability: "Flexible",
    rating: null,
    reviewsCount: 0,
    swapsCount: 0,
    bio: "Former tech hiring manager and coach. Helped 120+ designers and engineers negotiate six-figure offers and land dream leadership roles.",
    skillsOffered: [
      { name: "Interview Prep & Negotiation", level: "Expert", category: "Career" },
      { name: "Executive Mentoring", level: "Expert", category: "Career" },
      { name: "Resume & Portfolio Teardown", level: "Expert", category: "Career" }
    ],
    skillsWanted: [
      { name: "Figma & UI Systems", level: "Intermediate", category: "Design" },
      { name: "Modern Web Basics", level: "Beginner", category: "Web Development" }
    ]
  },
  {
    id: "community-4",
    name: "Elena Rostova",
    email: "elena.rostova@mlresearch.de",
    role: "Machine Learning Researcher",
    initials: "ER",
    avatarColor: "indigo",
    location: "Berlin, DE",
    experienceLevel: "Expert",
    availability: "Weekends",
    rating: null,
    reviewsCount: 0,
    swapsCount: 0,
    bio: "Applied ML engineer working on LLMs, computer vision, and Python data pipelines. Eager to trade programming expertise for design know-how.",
    skillsOffered: [
      { name: "Python for Data Analysis", level: "Expert", category: "AI/ML" },
      { name: "Machine Learning & LLMs", level: "Advanced", category: "AI/ML" },
      { name: "Data Visualization", level: "Advanced", category: "AI/ML" }
    ],
    skillsWanted: [
      { name: "UX Research & Testing", level: "Intermediate", category: "Design" },
      { name: "Product Design", level: "Beginner", category: "Design" }
    ]
  },
  {
    id: "community-5",
    name: "Marcus Vance",
    email: "marcus.vance@growthadvisors.com",
    role: "Growth & Paid Media Director",
    initials: "MV",
    avatarColor: "purple",
    location: "San Francisco, CA",
    experienceLevel: "Advanced",
    availability: "Evenings",
    rating: null,
    reviewsCount: 0,
    swapsCount: 0,
    bio: "Performance marketing specialist who has managed over $5M in ad spend across Google, Meta, and LinkedIn. Looking to understand frontend code.",
    skillsOffered: [
      { name: "Growth Marketing", level: "Expert", category: "Marketing" },
      { name: "Paid Ads & CAC Optimization", level: "Advanced", category: "Marketing" },
      { name: "Analytics & Funnels", level: "Advanced", category: "Marketing" }
    ],
    skillsWanted: [
      { name: "React Fundamentals", level: "Beginner", category: "Web Development" },
      { name: "Fullstack Architecture", level: "Beginner", category: "Programming" }
    ]
  },
  {
    id: "community-6",
    name: "Aisha Al-Mansoor",
    email: "aisha.almansoor@speechcraft.uk",
    role: "Linguist & Public Speaking Coach",
    initials: "AA",
    avatarColor: "violet",
    location: "London, UK",
    experienceLevel: "Advanced",
    availability: "Flexible",
    rating: null,
    reviewsCount: 0,
    swapsCount: 0,
    bio: "Trilingual linguist and TEDx speaker coach. I help founders, developers, and creatives deliver captivating keynotes and polish speech delivery.",
    skillsOffered: [
      { name: "Public Speaking & Keynotes", level: "Expert", category: "Languages" },
      { name: "Arabic Language Mastery", level: "Expert", category: "Languages" },
      { name: "Vocal Confidence & Pitch", level: "Advanced", category: "Languages" }
    ],
    skillsWanted: [
      { name: "Motion Design", level: "Intermediate", category: "Design" },
      { name: "Brand Visuals", level: "Beginner", category: "Marketing" }
    ]
  }
];

export const CATEGORIES = [
  "All Categories",
  "Programming",
  "Web Development",
  "AI/ML",
  "Design",
  "Languages",
  "Marketing",
  "Career"
];

export const EXPERIENCE_LEVELS = ["All Levels", "Beginner", "Intermediate", "Advanced", "Expert"];

export const AVAILABILITY_OPTIONS = ["All Availability", "Weekdays", "Weekends", "Flexible", "Evenings"];
