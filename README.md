# SkillSwap – Peer-to-Peer Skill Exchange Platform

SkillSwap is a **React-based peer-to-peer skill exchange platform** that helps students and learners connect with others to exchange knowledge and skills without spending money.

Users can create profiles, list the skills they can teach, add skills they want to learn, discover suitable skill partners, communicate with other users, send skill-swap requests, and complete exchanges.

---

## 🚀 Project Overview

SkillSwap creates a collaborative learning environment where every user can be both a **learner and a mentor**.

Instead of depending only on traditional learning methods, users can learn practical skills directly from their peers while sharing their own knowledge in return.

### Example

A student who knows **Python** but wants to learn **Graphic Design** can find another student who knows Graphic Design and wants to learn Python.

They can connect and exchange their skills with each other.

---

## 🎯 Objectives

* Provide an easy platform for peer-to-peer learning
* Help users discover people with complementary skills
* Allow users to list skills they can teach
* Allow users to list skills they want to learn
* Provide personalized skill recommendations
* Enable users to communicate with potential skill partners
* Manage skill-swap requests
* Support completed exchanges and reviews
* Create a collaborative learning community

---

## ✨ Key Features

### 🔐 Registration & Login

* User registration
* Password-based authentication
* Strong password validation
* Login validation
* User-specific application data

### 👤 User Profiles

Users can create profiles containing:

* Name
* Profile information
* Location
* Experience
* Skills they offer
* Skills they want to learn

### 🧠 Skill Management

Users can:

* Add skills they can teach
* Add skills they want to learn
* Update their skills
* View their personal skill profile

### 🔎 Skill Discovery

Users can browse available skills and discover other users based on their learning goals.

### 🤝 Smart Skill Matching

Skill recommendations are generated based on complementary skills.

For example:

```text
User A wants to learn Python
        ↓
User B offers Python
        ↓
Potential Skill Match
```

The matching system also considers complementary learning relationships where appropriate.

### 💬 Messaging

Users can:

* View another user's profile
* Start a conversation
* Send messages
* Continue existing conversations
* View previous messages

Conversations are stored locally and remain available after refreshing the browser.

### 🔄 Skill Swap Requests

Users can:

* Request a skill exchange
* Select the skill they want to learn
* Select the skill they can teach in return
* Send an introductory message
* Accept or manage incoming requests
* Complete skill exchanges

### ⭐ Reviews & Ratings

After completing a skill exchange, users can provide:

* Rating
* Written review

Average ratings are calculated dynamically from actual reviews.

### 📊 Dynamic Dashboard

The dashboard displays user-specific information such as:

* Skills offered
* Skills wanted
* Pending requests
* Active swaps
* Profile completion
* Upcoming activities
* Recommended skill partners

---

## 🛠️ Technology Stack

### Frontend

* **React**
* **JavaScript**
* **HTML5**
* **CSS3**
* **React Router**
* **React Context API**
* **React State**

### Data Persistence

* **Browser localStorage**

SkillSwap is designed as a **frontend-only project**.

There is no backend server or traditional database.

```text
React UI
   ↓
React Components
   ↓
React Context / State
   ↓
Browser localStorage
   ↓
Persistent User Data
```

---

## 🏗️ Application Architecture

```text
                    SkillSwap
                       │
                       ▼
                 React Frontend
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      Components    Context       Routing
          │            │            │
          └────────────┼────────────┘
                       ▼
                React State
                       │
                       ▼
               Browser Storage
                localStorage
```

---

## 🔄 User Workflow

```text
Register / Login
       ↓
Create Profile
       ↓
Add Skills to Teach
       ↓
Add Skills to Learn
       ↓
Find Matching Users
       ↓
View User Profile
       ↓
Start Conversation
       ↓
Request Skill Swap
       ↓
Accept Request
       ↓
Active Skill Exchange
       ↓
Complete Exchange
       ↓
Review & Rating
```

---

## 📱 Main Application Sections

### Home

Introduces SkillSwap and explains the purpose of the platform.

### Dashboard

Provides a personalized overview of the current user's activity and skill information.

### My Skills

Allows users to manage skills they offer and skills they want to learn.

### Find Skills

Allows users to discover potential skill partners based on matching skills.

### Messages

Provides one-to-one conversations between skill partners.

### Requests

Allows users to manage incoming and outgoing skill-swap requests.

### Profile

Displays and manages personal profile information and reviews.

---

## 💾 Data Persistence

SkillSwap uses the browser's **localStorage** to maintain application data.

This allows data such as the following to remain available after a page refresh:

* User information
* Skills
* Skill preferences
* Conversations
* Messages
* Swap requests
* Active swaps
* Reviews
* Ratings

### Important

Since this is a frontend-only academic project, localStorage is used for demonstration and learning purposes. It should not be considered a production-grade authentication or data-storage solution for sensitive information.

---

## 🔒 Authentication

SkillSwap includes frontend password-based authentication with strong password requirements.

A valid password should contain:

* At least 8 characters
* One uppercase letter
* One lowercase letter
* One number
* One special character

Example format:

```text
Example@123
```

> Do not use this example password for a real account.

---

## 🎓 Target Users

### College Students

Students looking for affordable and flexible peer-to-peer learning opportunities.

### Student Mentors

Students who want to share their knowledge and improve their teaching skills.

### Skill Learners

Users who want to gain practical, academic, technical, or creative skills through peer learning.

---

## 🌟 Benefits

### Accessible Peer Learning

Students can connect with peers who have the skills they want to learn.

### Practical Knowledge Sharing

Users can teach real-world skills and gain practical experience.

### Collaborative Growth

Every user can participate as both a learner and a mentor.

### Connected Community

SkillSwap encourages students to build meaningful learning connections.

### Organized Skill Exchange

Skill requests, conversations, exchanges, and reviews are managed within one platform.

---

## 📂 Project Structure

A simplified project structure is:

```text
SkillSwap/
│
├── src/
│   ├── components/
│   │   ├── Icons.jsx
│   │   ├── Navbar.jsx
│   │   ├── RequestCard.jsx
│   │   ├── RequestSwapModal.jsx
│   │   ├── UserCard.jsx
│   │   └── UserProfileModal.jsx
│   │
│   ├── context/
│   │   └── SkillSwapContext.jsx
│   │
│   ├── data/
│   │   ├── initialData.js
│   │   └── users.js
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MySkills.jsx
│   │   ├── FindSkills.jsx
│   │   ├── Messages.jsx
│   │   ├── Requests.jsx
│   │   └── Profile.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── public/
│
├── package.json
├── vite.config.js
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/balinenimounika/SkillSwap-Peer-to-Peer-Skill-Exchange-Platform.git
```

### 2. Open the project

```bash
cd SkillSwap-Peer-to-Peer-Skill-Exchange-Platform
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

### 5. Open the application

Vite will provide a local development URL, normally similar to:

```text
http://localhost:5173
```

Open the displayed URL in your browser.

---

## 🏗️ Production Build

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🧪 Testing the Application

The main application workflow can be tested using:

```text
Register
   ↓
Login
   ↓
Create Profile
   ↓
Add Skills
   ↓
Find Skills
   ↓
View Profile
   ↓
Start Conversation
   ↓
Send Message
   ↓
Request Skill Swap
   ↓
Accept Request
   ↓
Complete Exchange
   ↓
Submit Review
```

Refresh the browser during testing to verify that user-specific data persists through localStorage.

---

## 🔐 Project Constraints

This project intentionally uses a frontend-only architecture.

### Included

* React
* React Context
* React State
* React Router
* Browser localStorage
* Responsive frontend UI

### Not Included

* ❌ Node.js backend
* ❌ Express.js
* ❌ MongoDB
* ❌ MySQL
* ❌ PostgreSQL
* ❌ Firebase
* ❌ Supabase
* ❌ External APIs
* ❌ Backend server

---

## 🔮 Future Enhancements

Although the current project is frontend-only, future versions could introduce:

* Secure backend authentication
* Cloud database storage
* Real-time messaging
* Email notifications
* Video/audio skill sessions
* Advanced recommendation algorithms
* Calendar integration
* Skill verification
* Achievement badges
* Community moderation
* Mobile application

These are potential future improvements and are **not part of the current frontend-only implementation**.

---

## 🎓 Academic Project

**Project Name:** SkillSwap – Peer-to-Peer Skill Exchange Platform

**Project Type:** Frontend Web Application

**Primary Technology:** React

**Data Storage:** Browser localStorage

**Architecture:** Frontend-only

**Purpose:** Peer-to-peer learning and skill exchange

---

## 👩‍💻 Contributors

* **Chaitanya**
* **Navya**
* **Haniska**
* **Mahitha**
* **Mounika**

---


## ❤️ Conclusion

SkillSwap transforms individual abilities into shared learning opportunities.

It provides a platform where users can:

**Teach → Connect → Learn → Grow**

By combining skill discovery, peer matching, messaging, skill-swap requests, and reviews in one frontend application, SkillSwap creates a simple and collaborative environment for peer-to-peer learning.

---

## 📄 License

This project was developed as an academic/college project for educational purposes.
