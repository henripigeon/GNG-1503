"use client";
import React, { useState, useEffect } from "react";



// =============================================================================
// Translations & Slide Data
// This section holds all the text strings and slide content for the game in both
// English and French. The translations object contains localized text for setup,
// introductions, instructions, game completion, certificates, and more.
// The slide arrays (fireSlidesEn, fireSlidesFr, oceanSlidesEn, oceanSlidesFr) define
// the big text slides and question slides used in the fire and ocean halves of the game.
// Helper functions getFireSlides() and getOceanSlides() return the correct set of slides
// based on the current language.
// =============================================================================
const translations = {
  en: {
    setup: {
      heading: "Enter Your Team Name",
      placeholder: "Team Name",
      start: "Save & Start",
    },
    title: "Earth Dual",
    intro: {
      heading: "Final Mission: Save the Planet Together",
      description1:
        "You will face two halves (Fire + Ocean), each worth 50 points. Your total can reach 100 points if you do everything perfectly!",
      description2: `1) Forest Fire (Game + Questions)
   • Move with W, A, S, D
   • SPACE near a fire to extinguish
   • E near an extinguished fire to plant a tree
   • Then read Fire info slides & answer questions

2) Ocean Cleanup (Game + Questions)
   • Move with W, A, S, D
   • Collect trash (+5 points each)
   • Hitting fish or turtles costs -5 points each. Avoid them for a perfect score!

Aim for 100 points!`,
      startButton: "Begin Final Mission",
    },
    completion: {
      heading: "Mission Accomplished!",
      description:
        "Congratulations! Your team has successfully completed all challenges and saved the planet.",
      finalScore: "Final Score: {score}/100",
      message: "The Earth is now safe thanks to your teamwork!",
      warning:
        "Warning: DO NOT refresh this page or you'll lose your progress! Compare your score with your classmates.",
    },
    certificate: {
      heading: "Certificate of Achievement",
      certifies: "This certifies that",
      text: "Has successfully completed the Earth Rescue Mission with excellence and demonstrated exceptional environmental knowledge and teamwork.",
      finalScore: "Final Score",
      date: "Date",
      program: "Earth Dual Program",
    },
    language: "Français",
    slideshow: {
      previous: "Previous",
      next: "Next",
      finish: "Finish",
    },
    fireGame: {
      header: "Forest Fire (25 points)",
      instructions:
        "Move with W, A, S, D. SPACE near a fire to extinguish, E to plant.\n6 fires = 12 actions = 25 points total",
    },
    oceanGame: {
      header: "Ocean Cleanup (25 points)",
      instructions:
        "Move with W, A, S, D. Collect trash (+5 points each), avoid fish/turtles (-5 points each).",
    },
  },
  fr: {
    setup: {
      heading: "Entrez le Nom de Votre Équipe",
      placeholder: "Nom de l'Équipe",
      start: "Enregistrer & Commencer",
    },
    title: "Earth Dual",
    intro: {
      heading: "Mission Finale: Sauvons la Planète Ensemble",
      description1:
        "Vous allez relever deux moitiés (Feu + Océan), chacune valant 50 points. Vous pouvez atteindre 100 points si vous faites tout parfaitement !",
      description2: `1) Incendie de Forêt (Jeu + Questions)
   • W, A, S, D pour se déplacer
   • ESPACE près d'un feu pour l'éteindre
   • E près d'un feu éteint pour planter un arbre
   • Ensuite, lisez les infos Feu et répondez aux questions

2) Nettoyage de l'Océan (Jeu + Questions)
   • W, A, S, D
   • Ramassez les déchets (+5 points chacun)
   • Évitez les poissons ou tortues (-5 points chacun). Essayez de garder un score parfait !

Visez 100 points !`,
      startButton: "Commencer la Mission Finale",
    },
    completion: {
      heading: "Mission Accomplie!",
      description:
        "Félicitations! Votre équipe a complété tous les défis et a sauvé la planète.",
      finalScore: "Score Final: {score}/100",
      message: "La Terre est désormais en sécurité grâce à votre travail d'équipe!",
      warning:
        "Attention: NE PAS rafraîchir cette page ou vous perdrez votre progression ! Comparez votre score avec vos camarades.",
    },
    certificate: {
      heading: "Certificat de Réussite",
      certifies: "Ceci certifie que",
      text: "A réussi la Mission de Sauvetage de la Terre avec excellence et a démontré des connaissances exceptionnelles en matière d’environnement et de travail d’équipe.",
      finalScore: "Score Final",
      date: "Date",
      program: "Programme Earth Dual",
    },
    language: "English",
    slideshow: {
      previous: "Précédent",
      next: "Suivant",
      finish: "Terminer",
    },
    fireGame: {
      header: "Incendie de Forêt (25 points)",
      instructions:
        "Utilisez W, A, S, D pour vous déplacer. ESPACE près d'un feu pour éteindre, E pour planter.\n6 feux = 12 actions = 25 points total",
    },
    oceanGame: {
      header: "Nettoyage de l'Océan (25 points)",
      instructions:
        "Utilisez W, A, S, D pour vous déplacer. Ramassez les déchets (+5 points chacun), évitez les poissons/tortues (-5 points chacun).",
    },
  },
} as const;

type Language = keyof typeof translations;

/** Slide type: big text slides + question slides. */
interface Slide {
  title: string;
  content: string;
  options?: string[];
  correct?: string;
}

/* 
   2) Full sets of Fire / Ocean slides in both languages, 
   with big text & 5 question slides each.
   (Example slides included)
*/

/* ============= FIRE ENGLISH ============= */
const fireSlidesEn: Slide[] = [
  {
    title: "Why Do Forest Fires Happen?",
    content:
      "Forest fires happen when dry plants, trees, and leaves catch fire. Here’s why this happens:\nHot, Dry Weather: When there is no rain for a long time, trees and grass become dry, making them easy to burn.\nGlobal Warming: Rising temperatures make forests drier and cause more wildfires.\nStrong Winds: Wind spreads fire quickly from one tree to another.\nHuman Mistakes: Most wildfires start because of people—not nature.",
  },
  {
    title: "How Are They Caused?",
    content:
      "Campfires Not Put Out: Even small leftover embers can start a big fire.\nDropped Matches or Lighters: A tiny flame can grow into a huge wildfire.\nFireworks or Sparklers: If used in dry areas, they can ignite fires.",
  },
  {
    title: "How Can You Help Prevent Forest Fires?",
    content:
      "Put Out Campfires: If camping, remind adults to pour water on fires before leaving.\nFollow Fire Warnings: If there’s a fire ban, remind your family not to light a fire.\nPick Up Trash: Glass bottles and plastic can focus sunlight and start a fire.",
  },
  {
    title: "Forest Fire Question 1",
    content: "What makes trees and plants dry and easy to catch fire?",
    options: ["a) Too much rain", "b) Cold weather", "c) Hot, dry weather"],
    correct: "c",
  },
  {
    title: "Forest Fire Question 2",
    content: "Which human activities can start forest fires?",
    options: [
      "a) Playing with matches and lighters",
      "b) Collecting leaves",
      "c) Walking in the forest",
    ],
    correct: "a",
  },
  {
    title: "Forest Fire Question 3",
    content: "Why is wind dangerous during a forest fire?",
    options: [
      "a) It spreads the fire quickly",
      "b) It puts out the fire",
      "c) It makes trees grow faster",
    ],
    correct: "a",
  },
  {
    title: "Forest Fire Question 4",
    content: "What should you do if you see smoke in a forest?",
    options: [
      "a) Run away and say nothing",
      "b) Tell an adult or call emergency services",
      "c) Try to put it out yourself",
    ],
    correct: "b",
  },
  {
    title: "Forest Fire Question 5",
    content: "How can kids help prevent forest fires?",
    options: [
      "a) Play with matches in the forest",
      "b) Remind adults to fully put out campfires",
      "c) Leave trash in the forest",
    ],
    correct: "b",
  },
];

/* ============= FIRE FRENCH ============= */
const fireSlidesFr: Slide[] = [
  {
    title: "Pourquoi les feux de forêt se produisent-ils ?",
    content:
      "Les feux de forêt se déclenchent lorsque des plantes, des arbres et des feuilles sèches prennent feu. Voici pourquoi cela arrive :\nTemps chaud et sec : Lorsque la pluie ne tombe pas pendant longtemps, les arbres et l'herbe deviennent secs et faciles à brûler.\nRéchauffement climatique : La hausse des températures assèche les forêts et augmente les incendies.\nVents forts : Le vent propage rapidement le feu d’un arbre à l’autre.\nErreurs humaines : La plupart des feux de forêt sont causés par les gens et non par la nature.",
  },
  {
    title: "Comment sont-ils causés ?",
    content:
      "Feux de camp mal éteints : Même de petites braises restantes peuvent allumer un grand incendie.\nMégots de cigarettes : Les jeter dans l’herbe sèche peut déclencher un feu.\nFeux d’artifice : Utilisés dans des zones sèches, ils peuvent provoquer un incendie.",
  },
  {
    title: "Comment pouvez-vous aider à prévenir les feux de forêt ?",
    content:
      "Même en tant qu'enfant, vous pouvez aider !\nÉteignez les feux de camp : Si vous campez, rappelez aux adultes de verser de l'eau sur le feu avant de partir.\nRespectez les avertissements d’incendie : S'il y a une interdiction de feu, rappelez à votre famille de ne pas allumer de feu.\nRamassez les déchets : Les bouteilles en verre et le plastique peuvent concentrer la lumière du soleil et déclencher un incendie.\nSignalez la fumée : Si vous voyez de la fumée dans une forêt, dites-le à un adulte.",
  },
  {
    title: "Question Feu de Forêt 1",
    content:
      "Qu'est-ce qui rend les arbres et les plantes secs et faciles à brûler ?",
    options: ["a) Trop de pluie", "b) Temps froid", "c) Temps chaud et sec"],
    correct: "c",
  },
  {
    title: "Question Feu de Forêt 2",
    content:
      "Quelles activités humaines peuvent provoquer des feux de forêt ?",
    options: [
      "a) Jouer avec des allumettes et des briquets",
      "b) Ramasser des feuilles",
      "c) Marcher dans la forêt",
    ],
    correct: "a",
  },
  {
    title: "Question Feu de Forêt 3",
    content: "Pourquoi le vent est-il dangereux pendant un feu de forêt ?",
    options: [
      "a) Il propage le feu rapidement",
      "b) Il éteint le feu",
      "c) Il fait pousser les arbres plus vite",
    ],
    correct: "a",
  },
  {
    title: "Question Feu de Forêt 4",
    content: "Que dois-tu faire si tu vois de la fumée dans une forêt ?",
    options: [
      "a) Partir en courant sans rien dire",
      "b) Prévenir un adulte ou appeler les secours",
      "c) Essayer d’éteindre le feu tout seul",
    ],
    correct: "b",
  },
  {
    title: "Question Feu de Forêt 5",
    content:
      "Comment les enfants peuvent-ils aider à prévenir les feux de forêt ?",
    options: [
      "a) Jouer avec des allumettes dans la forêt",
      "b) Rappeler aux adultes d’éteindre complètement les feux de camp",
      "c) Laisser des déchets dans la forêt",
    ],
    correct: "b",
  },
];

/* ============= OCEAN ENGLISH ============= */
const oceanSlidesEn: Slide[] = [
  {
    title: "Why Do Oceans Get Polluted?",
    content:
      "The ocean gets dirty when people’s trash, chemicals, and waste enter the water. Here’s why this happens:\nPlastic Waste: Items like bottles, bags, and straws don’t break down and end up in the ocean.\nOil Spills: Ships sometimes leak oil into the ocean, making the water toxic for sea animals.\nChemicals from Homes: Soap, cleaners, and fertilizers wash into rivers and lead to ocean pollution.\nLittering: Trash thrown on the ground often gets washed into waterways and the ocean.\nFishing Waste: Lost fishing nets and other waste trap and harm sea animals.",
  },
  {
    title: "How Are Oceans Polluted?",
    content:
      "People Throwing Trash: Garbage left on the beach or ground eventually reaches the ocean.\nFactories Dumping Waste: Some industries release harmful chemicals into rivers that flow into the sea.\nToo Much Plastic Use: Single-use plastics like straws and wrappers end up in the ocean.\nWashing Chemicals Down the Drain: Cleaning products and fertilizers used at home can pollute water.",
  },
  {
    title: "How Can You Help Keep the Ocean Clean?",
    content:
      "Use Less Plastic: Choose reusable bottles, bags, and containers.\nThrow Trash in the Bin: Always put garbage in the right place.\nRecycle: Help sort plastics and cans to keep them out of the ocean.\nUse Eco-Friendly Products: Choose soaps and cleaners that don’t harm the environment.\nJoin a Cleanup: If you visit a park, river, or beach, pick up any trash you see.",
  },
  {
    title: "Ocean Pollution Question 1",
    content: "What is the biggest cause of ocean pollution?",
    options: ["a) Plastic waste", "b) Rocks and sand", "c) Fish and seaweed"],
    correct: "a",
  },
  {
    title: "Ocean Pollution Question 2",
    content:
      "How does trash from the ground end up in the ocean?",
    options: [
      "a) Wind and rain carry it into rivers and streams",
      "b) People bring trash to the ocean on purpose",
      "c) It disappears on its own",
    ],
    correct: "a",
  },
  {
    title: "Ocean Pollution Question 3",
    content: "Why is plastic dangerous for sea animals?",
    options: [
      "a) They can use it as a toy",
      "b) They might eat it or get stuck in it",
      "c) It helps them swim faster",
    ],
    correct: "b",
  },
  {
    title: "Ocean Pollution Question 4",
    content: "Which action helps keep the ocean clean?",
    options: [
      "a) Using reusable bags and bottles",
      "b) Throwing trash in the water",
      "c) Buying more plastic items",
    ],
    correct: "a",
  },
  {
    title: "Ocean Pollution Question 5",
    content: "What should you do if you see trash at the beach?",
    options: [
      "a) Ignore it and walk away",
      "b) Pick it up and throw it in a bin",
      "c) Push it into the water",
    ],
    correct: "b",
  },
];

/* ============= OCEAN FRENCH ============= */
const oceanSlidesFr: Slide[] = [
  {
    title: "Pourquoi les océans sont-ils pollués ?",
    content:
      "Les océans deviennent sales lorsque les déchets, les produits chimiques et les ordures des gens y pénètrent. Voici pourquoi cela arrive :\nDéchets plastiques : Les bouteilles, sacs et pailles ne se décomposent pas et finissent dans l’océan.\nProduits chimiques des maisons : Les savons, nettoyants et engrais se retrouvent dans l’eau et polluent l’océan.\nDéchets jetés par terre : Les ordures laissées au sol finissent souvent dans l’eau.\nDéchets de pêche : Les filets et autres déchets de pêche piègent et blessent les animaux marins.",
  },
  {
    title: "Comment les océans sont-ils pollués ?",
    content:
      "La pollution survient lorsque :\n• Les déchets sont transportés par le vent et la pluie\n• Les usines déversent des produits chimiques\n• L'usage excessif de plastique\n• Les produits ménagers polluent l'eau",
  },
  {
    title: "Comment garder l'océan propre ?",
    content:
      "Utilisez moins de plastique : Préférez des bouteilles et sacs réutilisables.\nJetez les déchets à la poubelle : Ne laissez jamais d'ordures au sol.\nRecyclez : Aidez à trier les plastiques et canettes pour éviter qu’ils finissent dans l’eau.\nUtilisez des produits écologiques : Choisissez des savons et nettoyants respectueux de l’environnement.\nParticipez à un nettoyage : Si vous visitez un parc, une rivière ou une plage, ramassez les déchets que vous trouvez.",
  },
  {
    title: "Question Océan 1",
    content: "Quelle est la plus grande cause de pollution des océans ?",
    options: [
      "a) Les déchets plastiques comme les bouteilles et les sacs",
      "b) Les rochers et le sable",
      "c) Les poissons et les algues",
    ],
    correct: "a",
  },
  {
    title: "Question Océan 2",
    content:
      "Comment les déchets laissés au sol finissent-ils dans l'océan ?",
    options: [
      "a) Le vent et la pluie les transportent dans les rivières et les fleuves",
      "b) Les gens les apportent volontairement à l’océan",
      "c) Ils disparaissent tout seuls",
    ],
    correct: "a",
  },
  {
    title: "Question Océan 3",
    content: "Pourquoi le plastique est-il dangereux pour les animaux marins ?",
    options: [
      "a) Ils peuvent jouer avec",
      "b) Ils peuvent en manger ou s’y coincer",
      "c) Ça les aide à mieux nager",
    ],
    correct: "b",
  },
  {
    title: "Question Océan 4",
    content: "Quelle action aide à garder l’océan propre ?",
    options: [
      "a) Utiliser des sacs et des bouteilles réutilisables",
      "b) Jeter ses déchets dans l’eau",
      "c) Acheter plus d’objets en plastique",
    ],
    correct: "a",
  },
  {
    title: "Question Océan 5",
    content:
      "Que dois-tu faire si tu vois des déchets sur la plage ?",
    options: [
      "a) Les ignorer et partir",
      "b) Les ramasser et les jeter dans une poubelle",
      "c) Les pousser dans l’eau",
    ],
    correct: "b",
  },
];

/* Return the correct arrays based on language. */
function getFireSlides(lang: Language): Slide[] {
  return lang === "en" ? fireSlidesEn : fireSlidesFr;
}
function getOceanSlides(lang: Language): Slide[] {
  return lang === "en" ? oceanSlidesEn : oceanSlidesFr;
}



// =============================================================================
//  Flow States + Helper
// Defines the various game states as a union type (setup, intro, fireGame, etc.).
// Also includes helper functions, such as 'distance', which calculates the Euclidean
// distance between two points. This is used for collision or proximity checks within
// the game (for instance, when determining if the firefighter is close enough to a fire).
// =============================================================================

type GameState =
  | "setup"
  | "intro"
  | "fireGame"
  | "fireSlides"
  | "oceanGame"
  | "oceanSlides"
  | "certificate";

function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

// =============================================================================
// Main Page
// This component manages the overall flow of the game by switching between various
// game states: "setup", "intro", "fireGame", "fireSlides", "oceanGame", "oceanSlides",
// and "certificate". It renders a language toggle button, the team setup screen,
// an introduction screen, and conditionally renders game components such as FireGame,
// QuestionSlideshow (for both fire and ocean), OceanGame, and the CompletionCertificate.
// Inline styles (via a style tag) define global and component-specific CSS.
// =============================================================================
export default function Page() {
  const [language, setLanguage] = useState<Language>("en");
  const text = translations[language];
  const [gameState, setGameState] = useState<GameState>("setup");
  const [teamName, setTeamName] = useState("");

  // Fire
  const [scoreFireGame, setScoreFireGame] = useState(0);
  const [scoreFireSlides, setScoreFireSlides] = useState(0);

  // Ocean
  const [scoreOceanGame, setScoreOceanGame] = useState(0);
  const [scoreOceanSlides, setScoreOceanSlides] = useState(0);

  const totalScore =
    scoreFireGame + scoreFireSlides + scoreOceanGame + scoreOceanSlides;
  // Cap at 100
  const finalScore = Math.min(totalScore, 100);

  // Force a one-time refresh if you want
  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has("refreshed")) {
      url.searchParams.set("refreshed", "true");
      window.location.replace(url.toString());
    }
  }, []);

  function toggleLanguage() {
    setLanguage((prev) => (prev === "en" ? "fr" : "en"));
  }

  function handleSetupSubmit() {
    if (teamName.trim()) {
      setGameState("intro");
    }
  }

  // If no team name, force setup
  useEffect(() => {
    if (!teamName && gameState !== "setup") {
      setGameState("setup");
    }
  }, [teamName, gameState]);

  return (
    <div style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <style>
        {`
        /* Hide default Next.js bar => no black bar */
        header, nav {
          display: none !important;
        }
        html, body {
          margin: 0; padding: 0;
          width: 100%; height: 100%;
          overflow: hidden; 
          box-sizing: border-box;
        }
        .lang-toggle {
          position: fixed; top: 10px; right: 10px; 
          background: #2980b9; color: #fff; 
          border: none; border-radius: 6px; 
          padding: 8px 16px; cursor: pointer;
          z-index: 9999;
        }
        /* Setup & Intro => background image: minigamebackground.jpg */
        .bg-image-section {
          width: 100%; height: 100%;
          display: flex; align-items: center; justify-content: center;
          background: url('/minigamebackground.jpg') no-repeat center center;
          background-size: cover;
        }
        .center-box {
          background: rgba(255,255,255,0.85);
          padding: 30px;
          border-radius: 12px;
          text-align: center;
          color: #000;
          max-width: 600px; width: 90%;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .team-input {
          margin-top: 20px; padding: 8px; font-size: 16px; width: 70%;
          border-radius: 6px; border: 1px solid #ccc;
        }
        .start-button {
          background-color: #27ae60; color: #fff; border: none;
          padding: 12px 24px; border-radius: 6px; font-size: 18px;
          cursor: pointer; margin-top: 20px;
        }
        .start-button:hover { background-color: #2ecc71; }
        .planet-image {
          font-size: 80px; margin: 20px 0;
          animation: float 3s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        `}
      </style>

      <button className="lang-toggle" onClick={toggleLanguage}>
        {translations[language].language}
      </button>

      {/* SETUP => background image */}
      {gameState === "setup" && (
        <div className="bg-image-section">
          <div className="center-box">
            <h2>{text.setup.heading}</h2>
            <input
              type="text"
              placeholder={text.setup.placeholder}
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="team-input"
            />
            <button onClick={handleSetupSubmit} className="start-button">
              {text.setup.start}
            </button>
          </div>
        </div>
      )}

      {/* INTRO => background image */}
      {gameState === "intro" && (
        <div className="bg-image-section">
          <div className="center-box">
            <h2 style={{ marginBottom: "10px" }}>{text.intro.heading}</h2>
            <p>{text.intro.description1}</p>
            <p style={{ whiteSpace: "pre-line", textAlign: "left", marginTop: "10px" }}>
              {text.intro.description2}
            </p>
            <div className="planet-image">🌍</div>
            <button onClick={() => setGameState("fireGame")} className="start-button">
              {text.intro.startButton}
            </button>
          </div>
        </div>
      )}

      {/* FIRE GAME */}
      {gameState === "fireGame" && (
        <FireGame
          language={language}
          scoreFireGame={scoreFireGame}
          setScoreFireGame={setScoreFireGame}
          onFinish={() => setGameState("fireSlides")}
          totalScore={totalScore}
        />
      )}

      {/* FIRE SLIDES => big text + questions */}
      {gameState === "fireSlides" && (
        <QuestionSlideshow
          slides={getFireSlides(language)}
          language={language}
          questionScore={scoreFireSlides}
          setQuestionScore={setScoreFireSlides}
          onFinish={() => setGameState("oceanGame")}
          totalScore={totalScore}
          halfName="Fire"
        />
      )}

      {/* OCEAN GAME */}
      {gameState === "oceanGame" && (
        <OceanGame
          language={language}
          scoreOceanGame={scoreOceanGame}
          setScoreOceanGame={setScoreOceanGame}
          onFinish={() => setGameState("oceanSlides")}
          totalScore={totalScore}
        />
      )}

      {/* OCEAN SLIDES => big text + questions */}
      {gameState === "oceanSlides" && (
        <QuestionSlideshow
          slides={getOceanSlides(language)}
          language={language}
          questionScore={scoreOceanSlides}
          setQuestionScore={setScoreOceanSlides}
          onFinish={() => setGameState("certificate")}
          totalScore={totalScore}
          halfName="Ocean"
        />
      )}

      {/* CERTIFICATE */}
      {gameState === "certificate" && (
        <CompletionCertificate
          rawScore={finalScore}
          language={language}
          teamName={teamName}
        />
      )}
    </div>
  );
}

// =============================================================================
// FireGame Component
// Implements the Forest Fire game segment. This component:
// • Spawns 6 fires at random positions and decorative trees.
// • Tracks the firefighter's position and direction using key events (W, A, S, D).
// • Allows the player to activate the hose (SPACE) to extinguish fires and press E
//   to plant a tree near an extinguished fire.
// • Uses the 'distance' helper to check proximity for extinguishing/planting.
// • Recalculates the fire game score based on the number of extinguish and plant actions,
//   capping the score at 25 points.
// • Finishes the game when all fires are planted, then triggers the onFinish callback.
// =============================================================================
interface FireGameProps {
  language: Language;
  scoreFireGame: number;
  setScoreFireGame: React.Dispatch<React.SetStateAction<number>>;
  onFinish: () => void;
  totalScore: number;
}
type FireStatus = "burning" | "extinguished" | "planted";

function FireGame({
  language,
  scoreFireGame,
  setScoreFireGame,
  onFinish,
  totalScore,
}: FireGameProps) {
  const text = translations[language];
  const [doneFire, setDoneFire] = useState(false);

  const [fires, setFires] = useState<Array<{ x: number; y: number; status: FireStatus }>>([]);
  const [forestTrees, setForestTrees] = useState<Array<{ x: number; y: number }>>([]);

  const [firefighterPos, setFirefighterPos] = useState({ x: 20, y: 80 });
  const [firefighterDir, setFirefighterDir] = useState({ x: 0, y: 0 });
  const [isHoseOn, setIsHoseOn] = useState(false);

  const [extinguishCount, setExtinguishCount] = useState(0);
  const [plantCount, setPlantCount] = useState(0);

  // let 12 actions => 25 points
  function recalcFireScore(ext: number, plant: number) {
    const actions = ext + plant;
    if (actions >= 12) {
      setScoreFireGame(25);
    } else {
      setScoreFireGame(Math.min(actions * 2, 24));
    }
  }

  useEffect(() => {
    setScoreFireGame(0);
    setExtinguishCount(0);
    setPlantCount(0);

    // spawn 6 fires
    const newFires = [];
    for (let i = 0; i < 6; i++) {
      newFires.push({
        x: Math.floor(Math.random() * 40) + 50,
        y: Math.floor(Math.random() * 40) + 10,
        status: "burning" as const,
      });
    }
    setFires(newFires);

    // decorative trees
    const newTrees = [];
    for (let i = 0; i < 8; i++) {
      newTrees.push({
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
      });
    }
    setForestTrees(newTrees);
  }, [setScoreFireGame]);

  // movement: update every 16ms (~60fps)
  useEffect(() => {
    const interval = setInterval(() => {
      setFirefighterPos((prev) => {
        const newX = Math.max(0, Math.min(100, prev.x + firefighterDir.x));
        const newY = Math.max(0, Math.min(100, prev.y + firefighterDir.y));
        return { x: newX, y: newY };
      });
    }, 16);
    return () => clearInterval(interval);
  }, [firefighterDir]);

  // instant extinguish fires 
  useEffect(() => {
    fires.forEach((f, idx) => {
      if (f.status === "burning") {
        const dist = distance(f.x, f.y, firefighterPos.x, firefighterPos.y);
        if (dist < 5 && isHoseOn) {
          setFires((prev) => {
            const copy = [...prev];
            if (copy[idx].status === "burning") {
              copy[idx].status = "extinguished";
              setExtinguishCount((c) => {
                const newE = c + 1;
                recalcFireScore(newE, plantCount);
                return newE;
              });
            }
            return copy;
          });
        }
      }
    });
  }, [fires, firefighterPos, isHoseOn, plantCount]);

  function handleKeyDown(e: React.KeyboardEvent) {
    const k = e.key.toLowerCase();
    switch (k) {
      case "w":
        setFirefighterDir({ x: 0, y: -0.5 });
        break;
      case "a":
        setFirefighterDir({ x: -0.5, y: 0 });
        break;
      case "s":
        setFirefighterDir({ x: 0, y: 0.5 });
        break;
      case "d":
        setFirefighterDir({ x: 0.5, y: 0 });
        break;
      case " ":
        setIsHoseOn(true);
        break;
      case "e":
        // plant if near extinguished
        setFires((prev) =>
          prev.map((fire) => {
            if (fire.status === "extinguished") {
              const dist = distance(fire.x, fire.y, firefighterPos.x, firefighterPos.y);
              if (dist < 5) {
                setPlantCount((p) => {
                  const newP = p + 1;
                  recalcFireScore(extinguishCount, newP);
                  return newP;
                });
                return { ...fire, status: "planted" };
              }
            }
            return fire;
          })
        );
        break;
      default:
        break;
    }
  }
  function handleKeyUp(e: React.KeyboardEvent) {
    const k = e.key.toLowerCase();
    if (["w", "a", "s", "d"].includes(k)) {
      setFirefighterDir({ x: 0, y: 0 });
    }
    if (k === " ") {
      setIsHoseOn(false);
    }
  }

  // done if all fires planted
  useEffect(() => {
    if (fires.length > 0 && fires.every((f) => f.status === "planted")) {
      setDoneFire(true);
    }
  }, [fires]);
  useEffect(() => {
    if (doneFire) {
      const timer = setTimeout(() => onFinish(), 1000);
      return () => clearTimeout(timer);
    }
  }, [doneFire, onFinish]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        position: "relative",
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "rgba(0,0,0,0.05)",
          padding: "10px 15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
          Fire Game Score: {scoreFireGame}/25
        </p>
        <p style={{ margin: 0, color: "#666" }}>
          Total: {Math.min(totalScore, 100)}/100
        </p>
      </div>

      {/* Game header and instructions (language sensitive) */}
      <div
        style={{
          maxWidth: "800px",
          margin: "60px auto 0 auto",
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#e67e22", marginBottom: "10px" }}>
          {translations[language].fireGame.header}
        </h3>
        <p style={{ fontWeight: "bold", color: "#444", margin: 0 }}>
          {translations[language].fireGame.instructions}
        </p>
      </div>

      {/* Playable area with decorative trees */}
      <div
        style={{
          position: "relative",
          margin: "20px auto",
          maxWidth: "900px",
          height: "500px",
          backgroundColor: "#e2f7e2",
          borderRadius: "8px",
          border: "2px solid #c3e6c3",
          overflow: "hidden",
        }}
      >
        {/* Decorative trees */}
        {forestTrees.map((t, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              fontSize: "32px",
              transform: "translate(-50%, -50%)",
              left: `${t.x}%`,
              top: `${t.y}%`,
            }}
          >
            🌳
          </div>
        ))}

        {/* Fires */}
        {fires.map((f, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              fontSize: "32px",
              transform: "translate(-50%, -50%)",
              left: `${f.x}%`,
              top: `${f.y}%`,
            }}
          >
            {f.status === "burning" && "🔥"}
            {f.status === "extinguished" && "🪨"}
            {f.status === "planted" && "🌱"}
          </div>
        ))}
        {/* Firefighter */}
        <div
          style={{
            position: "absolute",
            fontSize: "32px",
            transform: "translate(-50%, -50%)",
            left: `${firefighterPos.x}%`,
            top: `${firefighterPos.y}%`,
            textShadow: isHoseOn ? "0 0 8px #00f" : "none",
          }}
        >
          👨‍🚒
        </div>
      </div>
    </div>
  );
}



// =============================================================================
// QuestionSlideshow Component
// Displays a series of slides containing big text and questions for either the fire
// or ocean section of the game. This component:
// • Receives an array of Slide objects along with language and score state.
// • Renders each slide's title, content, and (if provided) multiple-choice options.
// • Handles answer selection, provides immediate feedback (correct/incorrect),
//   and adjusts the score accordingly (awarding or deducting points).
// • Provides navigation buttons (Previous, Next, or Finish) to move through the slides.
// • Calls onFinish when the last slide is complete, transitioning to the next game phase.
// =============================================================================
interface QuestionSlideshowProps {
  slides: Slide[];
  language: Language;
  questionScore: number;
  setQuestionScore: React.Dispatch<React.SetStateAction<number>>;
  onFinish: () => void;
  totalScore: number;
  halfName?: string;
}
function QuestionSlideshow({
  slides,
  language,
  questionScore,
  setQuestionScore,
  onFinish,
  totalScore,
  halfName,
}: QuestionSlideshowProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");

  const text = translations[language];
  const POINTS_CORRECT = 5;
  const POINTS_WRONG = -5;

  const currentSlide = slides[slideIndex];

  let correctAnswer = "";
  if (currentSlide.options && currentSlide.correct) {
    const idx = currentSlide.options.findIndex((opt) =>
      opt.toLowerCase().startsWith(currentSlide.correct!.toLowerCase())
    );
    if (idx >= 0) correctAnswer = currentSlide.options[idx];
  }

  function handleOptionClick(opt: string) {
    if (answered || !currentSlide.correct || !currentSlide.options) return;
    setSelected(opt);
    setAnswered(true);
    if (opt.charAt(0).toLowerCase() === currentSlide.correct.toLowerCase()) {
      setQuestionScore((prev) => Math.min(prev + POINTS_CORRECT, 25));
      setFeedback("Correct!");
    } else {
      setQuestionScore((prev) => Math.max(prev + POINTS_WRONG, 0));
      setFeedback(`Wrong! The correct answer is: ${correctAnswer}`);
    }
  }

  function goNextSlide() {
    setAnswered(false);
    setSelected("");
    setFeedback("");
    if (slideIndex < slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      onFinish();
    }
  }
  function goPrevSlide() {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
      setAnswered(false);
      setSelected("");
      setFeedback("");
    }
  }

  return (
    <div style={{ width: "100%", height: "100%", backgroundColor: "#fff", position: "relative" }}>
      <style>
        {`
        .quiz-button {
          padding: 14px 18px;
          border-radius: 6px;
          border: 1px solid #ccc;
          background-color: #fff;
          font-size: 1.1rem; 
          color: #333;
          text-align: left;
          cursor: pointer;
        }
        .quiz-button.correct {
          border-color: green !important;
          background-color: #eaffea !important;
          color: #006600 !important;
        }
        .quiz-button.wrong {
          border-color: red !important;
          background-color: #ffeaea !important;
          color: #990000 !important;
        }
        `}
      </style>

      {/* Pinned scoreboard */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "rgba(0,0,0,0.05)",
          padding: "10px 15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          zIndex: 9999,
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
          {halfName || "Quiz"} Score: {questionScore}/25
        </p>
        <p style={{ margin: 0, color: "#666" }}>
          Total: {Math.min(totalScore, 100)}/100
        </p>
      </div>

      <div
        style={{
          maxWidth: "700px",
          margin: "80px auto 0 auto",
          padding: "20px",
          background: "#fafafa",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "10px", color: "#e67e22" }}>
          {currentSlide.title}
        </h2>
        <p
          style={{
            whiteSpace: "pre-line",
            fontSize: "1.25rem",
            margin: "20px 0",
            lineHeight: 1.6,
            color: "#444",
          }}
        >
          {currentSlide.content}
        </p>
        {currentSlide.options && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginBottom: "20px",
              maxWidth: "400px",
              margin: "0 auto",
            }}
          >
            {currentSlide.options.map((opt, i) => {
              let className = "quiz-button";
              if (answered && opt === selected) {
                if (opt.charAt(0).toLowerCase() === currentSlide.correct?.toLowerCase()) {
                  className += " correct";
                } else {
                  className += " wrong";
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleOptionClick(opt)}
                  disabled={answered}
                  className={className}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}

        {answered && feedback && (
          <p style={{ color: feedback.startsWith("Wrong") ? "red" : "green", fontWeight: "bold" }}>
            {feedback}
          </p>
        )}

        <div style={{ marginTop: "30px", display: "flex", gap: "16px", justifyContent: "center" }}>
          {slideIndex > 0 && (
            <button
              onClick={goPrevSlide}
              style={{
                backgroundColor: "#ccc",
                color: "#333",
                border: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                cursor: "pointer",
              }}
            >
              {translations[language].slideshow.previous}
            </button>
          )}
          <button
            onClick={goNextSlide}
            style={{
              backgroundColor: "#27ae60",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            {slideIndex === slides.length - 1
              ? translations[language].slideshow.finish
              : translations[language].slideshow.next}
          </button>
        </div>
      </div>
    </div>
  );
}



// =============================================================================
// OceanGame Component
// Implements the Ocean Cleanup game segment. This component:
// • Spawns 6 pieces of trash (debris) and a set of ocean animals (fish/turtles) at random positions.
// • Controls the boat’s position and movement (using WASD keys) within the game area.
// • Checks for collisions between the boat and trash (to collect and increase score)
//   or boat and animals (to deduct points), using the 'distance' helper function.
// • Updates the game score accordingly (capped at 25 points for the ocean half).
// • Finishes the game once all trash is collected, then triggers the onFinish callback.
// =============================================================================
interface OceanGameProps {
  language: Language;
  scoreOceanGame: number;
  setScoreOceanGame: React.Dispatch<React.SetStateAction<number>>;
  onFinish: () => void;
  totalScore: number;
}
function OceanGame({
  language,
  scoreOceanGame,
  setScoreOceanGame,
  onFinish,
  totalScore,
}: OceanGameProps) {
  const text = translations[language];
  const [doneOcean, setDoneOcean] = useState(false);

  const [boatPos, setBoatPos] = useState({ x: 50, y: 50 });
  const [boatDir, setBoatDir] = useState({ x: 0, y: 0 });
  const [oceanDebris, setOceanDebris] = useState<
    Array<{ id: number; x: number; y: number; collected: boolean }>
  >([]);
  const [oceanAnimals, setOceanAnimals] = useState<
    Array<{ id: number; x: number; y: number; char: string; hit: boolean }>
  >([]);

  function clampOceanScore(val: number) {
    return Math.min(Math.max(val, 0), 25);
  }

  useEffect(() => {
    setScoreOceanGame(0);

    // spawn 6 trash
    const newDebris = [];
    for (let i = 0; i < 6; i++) {
      newDebris.push({
        id: i,
        x: Math.floor(Math.random() * 80) + 10,
        y: Math.floor(Math.random() * 80) + 10,
        collected: false,
      });
    }
    setOceanDebris(newDebris);

    // extra fish/turtles
    const animals = [
      { id: 1, x: 20, y: 70, char: "🐟", hit: false },
      { id: 2, x: 60, y: 30, char: "🐢", hit: false },
      { id: 3, x: 40, y: 50, char: "🐢", hit: false },
      { id: 4, x: 75, y: 75, char: "🐟", hit: false },
    ];
    setOceanAnimals(animals);
  }, [setScoreOceanGame]);

  // movement
  useEffect(() => {
    const interval = setInterval(() => {
      setBoatPos((prev) => {
        const newX = Math.max(0, Math.min(100, prev.x + boatDir.x));
        const newY = Math.max(0, Math.min(100, prev.y + boatDir.y));
        return { x: newX, y: newY };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [boatDir]);

  // collect trash => +5, fish/turtles => -5
  useEffect(() => {
    setOceanDebris((prev) =>
      prev.map((d) => {
        if (d.collected) return d;
        const dist = distance(d.x, d.y, boatPos.x, boatPos.y);
        if (dist < 5) {
          setScoreOceanGame((old) => clampOceanScore(old + 5));
          return { ...d, collected: true };
        }
        return d;
      })
    );
    setOceanAnimals((prev) =>
      prev.map((a) => {
        if (!a.hit) {
          const dist = distance(a.x, a.y, boatPos.x, boatPos.y);
          if (dist < 5) {
            setScoreOceanGame((old) => clampOceanScore(old - 5));
            return { ...a, hit: true };
          }
        }
        return a;
      })
    );
  }, [boatPos]);

  function handleKeyDown(e: React.KeyboardEvent) {
    const k = e.key.toLowerCase();
    switch (k) {
      case "w":
        setBoatDir({ x: 0, y: -3 });
        break;
      case "a":
        setBoatDir({ x: -3, y: 0 });
        break;
      case "s":
        setBoatDir({ x: 0, y: 3 });
        break;
      case "d":
        setBoatDir({ x: 3, y: 0 });
        break;
      default:
        break;
    }
  }
  function handleKeyUp(e: React.KeyboardEvent) {
    const k = e.key.toLowerCase();
    if (["w", "a", "s", "d"].includes(k)) {
      setBoatDir({ x: 0, y: 0 });
    }
  }

  useEffect(() => {
    const collectedCount = oceanDebris.filter((t) => t.collected).length;
    if (collectedCount === 6) {
      setDoneOcean(true);
    }
  }, [oceanDebris]);
  useEffect(() => {
    if (doneOcean) {
      const timer = setTimeout(() => onFinish(), 1000);
      return () => clearTimeout(timer);
    }
  }, [doneOcean, onFinish]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        position: "relative",
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "rgba(0,0,0,0.05)",
          padding: "10px 15px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      >
        <p style={{ margin: 0, fontWeight: "bold", color: "#333" }}>
          Ocean Game Score: {scoreOceanGame}/25
        </p>
        <p style={{ margin: 0, color: "#666" }}>
          Total: {Math.min(totalScore, 100)}/100
        </p>
      </div>

      {/* Game header and instructions (language sensitive) */}
      <div
        style={{
          maxWidth: "800px",
          margin: "60px auto 0 auto",
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h3 style={{ color: "#2980b9", marginBottom: "10px" }}>
          {translations[language].oceanGame.header}
        </h3>
        <p style={{ fontWeight: "bold", color: "#444", margin: 0 }}>
          {translations[language].oceanGame.instructions}
        </p>
      </div>

      <div
        style={{
          position: "relative",
          margin: "20px auto",
          maxWidth: "900px",
          height: "500px",
          backgroundColor: "#add8e6",
          borderRadius: "8px",
          border: "2px solid #ccc",
          overflow: "hidden",
        }}
      >
        {/* Trash */}
        {oceanDebris.map((t) =>
          !t.collected ? (
            <div
              key={t.id}
              style={{
                position: "absolute",
                fontSize: "24px",
                transform: "translate(-50%, -50%)",
                left: `${t.x}%`,
                top: `${t.y}%`,
              }}
            >
              🗑️
            </div>
          ) : null
        )}
        {/* Fish/Turtles */}
        {oceanAnimals.map((a) => (
          <div
            key={a.id}
            style={{
              position: "absolute",
              fontSize: "24px",
              transform: "translate(-50%, -50%)",
              left: `${a.x}%`,
              top: `${a.y}%`,
              opacity: a.hit ? 0.4 : 1,
            }}
          >
            {a.char}
          </div>
        ))}
        {/* Boat */}
        <div
          style={{
            position: "absolute",
            fontSize: "28px",
            transform: "translate(-50%, -50%)",
            left: `${boatPos.x}%`,
            top: `${boatPos.y}%`,
          }}
        >
          🚢
        </div>
      </div>
    </div>
  );
}



// =============================================================================
// CompletionCertificate Component
// Displays a certificate of achievement when the game is complete. This component:
// • Receives the final raw score, current language, and team name as props.
// • Caps the final score at 100 and formats it for display.
// • Shows a congratulatory message, the final score, the current date (formatted according
//   to language), and program details in a styled certificate layout.
// • Uses inline styles to create a visually distinct certificate section.
// =============================================================================
interface CompletionProps {
  rawScore: number;
  language: Language;
  teamName: string;
}
function CompletionCertificate({ rawScore, language, teamName }: CompletionProps) {
  const text = translations[language];
  const finalScore = Math.max(0, Math.min(rawScore, 100));
  const today = new Date().toLocaleDateString(
    language === "en" ? "en-US" : "fr-FR"
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#333",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          padding: "20px",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#000" }}>{text.completion.heading}</h2>
        <p style={{ color: "#444" }}>{text.completion.description}</p>
        <h3 style={{ color: "#000" }}>
          {text.completion.finalScore.replace("{score}", finalScore.toString())}
        </h3>
        <p style={{ color: "#444" }}>{text.completion.message}</p>
        <p
          style={{
            color: "red",
            fontWeight: "bold",
            marginTop: "20px",
            marginBottom: "30px",
          }}
        >
          {text.completion.warning}
        </p>

        <div
          style={{
            marginTop: 10,
            padding: 20,
            border: "2px solid #7f8c8d",
            borderRadius: 12,
            background: "#fff",
            maxWidth: 600,
            width: "90%",
            marginLeft: "auto",
            marginRight: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            color: "#333",
          }}
        >
          <h2 style={{ margin: 0 }}>{text.certificate.heading}</h2>
          <p style={{ fontStyle: "italic", marginTop: 20 }}>
            {text.certificate.certifies}
          </p>
          <p style={{ fontSize: 24, fontWeight: "bold", margin: "10px 0" }}>
            {teamName || "Your Team"}
          </p>
          <p style={{ margin: "20px 0", lineHeight: 1.5 }}>
            {text.certificate.text}
          </p>
          <p style={{ fontWeight: "bold" }}>
            {text.certificate.finalScore}: {finalScore}/100
          </p>
          <p style={{ fontStyle: "italic" }}>
            {text.certificate.date}: {today}
          </p>
          <div
            style={{
              marginTop: 30,
              textAlign: "right",
              fontStyle: "italic",
              fontWeight: "bold",
            }}
          >
            {text.certificate.program}
          </div>
        </div>
      </div>
    </div>
  );
}
