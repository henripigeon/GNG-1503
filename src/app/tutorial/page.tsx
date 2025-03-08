"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Tutorial content translations
const tutorialTranslations = {
  en: [
    {
      title: "🎮 How to Play",
      content: `⏳ Step 1: The Countdown Begins!\n\nA 90-second timer will start. During this time, discuss with your team and decide which card to play.\nYour goal is to choose the best action to help the Earth!`,
    },
    {
      title: "🃏 Step 2: Play a Card",
      content: `Each turn, your team will choose a card.\nCards will give you different choices—some are good for the planet, and some are not!\nThink carefully and pick the best one.`,
    },
    {
      title: "❓ Step 3: Answer a Question",
      content: `After picking a card, your team must answer an environmental question.\nIf you get it right, you earn bonus points! 🎉`,
    },
    {
      title: "🌍 Step 4: Watch the Earth Change!",
      content: `The game will show how your choice affects the planet.\nKeep an eye on the progress bars—they show things like pollution levels, biodiversity, and Earth’s lifespan.`,
    },
    {
      title: "🔁 Step 5: Next Team’s Turn",
      content: `Now, the other team plays!\nBoth teams keep playing and learning until the game ends.`,
    },
    {
      title: "🏆 Winning the Game",
      content: `The game ends after a set number of turns.\nThe team that made the best decisions for the Earth wins! 🎉\nEven if you don’t win, you still learned something cool about saving the planet! 🌎💚`,
    },
  ],
  fr: [
    {
      title: "🎮 Comment Jouer",
      content: `⏳ Étape 1 : Le compte à rebours commence !\n\nUn minuteur de 90 secondes démarrera. Pendant ce temps, discutez en équipe et décidez quelle carte jouer.\nVotre objectif est de choisir la meilleure action pour aider la Terre !`,
    },
    {
      title: "🃏 Étape 2 : Jouer une Carte",
      content: `À chaque tour, votre équipe choisira une carte.\nLes cartes offrent différentes options – certaines sont bénéfiques pour la planète, d'autres non !\nRéfléchissez bien et choisissez la meilleure.`,
    },
    {
      title: "❓ Étape 3 : Répondez à une Question",
      content: `Après avoir choisi une carte, votre équipe devra répondre à une question environnementale.\nSi vous répondez correctement, vous gagnez des points bonus ! 🎉`,
    },
    {
      title: "🌍 Étape 4 : Regardez la Terre Changer !",
      content: `Le jeu montrera comment votre choix affecte la planète.\nGardez un œil sur les barres de progression – elles indiquent des informations telles que les niveaux de pollution, la biodiversité et la durée de vie de la Terre.`,
    },
    {
      title: "🔁 Étape 5 : Au tour de l'autre équipe",
      content: `Maintenant, c'est au tour de l'autre équipe !\nLes deux équipes continuent à jouer et à apprendre jusqu'à la fin du jeu.`,
    },
    {
      title: "🏆 Gagner le Jeu",
      content: `Le jeu se termine après un certain nombre de tours.\nL'équipe qui aura pris les meilleures décisions pour la Terre gagne ! 🎉\nMême si vous ne gagnez pas, vous aurez appris quelque chose d'incroyable sur la protection de la planète ! 🌎💚`,
    },
  ],
};

function TutorialContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Get the language from the query parameter, default to English
  const lang = (searchParams.get("lang") as "en" | "fr") || "en";
  const slides = tutorialTranslations[lang];

  const [currentSlide, setCurrentSlide] = useState(0);

  function goNext() {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // When all slides are done, redirect to the game page
      router.push("/game");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('/tutbg-02.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          width: "90%",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "rgba(0,0,0,0.6)",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
          >
            <h2 style={{ fontSize: "1.75rem", marginBottom: "16px", fontWeight: "bold" }}>
              {slides[currentSlide].title}
            </h2>
            <p style={{ whiteSpace: "pre-line", marginBottom: "24px" }}>
              {slides[currentSlide].content}
            </p>
          </motion.div>
        </AnimatePresence>
        <button
          onClick={goNext}
          style={{
            padding: "10px 16px",
            backgroundColor: "#2980b9",
            color: "#fff",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          {lang === "fr" ? "Suivant" : "Next"}
        </button>
      </div>
    </div>
  );
}

export default function TutorialPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TutorialContent />
    </Suspense>
  );
}
