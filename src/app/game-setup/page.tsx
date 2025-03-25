// -----------------------------------------------------------------------------
// File Header & Import Statements
// "use client" specifies that this file is to be executed on the client side.
// The import statements bring in React hooks (useState, useEffect, Suspense), Next.js
// navigation hooks (useRouter, useSearchParams), Framer Motion's animation tools (motion),
// and React itself. These libraries support UI rendering, state management, routing, and animations.
// -----------------------------------------------------------------------------
"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";



// -----------------------------------------------------------------------------
// Translations Object
// Contains all the localized UI text strings for both English and French.
// These keys (e.g., title, sectionLabel, team names, etc.) are used to dynamically display
// the correct text based on the user's language selection.
// -----------------------------------------------------------------------------
const translations = {
  en: {
    title: "Team Setup",
    sectionLabel: "Grade", 
    team1Name: "Team 1 Name",
    team2Name: "Team 2 Name",
    team1Count: "Number of Members (Team 1)",
    team2Count: "Number of Members (Team 2)",
    teamMember: "Member Name",
    startGame: "Start Game",
    fillRequiredFields: "Please fill out the grade and both team names!"
  },
  fr: {
    title: "Configuration des Équipes",
    sectionLabel: "Niveau",
    team1Name: "Nom de l'Équipe 1",
    team2Name: "Nom de l'Équipe 2",
    team1Count: "Nombre de membres (Équipe 1)",
    team2Count: "Nombre de membres (Équipe 2)",
    teamMember: "Nom du membre",
    startGame: "Commencer le Jeu",
    fillRequiredFields: "Veuillez remplir le niveau et les noms des deux équipes !"
  },
};



// -----------------------------------------------------------------------------
// GameSetupContent Component - Team Setup Page
// This component renders the team setup form for the game. It allows the user to:
// • Select a grade/section (or level).
// • Input team names and the number of team members (limited to 4 per team).
// • Dynamically generate input fields for each team member’s name based on the specified count.
// Upon submission, it validates the inputs and navigates to the tutorial page with the proper query parameters.
// -----------------------------------------------------------------------------
function GameSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as "en" | "fr") || "en";
  const t = translations[lang];



  // -----------------------------------------------------------------------------
// State Variables & Hooks Initialization
// Initializes state for the section (grade), team names, team member counts, and team members arrays.
// Also sets up an error message state and uses Next.js routing and search parameter hooks to determine
// the language (defaulting to English if none is specified).
// -----------------------------------------------------------------------------
  const [section, setSection] = useState("");
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [team1Count, setTeam1Count] = useState<number>(0);
  const [team2Count, setTeam2Count] = useState<number>(0);
  const [team1Members, setTeam1Members] = useState<string[]>([]);
  const [team2Members, setTeam2Members] = useState<string[]>([]);
  const [error, setError] = useState("");



  // -----------------------------------------------------------------------------
// useEffect: Team 1 Members Update
// Ensures that the number of team member input fields for Team 1 is limited to 4.
// Updates the team1Members array based on the current team1Count, and resets the count to 4 if exceeded.
// -----------------------------------------------------------------------------
  useEffect(() => {
    // Limit to maximum 4 members
    const limitedCount = Math.min(4, team1Count);
    setTeam1Members(Array(limitedCount).fill(""));
    if (team1Count > 4) {
      setTeam1Count(4);
    }
  }, [team1Count]);


  // -----------------------------------------------------------------------------
// useEffect: Team 2 Members Update
// Similar to Team 1, this effect ensures that the Team 2 member inputs are limited to 4.
// It creates an array of empty strings for each team member and adjusts team2Count if it exceeds 4.
// -----------------------------------------------------------------------------
  useEffect(() => {
    // Limit to maximum 4 members
    const limitedCount = Math.min(4, team2Count);
    setTeam2Members(Array(limitedCount).fill(""));
    if (team2Count > 4) {
      setTeam2Count(4);
    }
  }, [team2Count]);



  // -----------------------------------------------------------------------------
// Update Team Member Functions
// updateTeam1Member and updateTeam2Member update the name of a team member at a specific index
// in their respective arrays. This ensures that as the user types into the input fields,
// the component state is updated accordingly.
// -----------------------------------------------------------------------------
  const updateTeam1Member = (index: number, value: string) => {
    setTeam1Members((prev) => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  };

  const updateTeam2Member = (index: number, value: string) => {
    setTeam2Members((prev) => {
      const newArr = [...prev];
      newArr[index] = value;
      return newArr;
    });
  };



  // -----------------------------------------------------------------------------
// handleStartGame Function
// Validates that the required fields (grade/section and both team names) are filled.
// If validation fails, it displays an error message. Otherwise, it constructs a URL query string
// (including team member names) and navigates to the tutorial page.
// -----------------------------------------------------------------------------
const handleStartGame = () => {
  // Ensuring that the grade, section, and both team names are filled before proceeding.
  if (!section || !team1Name || !team2Name || !section) {
    setError(t.fillRequiredFields);
    return;
  }

  setError("");
  router.push(
    `/tutorial?lang=${lang}` +
      `&section=${encodeURIComponent(section)}` +
      `&team1=${encodeURIComponent(team1Name)}` +
      `&team2=${encodeURIComponent(team2Name)}` +
      `&members1=${encodeURIComponent(team1Members.join(","))}` +
      `&members2=${encodeURIComponent(team2Members.join(","))}` +
      `&grade=${encodeURIComponent(section)}`
  );
};



  // -----------------------------------------------------------------------------
// Input & Label Style Objects
// Defines the CSS styling for text inputs and labels.
// These style objects are reused for consistency across the form elements.
// -----------------------------------------------------------------------------
  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    backgroundColor: "white",
    transition: "all 0.2s ease",
    fontSize: "16px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05) inset"
  };

  const labelStyle = {
    display: "block",
    fontWeight: "600",
    marginBottom: "8px",
    fontSize: "16px",
    color: "#444"
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/earth-split-bg2.jpg'), linear-gradient(to bottom, rgba(46, 204, 113, 0.2), rgba(39, 174, 96, 0.4))",
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#333",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        boxSizing: "border-box",
        fontFamily: "'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, sans-serif",
        overflow: "auto"
      }}
    >
      <motion.div
        style={{
          backgroundColor: "rgba(255,255,255,0.95)",
          borderRadius: "20px",
          padding: "36px",
          maxWidth: "900px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)",
          border: "1px solid rgba(230, 230, 230, 0.7)"
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          style={{ 
            fontSize: "2.5rem", 
            marginBottom: "28px", 
            textAlign: "center",
            color: "#1e8449",
            fontWeight: "700",
            letterSpacing: "-0.5px"
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {t.title}
        </motion.h1>

        {error && (
          <motion.div 
            style={{
              padding: "12px 16px",
              backgroundColor: "#ffebee",
              color: "#c62828",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center",
              fontWeight: "500"
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}

        {/* Grade/Section */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>
            {t.sectionLabel}
          </label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            style={{
              ...inputStyle,
              cursor: "pointer",
              appearance: "none",
              backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"black\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/><path d=\"M0 0h24v24H0z\" fill=\"none\"/></svg>')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center"
            }}
          >
            <option value="">{lang === "fr" ? "Sélectionner niveau" : "Select grade"}</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
          </select>
        </div>

        <div style={{ 
          display: "flex", 
          flexDirection: "row",
          gap: "32px",
          marginBottom: "20px"
        }}>
          {/* Team 1 */}
          <div style={{ 
            flex: 1,
            backgroundColor: "rgba(212, 239, 223, 0.6)", 
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            border: "1px solid rgba(130, 204, 161, 0.3)"
          }}>
            <h2 style={{ 
              fontSize: "1.4rem", 
              marginBottom: "20px", 
              color: "#2e7d32",
              fontWeight: "600" 
            }}>
              Team 1
            </h2>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t.team1Name}
              </label>
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                placeholder={t.team1Name}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t.team1Count}
              </label>
              <input
                type="number"
                min={0}
                max={4}
                value={team1Count}
                onChange={(e) => setTeam1Count(Math.min(4, Number(e.target.value)))}
                placeholder="0"
                style={inputStyle}
              />
            </div>
            {team1Members.map((member, idx) => (
              <div key={idx} style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>
                  {t.teamMember} {idx + 1}
                </label>
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateTeam1Member(idx, e.target.value)}
                  placeholder={`${t.teamMember} ${idx + 1}`}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>

          {/* Team 2 */}
          <div style={{ 
            flex: 1,
            backgroundColor: "rgba(232, 245, 233, 0.6)", 
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            border: "1px solid rgba(165, 214, 167, 0.3)"
          }}>
            <h2 style={{ 
              fontSize: "1.4rem", 
              marginBottom: "20px", 
              color: "#388e3c",
              fontWeight: "600" 
            }}>
              Team 2
            </h2>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t.team2Name}
              </label>
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                placeholder={t.team2Name}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>
                {t.team2Count}
              </label>
              <input
                type="number"
                min={0}
                max={4}
                value={team2Count}
                onChange={(e) => setTeam2Count(Math.min(4, Number(e.target.value)))}
                placeholder="0"
                style={inputStyle}
              />
            </div>
            {team2Members.map((member, idx) => (
              <div key={idx} style={{ marginBottom: "16px" }}>
                <label style={labelStyle}>
                  {t.teamMember} {idx + 1}
                </label>
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateTeam2Member(idx, e.target.value)}
                  placeholder={`${t.teamMember} ${idx + 1}`}
                  style={inputStyle}
                />
              </div>
            ))}
          </div>
        </div>

        <motion.button
          onClick={handleStartGame}
          style={{
            width: "100%",
            marginTop: "36px",
            padding: "18px",
            backgroundColor: "#27ae60",
            color: "#fff",
            fontWeight: "600",
            fontSize: "18px",
            borderRadius: "14px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(39, 174, 96, 0.3)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px"
          }}
          whileHover={{ 
            backgroundColor: "#2ecc71",
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(39, 174, 96, 0.4)"
          }}
          whileTap={{ 
            transform: "translateY(0px)",
            boxShadow: "0 2px 5px rgba(0,0,0,0.15)"
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          {t.startGame}
        </motion.button>
      </motion.div>
    </div>
  );
}



// -----------------------------------------------------------------------------
// GameSetupPage Component - Main Page Export
// Wraps the GameSetupContent component within a Suspense component that shows a fallback loading indicator.
// This ensures that the team setup page renders smoothly even if some content is loaded asynchronously.
// -----------------------------------------------------------------------------
export default function GameSetupPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        color: "black", 
        padding: "20px", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        height: "100vh"
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "4px solid rgba(0,0,0,0.1)",
            borderTopColor: "#2980b9",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "16px"
          }}></div>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <p style={{ fontWeight: "500" }}>Loading...</p>
        </div>
      </div>
    }>
      <GameSetupContent />
    </Suspense>
  );
}