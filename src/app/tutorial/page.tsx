// -----------------------------------------------------------------------------
// File Header & Import Statements
// "use client" ensures that this file is executed on the client side.
// The import statements bring in React hooks (useState, useEffect, Suspense),
// Next.js navigation hooks (useRouter, useSearchParams), and Framer Motion components
// (motion, AnimatePresence) to enable UI rendering, routing, and smooth animations.
// -----------------------------------------------------------------------------
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";



// -----------------------------------------------------------------------------
// Tutorial Content Translations
// This object holds the localized text for the tutorial steps in both English and French.
// Each language contains an array of slide objects with a title, content text,
// an icon (emoji), and an illustration image path. These slides provide instructions
// on how to play the game.
// -----------------------------------------------------------------------------
const tutorialTranslations = {
  en: [
    {
      title: "How to Play",
      content: `A 90-second timer will start. During this time, discuss with your team and decide which card to play.\n\nYour goal is to choose the best action to help the Earth considering the scenario!`,
      icon: "⏳",
      illustration: "/timer-illustration.svg", // Placeholder path
    },
    {
      title: "Play a Card",
      content: `Each turn, your team will choose a card.\n\nCards will give you different choices—some are good for the planet, and some are less!\n\nThink carefully and pick the best one.`,
      icon: "🃏",
      illustration: "/cards-illustration.svg", // Placeholder path
    },
    {
      title: "Answer a Question",
      content: `After picking a card, your team must answer an environmental question.\n\nIf you get it right, you earn bonus points!`,
      icon: "❓",
      illustration: "/question-illustration.svg", // Placeholder path
    },
    {
      title: "Winning the Game",
      content: `The game ends after a set number of turns.\n\nThe team that made the best decisions for the Earth wins!\n\nEven if you don't win, you still learned something cool about saving the planet!`,
      icon: "🏆",
      illustration: "/trophy-illustration.svg", // Placeholder path
    },
  ],
  fr: [
    {
      title: "Comment Jouer",
      content: `Un minuteur de 90 secondes démarrera. Pendant ce temps, discutez en équipe et décidez quelle carte jouer.\n\nVotre objectif est de choisir la meilleure action pour aider la Terre considérant le scénario!`,
      icon: "⏳",
      illustration: "/timer-illustration.svg", // Placeholder path
    },
    {
      title: "Jouer une Carte",
      content: `À chaque tour, votre équipe choisira une carte.\n\nLes cartes offrent différentes options pour aider la planète de plusieur différentes façons!\n\nRéfléchissez bien et choisissez la meilleure.`,
      icon: "🃏",
      illustration: "/cards-illustration.svg", // Placeholder path
    },
    {
      title: "Répondez à une Question",
      content: `Après avoir choisi une carte, votre équipe devra répondre à une question environnementale.\n\nSi vous répondez correctement, vous gagnez des points bonus !`,
      icon: "❓",
      illustration: "/question-illustration.svg", // Placeholder path
    },
    {
      title: "Gagner le Jeu",
      content: `Le jeu se termine après un certain nombre de tours.\n\nL'équipe qui aura pris les meilleures décisions pour la Terre gagne !\n\nMême si vous ne gagnez pas, vous aurez appris quelque chose d'incroyable sur la protection de la planète !`,
      icon: "🏆",
      illustration: "/trophy-illustration.svg", // Placeholder path
    },
  ],
};



// -----------------------------------------------------------------------------
// Custom Illustrations for Tutorial Slides
// Contains embedded SVG illustrations for specific tutorial steps (timer, cards, question, trophy).
// These illustrations serve as visual enhancements to the textual instructions.
// -----------------------------------------------------------------------------
const illustrations = {
  timer: (
    <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="70" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
      <circle cx="90" cy="90" r="70" fill="none" stroke="#2ecc71" strokeWidth="8" strokeDasharray="440" strokeDashoffset="110" transform="rotate(-90 90 90)" />
      <circle cx="90" cy="90" r="60" fill="rgba(255,255,255,0.1)" />
      <text x="90" y="95" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">90s</text>
    </svg>
  ),
  cards: (
    <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="50" width="80" height="100" rx="8" fill="#3498db" transform="rotate(-10 35 50)" />
      <rect x="65" y="40" width="80" height="100" rx="8" fill="#2ecc71" />
      <text x="105" y="90" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">🌍</text>
    </svg>
  ),
  question: (
    <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="90" r="65" fill="#f39c12" />
      <text x="90" y="110" fontSize="90" fontWeight="bold" fill="white" textAnchor="middle">?</text>
    </svg>
  ),
  trophy: (
    <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
      <path d="M90,30 L60,30 L60,50 C60,85 40,90 40,90 L40,100 L70,100 C70,100 75,120 90,120 C105,120 110,100 110,100 L140,100 L140,90 C140,90 120,85 120,50 L120,30 L90,30 Z" fill="#f1c40f" />
      <rect x="75" y="115" width="30" height="35" fill="#f1c40f" />
      <rect x="65" y="150" width="50" height="10" rx="2" fill="#f1c40f" />
    </svg>
  ),
};



// -----------------------------------------------------------------------------
// TutorialContent Component - Main Tutorial Screen
// This component renders the tutorial (or walkthrough) for the game.
// It uses localized slide data from tutorialTranslations and displays one slide at a time,
// complete with a title, content text, an icon, and a custom illustration.
// It also shows animated background particles for visual effect, and includes navigation
// controls (Next, Previous) to move through the slides. On the final slide, clicking the button
// will redirect the user to the next page (/runthrough).
// -----------------------------------------------------------------------------
function TutorialContent() {

  // -----------------------------------------------------------------------------
// Language Detection & Particle Effects Setup
// - Determines the current language from the URL search parameters, defaulting to English.
// - Initializes state for the current slide and animation control.
// - Generates an array of random "particle" objects used to create animated background effects.
// -----------------------------------------------------------------------------
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get the language from the query parameter, default to English
  const lang = (searchParams.get("lang") as "en" | "fr") || "en";
  const slides = tutorialTranslations[lang];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number; }[]>([]);

  // Generate random particles for background
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 5,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 10,
      });
    }
    setParticles(newParticles);
  }, []);

  function goNext() {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // When all slides are done, redirect to the game page
      router.push("/runthrough?lang=" + lang);
    }
  }

  function goPrev() {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }
  
  const isLastSlide = currentSlide === slides.length - 1;
  const buttonText = isLastSlide 
    ? (lang === "fr" ? "Commencer le Jeu" : "Start Game") 
    : (lang === "fr" ? "Suivant" : "Next");

  const getIllustration = (index: number) => {
    switch(index) {
      case 0: return illustrations.timer;
      case 1: return illustrations.cards;
      case 2: return illustrations.question;
      case 3: return illustrations.trophy;
      default: return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "linear-gradient(135deg, rgba(42, 63, 84, 0.9), rgba(24, 34, 45, 0.95)), url('/tutbg-02.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: "absolute",
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            zIndex: 0,
          }}
          animate={{
            y: ["0%", "100%"],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{
            duration: particle.duration,
            ease: "linear",
            repeat: Infinity,
            delay: particle.delay,
          }}
        />
      ))}

      <div className="language-switcher" style={{ 
        position: "absolute", 
        top: "20px", 
        right: "20px",
        zIndex: 10,
      }}>
        <motion.button
          onClick={() => router.push(`/tutorial?lang=${lang === "en" ? "fr" : "en"}`)}
          style={{
            padding: "10px 16px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            borderRadius: "30px",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            cursor: "pointer",
            fontWeight: "bold",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          whileHover={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            scale: 1.05,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <span style={{ fontSize: "16px" }}>
            {lang === "en" ? "🇫🇷" : "🇬🇧"}
          </span>
          <span>{lang === "en" ? "Français" : "English"}</span>
        </motion.button>
      </div>
      
      <header style={{ 
        position: "absolute", 
        top: "20px", 
        left: "20px", 
        display: "flex", 
        alignItems: "center",
        zIndex: 10,
      }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            padding: "8px 16px",
            borderRadius: "30px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            backdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div style={{
                width: "36px", 
                height: "36px", 
                borderRadius: "50%", 
                backgroundColor: "#2ecc71",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 15px rgba(46, 204, 113, 0.5)",
                position: "relative",
              }}>
                <div style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  backgroundImage: "radial-gradient(circle, #27ae60, #2ecc71)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                }}>
                  🌍
                </div>
              </div>
            </motion.div>
            <h1 style={{ 
              fontSize: "1.5rem", 
              margin: 0, 
              fontWeight: "bold",
              textShadow: "0px 0px 10px rgba(0,0,0,0.7)",
              letterSpacing: "1px",
            }}>
              Earth Dual
            </h1>
          </div>
        </motion.div>
      </header>
      
      {/* Main Tutorial Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{
          maxWidth: "900px",
          width: "90%",
          margin: "0 auto",
          backgroundColor: "rgba(15, 23, 30, 0.7)",
          backdropFilter: "blur(10px)",
          borderRadius: "24px",
          boxShadow: "0 15px 35px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1) inset",
          overflow: "hidden",
          zIndex: 5,
          position: "relative",
        }}
      >
        {/* Animated Gradient Border */}
        <div style={{
          position: "absolute",
          inset: 0,
          padding: "2px",
          borderRadius: "24px",
          background: "linear-gradient(45deg, #2ecc71, transparent, #3498db, transparent, #2ecc71)",
          backgroundSize: "400% 400%",
          animation: "gradientBorder 8s ease infinite",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          zIndex: -1,
        }}>
          <style jsx>{`
            @keyframes gradientBorder {
              0% { background-position: 0% 50% }
              50% { background-position: 100% 50% }
              100% { background-position: 0% 50% }
            }
          `}</style>
        </div>

        <div style={{ padding: "40px" }}>
          {/* Progress indicator */}
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            marginBottom: "40px",
            gap: "12px"
          }}>
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  backgroundColor: index === currentSlide 
                    ? "#2ecc71" 
                    : index < currentSlide 
                      ? "rgba(46, 204, 113, 0.5)" 
                      : "rgba(255, 255, 255, 0.1)",
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                transition={{ 
                  duration: 0.3, 
                  delay: 0.1 * index,
                  type: "spring",
                  stiffness: 300,
                }}
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "background-color 0.3s",
                }}
              />
            ))}
          </div>
          
          <div style={{ display: "flex", flexDirection: "row", gap: "40px", alignItems: "center" }}>
            {/* Left side: Illustration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ 
                flex: "0 0 180px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`illustration-${currentSlide}`}
                  initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    filter: "drop-shadow(0px 5px 15px rgba(0,0,0,0.3))",
                  }}
                >
                  {getIllustration(currentSlide)}
                </motion.div>
              </AnimatePresence>
            </motion.div>
            
            {/* Right side: Content */}
            <div style={{ flex: 1 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={`content-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  style={{ 
                    minHeight: "300px", 
                    display: "flex", 
                    flexDirection: "column", 
                    justifyContent: "center",
                    alignItems: "flex-start",
                    textAlign: "left",
                  }}
                >
                  <div style={{
                    backgroundColor: "rgba(46, 204, 113, 0.2)",
                    borderRadius: "30px",
                    padding: "6px 16px",
                    marginBottom: "16px",
                    display: "inline-block",
                  }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {lang === "fr" ? "ÉTAPE" : "STEP"} {currentSlide + 1}/{slides.length}
                    </span>
                  </div>
                  
                  <h2 style={{ 
                    fontSize: "2.5rem", 
                    marginBottom: "24px", 
                    fontWeight: "800",
                    background: "linear-gradient(135deg, #2ecc71, #3498db)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textShadow: "0px 0px 15px rgba(46, 204, 113, 0.2)"
                  }}>
                    {slides[currentSlide].icon} {slides[currentSlide].title}
                  </h2>
                  
                  <p style={{ 
                    whiteSpace: "pre-line", 
                    fontSize: "1.1rem",
                    lineHeight: "1.7",
                    color: "rgba(255, 255, 255, 0.9)",
                    textShadow: "0px 0px 5px rgba(0,0,0,0.2)",
                  }}>
                    {slides[currentSlide].content}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation buttons */}
              <div style={{ 
                display: "flex", 
                justifyContent: "flex-start", 
                gap: "12px",
                marginTop: "30px"
              }}>
                {currentSlide > 0 && (
                  <motion.button
                    onClick={goPrev}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.25)" }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      padding: "12px 20px",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      color: "#fff",
                      borderRadius: "12px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      cursor: "pointer",
                      fontWeight: "600",
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontSize: "1rem",
                    }}
                  >
                    <span>←</span>
                    <span>{lang === "fr" ? "Précédent" : "Previous"}</span>
                  </motion.button>
                )}
                
                <motion.button
                  onClick={goNext}
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: isLastSlide ? "#27ae60" : "#2980b9" 
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: "12px 24px",
                    backgroundColor: isLastSlide ? "#2ecc71" : "#3498db",
                    color: "#fff",
                    borderRadius: "12px",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "600",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "1rem",
                  }}
                >
                  <span>{buttonText}</span>
                  <span>→</span>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


// -----------------------------------------------------------------------------
// TutorialPage Component - Suspense Wrapper & Main Export
// Wraps the TutorialContent component in a Suspense component that provides a fallback UI
// while the tutorial content loads. The fallback shows a centered loading animation and text.
// This component serves as the entry point for the tutorial page.
// -----------------------------------------------------------------------------
export default function TutorialPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1a1a1a",
        color: "#fff",
      }}>
        <div style={{
          position: "relative",
          width: "80px",
          height: "80px",
          marginBottom: "24px",
        }}>
          <div style={{
            position: "absolute",
            width: "80px",
            height: "80px",
            border: "4px solid rgba(255,255,255,0.1)",
            borderRadius: "50%",
            borderTop: "4px solid #2ecc71",
            animation: "spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite",
          }}></div>
          <div style={{
            position: "absolute",
            width: "60px",
            height: "60px",
            left: "10px",
            top: "10px",
            border: "4px solid transparent",
            borderRadius: "50%",
            borderRight: "4px solid #3498db",
            animation: "spin 1.8s cubic-bezier(0.5, 0, 0.5, 1) infinite",
          }}></div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{
          background: "linear-gradient(135deg, #2ecc71, #3498db)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}>
          Loading Earth Dual...
        </div>
      </div>
    }>
      <TutorialContent />
    </Suspense>
  );
}