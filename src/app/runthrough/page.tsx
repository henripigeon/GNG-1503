"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// -----------------------------------------------------------------------------
// Walkthrough Steps Data (Instructions)
// -----------------------------------------------------------------------------
interface WalkthroughStep {
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  imageSrc?: string;
}

const walkthroughSteps: WalkthroughStep[] = [
  {
    title: { en: "Score Table & Timer", fr: "Tableau des scores & minuterie" },
    description: {
      en: "Here you see the round number, overall score, and a countdown timer. You can skip the timer if you’re ready or end the game when you wish.",
      fr: "Ici, vous voyez le numéro de manche, le score global et le compte à rebours. Vous pouvez passer le minuteur si vous êtes prêts ou terminer la partie si besoin.",
    },
    imageSrc: "/IMAGE2.png",
  },
  {
    title: { en: "Language Switch", fr: "Changement de langue" },
    description: {
      en: "Use this button to toggle between English and French. If you have trouble understanding a word, try the other language!",
      fr: "Utilisez ce bouton pour passer de l’anglais au français. Si vous avez du mal à comprendre un mot, essayez dans l’autre langue !",
    },
    imageSrc: "/IMAGE3.png",
  },
  {
    title: { en: "Scenario & Hint", fr: "Scénario & conseils" },
    description: {
      en: "The scenario describes the environmental challenge you’ll face. Use the hint if you need extra guidance, or ignore it if you feel confident.",
      fr: "Le scénario décrit le problème environnemental auquel vous serez confrontés. Utilisez le conseil si vous avez besoin d’aide, sinon, jouez votre carte en toute confiance.",
    },
    imageSrc: "/IMAGE4.png",
  },
  {
    title: { en: "Card Input", fr: "Saisie des cartes" },
    description: {
      en: "Each team enters the ID of their chosen card here. Double-check your card before submitting and remember to pick up a new card afterward!",
      fr: "Chaque équipe saisit l’ID de la carte choisie ici. Vérifiez bien votre carte avant de la soumettre et n’oubliez pas de prendre une nouvelle carte par la suite !",
    },
    imageSrc: "/IMAGE5.png",
  },
  {
    title: { en: "Bonus Question", fr: "Question bonus" },
    description: {
      en: "After card submission, you’ll answer a bonus question related to your card. Answer correctly to earn an extra point!",
      fr: "Après la soumission des cartes, vous répondrez à une question bonus liée à votre carte. Répondez correctement pour gagner un point supplémentaire!",
    },
    imageSrc: "/IMAGE6.png",
  },
  {
    title: { en: "Practice Round Simulation", fr: "Simulation de manche d'entraînement" },
    description: {
      en: "Now you’ll simulate one full round. A fake scenario appears, teams enter fake card IDs, answer fake bonus questions, and a winner is declared.",
      fr: "Maintenant, vous allez simuler une manche complète. Un faux scénario apparaît, les équipes saisissent des fausses cartes, répondent aux questions bonus et un vainqueur est annoncé.",
    },
  },
  {
    title: { en: "End of Walkthrough", fr: "Fin de la démonstration" },
    description: {
      en: "That's it for the practice run! Click 'Start Real Game' to begin playing.",
      fr: "C'est tout pour la démonstration ! Cliquez sur 'Commencer le jeu' pour débuter la partie réelle.",
    },
  },
];

// -----------------------------------------------------------------------------
// Fake Simulation Data for One Round
// -----------------------------------------------------------------------------
interface FakeScenario {
  id: number;
  shortHintFr: string;
  shortHintEn: string;
  descFr: string;
  descEn: string;
}

const fakeScenario: FakeScenario = {
  id: 999,
  shortHintFr: "Indice faux : Choisissez bien votre carte !",
  shortHintEn: "Fake Hint: Choose your card wisely!",
  descFr: "Scénario faux : Une petite tempête a renversé un moulin à vent dans la ville.",
  descEn: "Fake Scenario: A small storm has knocked over a windmill in the city.",
};

interface FakeQuestion {
  questionEn: string;
  optionsEn: string[];
  correctEn: string;
  questionFr: string;
  optionsFr: string[];
  correctFr: string;
}

const fakeQuestionTeam1: FakeQuestion = {
  questionEn: "Fake Q1: What is the main effect of this card?",
  optionsEn: ["It repairs damage.", "It makes it worse.", "It does nothing."],
  correctEn: "a",
  questionFr: "Q bidon 1 : Quel est l'effet principal de cette carte ?",
  optionsFr: ["Elle répare les dégâts.", "Elle aggrave la situation.", "Elle ne fait rien."],
  correctFr: "a",
};

const fakeQuestionTeam2: FakeQuestion = {
  questionEn: "Fake Q2: How does this card help the situation?",
  optionsEn: ["By restoring nature.", "By causing more damage.", "By distracting the enemy."],
  correctEn: "a",
  questionFr: "Q bidon 2 : Comment cette carte aide-t-elle la situation ?",
  optionsFr: ["En restaurant la nature.", "En causant plus de dégâts.", "En distrayant l'ennemi."],
  correctFr: "a",
};

// -----------------------------------------------------------------------------
// UI Translations (same as main game)
// -----------------------------------------------------------------------------
const uiTranslations = {
  en: {
    teamXCards: "CARDS",
    // ... (other translations)
  },
  fr: {
    teamXCards: "CARTES",
    // ... (other translations)
  },
};

// -----------------------------------------------------------------------------
// Main RunThrough Content Component (contains your simulation and walkthrough UI)
// -----------------------------------------------------------------------------
function RunThroughContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Language state (English by default)
  const [lang, setLang] = useState<"en" | "fr">("en");

  useEffect(() => {
    const urlLang = searchParams.get("lang") as "en" | "fr" | null;
    if (urlLang) {
      setLang(urlLang);
      localStorage.setItem("selectedLang", urlLang);
    } else {
      const storedLang = localStorage.getItem("selectedLang") as "en" | "fr" | null;
      if (storedLang) setLang(storedLang);
    }
  }, [searchParams]);

  // Walkthrough step state
  const [step, setStep] = useState(0);
  const totalSteps = walkthroughSteps.length;

  // Simulation round state (for step index 6)
  const [simulated, setSimulated] = useState(false);
  const [simulationResult, setSimulationResult] = useState("");

  // Simulation round states
  const [timeLeft, setTimeLeft] = useState(10);
  const [team1Card, setTeam1Card] = useState("");
  const [team2Card, setTeam2Card] = useState("");
  const [cardError, setCardError] = useState("");
  const [showQuestionPhase, setShowQuestionPhase] = useState(false);
  const [team1Answer, setTeam1Answer] = useState("");
  const [team2Answer, setTeam2Answer] = useState("");
  const [team1Confirmed, setTeam1Confirmed] = useState(false);
  const [team2Confirmed, setTeam2Confirmed] = useState(false);
  const [team1AnswerCorrect, setTeam1AnswerCorrect] = useState(false);
  const [team2AnswerCorrect, setTeam2AnswerCorrect] = useState(false);

  // Use fake scenario & questions for simulation
  const scenario = fakeScenario;
  const scenarioDescription = lang === "fr" ? scenario.descFr : scenario.descEn;
  const scenarioHint = lang === "fr" ? scenario.shortHintFr : scenario.shortHintEn;

  const [team1Question] = useState(fakeQuestionTeam1);
  const [team2Question] = useState(fakeQuestionTeam2);

  // Timer countdown for simulation
  useEffect(() => {
    if (!showQuestionPhase && step === 6 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, showQuestionPhase, step]);

  const handleSubmitCards = () => {
    if (timeLeft > 0) {
      setCardError(lang === "fr" ? "Veuillez attendre la fin du minuteur." : "Please wait for the timer to finish.");
      return;
    }
    if (!team1Card.trim() || !team2Card.trim()) {
      setCardError(lang === "fr" ? "Les deux équipes doivent saisir une carte." : "Both teams must enter a card.");
      return;
    }
    setCardError("");
    setShowQuestionPhase(true);
  };

  const handleAnswer = (team: "team1" | "team2", answer: string) => {
    if (team === "team1") setTeam1Answer(answer);
    else setTeam2Answer(answer);
  };

  const confirmAnswer = (team: "team1" | "team2") => {
    if (team === "team1") {
      const correctKey = lang === "fr" ? team1Question.correctFr : team1Question.correctEn;
      const isCorrect = team1Answer === correctKey;
      setTeam1Confirmed(true);
      setTeam1AnswerCorrect(isCorrect);
    } else {
      const correctKey = lang === "fr" ? team2Question.correctFr : team2Question.correctEn;
      const isCorrect = team2Answer === correctKey;
      setTeam2Confirmed(true);
      setTeam2AnswerCorrect(isCorrect);
    }
  };

  useEffect(() => {
    if (showQuestionPhase && team1Confirmed && team2Confirmed && !simulated) {
      setTimeout(() => {
        const rand = Math.random();
        if (rand < 0.45)
          setSimulationResult(lang === "fr" ? "Vainqueur de la manche : ÉQUIPE 1" : "Round Winner: TEAM 1");
        else if (rand < 0.9)
          setSimulationResult(lang === "fr" ? "Vainqueur de la manche : ÉQUIPE 2" : "Round Winner: TEAM 2");
        else
          setSimulationResult(lang === "fr" ? "Égalité !" : "Tie!");
        setSimulated(true);
      }, 2000);
    }
  }, [showQuestionPhase, team1Confirmed, team2Confirmed, lang, simulated]);

  const resetSimulation = () => {
    setTeam1Card("");
    setTeam2Card("");
    setTeam1Answer("");
    setTeam2Answer("");
    setTeam1Confirmed(false);
    setTeam2Confirmed(false);
    setTeam1AnswerCorrect(false);
    setTeam2AnswerCorrect(false);
    setCardError("");
    setTimeLeft(10);
    setShowQuestionPhase(false);
    setSimulated(false);
    setSimulationResult("");
  };

  const handleNext = () => {
    if (step === 6) resetSimulation();
    if (step < totalSteps - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleStartGame = () => {
    router.push("/game");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/bgsimple.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "white",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Language Switch */}
      <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", gap: "0.5rem" }}>
        <button
          onClick={() => {
            setLang("en");
            localStorage.setItem("selectedLang", "en");
          }}
          style={{
            padding: "0.5rem",
            backgroundColor: lang === "en" ? "#10b981" : "#6b7280",
            borderRadius: "0.25rem",
            color: "white",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          EN
        </button>
        <button
          onClick={() => {
            setLang("fr");
            localStorage.setItem("selectedLang", "fr");
          }}
          style={{
            padding: "0.5rem",
            backgroundColor: lang === "fr" ? "#10b981" : "#6b7280",
            borderRadius: "0.25rem",
            color: "white",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          FR
        </button>
      </div>

      {/* Walkthrough Content */}
      <div
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "rgba(31,41,55,0.8)",
          borderRadius: "0.5rem",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          {lang === "fr" ? "Parcours de formation" : "Practice Run"}
        </h1>
        <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>{`Step ${step + 1} of ${totalSteps}`}</h2>

        {walkthroughSteps[step].imageSrc && (
          <img
            src={walkthroughSteps[step].imageSrc}
            alt={walkthroughSteps[step].title[lang]}
            style={{ width: "100%", maxWidth: "400px", borderRadius: "0.5rem", marginBottom: "1rem" }}
          />
        )}

        <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
          {walkthroughSteps[step].title[lang]}
        </h3>
        <p style={{ fontSize: "1rem", marginBottom: "1.5rem" }}>
          {walkthroughSteps[step].description[lang]}
        </p>

        {/* Simulation UI */}
        {step === 6 && (
          <div>
            {/* Fake Scoreboard */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{ backgroundColor: "#ffffff", padding: "0.5rem 1rem", borderRadius: "0.5rem", color: "#1e3a8a" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  {lang === "fr" ? "ÉQUIPE 1" : "TEAM 1"}: 5 {uiTranslations[lang].teamXCards}
                </h2>
              </div>
              <div style={{ backgroundColor: "#ffffff", padding: "0.5rem 1rem", borderRadius: "0.5rem", color: "#1e3a8a" }}>
                <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                  {lang === "fr" ? "ÉQUIPE 2" : "TEAM 2"}: 5 {uiTranslations[lang].teamXCards}
                </h2>
              </div>
            </div>

            {/* Fake Scenario & Hint */}
            {!showQuestionPhase && (
              <>
                <motion.div
                  style={{
                    padding: "1rem",
                    backgroundColor: "rgba(31,41,55,0.8)",
                    borderRadius: "0.5rem",
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                    {lang === "fr" ? "Scénario" : "Scenario"}
                  </h3>
                  <p style={{ fontSize: "0.9rem" }}>{lang === "fr" ? fakeScenario.descFr : fakeScenario.descEn}</p>
                </motion.div>
                <motion.div
                  style={{
                    padding: "1rem",
                    backgroundColor: "rgba(31,41,55,0.8)",
                    borderRadius: "0.5rem",
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.25rem" }}>
                    {lang === "fr" ? "Conseil" : "Hint"}
                  </h4>
                  <p style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
                    {lang === "fr" ? fakeScenario.shortHintFr : fakeScenario.shortHintEn}
                  </p>
                </motion.div>
              </>
            )}

            {/* Card Input */}
            {!showQuestionPhase && (
              <motion.div
                key="cardInputPhase"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "1rem",
                  marginTop: "2rem",
                  textAlign: "center",
                }}
              >
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {lang === "fr" ? "Saisissez vos fausses cartes" : "Enter Your Fake Cards"}
                </h2>
                {cardError && (
                  <div style={{ color: "#f87171", fontWeight: "bold", fontSize: "1rem" }}>
                    {cardError}
                  </div>
                )}
                <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #1e3a8a" }}>
                    <span style={{ color: "#1e3a8a", fontWeight: "bold", marginBottom: "0.5rem" }}>
                      {lang === "fr" ? "ÉQUIPE 1" : "TEAM 1"}
                    </span>
                    <label style={{ color: "#1e3a8a", fontWeight: "bold", marginBottom: "0.25rem" }}>
                      {lang === "fr" ? "ID de la Carte" : "CARD ID"}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === "fr" ? "Ex: FAKE1" : "e.g., FAKE1"}
                      value={team1Card}
                      onChange={(e) => setTeam1Card(e.target.value)}
                      style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #1e3a8a", width: "10rem", outline: "none", color: "#1e3a8a" }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#ffffff", padding: "1rem", borderRadius: "0.5rem", border: "1px solid #1e3a8a" }}>
                    <span style={{ color: "#1e3a8a", fontWeight: "bold", marginBottom: "0.5rem" }}>
                      {lang === "fr" ? "ÉQUIPE 2" : "TEAM 2"}
                    </span>
                    <label style={{ color: "#1e3a8a", fontWeight: "bold", marginBottom: "0.25rem" }}>
                      {lang === "fr" ? "ID de la Carte" : "CARD ID"}
                    </label>
                    <input
                      type="text"
                      placeholder={lang === "fr" ? "Ex: FAKE2" : "e.g., FAKE2"}
                      value={team2Card}
                      onChange={(e) => setTeam2Card(e.target.value)}
                      style={{ padding: "0.5rem", borderRadius: "0.25rem", border: "1px solid #1e3a8a", width: "10rem", outline: "none", color: "#1e3a8a" }}
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmitCards}
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#059669",
                    color: "white",
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {lang === "fr" ? "Valider les cartes" : "Submit Cards"}
                </button>
              </motion.div>
            )}

            {/* Q&A Phase */}
            <AnimatePresence>
              {showQuestionPhase && (
                <motion.div
                  key="questionPhase"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                    marginTop: "2rem",
                    width: "100%",
                    maxWidth: "40rem",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      backgroundColor: team1Confirmed
                        ? team1AnswerCorrect
                          ? "rgba(34,197,94,0.8)"
                          : "rgba(239,68,68,0.8)"
                        : "rgba(31,41,55,0.8)",
                    }}
                  >
                    <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                      {lang === "fr" ? "ÉQUIPE 1" : "TEAM 1"} – {lang === "fr" ? fakeQuestionTeam1.questionFr : fakeQuestionTeam1.questionEn}
                    </h3>
                    <p style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
                      {lang === "fr" ? "Répondez à la question suivante:" : "Answer the following question:"}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                      {(lang === "fr" ? fakeQuestionTeam1.optionsFr : fakeQuestionTeam1.optionsEn).map((option, idx) => {
                        const letter = String.fromCharCode(97 + idx);
                        return (
                          <button
                            key={letter}
                            onClick={() => handleAnswer("team1", letter)}
                            style={{
                              padding: "0.75rem",
                              backgroundColor: "white",
                              color: "#1e3a8a",
                              borderRadius: "9999px",
                              fontWeight: "bold",
                              fontSize: "1rem",
                              border: team1Answer === letter ? "4px solid #1e3a8a" : "none",
                            }}
                          >
                            {letter}) {option}
                          </button>
                        );
                      })}
                    </div>
                    {!team1Confirmed && (
                      <button
                        onClick={() => confirmAnswer("team1")}
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.5rem 1rem",
                          backgroundColor: "#1e3a8a",
                          color: "white",
                          borderRadius: "0.5rem",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {lang === "fr" ? "Confirmer la réponse" : "Confirm Answer"}
                      </button>
                    )}
                    {team1Confirmed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        style={{ marginTop: "0.5rem", fontSize: "1rem", fontWeight: "bold", color: "#ffffff" }}
                      >
                        {team1AnswerCorrect
                          ? (lang === "fr" ? "Correct ! Carte bonus obtenue !" : "Correct! Bonus card earned!")
                          : (lang === "fr" ? "Incorrect. Aucun bonus." : "Incorrect. No bonus awarded.")}
                      </motion.div>
                    )}
                  </div>

                  <div
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      backgroundColor: team2Confirmed
                        ? team2AnswerCorrect
                          ? "rgba(34,197,94,0.8)"
                          : "rgba(239,68,68,0.8)"
                        : "rgba(31,41,55,0.8)",
                    }}
                  >
                    <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                      {lang === "fr" ? "ÉQUIPE 2" : "TEAM 2"} – {lang === "fr" ? fakeQuestionTeam2.questionFr : fakeQuestionTeam2.questionEn}
                    </h3>
                    <p style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
                      {lang === "fr" ? "Répondez à la question suivante:" : "Answer the following question:"}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
                      {(lang === "fr" ? fakeQuestionTeam2.optionsFr : fakeQuestionTeam2.optionsEn).map((option, idx) => {
                        const letter = String.fromCharCode(97 + idx);
                        return (
                          <button
                            key={letter}
                            onClick={() => handleAnswer("team2", letter)}
                            style={{
                              padding: "0.75rem",
                              backgroundColor: "white",
                              color: "#1e3a8a",
                              borderRadius: "9999px",
                              fontWeight: "bold",
                              fontSize: "1rem",
                              border: team2Answer === letter ? "4px solid #1e3a8a" : "none",
                            }}
                          >
                            {letter}) {option}
                          </button>
                        );
                      })}
                    </div>
                    {!team2Confirmed && (
                      <button
                        onClick={() => confirmAnswer("team2")}
                        style={{
                          marginTop: "0.5rem",
                          padding: "0.5rem 1rem",
                          backgroundColor: "#1e3a8a",
                          color: "white",
                          borderRadius: "0.5rem",
                          fontSize: "1rem",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        {lang === "fr" ? "Confirmer la réponse" : "Confirm Answer"}
                      </button>
                    )}
                    {team2Confirmed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        style={{ marginTop: "0.5rem", fontSize: "1rem", fontWeight: "bold", color: "#ffffff" }}
                      >
                        {team2AnswerCorrect
                          ? (lang === "fr" ? "Correct ! Carte bonus obtenue !" : "Correct! Bonus card earned!")
                          : (lang === "fr" ? "Incorrect. Aucun bonus." : "Incorrect. No bonus awarded.")}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {simulationResult && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{ marginTop: "2rem", fontSize: "1.5rem", fontWeight: "bold", textAlign: "center" }}
              >
                {simulationResult}
              </motion.div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem" }}>
          <button
            onClick={handleBack}
            disabled={step === 0}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: step === 0 ? "#6b7280" : "#2563eb",
              color: "white",
              fontSize: "1rem",
              fontWeight: "bold",
              borderRadius: "0.5rem",
              border: "none",
              cursor: step === 0 ? "not-allowed" : "pointer",
            }}
          >
            {lang === "fr" ? "Précédent" : "Back"}
          </button>
          {step < totalSteps - 1 && (
            <button
              onClick={handleNext}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#2563eb",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              {lang === "fr" ? "Suivant" : "Next"}
            </button>
          )}
          {step === totalSteps - 1 && (
            <button
              onClick={handleStartGame}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#10b981",
                color: "white",
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "0.5rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              {lang === "fr" ? "Commencer le Jeu" : "Start Real Game"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Export RunThrough Component Wrapped in Suspense
// -----------------------------------------------------------------------------
export default function RunThrough() {
  return (
    <Suspense fallback={<div style={{ color: "white", padding: "2rem" }}>Loading...</div>}>
      <RunThroughContent />
    </Suspense>
  );
}
