"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Suspense } from "react";

// -----------------------------------------------------------------------------
// aboutContent Object - Define the textual content for the About page.
// This object stores all the game-related text (title, subtitle, description) in both English and French.
// It allows the page to display content in either language based on the URL parameters.
// -----------------------------------------------------------------------------

const aboutContent = {
  en: {
    title: "About the Game: Save the Earth",
    subtitle: "Fun, Educational, and Planet-Saving!",
    description: `Save the Earth is a fun and educational game where two teams work together to help the planet! Each team will make decisions on how to protect the Earth from pollution, save animals, and use clean energy.

How to Play
Two Teams: Both teams are trying to help the Earth. The team that makes the best decisions depending on the scenario wins that round!
Make Choices: Each round, you'll pick a card with an action like planting trees, recycling, or using clean energy. The team with the best action for the planet wins the round.
Win the Game: After several rounds, the team with the most wins is the overall winner of the game!
Learn & Play: Have fun while learning how we can protect our world!`
  },
  fr: {
    title: "À propos du jeu : Sauver la Terre",
    subtitle: "Amusant, Éducatif et Sauveur de Planète!",
    description: `Sauver la Terre est un jeu amusant et éducatif où deux équipes travaillent ensemble pour aider la planète! Chaque équipe prendra des décisions pour protéger la Terre de la pollution, sauver les animaux et utiliser de l'énergie propre.

Comment Jouer
Deux équipes : Les deux équipes essaient d'aider la Terre. L'équipe qui prend la meilleure décision pour le scenario monter gagne ce tour!
Faites des choix : À chaque tour, vous choisirez une carte avec une action par example planter des arbres, recycler ou utiliser de l'énergie propre. L'équipe ayant la meilleure action pour la planète gagne le tour.
Gagner le jeu : Après plusieurs tours, l'équipe qui a gagné le plus de tours est la gagnante du jeu!
Apprendre et jouer : Amusez-vous tout en apprenant comment protéger notre monde!`
  }
};

// -----------------------------------------------------------------------------
// EarthIcon Component - SVG Icon representing the Earth.
// This component returns an SVG image of the Earth which is used as a visual and animated element on the page.
// It helps reinforce the environmental theme of the game.
// -----------------------------------------------------------------------------
const EarthIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// -----------------------------------------------------------------------------
// RecycleIcon Component - SVG Icon representing recycling.
// This component returns an SVG image symbolizing recycling, providing a visual cue for environmental actions.
// It is used as part of the animated icons on the page.
// -----------------------------------------------------------------------------

const RecycleIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 19L12 14L17 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 14V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8.5 9L3.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.5 4L8.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3.5 4V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15.5 9L20.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.5 4L15.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.5 4V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// -----------------------------------------------------------------------------
// TreeIcon Component - SVG Icon representing a tree.
// This component returns an SVG image of a tree, symbolizing nature and conservation.
// It contributes to the page’s theme by representing environmental preservation.
// -----------------------------------------------------------------------------

const TreeIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 13C8.13401 13 5 9.86599 5 6C5 2.13401 8.13401 -1 12 -1C15.866 -1 19 2.13401 19 6C19 9.86599 15.866 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// -----------------------------------------------------------------------------
// AboutContent Component - Main Content for the About Page.
// This function component handles the rendering of the About page content, including:
// • Setting the language based on URL parameters (English or French).
// • Splitting and displaying the game’s description and instructions.
// • Managing button hover states and animations.
// • Rendering animated background elements and interactive navigation.
// -----------------------------------------------------------------------------
function AboutContent() {

 // -----------------------------------------------------------------------------
// Hook Initialization and Language Setup
// Here, Next.js and React hooks (useRouter, useSearchParams, useState) are initialized.
// The code retrieves the "lang" parameter from the URL to determine the content language,
// and it sets up state for tracking hover effects on navigation buttons.
// -----------------------------------------------------------------------------

  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as "en" | "fr") || "en";
  const content = aboutContent[lang];
  const [hoverButton, setHoverButton] = useState<string | null>(null);

  const backButtonText = lang === "fr" ? "Retour à l'accueil" : "Back to Home";
  const toggleButtonText = lang === "fr" ? "Passer en anglais" : "Switch to French";

// -----------------------------------------------------------------------------
// Content Text Processing
// This section splits the game description into multiple parts:
// • 'intro': The introductory paragraph.
// • 'howToPlay': The section with game instructions, which is further split into individual points.
// • 'restOfParagraphs': Any additional text beyond the main instructions.
// This helps in rendering each part separately in the UI.
// -----------------------------------------------------------------------------
  const [intro, howToPlay, ...restOfParagraphs] = content.description.split("\n\n");
  
  // Further split how to play section into points
  const howToPlayPoints = howToPlay.split("\n").slice(1); // Skip the "How to Play" title


// -----------------------------------------------------------------------------
// Language Toggle Function
// This function toggles the page language between English and French.
// When called, it updates the URL parameter to switch languages, allowing dynamic content change.
// -----------------------------------------------------------------------------
  const toggleLanguage = () => {
    const newLang = lang === "en" ? "fr" : "en";
    router.push(`/about?lang=${newLang}`);
  };

  // -----------------------------------------------------------------------------
// Button Animation Variants
// This object defines the animation properties for buttons using Framer Motion.
// It sets the initial styles and hover effects (scale, background color, text color, and shadow),
// which are applied to the navigation buttons for a smooth interactive experience.
// -----------------------------------------------------------------------------
  const buttonVariants = {
    initial: { 
      scale: 1,
      backgroundColor: "#ffffff", 
      color: "#3B82F6" 
    },
    hover: { 
      scale: 1.05,
      backgroundColor: "#EFF6FF", 
      color: "#1D4ED8",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    }
  };

  // -----------------------------------------------------------------------------
// Card Animation Variants
// This object configures the animation for content cards using Framer Motion.
// It creates a fade-in and upward movement effect with a delay that staggers each card's appearance,
// providing a smooth and engaging transition as the page content loads.
// -----------------------------------------------------------------------------
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: [0.17, 0.67, 0.83, 0.67]
      }
    })
  };

  // -----------------------------------------------------------------------------
// Floating Icon Animation Variants
// This object defines the animation for the floating SVG icons on the page.
// It creates a continuous up-and-down movement effect to add a dynamic visual element,
// reinforcing the environmental theme with a playful, animated touch.
// -----------------------------------------------------------------------------
  const floatingIconVariants: Variants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  // -----------------------------------------------------------------------------
// Page Layout and Animated Background Elements
// This section sets up the main container for the About page.
// It applies a full-screen background gradient and includes animated elements that float around,
// establishing an engaging and immersive visual environment for the content.
// -----------------------------------------------------------------------------
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-green-400 text-white font-sans overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-20 bg-white rounded-full"
            style={{
              width: Math.random() * 40 + 10,
              height: Math.random() * 40 + 10,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 flex flex-col min-h-screen max-w-5xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-white text-blue-700 font-bold rounded-full shadow-md transition-all duration-300"
            onMouseEnter={() => setHoverButton('home')}
            onMouseLeave={() => setHoverButton(null)}
          >
            {backButtonText}
            {hoverButton === 'home' && (
              <motion.span 
                className="ml-2"
                initial={{ x: -5, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                →
              </motion.span>
            )}
          </motion.button>
          
          <motion.button
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            onClick={toggleLanguage}
            className="px-6 py-3 bg-white text-blue-700 font-bold rounded-full shadow-md transition-all duration-300"
          >
            {toggleButtonText}
          </motion.button>
        </div>

        {/* Floating icons */}
        <div className="absolute top-20 right-10 text-white opacity-30">
          <motion.div
            variants={floatingIconVariants}
            animate="animate"
          >
            <EarthIcon />
          </motion.div>
        </div>
        
        <div className="absolute bottom-20 left-10 text-white opacity-30">
          <motion.div
            variants={floatingIconVariants}
            animate="animate"
            transition={{ delay: 1 }}
          >
            <TreeIcon />
          </motion.div>
        </div>
        
        <div className="absolute top-40 left-20 text-white opacity-30">
          <motion.div
            variants={floatingIconVariants}
            animate="animate"
            transition={{ delay: 2 }}
          >
            <RecycleIcon />
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 drop-shadow-lg">
            {content.title}
          </h1>
          <h2 className="text-2xl sm:text-3xl font-light text-blue-100">
            {content.subtitle}
          </h2>
        </motion.div>

        {/* Game Description */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="mb-10 mx-auto max-w-3xl bg-white bg-opacity-10 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white border-opacity-20"
        >
          <p className="text-xl leading-relaxed text-gray-800">
            {intro}
          </p>
        </motion.div>

        {/* How to Play Cards */}
        <motion.h3
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="text-3xl font-bold text-center mb-6"
        >
          {lang === "fr" ? "Comment Jouer" : "How to Play"}
        </motion.h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {howToPlayPoints.map((point, idx) => {
            const [title, description] = point.split(": ");
            return (
              <motion.div
                key={idx}
                custom={idx + 2}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-white bg-opacity-90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white border-opacity-20 hover:bg-opacity-100 transition-all duration-300"
              >
                <h4 className="text-xl font-bold mb-3 text-blue-800">{title}</h4>
                <p className="text-lg text-gray-800">{description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Final note */}
        {restOfParagraphs.length > 0 && (
          <motion.div
            custom={howToPlayPoints.length + 2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="mt-8 mx-auto max-w-3xl text-center"
          >
            <p className="text-xl font-bold text-blue-800">
              {restOfParagraphs[0]}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// AboutPage Component - Entry Point for the About Page
// This component wraps the AboutContent component inside a Suspense component.
// It provides a fallback UI (a rotating loader and a loading message) while the main content loads,
// ensuring a smooth user experience even during data fetching or lazy loading.
// -----------------------------------------------------------------------------
export default function AboutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-600 text-white p-8 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
        />
        <span className="ml-4 text-xl">Loading...</span>
      </div>
    }>
      <AboutContent />
    </Suspense>
  );
}