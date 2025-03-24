// -----------------------------------------------------------------------------
// File Header & Import Statements
// "use client" ensures that this file is executed on the client side.
// This file imports React, various hooks (useState, useEffect, Suspense) for state management,
// Next.js navigation hooks (useSearchParams, useRouter) for handling URL parameters and routing,
// and Framer Motion components (motion, AnimatePresence) to enable smooth animations.
// -----------------------------------------------------------------------------
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";



const landingTranslations = {
  en: {
    welcome: "Welcome to EarthDual",
    chooseLang: "Choose your preferred language to begin.",
    english: "English",
    french: "Français",
    confirmTitle: "Confirm Language",
    confirmMessage: "Are you sure you want to use English?",
    confirmButton: "Confirm",
    cancelButton: "Cancel",
  },
  fr: {
    welcome: "Bienvenue à EarthDual",
    chooseLang: "Choisissez votre langue préférée pour commencer.",
    english: "Anglais",
    french: "Français",
    confirmTitle: "Confirmer la langue",
    confirmMessage: "Voulez-vous vraiment utiliser le Français ?",
    confirmButton: "Confirmer",
    cancelButton: "Annuler",
  },
};


// -----------------------------------------------------------------------------
// HomePage Component - Landing Page for Language Selection
// This component renders a landing page where the user chooses a language.
// It displays a background image with a semi-transparent overlay and a centered card.
// The card shows a welcome message and language selection buttons.
// When a button is clicked, a confirmation modal appears; if confirmed,
// the user is navigated to the game setup page with the selected language.
// -----------------------------------------------------------------------------
export default function HomePage() {
  const router = useRouter();

  // Which language the user clicked on but hasn't confirmed yet
  const [pendingLang, setPendingLang] = useState<"en" | "fr" | null>(null);
  // Whether to show the confirm modal
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // If user picked FR, we show French text in the modal; otherwise, English
  const t = pendingLang === "fr" ? landingTranslations.fr : landingTranslations.en;

  // Called when user clicks "English" or "Français" button
  function handleChooseLang(lang: "en" | "fr") {
    setPendingLang(lang);
    setShowConfirm(true);
  }

  // Called when user confirms language in the modal
  function confirmLanguage() {
    if (!pendingLang) return;
    // Navigate to the tutorial page with ?lang=XX
    // Change `/tutorial` to `/game-setup` or another route if you prefer
    router.push(`/game-setup?lang=${pendingLang}`);
  }

  // Called when user cancels language choice in the modal
  function cancelLanguage() {
    setShowConfirm(false);
    setPendingLang(null);
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundImage: "url('/earthbg1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Semi-transparent overlay to darken the background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.35)",
        }}
      />

      {/* Landing Card */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "650px",
          margin: "0 20px",
          padding: "35px",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "16px",
          textAlign: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.2) inset",
          color: "#000",
          backdropFilter: "blur(10px)",
        }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h2 style={{ 
            fontSize: "2.5rem", 
            fontWeight: 700, 
            marginBottom: "20px",
            background: "linear-gradient(135deg, #27ae60, #2980b9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0px 1px 1px rgba(255,255,255,0.5)",
            letterSpacing: "0.5px"
          }}>
            {landingTranslations.en.welcome} / {landingTranslations.fr.welcome}
          </h2>

          <div style={{
            borderTop: "1px solid rgba(0,0,0,0.1)",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            padding: "12px 0",
            marginBottom: "28px"
          }}>
            <p style={{ 
              fontSize: "1.1rem", 
              lineHeight: "1.5",
              fontWeight: "400",
              color: "#333"
            }}>
              {landingTranslations.en.chooseLang}
            </p>
            <p style={{ 
              fontSize: "1.1rem", 
              lineHeight: "1.5",
              fontWeight: "400",
              color: "#333",
              fontStyle: "italic"
            }}>
              {landingTranslations.fr.chooseLang}
            </p>
          </div>

          {/* Buttons to choose English or French */}
          <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
            <button
              onClick={() => handleChooseLang("en")}
              style={{
                padding: "14px 24px",
                backgroundColor: "#27ae60",
                border: "none",
                borderRadius: "9999px",
                color: "#fff",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px rgba(39, 174, 96, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 10px rgba(39, 174, 96, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(39, 174, 96, 0.3)";
              }}
            >
              {landingTranslations.en.english}
            </button>
            <button
              onClick={() => handleChooseLang("fr")}
              style={{
                padding: "14px 24px",
                backgroundColor: "#2980b9",
                border: "none",
                borderRadius: "9999px",
                color: "#fff",
                fontSize: "1.1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 6px rgba(41, 128, 185, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 6px 10px rgba(41, 128, 185, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(41, 128, 185, 0.3)";
              }}
            >
              {landingTranslations.fr.french}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            key="confirmModal"
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 50,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              style={{
                background: "#fff",
                color: "#000",
                borderRadius: "12px",
                padding: "28px",
                maxWidth: "320px",
                width: "90%",
                boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                textAlign: "center",
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 style={{ 
                fontSize: "1.5rem", 
                fontWeight: "600", 
                marginBottom: "18px",
                color: pendingLang === "fr" ? "#2980b9" : "#27ae60"
              }}>
                {t.confirmTitle}
              </h2>
              <p style={{ 
                marginBottom: "28px", 
                fontSize: "1.05rem",
                lineHeight: "1.5"
              }}>
                {t.confirmMessage}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
                <button
                  onClick={cancelLanguage}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: "#f1f1f1",
                    color: "#555",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e0e0e0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#f1f1f1";
                  }}
                >
                  {t.cancelButton}
                </button>
                <button
                  onClick={confirmLanguage}
                  style={{
                    padding: "10px 18px",
                    backgroundColor: pendingLang === "fr" ? "#2980b9" : "#27ae60",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "1rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    boxShadow: `0 3px 6px ${pendingLang === "fr" ? "rgba(41, 128, 185, 0.3)" : "rgba(39, 174, 96, 0.3)"}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = `0 5px 8px ${pendingLang === "fr" ? "rgba(41, 128, 185, 0.4)" : "rgba(39, 174, 96, 0.4)"}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = `0 3px 6px ${pendingLang === "fr" ? "rgba(41, 128, 185, 0.3)" : "rgba(39, 174, 96, 0.3)"}`;
                  }}
                >
                  {t.confirmButton}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}