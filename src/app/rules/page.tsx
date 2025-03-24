// -----------------------------------------------------------------------------
// File Header & Import Statements
// "use client" ensures this component is rendered on the client side.
// This file imports React, Suspense, Next.js navigation hooks (useSearchParams, useRouter),
// and the motion component from Framer Motion to enable smooth animations on the Rules page.
// -----------------------------------------------------------------------------

"use client";
import React from "react";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";


// -----------------------------------------------------------------------------
// RulesContent Component - Game Rules Page Content
// This component renders the game rules and instructions with support for both English and French.
// It reads the language from the URL search parameters and uses a local translations object
// to display all the text (titles, objectives, setup instructions, and winning conditions).
// The component uses Framer Motion to animate the background and content overlay,
// creating a visually engaging and immersive rules screen.
// A button at the bottom allows the user to acknowledge the rules and proceed to the tutorial page.
// -----------------------------------------------------------------------------
function RulesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const lang = (searchParams.get("lang") as "en" | "fr") || "en";



  // -----------------------------------------------------------------------------
// Local Translations Object for RulesContent
// Contains all the localized strings for the rules page, including the title, objectives,
// descriptions for team roles, setup instructions, winning conditions, and the button text.
// This enables dynamic language support (English and French) based on URL parameters.
// -----------------------------------------------------------------------------
  const translations = {
    en: {
      title: "Game Rules",
      objective: "Objective: Save or Destroy the Earth!",
      defenders: "Team Defenders: Your goal is to extend Earth's lifespan.",
      destroyers: "Team Destroyers: Your goal is to reduce Earth's lifespan.",
      setup: "Each round, players choose cards affecting Earth's future.",
      winning: "Winning Conditions",
      win_defenders: "Defenders win if Earth reaches the year 3000!",
      win_destroyers: "Destroyers win if Earth's lifespan hits 0!",
      understand: "I Understand",
    },
    fr: {
      title: "Règles du Jeu",
      objective: "Objectif : Sauver ou détruire la Terre !",
      defenders: "Équipe Sauveurs : Votre but est de prolonger la vie de la Terre.",
      destroyers: "Équipe Destructeurs : Votre but est de réduire la vie de la Terre.",
      setup: "Chaque manche, les joueurs choisissent des cartes influençant l'avenir de la Terre.",
      winning: "Conditions de Victoire",
      win_defenders: "Les Sauveurs gagnent si la Terre atteint l'an 3000 !",
      win_destroyers: "Les Destructeurs gagnent si l'espérance de vie de la Terre atteint 0 !",
      understand: "Je Comprends",
    },
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white relative overflow-hidden">
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/earth-split-bg2.jpg')` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="z-10 bg-black bg-opacity-50 p-10 rounded-lg shadow-xl text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-bold mb-6">{translations[lang].title}</h1>
        <h2 className="text-2xl font-bold mt-4">{translations[lang].objective}</h2>
        <p className="mt-2">{translations[lang].defenders}</p>
        <p className="mt-2">{translations[lang].destroyers}</p>
        <h2 className="text-2xl font-bold mt-4">{translations[lang].setup}</h2>
        <h2 className="text-2xl font-bold mt-4">{translations[lang].winning}</h2>
        <p className="mt-2">{translations[lang].win_defenders}</p>
        <p className="mt-2">{translations[lang].win_destroyers}</p>
        <button
          onClick={() => router.push(`/tutorial?lang=${lang}`)}
          className="mt-6 px-6 py-3 bg-green-600 rounded-lg text-white text-lg hover:bg-green-700 transition"
        >
          {translations[lang].understand}
        </button>
      </motion.div>
    </div>
  );
}

export default function RulesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RulesContent />
    </Suspense>
  );
}
