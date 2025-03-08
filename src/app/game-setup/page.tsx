"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";

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
  },
  fr: {
    title: "Configuration des Équipes",
    sectionLabel: "Année",
    team1Name: "Nom de l'Équipe 1",
    team2Name: "Nom de l'Équipe 2",
    team1Count: "Nombre de membres (Équipe 1)",
    team2Count: "Nombre de membres (Équipe 2)",
    teamMember: "Nom du membre",
    startGame: "Commencer le Jeu",
  },
};

function GameSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as "en" | "fr") || "en";
  const t = translations[lang];

  const [section, setSection] = useState("");
  const [team1Name, setTeam1Name] = useState("");
  const [team2Name, setTeam2Name] = useState("");
  const [team1Count, setTeam1Count] = useState<number>(0);
  const [team2Count, setTeam2Count] = useState<number>(0);
  const [team1Members, setTeam1Members] = useState<string[]>([]);
  const [team2Members, setTeam2Members] = useState<string[]>([]);

  useEffect(() => {
    setTeam1Members(Array(team1Count).fill(""));
  }, [team1Count]);

  useEffect(() => {
    setTeam2Members(Array(team2Count).fill(""));
  }, [team2Count]);

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

  const handleStartGame = () => {
    // Ensuring that the grade (section) and both team names are filled before proceeding.
    if (!section || !team1Name || !team2Name) {
      alert("Please fill out the grade and both team names!");
      return;
    }
    router.push(
      `/tutorial?lang=${lang}&section=${encodeURIComponent(
        section
      )}&team1=${encodeURIComponent(team1Name)}&team2=${encodeURIComponent(
        team2Name
      )}&members1=${encodeURIComponent(team1Members.join(","))}&members2=${encodeURIComponent(
        team2Members.join(",")
      )}`
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/earth-split-bg2.jpg'), linear-gradient(red, red)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <motion.div
        style={{
          backgroundColor: "rgba(255,255,255,0.9)",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "800px",
          width: "100%",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "16px", textAlign: "center" }}>
          {t.title}
        </h1>

        {/* Grade/Section */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
            {t.sectionLabel}
          </label>
          <select
            value={section}
            onChange={(e) => setSection(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">Select grade</option>
            <option value="4th">4th</option>
            <option value="5th">5th</option>
            <option value="6th">6th</option>
            <option value="7th">7th</option>
          </select>
        </div>

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {/* Team 1 */}
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                {t.team1Name}
              </label>
              <input
                type="text"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                placeholder={t.team1Name}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                {t.team1Count}
              </label>
              <input
                type="number"
                min={0}
                value={team1Count}
                onChange={(e) => setTeam1Count(Number(e.target.value))}
                placeholder="0"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            {team1Members.map((member, idx) => (
              <div key={idx} style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                  {t.teamMember} {idx + 1}
                </label>
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateTeam1Member(idx, e.target.value)}
                  placeholder={`${t.teamMember} ${idx + 1}`}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Team 2 */}
          <div style={{ flex: "1 1 300px" }}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                {t.team2Name}
              </label>
              <input
                type="text"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                placeholder={t.team2Name}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                {t.team2Count}
              </label>
              <input
                type="number"
                min={0}
                value={team2Count}
                onChange={(e) => setTeam2Count(Number(e.target.value))}
                placeholder="0"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
            {team2Members.map((member, idx) => (
              <div key={idx} style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>
                  {t.teamMember} {idx + 1}
                </label>
                <input
                  type="text"
                  value={member}
                  onChange={(e) => updateTeam2Member(idx, e.target.value)}
                  placeholder={`${t.teamMember} ${idx + 1}`}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleStartGame}
          style={{
            width: "100%",
            marginTop: "24px",
            padding: "12px",
            backgroundColor: "#2980b9",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3498db")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2980b9")}
        >
          {t.startGame}
        </button>
      </motion.div>
    </div>
  );
}

export default function GameSetupPage() {
  return (
    <Suspense fallback={<div style={{ color: "black", padding: "20px" }}>Loading...</div>}>
      <GameSetupContent />
    </Suspense>
  );
}
