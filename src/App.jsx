import React from "react";
import { Routes, Route } from "react-router-dom";
import { SkillSwapProvider } from "./context/SkillSwapContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FindSkills from "./pages/FindSkills";
import MySkills from "./pages/MySkills";
import Requests from "./pages/Requests";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

function App() {
  return (
    <SkillSwapProvider>
      <div className="app-layout">
        <Navbar />

        <main className="app-main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/find-skills" element={<FindSkills />} />
            <Route path="/my-skills" element={<MySkills />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </SkillSwapProvider>
  );
}

export default App;