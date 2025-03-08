"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Translations for the landing page
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
          maxWidth: "400px",
          margin: "0 20px",
          padding: "30px",
          background: "rgba(255, 255, 255, 0.95)",
          borderRadius: "12px",
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          color: "#000",
        }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Show both languages for the title/description, or just pick one */}
          <h2 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "16px" }}>
            {landingTranslations.en.welcome} / {landingTranslations.fr.welcome}
          </h2>
          <p style={{ fontSize: "1rem", marginBottom: "24px" }}>
            {landingTranslations.en.chooseLang}
            <br />
            {landingTranslations.fr.chooseLang}
          </p>

          {/* Buttons to choose English or French */}
          <div style={{ display: "flex", justifyContent: "center", gap: "16px" }}>
            <button
              onClick={() => handleChooseLang("en")}
              style={{
                padding: "12px 20px",
                backgroundColor: "#27ae60",
                border: "none",
                borderRadius: "9999px",
                color: "#fff",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {landingTranslations.en.english}
            </button>
            <button
              onClick={() => handleChooseLang("fr")}
              style={{
                padding: "12px 20px",
                backgroundColor: "#2980b9",
                border: "none",
                borderRadius: "9999px",
                color: "#fff",
                fontSize: "1rem",
                cursor: "pointer",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                borderRadius: "8px",
                padding: "24px",
                maxWidth: "300px",
                width: "90%",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                textAlign: "center",
              }}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "16px" }}>
                {t.confirmTitle}
              </h2>
              <p style={{ marginBottom: "24px", fontSize: "0.95rem" }}>
                {t.confirmMessage}
              </p>
              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <button
                  onClick={cancelLanguage}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#ccc",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {t.cancelButton}
                </button>
                <button
                  onClick={confirmLanguage}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#2980b9",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
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
