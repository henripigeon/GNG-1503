// -----------------------------------------------------------------------------
// File Header & Import Statements
// "use client" ensures that this file is executed on the client side.
// The import statements bring in necessary React hooks (useState, useEffect, Suspense),
// Next.js navigation tools (useRouter, useSearchParams), and Framer Motion components
// (motion, AnimatePresence) to support UI rendering, routing, and smooth animations.
// -----------------------------------------------------------------------------
"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";



// -----------------------------------------------------------------------------
// Walkthrough Steps Data (Instructions)
// This array defines each step of the game walkthrough/tutorial.
// Each step includes localized titles and descriptions (for both English and French)
// as well as an optional image source to visually represent the step.
// These instructions guide the user through the game features before playing.
// -----------------------------------------------------------------------------
const walkthroughSteps = [
  {
    title: { en: "Game Dashboard", fr: "Tableau de bord du jeu" },
    description: {
      en: "Here you can track the round number, overall score, and remaining time. You can skip the timer when you're ready or end the game when needed.",
      fr: "Ici, vous pouvez suivre le numéro de manche, le score global et le temps restant. Vous pouvez passer le minuteur lorsque vous êtes prêt ou terminer la partie si nécessaire.",
    },
    imageSrc: "/IMAGE2.png",
  },
  {
    title: { en: "Language Options", fr: "Options de langue" },
    description: {
      en: "Switch between English and French at any time during the game. This helps international teams understand card effects and game instructions.",
      fr: "Passez de l'anglais au français à tout moment pendant le jeu. Cela aide les équipes internationales à comprendre les effets des cartes et les instructions du jeu.",
    },
    imageSrc: "/IMAGE3.png",
  },
  {
    title: { en: "Environmental Challenge", fr: "Défi environnemental" },
    description: {
      en: "Each round presents a unique environmental scenario. Read it carefully before selecting your card. Use the hint if you need guidance.",
      fr: "Chaque manche présente un scénario environnemental unique. Lisez-le attentivement avant de sélectionner votre carte. Utilisez l'indice si vous avez besoin d'aide.",
    },
    imageSrc: "/IMAGE4.png",
  },
  {
    title: { en: "Playing Your Cards", fr: "Jouer vos cartes" },
    description: {
      en: "Select the best card from your hand to address the environmental challenge. Enter your card ID in the designated field to play it.",
      fr: "Sélectionnez la meilleure carte de votre main pour répondre au défi environnemental. Entrez l'ID de votre carte dans le champ désigné pour la jouer.",
    },
    imageSrc: "/IMAGE5.png",
  },
  {
    title: { en: "Knowledge Check", fr: "Vérification des connaissances" },
    description: {
      en: "After playing your card, answer a bonus question related to your card's theme to earn an additional point. This tests your environmental knowledge!",
      fr: "Après avoir joué votre carte, répondez à une question bonus liée au thème de votre carte pour gagner un point supplémentaire. Cela teste vos connaissances environnementales !",
    },
    imageSrc: "/IMAGE6.png",
  },
  {
    title: { en: "Ready to Play!", fr: "Prêt à jouer !" },
    description: {
      en: "You're now ready to play Earth Dual! Remember, the goal is to find the most effective solutions to environmental challenges. Good luck!",
      fr: "Vous êtes maintenant prêt à jouer à Earth Dual ! N'oubliez pas que l'objectif est de trouver les solutions les plus efficaces aux défis environnementaux. Bonne chance !",
    },
  },
];



// -----------------------------------------------------------------------------
// Simulation Data
// This section contains fake data used for demonstration purposes.
// - fakeScenario: A sample environmental scenario with hints and descriptions.
// - fakeQuestionTeam1 & fakeQuestionTeam2: Example questions for two teams.
// This data might be used during testing or as placeholders for real game data.
// -----------------------------------------------------------------------------
const fakeScenario = {
  id: 999,
  shortHintFr: "Indice : Les énergies renouvelables pourraient être utiles ici.",
  shortHintEn: "Hint: Renewable energy solutions might be useful here.",
  descFr: "Une tempête a endommagé le réseau électrique local, laissant la communauté sans électricité. Quelle solution proposez-vous pour rétablir l'énergie de manière durable ?",
  descEn: "A storm has damaged the local power grid, leaving the community without electricity. What solution do you propose to restore power sustainably?",
};

const fakeQuestionTeam1 = {
  questionEn: "What is the main advantage of solar panels in emergency situations?",
  optionsEn: ["Quick deployment", "Lower cost", "Zero emissions"],
  correctEn: "a",
  questionFr: "Quel est le principal avantage des panneaux solaires dans les situations d'urgence ?",
  optionsFr: ["Déploiement rapide", "Coût inférieur", "Zéro émission"],
  correctFr: "a",
};

const fakeQuestionTeam2 = {
  questionEn: "Why are microgrids beneficial for community resilience?",
  optionsEn: ["Independent operation", "Cheaper installation", "Simpler technology"],
  correctEn: "a",
  questionFr: "Pourquoi les micro-réseaux sont-ils bénéfiques pour la résilience communautaire ?",
  optionsFr: ["Fonctionnement indépendant", "Installation moins coûteuse", "Technologie plus simple"],
  correctFr: "a",
};



// -----------------------------------------------------------------------------
// Styles
// Defines inline style objects for various UI elements throughout the walkthrough.
// These styles include settings for the walkthrough container, buttons, progress indicators,
// content cards, images, and loading animations, ensuring a consistent and appealing design.
// -----------------------------------------------------------------------------
const styles = {
  walkthrough: {
    minHeight: "100vh",
    backgroundImage: "url('/bgsimple.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: "white",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "'Inter', sans-serif",
  },
  container: {
    maxWidth: "800px",
    width: "100%",
    position: "relative",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "2rem",
    textShadow: "0 2px 4px rgba(0,0,0,0.5)",
  },
  langToggle: {
    position: "absolute",
    top: "108px", // Position below the header
    right: "1.5rem", 
    display: "flex",
    gap: "0.5rem",
    zIndex: "10",
  },
  langBtn: (isActive: boolean) => ({
    padding: "0.25rem 0.75rem",
    borderRadius: "0.25rem",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    backgroundColor: isActive ? "#10b981" : "#374151",
    color: "white",
    fontSize: "0.875rem",
  }),
  progressIndicator: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginBottom: "2rem",
  },
  progressDot: (isActive: boolean, isCompleted: boolean) => ({
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: isActive 
      ? "#10b981" 
      : isCompleted 
        ? "rgba(16,185,129,0.6)" 
        : "rgba(255,255,255,0.3)",
    cursor: "pointer",
    transition: "all 0.3s",
    transform: isActive ? "scale(1.2)" : "scale(1)",
  }),
  contentCard: {
    backgroundColor: "rgba(31,41,55,0.85)",
    borderRadius: "1rem",
    padding: "2rem",
    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    position: "relative",
    overflow: "hidden",
  },
  stepCounter: {
    fontSize: "0.9rem",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "1rem",
    textAlign: "center",
  },
  stepImage: {
    width: "100%",
    maxWidth: "400px",
    borderRadius: "0.5rem",
    margin: "0 auto 1.5rem",
    display: "block",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  stepTitle: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    textAlign: "center",
    color: "#10b981",
  },
  stepDescription: {
    fontSize: "1.1rem",
    lineHeight: "1.6",
    marginBottom: "2rem",
    textAlign: "center",
  },
  navigationButtons: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "2rem",
  },
  navBtn: {
    padding: "0.75rem 1.5rem",
    borderRadius: "0.5rem",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s",
    fontSize: "1rem",
  },
  backBtn: (isDisabled: boolean) => ({
    backgroundColor: isDisabled ? "#6b7280" : "#4b5563",
    color: "white",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? "0.7" : "1",
  }),
  nextBtn: {
    backgroundColor: "#2563eb",
    color: "white",
  },
  startGameBtn: {
    backgroundColor: "#10b981",
    color: "white",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    color: "white",
    backgroundColor: "rgba(17, 24, 39, 0.9)",
  },
  loadingSpinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255, 255, 255, 0.3)",
    borderRadius: "50%",
    borderTopColor: "#10b981",
    animation: "spin 1s linear infinite",
    marginBottom: "1rem",
  },
};



// -----------------------------------------------------------------------------
// Main RunThrough Component - RunThroughContent
// This component handles the interactive walkthrough (tutorial) for the game.
// It manages language detection, the current walkthrough step, and navigation between steps.
// It renders a progress indicator, a content card for the current step (with title, image, and description),
// and navigation buttons (Back, Next, or Start Game).
// -----------------------------------------------------------------------------
function RunThroughContent() {
  const router = useRouter();
  const searchParams = useSearchParams();



 // -----------------------------------------------------------------------------
// Language State & Detection
// Initializes the language state (default "en") and uses URL search parameters (or localStorage)
// to determine the current language. This ensures that all text displayed is localized.
// -----------------------------------------------------------------------------
  const [lang, setLang] = useState<"en" | "fr">("en");



  // -----------------------------------------------------------------------------
// Walkthrough Step State & Validation
// Manages the current step (index) of the walkthrough using state.
// A useEffect ensures that the step value does not exceed the total number of steps.
// -----------------------------------------------------------------------------
  useEffect(() => {
    const urlLang = searchParams.get("lang");
    if (urlLang === "en" || urlLang === "fr") {
      setLang(urlLang);
      localStorage.setItem("selectedLang", urlLang);
    } else {
      const storedLang = localStorage.getItem("selectedLang");
      if (storedLang === "en" || storedLang === "fr") {
        setLang(storedLang);
      }
    }
  }, [searchParams]);

  // Walkthrough state
  const [step, setStep] = useState(0);
  const totalSteps = walkthroughSteps.length;

  // Make sure we have a valid step
  useEffect(() => {
    if (step >= totalSteps) {
      setStep(totalSteps - 1);
    }
  }, [step, totalSteps]);
  
  // This effect helps with language detection from URL
  useEffect(() => {
    const urlLang = searchParams.get("lang");
    if (urlLang === "en" || urlLang === "fr") {
      setLang(urlLang);
      localStorage.setItem("selectedLang", urlLang);
    } else {
      const storedLang = localStorage.getItem("selectedLang");
      if (storedLang === "en" || storedLang === "fr") {
        setLang(storedLang);
      }
    }
  }, [searchParams]);



 // -----------------------------------------------------------------------------
// Navigation Handlers
// Defines functions to navigate between walkthrough steps:
// - handleNext: Advances to the next step.
// - handleBack: Goes back to the previous step.
// - handleStartGame: Navigates to the game page when the walkthrough is complete.
// -----------------------------------------------------------------------------
  const handleNext = () => {
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleStartGame = () => {
    router.push("/game");
  };

  return (
    <div style={styles.walkthrough as React.CSSProperties}>
      {/* Background and Container */}
      <motion.div 
        style={styles.container as React.CSSProperties}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 style={styles.title as React.CSSProperties}>
          {lang === "fr" ? "Parcours de formation" : "Earth Dual Tutorial"}
        </h1>

        {/* Progress Indicator */}
        <div style={styles.progressIndicator}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div 
              key={index} 
              style={styles.progressDot(index === step, index < step)}
              onClick={() => setStep(index)}
            />
          ))}
        </div>

        {/* Walkthrough Content Card */}
        <motion.div 
          style={styles.contentCard as React.CSSProperties}
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <div style={styles.stepCounter as React.CSSProperties}>
            {lang === "fr" ? `Étape ${step + 1} sur ${totalSteps}` : `Step ${step + 1} of ${totalSteps}`}
          </div>

          {/* Safely render image with error handling */}
          {walkthroughSteps[step] && walkthroughSteps[step].imageSrc && (
            <img
              src={walkthroughSteps[step].imageSrc}
              alt={walkthroughSteps[step].title[lang as "en" | "fr"] || `Step ${step + 1}`}
              style={styles.stepImage}
            />
          )}

          <h2 style={styles.stepTitle as React.CSSProperties}>
            {walkthroughSteps[step] && walkthroughSteps[step].title ? 
              walkthroughSteps[step].title[lang] : ''}
          </h2>
          <p style={styles.stepDescription as React.CSSProperties}>
            {walkthroughSteps[step] && walkthroughSteps[step].description ? 
              walkthroughSteps[step].description[lang] : ''}
          </p>

          {/* Navigation Buttons */}
          <div style={styles.navigationButtons}>
            <button
              onClick={handleBack}
              disabled={step === 0}
              style={{...styles.navBtn, ...styles.backBtn(step === 0)}}
            >
              {lang === "fr" ? "Précédent" : "Back"}
            </button>
            
            {step < totalSteps - 1 ? (
              <button onClick={handleNext} style={{...styles.navBtn, ...styles.nextBtn}}>
                {lang === "fr" ? "Suivant" : "Next"}
              </button>
            ) : (
              <button onClick={handleStartGame} style={{...styles.navBtn, ...styles.startGameBtn}}>
                {lang === "fr" ? "Commencer le Jeu" : "Start Game"}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}


// -----------------------------------------------------------------------------
// RunThrough Component - Main Page Export
// Wraps the RunThroughContent component within a Suspense component that displays a loading
// indicator until the content is ready. This ensures a smooth user experience while the tutorial
// data and assets load.
// -----------------------------------------------------------------------------
export default function RunThrough() {
  return (
    <Suspense fallback={
      <div style={styles.loadingContainer as React.CSSProperties}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading tutorial...</p>
      </div>
    }>
      <RunThroughContent />
    </Suspense>
  );
}