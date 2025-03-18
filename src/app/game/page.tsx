"use client";

/* eslint-disable @next/next/no-img-element */ // Disable Next.js warning for <img>

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";



// UTILITY: Shuffle an array in place
function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

interface ScenarioData {
  id: number;
  shortHintFr: string;
  shortHintEn: string;
  descFr: string;
  descEn: string;
}
// --- NEW RANKING DATA ---
// For each scenario ID, only the cards listed here are valid.
// Ranking order: lower index means higher ranking.
const newScenarioRankings: { [id: number]: string[] } = {
  1: [
    "V78", "T34", "S12", "R89", "U56", "I78", "A12", "Q16", "M12", "A13",
    "R38", "L45", "E23", "G67", "F45", "H89", "J90", "Q67", "P45", "O23",
    "V17", "M78", "K34", "L56", "N90", "Z67", "Y45", "Q90", "R23", "S45",
    "T67", "U89", "V12", "W34", "X56", "Z90", "Y78", "W39", "X61", "T82",
    "U94", "S60", "P78", "G34", "C45", "D67", "E89", "B34", "C56", "D78",
    "F12", "W90", "X23", "K23", "H56", "J12", "A90", "B23", "N34", "O56",
    "M37", "N59", "P93", "G14", "H36", "F91", "E79", "I58", "J80", "K92",
    "C35", "B13", "D57", "O81"
  ],
  2 : [
    "V78", "T34", "S12", "R89", "U56", "W90", "X23", "T82", "V17", "M12",
    "A12", "Q16", "A13", "L45", "I78", "E23", "G67", "F45", "H89", "Z90",
    "Q67", "P45", "J90", "U94", "M78", "K34", "L56", "N90", "Z67", "O23",
    "Y45", "R38", "S60", "Q90", "R23", "S45", "T67", "U89", "V12", "W34",
    "X56", "Y78", "W39", "X61", "M37", "N59", "C45", "G34", "D67", "E89",
    "B34", "C56", "D78", "F12", "K23", "H56", "J12", "A90", "B23", "N34",
    "O56", "P78", "P93", "G14", "H36", "F91", "E79", "I58", "J80", "K92",
    "C35", "B13", "D57", "O81"
  ],
  3 : [
    "L45", "E89", "I78", "V78", "T34", "S12", "R89", "U56", "G67", "E23",
    "F45", "Q16", "A12", "A13", "M12", "Z90", "J90", "Q67", "P45", "O23",
    "V17", "T82", "N90", "K34", "L56", "Z67", "M78", "Y45", "Q90", "R23",
    "S45", "T67", "U89", "V12", "W34", "X56", "Y78", "W39", "X61", "U94",
    "S60", "P78", "G34", "C45", "D67", "B34", "C56", "D78", "E79", "F12",
    "W90", "X23", "K23", "H56", "J12", "A90", "B23", "N34", "O56", "M37",
    "N59", "O81", "P93", "G14", "H36", "F91", "I58", "J80", "K92", "C35",
    "B13", "D57", "R38", "H89"
  ],
  4: [
    "A12", "Q16", "A13", "M12", "S60", "N34", "V17", "O56", "W90", "X23",
    "V78", "T34", "S12", "R89", "U56", "T82", "M78", "K34", "L56", "Z67",
    "N90","Y45", "Q67", "P45", "R23", "Q90", "S45", "T67", "U89", "V12",
    "L45","X56", "Y78", "W34", "Z90", "R38", "E23", "G67", "F45", "H89",
    "E89","G34", "C45", "D67", "B34", "C56", "D78", "F12", "U94", "M37",
    "N59","O23", "I78", "J90", "K23", "H56", "J12", "A90", "B23", "P78",
    "X61","G14", "H36", "F91", "E79", "I58", "W39", "K92", "C35", "D57",
    "O81","P93", "J80", "B13"
  ],
  5 : [
        "V78", "T34", "S12", "R89", "U56", "I78", "E89", "L45", "M12", "Q16",
        "A12", "A13", "R38", "Z90", "Q67", "P45", "J90", "F45", "G67", "E23",
        "H89", "T82", "W90", "X23", "K34", "L56", "Z67", "N90", "M78", "Y45",
        "Q90", "U94", "S60", "W34", "X56", "V17", "Y78", "W39", "X61", "G34",
        "C45", "D67", "B34", "C56", "D78", "F12", "V12", "R23", "S45", "T67",
        "U89", "P78", "N34", "O56", "O23", "M37", "N59", "O81", "P93", "G14",
        "H36", "F91", "E79", "I58", "J80", "K92", "C35", "B13", "D57", "H56",
        "J12", "A90", "B23", "K23"
  ],
  6: [
    "A90", "B23", "L45", "V78", "T34", "S12", "R89", "U56", "E79", "Q67",
    "P45", "J90", "O23", "U94", "M12", "Q16", "A12", "A13", "O56", "Z90",
    "W90", "X23", "N90", "K34", "L56", "Z67", "M78", "Y45", "Q90", "S45",
    "T67", "U89", "V12", "R23", "X56", "Y78", "W34", "T82", "G67", "F45",
    "E23", "H89", "V17", "S60", "R38", "M37", "N59", "O81", "P78", "G34",
    "C45", "D67", "E89", "B34", "C56", "D78", "F12", "W39", "X61", "G14",
    "H36", "F91", "I58", "J80", "K92", "C35", "B13", "D57", "H56", "J12",
    "K23", "P93", "I78", "N34"
  ],
  7 : [
    "W90", "X23", "F12", "G34", "C45", "K23", "D67", "B34", "C56", "D78",
    "E89", "Q67", "T67", "U89", "Y78", "R23", "S45", "X56", "V12", "Y45",
    "O23", "P78", "P45", "M12", "A12", "Q16", "A13", "O56", "S60", "V17",
    "Z90", "L45", "A90", "B23", "I78", "J90", "Q90", "U94", "W34", "T82",
    "F45", "G67", "E23", "H89", "K34", "L56", "N90", "Z67", "M78", "R89",
    "S12", "T34", "U56", "G14", "H36", "H56", "J12", "M37", "N34", "N59",
    "O81", "P93", "F91", "E79", "I58", "J80", "K92", "C35", "B13", "D57",
    "R38", "V78", "X61", "W39"
  ],
  8 : [
    "V78", "M12", "S60", "V17", "A12", "Q16", "A13", "O56", "R23", "U56",
    "W90", "X23", "T34", "S12", "R89", "Y45", "P45", "Q67", "M78", "K34",
    "L56", "Z67", "N90", "Q90", "G67", "E23", "F45", "H89", "Z90", "G34",
    "C45", "D67", "B34", "C56", "D78", "F12", "V12", "P78", "U94", "S45",
    "T67", "U89", "Y78", "X56", "W34", "M37", "N59", "O81", "P93", "I78",
    "T82", "L45", "W39", "X61", "K23", "H56", "J12", "A90", "B23", "G14",
    "H36", "F91", "E79", "I58", "J80", "K92", "C35", "B13", "D57", "R38",
    "J90", "E89", "N34", "O23"
  ],
  9 : [
    "W90", "X23", "F12", "G67", "E23", "F45", "H89", "T82", "Z67", "K34",
    "L56", "N90", "M78", "V12", "Q16", "A12", "A13", "M12", "S60", "Z90",
    "Q67", "U89", "T67", "B34", "C56", "D78", "G34", "C45", "K23", "D67",
    "E89", "U56", "R23", "X61", "T34", "S12", "R89", "W34", "Y78", "Q90",
    "H56", "J12", "M37", "F91", "A90", "B23", "L45", "O23", "N59", "I78",
    "S45", "U94", "V17", "P45", "O56", "P78", "Y45", "V78", "X56", "W39",
    "R38", "Q16", "E79", "I58", "J80", "K92", "C35", "B13", "D57", "O81",
    "P93", "G14", "H36", "N34",
  ],
  10 : [
    "W90", "X23", "U56", "F12", "K34", "L56", "N90", "M78", "Z67", "X56",
    "G67", "E23", "F45", "H89", "T82", "M12", "A12", "Q16", "A13", "O56",
    "V12", "R23", "V17", "S60", "Z90", "U94", "Q67", "P45", "J90", "I78",
    "E89", "B34", "C56", "D78", "G34", "C45", "K23", "D67", "S45", "T67",
    "U89", "Y78", "Q90", "W34", "X61", "R38", "O23", "N59", "M37", "P78",
    "R89", "S12", "T34", "H56", "J12", "A90", "B23", "Y45", "P93", "M78",
    "H36", "E79", "I58", "J80", "K92", "C35", "B13", "D57", "G14", "F91",
    "O81", "N34", "V78", "L45"
  ],
  11 : [
    "R38", "K23", "U89", "E89", "I78", "B34", "C56", "D78", "G34", "C45",
    "D67", "W90", "X23", "F12", "O23", "V78", "S60", "Z90", "Q67", "T67",
    "X56", "Y78", "P93", "R23", "S45", "M12", "A12", "Q16", "A13", "O56",
    "V17", "M78", "K34", "L56", "Z67", "N90", "G67", "E23", "F45", "H89",
    "T82", "W34", "X61", "G14", "Q90", "U94", "V12", "S12", "R89", "T34",
    "U56", "I58", "B13", "N59", "O81", "P45", "M37", "F91", "E79", "H56",
    "J12", "A90", "B23", "N34", "P78", "H36", "D57", "K92", "C35", "P93",
    "J80", "L45", "Y45", "W39"
  ],
  12 : [
    "J90", "P45", "Q67", "O23", "S45", "T34", "S12", "R89", "V78", "U56", 
    "L45", "M12", "A12", "A13", "Q16", "O56", "Y45", "U94", "V12", "Z90", "G67",
    "E23", "F45", "H89", "T82", "W90", "X23", "M78", "K34", "L56", "N90",
    "Z67", "Q90", "R23", "X56", "W34", "X61", "G34", "C45", "K23", "D67",
    "B34", "C56", "D78", "T67", "U89", "R38", "S60", "V17", "Y78", "W39",
    "P78", "E89", "N59", "M37", "F12", "H56", "J12", "A90", "B23", "I78",
    "E79", "I58", "J80", "K92", "C35", "P93", "G14", "H36", "F91", "O81",
    "B13", "D57", "N34"
  ],
  13 : [
    "Z90", "V78", "T34", "S12", "R89", "U56", "A12", "A13", "Q16", "M12",
    "O56", "V17", "S60", "Q67", "P45", "U94", "W90", "X23", "Z67", "K34",
    "L56", "N90", "M78", "Y45", "V12", "R23", "Q90", "S45", "T67", "U89",
    "W34", "X56", "Y78", "T82", "E23", "G67", "F45", "H89", "W39", "X61",
    "P78", "G34", "C45", "K23", "D67", "B34", "C56", "D78", "F12", "I78",
    "L45", "E89", "R38", "N34", "O23", "N59", "M37", "O81", "P93", "E79",
    "G14", "H36", "F91", "I58", "J80", "K92", "C35", "B13", "D57", "J12",
    "A90", "B23", "H56"
  ],
  14 : [
    "H56", "J12", "N34", "A12", "O56", "U56", "W90", "X23", "F12", "T82", "A13",
    "G67", "E23", "F45", "H89", "Z67", "K34", "L56", "N90", "M78", "Q16",
    "M12", "S60", "V17", "Q67", "P45", "Y45", "R23", "T34", "S12", "R89", "J90",
    "U94", "P78", "W34", "X56", "V12", "Z90", "Q90", "I78", "L45", "A90",
    "B23", "C45", "G34", "D67", "B34", "C56", "D78", "T67", "U89", "S45", "K23",
    "N59", "O23", "P93", "E89", "W39", "X61", "V78", "F91", "E79", "I58", "Y78",
    "J80", "K92", "C35", "B13", "D57", "H36", "G14", "M37", "O81",
    "R38"
  ],
  15 : [
    "A12", "Q16", "A13", "M12", "O56", "U94", "V12", "P45", "Q67", "Y45", "V78",
    "W90", "X23", "R23", "J90", "T34", "S12", "R89", "T82", "E23", "G67",
    "F45", "H89", "L45", "Q90", "I78", "E89", "B34", "C56", "D78", "D67",
    "G34", "C45", "M78", "N90", "K34", "L56", "Z67", "U56", "S45", "T67",
    "U89", "W34", "X56", "Y78", "N34", "W39", "X61", "G14", "H56", "J12",
    "A90", "B23", "K23", "F12", "M37", "N59", "F91", "E79", "I58", "J80",
    "K92", "C35", "B13", "D57", "O81", "P93", "H36", "R38", "V17", "S60",
    "P78", "O23", "Z90"
  ],
  16 : [
    "F12", "W90", "X23", "T82", "G67", "E23", "F45", "H89", "Q16", "Z67",
    "K34", "L56", "N90", "M78", "A12", "A13", "M12", "S60", "R23", "U56", "N59",
    "Y78", "Q90", "W34", "X56", "G34", "C45", "K23", "D67", "B34", "C56", "V78",
    "D78", "E89", "T67", "U89", "S45", "R38", "Q67", "P45", "Y45", "O23", "J90",
    "R89", "P78", "O56", "V17", "V12", "U94", "N34", "W39", "X61", "G14", "L45",
    "H36", "F91", "E79", "I58", "J80", "K92", "C35", "B13", "D57", "O81", "J12", "H56", "I78", "M37",
    "P93", "Z90" 
  ],
};


interface CardQuestion {
  questionEn: string;
  optionsEn: string[];
  correctEn: string;
  questionFr: string;
  optionsFr: string[];
  correctFr: string;
}


// --- CARD QUESTIONS (without IDs) ---
const cardQuestions: { [id: string]: {
  questionEn: string;
  optionsEn: string[];
  correctEn: string;
  questionFr: string;
  optionsFr: string[];
  correctFr: string;
} } = {
  "A12-1": {
    questionEn: "Q1: Why are trees important for the air we breathe?",
    optionsEn: [
      "They add more smoke.",
      "They help clean the air by absorbing carbon dioxide.",
      "They make the air smell like candy."
    ],
    correctEn: "b",
    questionFr: "Q1: Pourquoi les arbres sont-ils importants pour l’air qu’on respire?",
    optionsFr: [
      "Ils ajoutent plus de fumée.",
      "Ils aident à purifier l’air en absorbant le dioxyde de carbone.",
      "Ils donnent à l’air une odeur de bonbon."
    ],
    correctFr: "b"
  },
  "A12-2": {
    questionEn: "Q2: How does planting trees help animals?",
    optionsEn: [
      "It creates more deserts for them.",
      "It scares animals away.",
      "It provides habitats for birds and other wildlife."
    ],
    correctEn: "c",
    questionFr: "Q2: Comment planter des arbres aide-t-il les animaux?",
    optionsFr: [
      "Ça crée plus de déserts pour eux.",
      "Ça fait fuir les animaux.",
      "Ça offre des habitats aux oiseaux et à la faune."
    ],
    correctFr: "c"
  },
  "A12-3": {
    questionEn: "Q3: Which of these helps fight climate change?",
    optionsEn: [
      "Cutting trees faster than we plant.",
      "Planting trees to absorb CO₂.",
      "Dumping chemicals on tree roots."
    ],
    correctEn: "b",
    questionFr: "Q3: Laquelle de ces actions aide à combattre les changements climatiques?",
    optionsFr: [
      "Couper les arbres plus vite qu’on ne les plante.",
      "Planter des arbres pour absorber le CO₂.",
      "Déverser des produits chimiques sur les racines."
    ],
    correctFr: "b"
  },
  "A13-1": {
    questionEn: "Q1: What is a reforestation plan mainly about?",
    optionsEn: [
      "Removing all trees from a forest.",
      "Planting new trees to replace lost ones.",
      "Burning the leaves for energy."
    ],
    correctEn: "b",
    questionFr: "Q1: Quel est le but principal d’un plan de reforestation?",
    optionsFr: [
      "Enlever tous les arbres d’une forêt.",
      "Planter de nouveaux arbres pour remplacer ceux perdus.",
      "Brûler les feuilles pour en faire de l’énergie."
    ],
    correctFr: "b"
  },
  "A13-2": {
    questionEn: "Q2: How does reforestation help local communities?",
    optionsEn: [
      "By making the land completely unusable.",
      "By restoring forests that can protect water and soil.",
      "By building giant malls in the forest."
    ],
    correctEn: "b",
    questionFr: "Q2: Comment la reforestation aide-t-elle les communautés locales?",
    optionsFr: [
      "En rendant la terre complètement inutilisable.",
      "En restaurant des forêts qui protègent l’eau et le sol.",
      "En construisant de grands centres commerciaux dans la forêt."
    ],
    correctFr: "b"
  },
  "A13-3": {
    questionEn: "Q3: Which is a benefit of reforestation for wildlife?",
    optionsEn: [
      "It destroys animal homes.",
      "It provides new habitats for species.",
      "It replaces trees with parking lots."
    ],
    correctEn: "b",
    questionFr: "Q3: Quel est l’avantage de la reforestation pour la faune?",
    optionsFr: [
      "Elle détruit le domicile des animaux.",
      "Elle offre de nouveaux habitats aux espèces.",
      "Elle remplace les arbres par des stationnements."
    ],
    correctFr: "b"
  },
  "A90-1": {
    questionEn: "Q1: Why is taking a short shower good for the environment?",
    optionsEn: [
      "It wastes more water.",
      "It saves water, especially in droughts.",
      "It makes the bathroom dirtier."
    ],
    correctEn: "b",
    questionFr: "Q1: Pourquoi prendre une courte douche est-il bon pour l’environnement?",
    optionsFr: [
      "Ça gaspille plus d’eau.",
      "Ça économise l’eau, surtout en période de sécheresse.",
      "Ça rend la salle de bain plus sale."
    ],
    correctFr: "b"
  },
  "A90-2": {
    questionEn: "Q2: How can shorter showers help communities?",
    optionsEn: [
      "They ensure no one else can use water.",
      "They leave more water in rivers and reservoirs.",
      "They make everyone shower less often."
    ],
    correctEn: "b",
    questionFr: "Q2: Comment des douches plus courtes peuvent-elles aider les communautés?",
    optionsFr: [
      "Elles empêchent les autres d’utiliser l’eau.",
      "Elles laissent plus d’eau dans les rivières et les réservoirs.",
      "Elles obligent tout le monde à se doucher moins souvent."
    ],
    correctFr: "b"
  },
  "A90-3": {
    questionEn: "Q3: What is one tip for taking shorter showers?",
    optionsEn: [
      "Keep the water running all day.",
      "Use a timer or music track to limit shower time.",
      "Wait until the tub overflows."
    ],
    correctEn: "b",
    questionFr: "Q3: Quel est un conseil pour prendre des douches plus courtes?",
    optionsFr: [
      "Laisser l’eau couler toute la journée.",
      "Utiliser un minuteur ou une chanson pour limiter la durée.",
      "Attendre que la baignoire déborde."
    ],
    correctFr: "b"
  },
  "B13-1": {
    questionEn: "Q1: What happens during mass deforestation?",
    optionsEn: [
      "Trees are cut down faster than they can grow back.",
      "We plant more trees than ever.",
      "Forests become bigger and healthier."
    ],
    correctEn: "a",
    questionFr: "Q1: Que se passe-t-il lors de la déforestation massive?",
    optionsFr: [
      "On coupe les arbres plus vite qu’ils ne repoussent.",
      "On plante plus d’arbres que jamais.",
      "Les forêts deviennent plus grandes et plus saines."
    ],
    correctFr: "a"
  },
  "B13-2": {
    questionEn: "Q2: Why is mass deforestation harmful to animals?",
    optionsEn: [
      "It offers them more housing choices.",
      "It destroys their habitats, leaving them homeless.",
      "It creates more food for them."
    ],
    correctEn: "b",
    questionFr: "Q2: Pourquoi la déforestation massive nuit-elle aux animaux?",
    optionsFr: [
      "Elle leur offre plus de choix de logement.",
      "Elle détruit leurs habitats, les laissant sans abri.",
      "Elle crée plus de nourriture pour eux."
    ],
    correctFr: "b"
  },
  "B13-3": {
    questionEn: "Q3: How does mass deforestation affect climate change?",
    optionsEn: [
      "It helps absorb more CO₂ from the air.",
      "It has no impact at all.",
      "It increases CO₂ in the atmosphere by removing trees."
    ],
    correctEn: "c",
    questionFr: "Q3: Comment la déforestation massive affecte-t-elle les changements climatiques?",
    optionsFr: [
      "Elle aide à absorber plus de CO₂ dans l’air.",
      "Elle n’a aucun impact.",
      "Elle augmente le CO₂ dans l’atmosphère en supprimant les arbres."
    ],
    correctFr: "c"
  },
    "B23-1": {
      "questionEn": "Q1: Why should we turn off the tap when not in use?",
      "optionsEn": [
        "To let water run freely.",
        "To save water from going to waste.",
        "To flood the bathroom."
      ],
      "correctEn": "b",
      "questionFr": "Q1: Pourquoi devrait-on fermer le robinet lorsqu’on ne l’utilise pas?",
      "optionsFr": [
        "Pour laisser l’eau couler librement.",
        "Pour empêcher le gaspillage de l’eau.",
        "Pour inonder la salle de bain."
      ],
      "correctFr": "b"
    },
    "B23-2": {
      "questionEn": "Q2: How does turning off the tap help rivers and lakes?",
      "optionsEn": [
        "It drains them faster.",
        "It keeps more water in nature instead of wasting it.",
        "It adds soap to the ecosystem."
      ],
      "correctEn": "b",
      "questionFr": "Q2: Comment fermer le robinet aide-t-il les rivières et les lacs?",
      "optionsFr": [
        "Ça les vide plus vite.",
        "Ça garde plus d’eau dans la nature au lieu de la gaspiller.",
        "Ça ajoute du savon à l’écosystème."
      ],
      "correctFr": "b"
    },
    "B23-3": {
      "questionEn": "Q3: Which everyday activity can we do without leaving the tap on?",
      "optionsEn": [
        "Brushing teeth.",
        "Watering the entire lawn indoors.",
        "Filling a pool in the kitchen."
      ],
      "correctEn": "a",
      "questionFr": "Q3: Quelle activité quotidienne peut-on faire sans laisser couler le robinet?",
      "optionsFr": [
        "Se brosser les dents.",
        "Arroser toute la pelouse à l’intérieur.",
        "Remplir une piscine dans la cuisine."
      ],
      "correctFr": "a"
    },
    "B34-1": {
      "questionEn": "Q1: Why is recycling 10 tons of waste helpful?",
      "optionsEn": [
        "It creates more garbage in landfills.",
        "It reduces resource use and pollution.",
        "It only helps big factories."
      ],
      "correctEn": "b",
      "questionFr": "Q1: Pourquoi recycler 10 tonnes de déchets est-il utile?",
      "optionsFr": [
        "Ça crée plus de déchets dans les décharges.",
        "Ça réduit la consommation de ressources et la pollution.",
        "Ça aide seulement les grandes usines."
      ],
      "correctFr": "b"
    },
    "B34-2": {
      "questionEn": "Q2: How does recycling protect wildlife?",
      "optionsEn": [
        "It puts more trash in forests.",
        "It keeps plastics out of animal habitats.",
        "It increases water pollution."
      ],
      "correctEn": "b",
      "questionFr": "Q2: Comment le recyclage protège-t-il la faune?",
      "optionsFr": [
        "Il dépose plus de déchets dans les forêts.",
        "Il empêche les plastiques de polluer les habitats des animaux.",
        "Il augmente la pollution de l’eau."
      ],
      "correctFr": "b"
    },
    "B34-3": {
      "questionEn": "Q3: What should you do before recycling a plastic container?",
      "optionsEn": [
        "Throw it out without rinsing.",
        "Rinse it so it’s easier to recycle.",
        "Burn it first."
      ],
      "correctEn": "b",
      "questionFr": "Q3: Que faut-il faire avant de recycler un contenant en plastique?",
      "optionsFr": [
        "Le jeter sans le rincer.",
        "Le rincer pour faciliter le recyclage.",
        "Le brûler d’abord."
      ],
      "correctFr": "b"
    },  
      "C35-1": {
        "questionEn": "Q1: What does 'excessive plastic use' mean?",
        "optionsEn": [
          "Using single-use plastics constantly without recycling.",
          "Always using reusable containers.",
          "Making plastic last a long time."
        ],
        "correctEn": "a",
        "questionFr": "Q1: Que veut dire « utilisation excessive de plastique »?",
        "optionsFr": [
          "Employer souvent des plastiques à usage unique sans recycler.",
          "Utiliser toujours des contenants réutilisables.",
          "Faire durer le plastique très longtemps."
        ],
        "correctFr": "a"
      },
      "C35-2": {
        "questionEn": "Q2: How does excessive plastic harm oceans?",
        "optionsEn": [
          "It dissolves safely.",
          "It pollutes the water and hurts marine life.",
          "It provides extra food for fish."
        ],
        "correctEn": "b",
        "questionFr": "Q2: Comment l’utilisation excessive de plastique nuit-elle aux océans?",
        "optionsFr": [
          "Elle se dissout sans danger.",
          "Elle pollue l’eau et blesse la vie marine.",
          "Elle fournit plus de nourriture aux poissons."
        ],
        "correctFr": "b"
      },
      "C35-3": {
        "questionEn": "Q3: What is a better alternative to single-use plastic?",
        "optionsEn": [
          "Reusable bags and containers.",
          "Using plastic once, then burning it.",
          "Throwing plastic in the forest."
        ],
        "correctEn": "a",
        "questionFr": "Q3: Quelle est une meilleure alternative au plastique à usage unique?",
        "optionsFr": [
          "Des sacs et contenants réutilisables.",
          "Utiliser le plastique une fois, puis le brûler.",
          "Jeter le plastique dans la forêt."
        ],
        "correctFr": "a"
      },
      "C45-1": {
        "questionEn": "Q1: Why use a reusable water bottle?",
        "optionsEn": [
          "To create more plastic waste.",
          "To reduce plastic pollution and save resources.",
          "To throw it away after one use."
        ],
        "correctEn": "b",
        "questionFr": "Q1: Pourquoi utiliser une bouteille d’eau réutilisable?",
        "optionsFr": [
          "Pour créer plus de déchets plastiques.",
          "Pour réduire la pollution plastique et économiser des ressources.",
          "Pour la jeter après une seule utilisation."
        ],
        "correctFr": "b"
      },
      "C45-2": {
        "questionEn": "Q2: What’s one advantage of reusable bottles for wildlife?",
        "optionsEn": [
          "They increase trash in habitats.",
          "They keep plastic out of oceans and forests.",
          "They make animals thirsty."
        ],
        "correctEn": "b",
        "questionFr": "Q2: Quel est l’avantage des bouteilles réutilisables pour la faune?",
        "optionsFr": [
          "Elles augmentent les déchets dans les habitats.",
          "Elles évitent que le plastique se retrouve dans les océans et les forêts.",
          "Elles donnent soif aux animaux."
        ],
        "correctFr": "b"
      },
      "C45-3": {
        "questionEn": "Q3: How can you keep a reusable bottle clean?",
        "optionsEn": [
          "Never wash it.",
          "Wash it regularly with soap and water.",
          "Soak it in soda overnight."
        ],
        "correctEn": "b",
        "questionFr": "Q3: Comment garder une bouteille réutilisable propre?",
        "optionsFr": [
          "Ne jamais la laver.",
          "La laver régulièrement avec du savon et de l’eau.",
          "La faire tremper dans du soda toute la nuit."
        ],
        "correctFr": "b"
      },
      "C56-1": {
        "questionEn": "Q1: What is the main advantage of recycling 100 tons of waste?",
        "optionsEn": [
          "It pollutes more lakes.",
          "It saves a lot of resources on a bigger scale.",
          "It only affects one small bin."
        ],
        "correctEn": "b",
        "questionFr": "Q1: Quel est l’avantage principal de recycler 100 tonnes de déchets?",
        "optionsFr": [
          "Ça pollue plus de lacs.",
          "Ça économise beaucoup de ressources à plus grande échelle.",
          "Ça ne touche qu’une petite poubelle."
        ],
        "correctFr": "b"
      },
      "C56-2": {
        "questionEn": "Q2: How does large-scale recycling help communities?",
        "optionsEn": [
          "By piling up trash in neighborhoods.",
          "By creating new products from old materials.",
          "By stopping all recycling programs."
        ],
        "correctEn": "b",
        "questionFr": "Q2: Comment le recyclage à grande échelle aide-t-il les communautés?",
        "optionsFr": [
          "En empilant les ordures dans les quartiers.",
          "En créant de nouveaux produits à partir de vieux matériaux.",
          "En stoppant tous les programmes de recyclage."
        ],
        "correctFr": "b"
      },
      "C56-3": {
        "questionEn": "Q3: Which of these best describes the goal of recycling 100 tons?",
        "optionsEn": [
          "To increase landfill size.",
          "To reduce waste and promote circular economy.",
          "To bury everything in the forest."
        ],
        "correctEn": "b",
        "questionFr": "Q3: Quelle phrase décrit le mieux l’objectif de recycler 100 tonnes?",
        "optionsFr": [
          "Agrandir la taille des décharges.",
          "Réduire les déchets et promouvoir l’économie circulaire.",
          "Tout enfouir dans la forêt."
        ],
        "correctFr": "b"
      },    
  "D57-1": {
    questionEn: "Q1: What is meant by 'food waste'?",
    optionsEn: [
      "Eating all your meals.",
      "Throwing away edible food instead of using it.",
      "Donating food to shelters."
    ],
    correctEn: "b",
    questionFr: "Q1: Qu’entend-on par « gaspillage alimentaire »?",
    optionsFr: [
      "Manger tous ses repas.",
      "Jeter de la nourriture comestible au lieu de l’utiliser.",
      "Faire un don de nourriture aux refuges."
    ],
    correctFr: "b"
  },
  "D57-2": {
    questionEn: "Q2: How does wasting food affect the environment?",
    optionsEn: [
      "It reduces trash in landfills.",
      "It increases greenhouse gases and resource use.",
      "It doesn’t affect anything."
    ],
    correctEn: "b",
    questionFr: "Q2: Comment le gaspillage alimentaire affecte-t-il l’environnement?",
    optionsFr: [
      "Il réduit les déchets dans les décharges.",
      "Il augmente les gaz à effet de serre et l’utilisation des ressources.",
      "Il n’a aucune conséquence."
    ],
    correctFr: "b"
  },
  "D57-3": {
    questionEn: "Q3: What’s a simple way to reduce food waste at home?",
    optionsEn: [
      "Buy more than we can eat.",
      "Plan meals and use leftovers.",
      "Keep the fridge empty so we never cook."
    ],
    correctEn: "b",
    questionFr: "Q3: Quelle est une façon simple de réduire le gaspillage alimentaire à la maison?",
    optionsFr: [
      "Acheter plus de nourriture qu’on peut consommer.",
      "Planifier les repas et réutiliser les restes.",
      "Garder le frigo vide pour ne jamais cuisiner."
    ],
    correctFr: "b"
  },
  "D67-1": {
    questionEn: "Q1: Why should we use less paper?",
    optionsEn: [
      "To cut down more trees.",
      "To help save forests and reduce waste.",
      "So we can have fewer books."
    ],
    correctEn: "b",
    questionFr: "Q1: Pourquoi devrait-on réduire l’utilisation de papier?",
    optionsFr: [
      "Pour couper plus d’arbres.",
      "Pour aider à sauvegarder les forêts et réduire les déchets.",
      "Pour avoir moins de livres."
    ],
    correctFr: "b"
  },
  "D67-2": {
    questionEn: "Q2: Which of these helps reduce paper usage at home?",
    optionsEn: [
      "Printing every email.",
      "Using cloth towels instead of paper towels.",
      "Buying only paper plates."
    ],
    correctEn: "b",
    questionFr: "Q2: Laquelle de ces actions aide à réduire la consommation de papier à la maison?",
    optionsFr: [
      "Imprimer chaque courriel.",
      "Utiliser des serviettes en tissu au lieu de papier.",
      "Acheter seulement des assiettes en papier."
    ],
    correctFr: "b"
  },
  "D67-3": {
    questionEn: "Q3: How does reducing paper usage protect wildlife?",
    optionsEn: [
      "It encourages cutting more forests.",
      "It leaves more trees standing for animal habitats.",
      "It sends animals to the zoo."
    ],
    correctEn: "b",
    questionFr: "Q3: Comment réduire l’utilisation de papier protège-t-il la faune?",
    optionsFr: [
      "Ça encourage à couper plus de forêts.",
      "Ça garde plus d’arbres pour les habitats d’animaux.",
      "Ça envoie les animaux au zoo."
    ],
    correctFr: "b"
  },
    "D78-1": {
      "questionEn": "Q1: What does recycling 1000 tons of waste mean?",
      "optionsEn": [
        "Cleaning a small office bin.",
        "Preventing a large amount of trash from going to landfills.",
        "Making a giant trash mountain."
      ],
      "correctEn": "b",
      "questionFr": "Q1: Que signifie recycler 1000 tonnes de déchets?",
      "optionsFr": [
        "Nettoyer une petite poubelle de bureau.",
        "Empêcher une grande quantité de déchets d’aller à l’enfouissement.",
        "Construire une énorme montagne d’ordures."
      ],
      "correctFr": "b"
    },
    "D78-2": {
      "questionEn": "Q2: How does large-scale recycling help the planet?",
      "optionsEn": [
        "By increasing the use of raw materials.",
        "By reducing pollution and saving resources.",
        "By removing jobs from communities."
      ],
      "correctEn": "b",
      "questionFr": "Q2: Comment le recyclage à grande échelle aide-t-il la planète?",
      "optionsFr": [
        "En augmentant l’utilisation de matières premières.",
        "En réduisant la pollution et en économisant des ressources.",
        "En supprimant des emplois dans les communautés."
      ],
      "correctFr": "b"
    },
    "D78-3": {
      "questionEn": "Q3: What is one way to support 1000-ton recycling programs?",
      "optionsEn": [
        "Never separate your trash.",
        "Sort and rinse recyclables properly.",
        "Burn all your plastic."
      ],
      "correctEn": "b",
      "questionFr": "Q3: Quelle est une façon de soutenir les programmes de recyclage de 1000 tonnes?",
      "optionsFr": [
        "Ne jamais trier ses déchets.",
        "Bien trier et rincer les matières recyclables.",
        "Brûler tout son plastique."
      ],
      "correctFr": "b"
    },
    "E23-1": {
      "questionEn": "Q1: What is the main benefit of a wind turbine?",
      "optionsEn": [
        "It uses fossil fuels.",
        "It generates clean, renewable energy.",
        "It only works on sunny days."
      ],
      "correctEn": "b",
      "questionFr": "Q1: Quel est l’avantage principal d’une éolienne?",
      "optionsFr": [
        "Elle utilise des combustibles fossiles.",
        "Elle produit de l’énergie propre et renouvelable.",
        "Elle ne fonctionne que les jours ensoleillés."
      ],
      "correctFr": "b"
    },
    "E23-2": {
      "questionEn": "Q2: How do wind turbines help reduce pollution?",
      "optionsEn": [
        "They add smoke to the atmosphere.",
        "They spin to clean the air physically.",
        "They replace power from coal or gas plants."
      ],
      "correctEn": "c",
      "questionFr": "Q2: Comment les éoliennes aident-elles à réduire la pollution?",
      "optionsFr": [
        "Elles ajoutent de la fumée dans l’atmosphère.",
        "Elles tournent pour nettoyer l’air physiquement.",
        "Elles remplacent l’électricité produite par le charbon ou le gaz."
      ],
      "correctFr": "c"
    },
    "E23-3": {
      "questionEn": "Q3: Where are wind turbines often installed?",
      "optionsEn": [
        "In deep caves underground.",
        "In windy areas like open plains or offshore.",
        "Inside busy city streets."
      ],
      "correctEn": "b",
      "questionFr": "Q3: Où installe-t-on souvent les éoliennes?",
      "optionsFr": [
        "Dans des grottes souterraines profondes.",
        "Dans des régions venteuses comme les plaines ou en mer.",
        "Au milieu des rues de la ville."
      ],
      "correctFr": "b"
    },
    "F12-1": {
      "questionEn": "Q1: What is a carbon tax?",
      "optionsEn": [
        "A tax on oxygen.",
        "A fee companies pay for producing greenhouse gases.",
        "A special discount for polluting more."
      ],
      "correctEn": "b",
      "questionFr": "Q1: Qu’est-ce qu’une taxe carbone?",
      "optionsFr": [
        "Une taxe sur l’oxygène.",
        "Des frais que les entreprises paient pour leurs émissions de gaz à effet de serre.",
        "Un rabais spécial pour polluer davantage."
      ],
      "correctFr": "b"
    },
    "F12-2": {
      "questionEn": "Q2: How does a carbon tax reduce pollution?",
      "optionsEn": [
        "By rewarding companies for burning more fuel.",
        "By encouraging firms to cut emissions to save money.",
        "By banning all factories."
      ],
      "correctEn": "b",
      "questionFr": "Q2: Comment une taxe carbone réduit-elle la pollution?",
      "optionsFr": [
        "En récompensant les entreprises qui brûlent plus de carburant.",
        "En encourageant les entreprises à réduire leurs émissions pour économiser de l’argent.",
        "En interdisant toutes les usines."
      ],
      "correctFr": "b"
    },
    "F12-3": {
      "questionEn": "Q3: Who usually decides on carbon tax rules?",
      "optionsEn": [
        "Movie directors.",
        "Governments or lawmakers.",
        "Only children at school."
      ],
      "correctEn": "b",
      "questionFr": "Q3: Qui décide habituellement des règles sur la taxe carbone?",
      "optionsFr": [
        "Les réalisateurs de films.",
        "Les gouvernements ou les législateurs.",
        "Seulement les enfants à l’école."
      ],
      "correctFr": "b"
    },
    "F45-1": {
      "questionEn": "Q1: What is hydropower?",
      "optionsEn": [
        "Energy made by burning water.",
        "Electricity from the movement of water (rivers, dams).",
        "A battery that doesn’t need water."
      ],
      "correctEn": "b",
      "questionFr": "Q1: Qu’est-ce que l’énergie hydraulique?",
      "optionsFr": [
        "De l’énergie produite en brûlant de l’eau.",
        "De l’électricité issue du mouvement de l’eau (rivières, barrages).",
        "Une batterie qui n’a pas besoin d’eau."
      ],
      "correctFr": "b"
    },
    "F45-2": {
      "questionEn": "Q2: Why is hydropower considered clean energy?",
      "optionsEn": [
        "It releases a lot of harmful smoke.",
        "It uses the natural flow of water without burning fuel.",
        "It only works when it’s snowing."
      ],
      "correctEn": "b",
      "questionFr": "Q2: Pourquoi l’énergie hydraulique est-elle considérée comme une énergie propre?",
      "optionsFr": [
        "Elle libère beaucoup de fumée nocive.",
        "Elle utilise l’écoulement naturel de l’eau sans brûler de carburant.",
        "Elle ne fonctionne que quand il neige."
      ],
      "correctFr": "b"
    },
    "F45-3": {
      "questionEn": "Q3: What is a possible downside of hydropower?",
      "optionsEn": [
        "It never produces electricity.",
        "Building dams can disrupt fish habitats.",
        "It always pollutes more than coal plants."
      ],
      "correctEn": "b",
      "questionFr": "Q3: Quel est un inconvénient possible de l’énergie hydraulique?",
      "optionsFr": [
        "Elle ne produit jamais d’électricité.",
        "La construction de barrages peut perturber les habitats des poissons.",
        "Elle pollue toujours plus que les centrales au charbon."
      ],
      "correctFr": "b"
    },
      "E89-1": {
        "questionEn": "Q1: What is a deposit waste system?",
        "optionsEn": [
          "A program where you pay extra for items, but get money back when you return them.",
          "A secret place to hide garbage.",
          "A tax for throwing away all trash."
        ],
        "correctEn": "a",
        "questionFr": "Q1: Qu’est-ce qu’un système de consigne pour les déchets?",
        "optionsFr": [
          "Un programme où on paie un supplément pour des articles et on est remboursé quand on les retourne.",
          "Un endroit secret pour cacher les ordures.",
          "Une taxe pour jeter tous les déchets."
        ],
        "correctFr": "a"
      },
      "E89-2": {
        "questionEn": "Q2: How does a waste deposit system encourage recycling?",
        "optionsEn": [
          "People earn refunds by returning cans and bottles.",
          "People get fined for reusing items.",
          "It makes recycling illegal."
        ],
        "correctEn": "a",
        "questionFr": "Q2: Comment un système de consigne encourage-t-il le recyclage?",
        "optionsFr": [
          "Les gens reçoivent un remboursement en retournant les canettes et bouteilles.",
          "Les gens sont pénalisés pour réutiliser des articles.",
          "Il rend le recyclage illégal."
        ],
        "correctFr": "a"
      },
      "E89-3": {
        "questionEn": "Q3: Which item is often part of a deposit system?",
        "optionsEn": [
          "Plastic wrap.",
          "Aluminum cans and glass bottles.",
          "Cardboard boxes only."
        ],
        "correctEn": "b",
        "questionFr": "Q3: Quel article fait souvent partie d’un système de consigne?",
        "optionsFr": [
          "La pellicule plastique.",
          "Les canettes en aluminium et les bouteilles en verre.",
          "Uniquement les boîtes en carton."
        ],
        "correctFr": "b"
      },    
      "F91-1": {
        "questionEn": "Q1: What does 'prioritizing individual cars' mean?",
        "optionsEn": [
          "Using public transport or carpooling.",
          "Encouraging everyone to drive alone.",
          "Walking or biking instead of driving."
        ],
        "correctEn": "b",
        "questionFr": "Q1: Que veut dire « privilégier la voiture individuelle »?",
        "optionsFr": [
          "Utiliser les transports en commun ou le covoiturage.",
          "Encourager tout le monde à conduire seul.",
          "Marcher ou faire du vélo au lieu de conduire."
        ],
        "correctFr": "b"
      },
      "F91-2": {
        "questionEn": "Q2: How does relying on individual cars affect pollution?",
        "optionsEn": [
          "It reduces traffic and emissions.",
          "It increases greenhouse gas emissions and traffic jams.",
          "It has no effect on the environment."
        ],
        "correctEn": "b",
        "questionFr": "Q2: Comment le fait de dépendre de la voiture individuelle affecte-t-il la pollution?",
        "optionsFr": [
          "Cela réduit la circulation et les émissions.",
          "Cela augmente les gaz à effet de serre et les embouteillages.",
          "Cela n’a aucun effet sur l’environnement."
        ],
        "correctFr": "b"
      },
      "F91-3": {
        "questionEn": "Q3: What is one alternative to driving alone?",
        "optionsEn": [
          "Taking the bus or train.",
          "Buying more cars.",
          "Idling in the driveway for fun."
        ],
        "correctEn": "a",
        "questionFr": "Q3: Quelle est une alternative au fait de conduire seul?",
        "optionsFr": [
          "Prendre l’autobus ou le train.",
          "Acheter plus de voitures.",
          "Laisser tourner le moteur dans l’entrée pour s’amuser."
        ],
        "correctFr": "a"
      },    
    "E79-1": {
      "questionEn": "Q1: What is overconsumption of water?",
      "optionsEn": [
        "Using just enough water.",
        "Using much more water than necessary.",
        "Letting rivers flow naturally."
      ],
      "correctEn": "b",
      "questionFr": "Q1: Qu’est-ce que la surconsommation d’eau?",
      "optionsFr": [
        "Utiliser juste assez d’eau.",
        "Utiliser beaucoup plus d’eau que nécessaire.",
        "Laisser les rivières couler naturellement."
      ],
      "correctFr": "b"
    },
    "E79-2": {
      "questionEn": "Q2: Why is overconsumption of water harmful in a drought?",
      "optionsEn": [
        "It leaves more water for everyone.",
        "It makes water shortages worse.",
        "It has no effect at all."
      ],
      "correctEn": "b",
      "questionFr": "Q2: Pourquoi la surconsommation d’eau est-elle nuisible en période de sécheresse?",
      "optionsFr": [
        "Elle laisse plus d’eau pour tout le monde.",
        "Elle aggrave le manque d’eau.",
        "Elle n’a aucun effet."
      ],
      "correctFr": "b"
    },
    "E79-3": {
      "questionEn": "Q3: How can we reduce overconsumption of water at home?",
      "optionsEn": [
        "Take extremely long showers.",
        "Fix leaks and turn off taps when not in use.",
        "Water the lawn during heavy rain."
      ],
      "correctEn": "b",
      "questionFr": "Q3: Comment peut-on réduire la surconsommation d’eau à la maison?",
      "optionsFr": [
        "Prendre des douches très longues.",
        "Réparer les fuites et fermer les robinets quand on ne les utilise pas.",
        "Arroser la pelouse quand il pleut beaucoup."
      ],
      "correctFr": "b"
    },  
  "G14-1": {
    questionEn: "Q1: What does leaving lights on unnecessarily mean?",
    optionsEn: [
      "Turning them off when not needed.",
      "Keeping lights on even if no one is in the room.",
      "Using special motion sensors to save energy."
    ],
    correctEn: "b",
    questionFr: "Q1: Que signifie laisser les lumières allumées inutilement?",
    optionsFr: [
      "Les éteindre quand on n’en a pas besoin.",
      "Les garder allumées même si personne n’est dans la pièce.",
      "Utiliser des détecteurs de mouvement pour économiser l’énergie."
    ],
    correctFr: "b"
  },
  "G14-2": {
    questionEn: "Q2: How does leaving lights on waste resources?",
    optionsEn: [
      "It creates more rainbows outside.",
      "It uses electricity from power plants, increasing pollution.",
      "It stores energy for later."
    ],
    correctEn: "b",
    questionFr: "Q2: Comment le fait de laisser les lumières allumées gaspille-t-il des ressources?",
    optionsFr: [
      "Ça crée plus d’arcs-en-ciel dehors.",
      "Ça utilise de l’électricité provenant de centrales, ce qui augmente la pollution.",
      "Ça stocke l’énergie pour plus tard."
    ],
    correctFr: "b"
  },
  "G14-3": {
    questionEn: "Q3: What’s an easy way to stop wasting light energy?",
    optionsEn: [
      "Turn off lights when leaving a room.",
      "Keep them on 24/7.",
      "Buy extra lamps for no reason."
    ],
    correctEn: "a",
    questionFr: "Q3: Quelle est une façon simple d’arrêter de gaspiller l’énergie lumineuse?",
    optionsFr: [
      "Éteindre les lumières en quittant la pièce.",
      "Les laisser allumées 24 heures sur 24.",
      "Acheter des lampes supplémentaires sans raison."
    ],
    correctFr: "a"
  },
  "G34-1": {
    questionEn: "Q1: Why use a reusable bag instead of a single-use plastic bag?",
    optionsEn: [
      "It helps reduce plastic waste.",
      "It makes more trash in landfills.",
      "It only holds one item."
    ],
    correctEn: "a",
    questionFr: "Q1: Pourquoi utiliser un sac réutilisable au lieu d’un sac plastique jetable?",
    optionsFr: [
      "Ça aide à réduire les déchets plastiques.",
      "Ça produit plus de déchets dans les décharges.",
      "Il ne peut contenir qu’un seul objet."
    ],
    correctFr: "a"
  },
  "G34-2": {
    questionEn: "Q2: How does a reusable bag help marine animals?",
    optionsEn: [
      "By floating on the ocean.",
      "By preventing plastic from ending up in waterways.",
      "By feeding fish with plastic pieces."
    ],
    correctEn: "b",
    questionFr: "Q2: Comment un sac réutilisable aide-t-il les animaux marins?",
    optionsFr: [
      "En flottant dans l’océan.",
      "En empêchant le plastique de se retrouver dans les cours d’eau.",
      "En nourrissant les poissons avec des morceaux de plastique."
    ],
    correctFr: "b"
  },
  "G34-3": {
    questionEn: "Q3: What’s a simple habit to remember your reusable bag?",
    optionsEn: [
      "Always leave it at home.",
      "Keep it in your car or near the door.",
      "Throw it in the garbage."
    ],
    correctEn: "b",
    questionFr: "Q3: Quelle habitude simple permet de ne pas oublier son sac réutilisable?",
    optionsFr: [
      "Toujours le laisser à la maison.",
      "Le garder dans la voiture ou près de la porte.",
      "Le jeter à la poubelle."
    ],
    correctFr: "b"
  },

  "L45-1": {
    questionEn: "Q1: Why collect rainwater in a bin?",
    optionsEn: [
      "To let it overflow and flood your yard.",
      "To store water for watering plants, reducing tap water use.",
      "To heat it for a hot tub."
    ],
    correctEn: "b",
    questionFr: "Q1: Pourquoi recueillir l’eau de pluie dans un bac?",
    optionsFr: [
      "Pour qu’elle déborde et inonde votre cour.",
      "Pour avoir de l’eau à arroser les plantes, sans puiser dans le robinet.",
      "Pour la chauffer dans un spa."
    ],
    correctFr: "b"
  },
  "L45-2": {
    questionEn: "Q2: How does rainwater harvesting help the environment?",
    optionsEn: [
      "It wastes more drinking water.",
      "It reduces runoff and conserves municipal water.",
      "It pollutes local rivers."
    ],
    correctEn: "b",
    questionFr: "Q2: Comment la récupération d’eau de pluie aide-t-elle l’environnement?",
    optionsFr: [
      "Elle gaspille plus d’eau potable.",
      "Elle diminue le ruissellement et épargne l’eau de la ville.",
      "Elle pollue les rivières locales."
    ],
    correctFr: "b"
  },
  "L45-3": {
    questionEn: "Q3: What is one tip for using a rainwater bin safely?",
    optionsEn: [
      "Leave it uncovered so mosquitoes breed.",
      "Keep a lid or mesh to prevent bugs and debris.",
      "Pour bleach into it daily."
    ],
    correctEn: "b",
    questionFr: "Q3: Quel est un conseil pour utiliser un bac de récupération d’eau de pluie en toute sécurité?",
    optionsFr: [
      "Le laisser découvert pour que les moustiques s’y reproduisent.",
      "Mettre un couvercle ou un tamis pour empêcher les insectes et débris.",
      "Y verser de l’eau de Javel tous les jours."
    ],
    correctFr: "b"
  },
    "G67-1": {
      "questionEn": "Q1: What does using less plastic help with?",
      "optionsEn": [
        "Creating more waste.",
        "Reducing pollution and protecting wildlife.",
        "Making plastic last forever."
      ],
      "correctEn": "b",
      "questionFr": "Q1: En quoi l’utilisation de moins de plastique aide-t-elle?",
      "optionsFr": [
        "Créer plus de déchets.",
        "Réduire la pollution et protéger la faune.",
        "Rendre le plastique éternel."
      ],
      "correctFr": "b"
    },
    "G67-2": {
      "questionEn": "Q2: Why is plastic pollution harmful?",
      "optionsEn": [
        "It nourishes ocean life.",
        "It endangers animals and contaminates ecosystems.",
        "It disappears instantly."
      ],
      "correctEn": "b",
      "questionFr": "Q2: Pourquoi la pollution plastique est-elle nuisible?",
      "optionsFr": [
        "Elle nourrit la vie marine.",
        "Elle met en danger les animaux et contamine les écosystèmes.",
        "Elle disparaît instantanément."
      ],
      "correctFr": "b"
    },
    "G67-3": {
      "questionEn": "Q3: How can you reduce plastic waste?",
      "optionsEn": [
        "Use reusable alternatives like bags and bottles.",
        "Throw all plastic into rivers.",
        "Ignore recycling."
      ],
      "correctEn": "a",
      "questionFr": "Q3: Comment peut-on réduire les déchets plastiques?",
      "optionsFr": [
        "Utiliser des alternatives réutilisables comme les sacs et bouteilles.",
        "Jeter tout le plastique dans les rivières.",
        "Ignorer le recyclage."
      ],
      "correctFr": "a"
    },
  
    "H36-1": {
      "questionEn": "Q1: What is deforestation?",
      "optionsEn": [
        "The large-scale clearing of forests.",
        "Planting more trees.",
        "Turning deserts into forests."
      ],
      "correctEn": "a",
      "questionFr": "Q1: Qu’est-ce que la déforestation?",
      "optionsFr": [
        "L’abattage à grande échelle des forêts.",
        "Planter plus d’arbres.",
        "Transformer les déserts en forêts."
      ],
      "correctFr": "a"
    },
    "H36-2": {
      "questionEn": "Q2: Why is deforestation harmful?",
      "optionsEn": [
        "It increases biodiversity.",
        "It removes habitats and increases CO₂ emissions.",
        "It has no impact."
      ],
      "correctEn": "b",
      "questionFr": "Q2: Pourquoi la déforestation est-elle nuisible?",
      "optionsFr": [
        "Elle augmente la biodiversité.",
        "Elle détruit les habitats et augmente les émissions de CO₂.",
        "Elle n’a aucun impact."
      ],
      "correctFr": "b"
    },
    "H36-3": {
      "questionEn": "Q3: How can deforestation be reduced?",
      "optionsEn": [
        "Promote sustainable forestry and replant trees.",
        "Cut all trees without replanting.",
        "Burn forests regularly."
      ],
      "correctEn": "a",
      "questionFr": "Q3: Comment réduire la déforestation?",
      "optionsFr": [
        "Encourager la foresterie durable et replanter des arbres.",
        "Couper tous les arbres sans replanter.",
        "Brûler les forêts régulièrement."
      ],
      "correctFr": "a"
    },
  
    "H56-1": {
      "questionEn": "Q1: What is organic farming?",
      "optionsEn": [
        "Growing crops without synthetic pesticides or fertilizers.",
        "Using only chemicals to grow food.",
        "Farming with plastic plants."
      ],
      "correctEn": "a",
      "questionFr": "Q1: Qu’est-ce que l’agriculture biologique?",
      "optionsFr": [
        "Cultiver des aliments sans pesticides ou engrais synthétiques.",
        "Utiliser uniquement des produits chimiques.",
        "Faire pousser des plantes en plastique."
      ],
      "correctFr": "a"
    },
    "H56-2": {
      "questionEn": "Q2: Why is organic farming better for the environment?",
      "optionsEn": [
        "It preserves soil health and reduces chemical runoff.",
        "It uses more pesticides.",
        "It eliminates all crops."
      ],
      "correctEn": "a",
      "questionFr": "Q2: Pourquoi l’agriculture biologique est-elle meilleure pour l’environnement?",
      "optionsFr": [
        "Elle préserve la santé du sol et réduit le ruissellement chimique.",
        "Elle utilise plus de pesticides.",
        "Elle élimine toutes les cultures."
      ],
      "correctFr": "a"
    },
    "H56-3": {
      "questionEn": "Q3: What is one challenge of organic farming?",
      "optionsEn": [
        "Lower yields and higher costs.",
        "It grows food instantly.",
        "It makes soil disappear."
      ],
      "correctEn": "a",
      "questionFr": "Q3: Quel est un défi de l’agriculture biologique?",
      "optionsFr": [
        "Des rendements plus faibles et des coûts plus élevés.",
        "Elle fait pousser la nourriture instantanément.",
        "Elle fait disparaître le sol."
      ],
      "correctFr": "a"
    },
  
      "H89-1": {
        "questionEn": "Q1: What is habitat restoration?",
        "optionsEn": [
          "Destroying natural environments.",
          "Repairing damaged ecosystems to help wildlife.",
          "Building more highways in forests."
        ],
        "correctEn": "b",
        "questionFr": "Q1: Qu’est-ce que la restauration des habitats?",
        "optionsFr": [
          "Détruire les environnements naturels.",
          "Réparer les écosystèmes endommagés pour aider la faune.",
          "Construire plus d’autoroutes dans les forêts."
        ],
        "correctFr": "b"
      },
      "H89-2": {
        "questionEn": "Q2: Why is habitat restoration important?",
        "optionsEn": [
          "It helps species recover and prevents extinctions.",
          "It makes ecosystems disappear.",
          "It has no effect on biodiversity."
        ],
        "correctEn": "a",
        "questionFr": "Q2: Pourquoi la restauration des habitats est-elle importante?",
        "optionsFr": [
          "Elle aide les espèces à se rétablir et prévient les extinctions.",
          "Elle fait disparaître les écosystèmes.",
          "Elle n’a aucun impact sur la biodiversité."
        ],
        "correctFr": "a"
      },
      "H89-3": {
        "questionEn": "Q3: What is one method of restoring habitats?",
        "optionsEn": [
          "Replanting native plants and cleaning polluted areas.",
          "Destroying wetlands.",
          "Removing all vegetation."
        ],
        "correctEn": "a",
        "questionFr": "Q3: Quelle est une méthode de restauration des habitats?",
        "optionsFr": [
          "Replanter des plantes indigènes et nettoyer les zones polluées.",
          "Détruire les zones humides.",
          "Enlever toute la végétation."
        ],
        "correctFr": "a"
      },
    
      "I58-1": {
        "questionEn": "Q1: What is sustainable fishing?",
        "optionsEn": [
          "Catching fish in a way that maintains population levels.",
          "Overfishing with no limits.",
          "Using dynamite to catch fish."
        ],
        "correctEn": "a",
        "questionFr": "Q1: Qu’est-ce que la pêche durable?",
        "optionsFr": [
          "Capturer les poissons d’une manière qui maintient les populations.",
          "Surpêcher sans limites.",
          "Utiliser de la dynamite pour attraper les poissons."
        ],
        "correctFr": "a"
      },
      "I58-2": {
        "questionEn": "Q2: Why is overfishing harmful?",
        "optionsEn": [
          "It depletes fish populations and disrupts ecosystems.",
          "It creates more fish instantly.",
          "It has no impact on the ocean."
        ],
        "correctEn": "a",
        "questionFr": "Q2: Pourquoi la surpêche est-elle nuisible?",
        "optionsFr": [
          "Elle épuise les populations de poissons et perturbe les écosystèmes.",
          "Elle crée plus de poissons instantanément.",
          "Elle n’a aucun impact sur l’océan."
        ],
        "correctFr": "a"
      },
      "I58-3": {
        "questionEn": "Q3: What is a way to support sustainable fishing?",
        "optionsEn": [
          "Choosing seafood with sustainability certifications.",
          "Eating only rare endangered fish.",
          "Fishing as much as possible, every day."
        ],
        "correctEn": "a",
        "questionFr": "Q3: Comment soutenir la pêche durable?",
        "optionsFr": [
          "Choisir des produits de la mer certifiés durables.",
          "Ne manger que des poissons rares et en danger.",
          "Pêcher autant que possible, chaque jour."
        ],
        "correctFr": "a"
      },
        "I78-1": {
          "questionEn": "Q1: What is urban gardening?",
          "optionsEn": [
            "Growing food in cities using small spaces.",
            "Planting trees in the ocean.",
            "Removing all plants from cities."
          ],
          "correctEn": "a",
          "questionFr": "Q1: Qu’est-ce que le jardinage urbain?",
          "optionsFr": [
            "Faire pousser des aliments en ville dans de petits espaces.",
            "Planter des arbres dans l’océan.",
            "Enlever toutes les plantes des villes."
          ],
          "correctFr": "a"
        },
        "I78-2": {
          "questionEn": "Q2: How does urban gardening benefit cities?",
          "optionsEn": [
            "It improves air quality and provides local food.",
            "It removes oxygen from the air.",
            "It causes pollution."
          ],
          "correctEn": "a",
          "questionFr": "Q2: Comment le jardinage urbain aide-t-il les villes?",
          "optionsFr": [
            "Il améliore la qualité de l’air et fournit des aliments locaux.",
            "Il retire l’oxygène de l’air.",
            "Il cause de la pollution."
          ],
          "correctFr": "a"
        },
        "I78-3": {
          "questionEn": "Q3: What is one way to start urban gardening?",
          "optionsEn": [
            "Using rooftop or community gardens.",
            "Covering soil with concrete.",
            "Destroying green spaces."
          ],
          "correctEn": "a",
          "questionFr": "Q3: Quelle est une façon de commencer le jardinage urbain?",
          "optionsFr": [
            "Utiliser des jardins sur les toits ou communautaires.",
            "Recouvrir le sol de béton.",
            "Détruire les espaces verts."
          ],
          "correctFr": "a"
        },
          "B12-1": {
            "questionEn": "Q1: Why are forests called the 'lungs of the Earth'?",
            "optionsEn": [
              "Because they breathe in oxygen.",
              "Because they absorb CO₂ and release oxygen.",
              "Because they make air heavier."
            ],
            "correctEn": "b",
            "questionFr": "Q1: Pourquoi les forêts sont-elles appelées les « poumons de la Terre »?",
            "optionsFr": [
              "Parce qu’elles respirent de l’oxygène.",
              "Parce qu’elles absorbent le CO₂ et libèrent de l’oxygène.",
              "Parce qu’elles rendent l’air plus lourd."
            ],
            "correctFr": "b"
          },
          "B12-2": {
            "questionEn": "Q2: How do forests help prevent floods?",
            "optionsEn": [
              "They create more water.",
              "They absorb rainwater and stabilize soil.",
              "They make water disappear."
            ],
            "correctEn": "b",
            "questionFr": "Q2: Comment les forêts aident-elles à prévenir les inondations?",
            "optionsFr": [
              "Elles créent plus d’eau.",
              "Elles absorbent l’eau de pluie et stabilisent le sol.",
              "Elles font disparaître l’eau."
            ],
            "correctFr": "b"
          },
          "B12-3": {
            "questionEn": "Q3: What is one way to protect forests?",
            "optionsEn": [
              "Cutting down all the trees.",
              "Practicing sustainable logging and reforestation.",
              "Burning the trees before they fall."
            ],
            "correctEn": "b",
            "questionFr": "Q3: Quelle est une façon de protéger les forêts?",
            "optionsFr": [
              "Couper tous les arbres.",
              "Pratiquer l’exploitation durable et la reforestation.",
              "Brûler les arbres avant qu’ils ne tombent."
            ],
            "correctFr": "b"
          },
          "C12-1": {
            "questionEn": "Q1: What is composting?",
            "optionsEn": [
              "Throwing food waste in the trash.",
              "Turning organic waste into nutrient-rich soil.",
              "Burning food scraps."
            ],
            "correctEn": "b",
            "questionFr": "Q1: Qu’est-ce que le compostage?",
            "optionsFr": [
              "Jeter les déchets alimentaires à la poubelle.",
              "Transformer les déchets organiques en sol riche en nutriments.",
              "Brûler les restes de nourriture."
            ],
            "correctFr": "b"
          },
          "C12-2": {
            "questionEn": "Q2: Why is composting good for the environment?",
            "optionsEn": [
              "It reduces landfill waste and enriches soil.",
              "It creates more pollution.",
              "It makes garbage bags heavier."
            ],
            "correctEn": "a",
            "questionFr": "Q2: Pourquoi le compostage est-il bon pour l’environnement?",
            "optionsFr": [
              "Il réduit les déchets dans les décharges et enrichit le sol.",
              "Il crée plus de pollution.",
              "Il alourdit les sacs à ordures."
            ],
            "correctFr": "a"
          },
          "C12-3": {
            "questionEn": "Q3: What should not be added to compost?",
            "optionsEn": [
              "Fruit and vegetable scraps.",
              "Meat, dairy, and oily foods.",
              "Leaves and grass clippings."
            ],
            "correctEn": "b",
            "questionFr": "Q3: Que ne faut-il pas ajouter au compost?",
            "optionsFr": [
              "Des restes de fruits et légumes.",
              "De la viande, des produits laitiers et des aliments gras.",
              "Des feuilles et des tontes de gazon."
            ],
            "correctFr": "b"
          },        
            "D12-1": {
              "questionEn": "Q1: What is the main cause of ocean pollution?",
              "optionsEn": [
                "Too many fish swimming.",
                "Plastic waste, chemicals, and oil spills.",
                "Clean water entering the sea."
              ],
              "correctEn": "b",
              "questionFr": "Q1: Quelle est la principale cause de la pollution des océans?",
              "optionsFr": [
                "Trop de poissons qui nagent.",
                "Les déchets plastiques, les produits chimiques et les marées noires.",
                "L’entrée d’eau propre dans la mer."
              ],
              "correctFr": "b"
            },
            "D12-2": {
              "questionEn": "Q2: How does ocean pollution affect marine animals?",
              "optionsEn": [
                "It gives them superpowers.",
                "It harms their health and destroys their habitats.",
                "It makes them grow faster."
              ],
              "correctEn": "b",
              "questionFr": "Q2: Comment la pollution des océans affecte-t-elle les animaux marins?",
              "optionsFr": [
                "Elle leur donne des superpouvoirs.",
                "Elle nuit à leur santé et détruit leurs habitats.",
                "Elle les fait grandir plus vite."
              ],
              "correctFr": "b"
            },
            "D12-3": {
              "questionEn": "Q3: What is one way to reduce ocean pollution?",
              "optionsEn": [
                "Throwing plastic waste in the sea.",
                "Using reusable products and reducing plastic use.",
                "Dumping chemicals down the drain."
              ],
              "correctEn": "b",
              "questionFr": "Q3: Quelle est une façon de réduire la pollution des océans?",
              "optionsFr": [
                "Jeter des déchets plastiques dans la mer.",
                "Utiliser des produits réutilisables et réduire l’utilisation du plastique.",
                "Déverser des produits chimiques dans les égouts."
              ],
              "correctFr": "b"
            },
            "E12-1": {
              "questionEn": "Q1: What is an ecosystem?",
              "optionsEn": [
                "A group of living things interacting with their environment.",
                "A computer program.",
                "A place where only plants grow."
              ],
              "correctEn": "a",
              "questionFr": "Q1: Qu’est-ce qu’un écosystème?",
              "optionsFr": [
                "Un groupe d’êtres vivants interagissant avec leur environnement.",
                "Un programme informatique.",
                "Un endroit où seules les plantes poussent."
              ],
              "correctFr": "a"
            },
            "E12-2": {
              "questionEn": "Q2: Why are healthy ecosystems important?",
              "optionsEn": [
                "They support biodiversity and clean the air and water.",
                "They create more pollution.",
                "They make food disappear."
              ],
              "correctEn": "a",
              "questionFr": "Q2: Pourquoi les écosystèmes sains sont-ils importants?",
              "optionsFr": [
                "Ils soutiennent la biodiversité et purifient l’air et l’eau.",
                "Ils créent plus de pollution.",
                "Ils font disparaître la nourriture."
              ],
              "correctFr": "a"
            },
            "E12-3": {
              "questionEn": "Q3: What is one way to protect ecosystems?",
              "optionsEn": [
                "Destroying forests.",
                "Reducing pollution and protecting wildlife.",
                "Building more highways in rainforests."
              ],
              "correctEn": "b",
              "questionFr": "Q3: Quelle est une façon de protéger les écosystèmes?",
              "optionsFr": [
                "Détruire les forêts.",
                "Réduire la pollution et protéger la faune.",
                "Construire plus d’autoroutes dans les forêts tropicales."
              ],
              "correctFr": "b"
            },
            "F34-1": {
              "questionEn": "Q1: What is sustainable energy?",
              "optionsEn": [
                "Energy that comes from non-renewable sources.",
                "Energy from natural resources that replenish over time.",
                "Energy that never runs out."
              ],
              "correctEn": "b",
              "questionFr": "Q1: Qu’est-ce que l’énergie durable?",
              "optionsFr": [
                "De l’énergie provenant de sources non renouvelables.",
                "De l’énergie issue de ressources naturelles qui se renouvellent.",
                "De l’énergie qui ne s’épuise jamais."
              ],
              "correctFr": "b"
            },
            "F34-2": {
              "questionEn": "Q2: Why is sustainable energy important?",
              "optionsEn": [
                "It reduces reliance on fossil fuels and decreases pollution.",
                "It increases CO₂ emissions.",
                "It makes electricity more expensive."
              ],
              "correctEn": "a",
              "questionFr": "Q2: Pourquoi l’énergie durable est-elle importante?",
              "optionsFr": [
                "Elle réduit la dépendance aux combustibles fossiles et diminue la pollution.",
                "Elle augmente les émissions de CO₂.",
                "Elle rend l’électricité plus chère."
              ],
              "correctFr": "a"
            },
            "F34-3": {
              "questionEn": "Q3: Which of these is an example of sustainable energy?",
              "optionsEn": [
                "Coal power.",
                "Solar, wind, and hydro power.",
                "Burning wood in fireplaces."
              ],
              "correctEn": "b",
              "questionFr": "Q3: Lequel de ces exemples représente une énergie durable?",
              "optionsFr": [
                "L’énergie du charbon.",
                "L’énergie solaire, éolienne et hydraulique.",
                "Brûler du bois dans une cheminée."
              ],
              "correctFr": "b"
            },
            "G12-1": {
              "questionEn": "Q1: What is an endangered species?",
              "optionsEn": [
                "A species with a large, growing population.",
                "A species at risk of extinction.",
                "A species that can live forever."
              ],
              "correctEn": "b",
              "questionFr": "Q1: Qu’est-ce qu’une espèce en voie de disparition?",
              "optionsFr": [
                "Une espèce avec une grande population en croissance.",
                "Une espèce en danger d’extinction.",
                "Une espèce qui peut vivre éternellement."
              ],
              "correctFr": "b"
            },
            "G12-2": {
              "questionEn": "Q2: What is one major cause of species endangerment?",
              "optionsEn": [
                "Habitat destruction and climate change.",
                "Giving animals too much food.",
                "Animals living too long."
              ],
              "correctEn": "a",
              "questionFr": "Q2: Quelle est une des principales causes de la mise en danger des espèces?",
              "optionsFr": [
                "La destruction des habitats et le changement climatique.",
                "Donner trop de nourriture aux animaux.",
                "Les animaux qui vivent trop longtemps."
              ],
              "correctFr": "a"
            },
            "G12-3": {
              "questionEn": "Q3: How can we help protect endangered species?",
              "optionsEn": [
                "Destroying forests where they live.",
                "Creating wildlife reserves and reducing pollution.",
                "Hunting them more often."
              ],
              "correctEn": "b",
              "questionFr": "Q3: Comment peut-on aider à protéger les espèces en danger?",
              "optionsFr": [
                "Détruire les forêts où elles vivent.",
                "Créer des réserves naturelles et réduire la pollution.",
                "Les chasser plus souvent."
              ],
              "correctFr": "b"
            },          



          "K23-1": {
            "questionEn": "Q1: What does energy-efficient lighting mean?",
            "optionsEn": [
              "Using bulbs that consume less electricity and last longer.",
              "Leaving all lights on all the time.",
              "Only using candles."
            ],
            "correctEn": "a",
            "questionFr": "Q1: Que signifie l’éclairage écoénergétique?",
            "optionsFr": [
              "Utiliser des ampoules qui consomment moins d’électricité et durent plus longtemps.",
              "Laisser toutes les lumières allumées en permanence.",
              "Utiliser uniquement des bougies."
            ],
            "correctFr": "a"
          },
          "K23-2": {
            "questionEn": "Q2: Why is energy-efficient lighting beneficial?",
            "optionsEn": [
              "It reduces electricity use and lowers carbon emissions.",
              "It increases electricity waste.",
              "It has no effect on the environment."
            ],
            "correctEn": "a",
            "questionFr": "Q2: Pourquoi l’éclairage écoénergétique est-il bénéfique?",
            "optionsFr": [
              "Il réduit la consommation d’électricité et les émissions de carbone.",
              "Il augmente le gaspillage d’électricité.",
              "Il n’a aucun impact sur l’environnement."
            ],
            "correctFr": "a"
          },
          "K23-3": {
            "questionEn": "Q3: Which is an example of energy-efficient lighting?",
            "optionsEn": [
              "LED or CFL bulbs that use less power.",
              "Incandescent bulbs that waste energy.",
              "No lights in any building."
            ],
            "correctEn": "a",
            "questionFr": "Q3: Quel est un exemple d’éclairage écoénergétique?",
            "optionsFr": [
              "Les ampoules LED ou CFL qui consomment moins d’énergie.",
              "Les ampoules à incandescence qui gaspillent de l’énergie.",
              "Aucune lumière dans aucun bâtiment."
            ],
            "correctFr": "a"
          },
        
          "K34-1": {
            "questionEn": "Q1: What is eco-friendly travel?",
            "optionsEn": [
              "Choosing transportation options that reduce environmental impact.",
              "Flying alone on private jets.",
              "Driving everywhere without carpooling."
            ],
            "correctEn": "a",
            "questionFr": "Q1: Qu’est-ce que le voyage écoresponsable?",
            "optionsFr": [
              "Choisir des modes de transport qui réduisent l’impact environnemental.",
              "Voyager seul en jet privé.",
              "Conduire partout sans covoiturer."
            ],
            "correctFr": "a"
          },
          "K34-2": {
            "questionEn": "Q2: Why is eco-friendly travel important?",
            "optionsEn": [
              "It reduces greenhouse gas emissions from transportation.",
              "It increases fuel consumption.",
              "It makes travel more expensive."
            ],
            "correctEn": "a",
            "questionFr": "Q2: Pourquoi le voyage écoresponsable est-il important?",
            "optionsFr": [
              "Il réduit les émissions de gaz à effet de serre du transport.",
              "Il augmente la consommation de carburant.",
              "Il rend les voyages plus coûteux."
            ],
            "correctFr": "a"
          },
          "K34-3": {
            "questionEn": "Q3: What is one way to travel more sustainably?",
            "optionsEn": [
              "Using trains, public transit, or biking when possible.",
              "Flying frequently for short distances.",
              "Driving alone in a large SUV."
            ],
            "correctEn": "a",
            "questionFr": "Q3: Quelle est une façon de voyager de manière plus durable?",
            "optionsFr": [
              "Utiliser les trains, le transport en commun ou le vélo quand c’est possible.",
              "Prendre fréquemment l’avion pour de courtes distances.",
              "Conduire seul dans un gros VUS."
            ],
            "correctFr": "a"
          },
        
          "K92-1": {
            "questionEn": "Q1: What does sustainable fishing mean?",
            "optionsEn": [
              "Fishing in ways that maintain healthy fish populations and ecosystems.",
              "Catching as many fish as possible without limits.",
              "Using methods that harm marine life and habitats."
            ],
            "correctEn": "a",
            "questionFr": "Q1: Que signifie la pêche durable?",
            "optionsFr": [
              "Pêcher d’une manière qui maintient des populations de poissons saines et des écosystèmes équilibrés.",
              "Capturer le plus de poissons possible sans limites.",
              "Utiliser des méthodes qui nuisent à la vie marine et aux habitats."
            ],
            "correctFr": "a"
          },
          "K92-2": {
            "questionEn": "Q2: Why is sustainable fishing important?",
            "optionsEn": [
              "It prevents overfishing and protects marine biodiversity.",
              "It leads to fish population collapse.",
              "It encourages illegal fishing practices."
            ],
            "correctEn": "a",
            "questionFr": "Q2: Pourquoi la pêche durable est-elle importante?",
            "optionsFr": [
              "Elle prévient la surpêche et protège la biodiversité marine.",
              "Elle entraîne l’effondrement des populations de poissons.",
              "Elle encourage les pratiques de pêche illégales."
            ],
            "correctFr": "a"
          },
          "K92-3": {
            "questionEn": "Q3: How can consumers support sustainable fishing?",
            "optionsEn": [
              "Choosing seafood with sustainability certifications (e.g., MSC label).",
              "Buying fish from overfished species.",
              "Ignoring seafood sustainability labels."
            ],
            "correctEn": "a",
            "questionFr": "Q3: Comment les consommateurs peuvent-ils soutenir la pêche durable?",
            "optionsFr": [
              "Choisir des produits de la mer avec des certifications de durabilité (ex. label MSC).",
              "Acheter du poisson provenant d’espèces surexploitées.",
              "Ignorer les labels de durabilité des produits de la mer."
            ],
            "correctFr": "a"
  },

   "J12-1": {
    "questionEn": "Q1: What does 'sustainable fishing' mean?",
    "optionsEn": [
      "Fishing in a way that maintains fish populations and ecosystems.",
      "Catching as many fish as possible.",
      "Ignoring overfishing and ocean health."
    ],
    "correctEn": "a",
    "questionFr": "Q1: Que signifie « pêche durable »?",
    "optionsFr": [
      "Pêcher de manière à préserver les populations de poissons et les écosystèmes.",
      "Attraper le plus de poissons possible.",
      "Ignorer la surpêche et la santé des océans."
    ],
    "correctFr": "a"
  },
  "J12-2": {
    "questionEn": "Q2: Why is sustainable fishing important?",
    "optionsEn": [
      "It helps prevent fish species from disappearing.",
      "It has no impact on marine life.",
      "It reduces seafood availability."
    ],
    "correctEn": "a",
    "questionFr": "Q2: Pourquoi la pêche durable est-elle importante?",
    "optionsFr": [
      "Elle aide à éviter la disparition des espèces de poissons.",
      "Elle n’a aucun impact sur la vie marine.",
      "Elle réduit la disponibilité des fruits de mer."
    ],
    "correctFr": "a"
  },
  "J12-3": {
    "questionEn": "Q3: What is a sustainable fishing method?",
    "optionsEn": [
      "Using selective fishing techniques that avoid bycatch.",
      "Overfishing and depleting marine populations.",
      "Dumping fishing gear into the ocean."
    ],
    "correctEn": "a",
    "questionFr": "Q3: Quelle est une méthode de pêche durable?",
    "optionsFr": [
      "Utiliser des techniques de pêche sélectives pour éviter les prises accessoires.",
      "Pratiquer la surpêche et épuiser les populations marines.",
      "Jeter les équipements de pêche dans l’océan."
    ],
    "correctFr": "a"
  },

  "J80-1": {
    "questionEn": "Q1: What is 'zero waste'?",
    "optionsEn": [
      "A lifestyle aiming to minimize waste production.",
      "Throwing away as much as possible.",
      "Burning all waste."
    ],
    "correctEn": "a",
    "questionFr": "Q1: Qu’est-ce que le « zéro déchet »?",
    "optionsFr": [
      "Un mode de vie visant à minimiser la production de déchets.",
      "Jeter le plus possible.",
      "Brûler tous les déchets."
    ],
    "correctFr": "a"
  },
  "J80-2": {
    "questionEn": "Q2: How can someone practice zero waste?",
    "optionsEn": [
      "Using reusable items and composting.",
      "Buying single-use plastic products.",
      "Throwing recyclables in the trash."
    ],
    "correctEn": "a",
    "questionFr": "Q2: Comment pratiquer le zéro déchet?",
    "optionsFr": [
      "Utiliser des objets réutilisables et composter.",
      "Acheter des produits en plastique à usage unique.",
      "Jeter les recyclables à la poubelle."
    ],
    "correctFr": "a"
  },
  "J80-3": {
    "questionEn": "Q3: What is an example of a zero-waste swap?",
    "optionsEn": [
      "Using a reusable water bottle instead of plastic ones.",
      "Using plastic cutlery for every meal.",
      "Buying excessive amounts of packaging."
    ],
    "correctEn": "a",
    "questionFr": "Q3: Quel est un exemple d’alternative zéro déchet?",
    "optionsFr": [
      "Utiliser une bouteille d’eau réutilisable au lieu de bouteilles en plastique.",
      "Utiliser des couverts en plastique pour chaque repas.",
      "Acheter des produits avec trop d’emballage."
    ],
    "correctFr": "a"
  },
  "J90-1": {
    "questionEn": "Q1: What does 'energy-efficient lighting' mean?",
    "optionsEn": [
      "Using LED bulbs that consume less electricity.",
      "Leaving lights on all day and night.",
      "Using only candles for lighting."
    ],
    "correctEn": "a",
    "questionFr": "Q1: Que signifie « éclairage écoénergétique »?",
    "optionsFr": [
      "Utiliser des ampoules DEL qui consomment moins d’électricité.",
      "Laisser les lumières allumées toute la journée et la nuit.",
      "Utiliser uniquement des bougies pour l’éclairage."
    ],
    "correctFr": "a"
  },
  "J90-2": {
    "questionEn": "Q2: Why is energy-efficient lighting important?",
    "optionsEn": [
      "It reduces electricity consumption and saves money.",
      "It increases energy waste.",
      "It makes homes darker."
    ],
    "correctEn": "a",
    "questionFr": "Q2: Pourquoi l’éclairage écoénergétique est-il important?",
    "optionsFr": [
      "Il réduit la consommation d’électricité et économise de l’argent.",
      "Il augmente le gaspillage d’énergie.",
      "Il rend les maisons plus sombres."
    ],
    "correctFr": "a"
  },
  "J90-3": {
    "questionEn": "Q3: Which type of bulb is most energy-efficient?",
    "optionsEn": [
      "LED bulbs.",
      "Incandescent bulbs.",
      "Halogen bulbs."
    ],
    "correctEn": "a",
    "questionFr": "Q3: Quel type d’ampoule est le plus écoénergétique?",
    "optionsFr": [
      "Les ampoules DEL.",
      "Les ampoules incandescentes.",
      "Les ampoules halogènes."
    ],
    "correctFr": "a"
  },
"L56-1": {
  "questionEn": "Q1: What is composting?",
  "optionsEn": [
    "Turning organic waste into nutrient-rich soil.",
    "Throwing all food waste in the trash.",
    "Burning food scraps to get rid of them."
  ],
  "correctEn": "a",
  "questionFr": "Q1: Qu’est-ce que le compostage?",
  "optionsFr": [
    "Transformer les déchets organiques en sol riche en nutriments.",
    "Jeter tous les déchets alimentaires à la poubelle.",
    "Brûler les restes de nourriture pour s’en débarrasser."
  ],
  "correctFr": "a"
},
"L56-2": {
  "questionEn": "Q2: Why is composting good for the environment?",
  "optionsEn": [
    "It reduces landfill waste and improves soil health.",
    "It increases pollution.",
    "It has no environmental benefits."
  ],
  "correctEn": "a",
  "questionFr": "Q2: Pourquoi le compostage est-il bon pour l’environnement?",
  "optionsFr": [
    "Il réduit les déchets envoyés aux décharges et améliore la santé du sol.",
    "Il augmente la pollution.",
    "Il n’a aucun bénéfice environnemental."
  ],
  "correctFr": "a"
},
"L56-3": {
  "questionEn": "Q3: What can be composted?",
  "optionsEn": [
    "Fruit and vegetable scraps, leaves, and coffee grounds.",
    "Plastic bags and metal cans.",
    "Glass bottles and batteries."
  ],
  "correctEn": "a",
  "questionFr": "Q3: Que peut-on composter?",
  "optionsFr": [
    "Les restes de fruits et légumes, les feuilles et le marc de café.",
    "Les sacs en plastique et les boîtes métalliques.",
    "Les bouteilles en verre et les piles."
  ],
  "correctFr": "a"
},

"M12-1": {
  "questionEn": "Q1: What is an electric bike?",
  "optionsEn": [
    "A bicycle with an electric motor to assist pedaling.",
    "A car disguised as a bike.",
    "A bike that only runs on gas."
  ],
  "correctEn": "a",
  "questionFr": "Q1: Qu’est-ce qu’un vélo électrique?",
  "optionsFr": [
    "Un vélo avec un moteur électrique pour aider au pédalage.",
    "Une voiture déguisée en vélo.",
    "Un vélo qui fonctionne uniquement à l’essence."
  ],
  "correctFr": "a"
},
"M12-2": {
  "questionEn": "Q2: Why are electric bikes environmentally friendly?",
  "optionsEn": [
    "They reduce the need for cars and lower emissions.",
    "They consume more fossil fuels.",
    "They make the air dirtier."
  ],
  "correctEn": "a",
  "questionFr": "Q2: Pourquoi les vélos électriques sont-ils écologiques?",
  "optionsFr": [
    "Ils réduisent le besoin de voitures et diminuent les émissions.",
    "Ils consomment plus de combustibles fossiles.",
    "Ils rendent l’air plus pollué."
  ],
  "correctFr": "a"
},
"M12-3": {
  "questionEn": "Q3: How can someone charge an electric bike sustainably?",
  "optionsEn": [
    "By using renewable energy sources like solar or wind power.",
    "By plugging it into a generator powered by coal.",
    "By only charging it with gasoline."
  ],
  "correctEn": "a",
  "questionFr": "Q3: Comment peut-on recharger un vélo électrique de manière durable?",
  "optionsFr": [
    "En utilisant des sources d’énergie renouvelables comme le solaire ou l’éolien.",
    "En le branchant à un générateur fonctionnant au charbon.",
    "En le rechargeant uniquement avec de l’essence."
  ],
  "correctFr": "a"
},

"M37-1": {
  "questionEn": "Q1: What is green architecture?",
  "optionsEn": [
    "Designing buildings to be energy-efficient and eco-friendly.",
    "Building houses entirely out of plastic.",
    "Ignoring environmental impacts in construction."
  ],
  "correctEn": "a",
  "questionFr": "Q1: Qu’est-ce que l’architecture verte?",
  "optionsFr": [
    "Concevoir des bâtiments pour qu’ils soient écoénergétiques et respectueux de l’environnement.",
    "Construire des maisons entièrement en plastique.",
    "Ignorer les impacts environnementaux dans la construction."
  ],
  "correctFr": "a"
},
"M37-2": {
  "questionEn": "Q2: How does green architecture benefit the environment?",
  "optionsEn": [
    "It reduces energy and water consumption in buildings.",
    "It increases pollution and waste.",
    "It makes buildings less efficient."
  ],
  "correctEn": "a",
  "questionFr": "Q2: Comment l’architecture verte profite-t-elle à l’environnement?",
  "optionsFr": [
    "Elle réduit la consommation d’énergie et d’eau des bâtiments.",
    "Elle augmente la pollution et les déchets.",
    "Elle rend les bâtiments moins efficaces."
  ],
  "correctFr": "a"
},
"M37-3": {
  "questionEn": "Q3: What is an example of a green building feature?",
  "optionsEn": [
    "Solar panels for renewable energy.",
    "No insulation and high energy waste.",
    "Using only non-recyclable materials."
  ],
  "correctEn": "a",
  "questionFr": "Q3: Quel est un exemple de caractéristique d’un bâtiment écologique?",
  "optionsFr": [
    "Des panneaux solaires pour produire de l’énergie renouvelable.",
    "Aucune isolation et beaucoup de gaspillage énergétique.",
    "N’utiliser que des matériaux non recyclables."
  ],
  "correctFr": "a"
},
  "M78-1": {
    "questionEn": "Q1: What is a wildlife corridor?",
    "optionsEn": [
      "A safe passage that connects animal habitats.",
      "A fence that blocks animals from moving.",
      "A highway built in the middle of forests."
    ],
    "correctEn": "a",
    "questionFr": "Q1: Qu’est-ce qu’un corridor écologique?",
    "optionsFr": [
      "Un passage sécurisé reliant les habitats des animaux.",
      "Une clôture qui empêche les animaux de se déplacer.",
      "Une autoroute construite au milieu des forêts."
    ],
    "correctFr": "a"
  },
  "M78-2": {
    "questionEn": "Q2: Why are wildlife corridors important?",
    "optionsEn": [
      "They allow animals to migrate safely and maintain genetic diversity.",
      "They keep animals trapped in one place.",
      "They increase habitat destruction."
    ],
    "correctEn": "a",
    "questionFr": "Q2: Pourquoi les corridors écologiques sont-ils importants?",
    "optionsFr": [
      "Ils permettent aux animaux de migrer en toute sécurité et maintiennent la diversité génétique.",
      "Ils emprisonnent les animaux dans un seul endroit.",
      "Ils augmentent la destruction des habitats."
    ],
    "correctFr": "a"
  },
  "M78-3": {
    "questionEn": "Q3: How can people help create more wildlife corridors?",
    "optionsEn": [
      "By protecting green spaces and building eco-friendly roads.",
      "By expanding cities without green areas.",
      "By hunting animals near migration paths."
    ],
    "correctEn": "a",
    "questionFr": "Q3: Comment peut-on aider à créer plus de corridors écologiques?",
    "optionsFr": [
      "En protégeant les espaces verts et en construisant des routes écologiques.",
      "En agrandissant les villes sans zones vertes.",
      "En chassant les animaux près des routes migratoires."
    ],
    "correctFr": "a"
  },

  "N34-1": {
    "questionEn": "Q1: What is a carbon footprint?",
    "optionsEn": [
      "The total amount of greenhouse gases a person or activity produces.",
      "A new type of shoe.",
      "A way to remove all CO₂ from the air instantly."
    ],
    "correctEn": "a",
    "questionFr": "Q1: Qu’est-ce qu’une empreinte carbone?",
    "optionsFr": [
      "La quantité totale de gaz à effet de serre qu’une personne ou une activité produit.",
      "Un nouveau type de chaussure.",
      "Un moyen d’éliminer instantanément tout le CO₂ de l’air."
    ],
    "correctFr": "a"
  },
  "N34-2": {
    "questionEn": "Q2: How can someone reduce their carbon footprint?",
    "optionsEn": [
      "By using energy-efficient appliances and reducing waste.",
      "By increasing fossil fuel use.",
      "By flying more often."
    ],
    "correctEn": "a",
    "questionFr": "Q2: Comment réduire son empreinte carbone?",
    "optionsFr": [
      "En utilisant des appareils écoénergétiques et en réduisant les déchets.",
      "En consommant plus de combustibles fossiles.",
      "En prenant l’avion plus souvent."
    ],
    "correctFr": "a"
  },
  "N34-3": {
    "questionEn": "Q3: What is a benefit of lowering your carbon footprint?",
    "optionsEn": [
      "It helps fight climate change and preserves natural resources.",
      "It increases air pollution.",
      "It has no effect on the planet."
    ],
    "correctEn": "a",
    "questionFr": "Q3: Quel est un avantage de réduire son empreinte carbone?",
    "optionsFr": [
      "Cela aide à lutter contre le changement climatique et préserve les ressources naturelles.",
      "Cela augmente la pollution de l’air.",
      "Cela n’a aucun effet sur la planète."
    ],
    "correctFr": "a"
  },

  "N59-1": {
    "questionEn": "Q1: What is eco-friendly packaging?",
    "optionsEn": [
      "Packaging that is biodegradable, recyclable, or reusable.",
      "Packaging that never decomposes.",
      "Using excessive plastic and Styrofoam."
    ],
    "correctEn": "a",
    "questionFr": "Q1: Qu’est-ce qu’un emballage écologique?",
    "optionsFr": [
      "Un emballage biodégradable, recyclable ou réutilisable.",
      "Un emballage qui ne se décompose jamais.",
      "Utiliser trop de plastique et de polystyrène."
    ],
    "correctFr": "a"
  },
  "N59-2": {
    "questionEn": "Q2: How does eco-friendly packaging help the planet?",
    "optionsEn": [
      "It reduces waste and pollution.",
      "It increases plastic pollution in the ocean.",
      "It has no environmental impact."
    ],
    "correctEn": "a",
    "questionFr": "Q2: Comment l’emballage écologique aide-t-il la planète?",
    "optionsFr": [
      "Il réduit les déchets et la pollution.",
      "Il augmente la pollution plastique dans l’océan.",
      "Il n’a aucun impact environnemental."
    ],
    "correctFr": "a"
  },
  "N59-3": {
    "questionEn": "Q3: Which of these is an example of eco-friendly packaging?",
    "optionsEn": [
      "Compostable containers made from plant materials.",
      "Plastic packaging that lasts forever.",
      "Wrapping everything in multiple layers of plastic."
    ],
    "correctEn": "a",
    "questionFr": "Q3: Quel est un exemple d’emballage écologique?",
    "optionsFr": [
      "Des contenants compostables faits de matériaux végétaux.",
      "Des emballages plastiques qui durent éternellement.",
      "Emballer tout dans plusieurs couches de plastique."
    ],
    "correctFr": "a"
  },

  "N90-1": {
    "questionEn": "Q1: What does reducing energy consumption mean?",
    "optionsEn": [
      "Using less electricity and fuel to lower environmental impact.",
      "Leaving all appliances running all day.",
      "Burning more fossil fuels."
    ],
    "correctEn": "a",
    "questionFr": "Q1: Que signifie réduire la consommation d’énergie?",
    "optionsFr": [
      "Utiliser moins d’électricité et de carburant pour réduire l’impact environnemental.",
      "Laisser tous les appareils allumés toute la journée.",
      "Brûler plus de combustibles fossiles."
    ],
    "correctFr": "a"
  },
  "N90-2": {
    "questionEn": "Q2: How can people reduce their energy use at home?",
    "optionsEn": [
      "Turning off lights when not in use and using energy-efficient devices.",
      "Leaving the heater and air conditioning on at full power all the time.",
      "Keeping electronics plugged in 24/7."
    ],
    "correctEn": "a",
    "questionFr": "Q2: Comment peut-on réduire sa consommation d’énergie à la maison?",
    "optionsFr": [
      "Éteindre les lumières inutilisées et utiliser des appareils écoénergétiques.",
      "Laisser le chauffage et la climatisation à pleine puissance en permanence.",
      "Garder les appareils électroniques branchés 24 h/24."
    ],
    "correctFr": "a"
  },
  "N90-3": {
    "questionEn": "Q3: Why is reducing energy use important?",
    "optionsEn": [
      "It decreases greenhouse gas emissions and saves money.",
      "It increases global warming.",
      "It has no benefits."
    ],
    "correctEn": "a",
    "questionFr": "Q3: Pourquoi est-il important de réduire sa consommation d’énergie?",
    "optionsFr": [
      "Cela diminue les émissions de gaz à effet de serre et économise de l’argent.",
      "Cela augmente le réchauffement climatique.",
      "Cela n’a aucun avantage."
    ],
    "correctFr": "a"
  },
    "O23-1": {
      "questionEn": "Q1: What is sustainable urban planning?",
      "optionsEn": [
        "Designing cities that balance development with environmental protection.",
        "Building cities without parks or green spaces.",
        "Expanding cities into forests without planning."
      ],
      "correctEn": "a",
      "questionFr": "Q1: Qu’est-ce que l’urbanisme durable?",
      "optionsFr": [
        "Concevoir des villes qui équilibrent développement et protection de l’environnement.",
        "Construire des villes sans parcs ni espaces verts.",
        "Étendre les villes dans les forêts sans planification."
      ],
      "correctFr": "a"
    },
    "O23-2": {
      "questionEn": "Q2: Why is sustainable urban planning important?",
      "optionsEn": [
        "It helps create eco-friendly cities with less pollution.",
        "It increases traffic and waste.",
        "It encourages more urban sprawl."
      ],
      "correctEn": "a",
      "questionFr": "Q2: Pourquoi l’urbanisme durable est-il important?",
      "optionsFr": [
        "Il aide à créer des villes écologiques avec moins de pollution.",
        "Il augmente le trafic et les déchets.",
        "Il encourage l’étalement urbain."
      ],
      "correctFr": "a"
    },
    "O23-3": {
      "questionEn": "Q3: What is an example of sustainable urban planning?",
      "optionsEn": [
        "Developing walkable neighborhoods with public transport access.",
        "Building only highways and parking lots.",
        "Eliminating all parks to make space for roads."
      ],
      "correctEn": "a",
      "questionFr": "Q3: Quel est un exemple d’urbanisme durable?",
      "optionsFr": [
        "Développer des quartiers accessibles à pied avec un bon transport en commun.",
        "Construire uniquement des autoroutes et des parkings.",
        "Éliminer tous les parcs pour faire place aux routes."
      ],
      "correctFr": "a"
    },
  
    "O56-1": {
      "questionEn": "Q1: What does responsible consumerism mean?",
      "optionsEn": [
        "Making eco-conscious choices when buying products.",
        "Buying as many things as possible, regardless of impact.",
        "Ignoring product sustainability."
      ],
      "correctEn": "a",
      "questionFr": "Q1: Que signifie la consommation responsable?",
      "optionsFr": [
        "Faire des choix écologiques lors de l’achat de produits.",
        "Acheter autant que possible sans se soucier des impacts.",
        "Ignorer la durabilité des produits."
      ],
      "correctFr": "a"
    },
    "O56-2": {
      "questionEn": "Q2: How can consumers be more responsible?",
      "optionsEn": [
        "Choosing sustainable brands and avoiding unnecessary waste.",
        "Throwing away items after one use.",
        "Always buying the cheapest products, no matter their impact."
      ],
      "correctEn": "a",
      "questionFr": "Q2: Comment les consommateurs peuvent-ils être plus responsables?",
      "optionsFr": [
        "Choisir des marques durables et éviter le gaspillage inutile.",
        "Jeter les objets après une seule utilisation.",
        "Toujours acheter les produits les moins chers, peu importe leur impact."
      ],
      "correctFr": "a"
    },
    "O56-3": {
      "questionEn": "Q3: Why is responsible consumerism important?",
      "optionsEn": [
        "It supports ethical businesses and reduces environmental harm.",
        "It increases pollution and waste.",
        "It has no effect on the planet."
      ],
      "correctEn": "a",
      "questionFr": "Q3: Pourquoi la consommation responsable est-elle importante?",
      "optionsFr": [
        "Elle soutient les entreprises éthiques et réduit les dommages environnementaux.",
        "Elle augmente la pollution et les déchets.",
        "Elle n’a aucun impact sur la planète."
      ],
      "correctFr": "a"
    },
  
    "O81-1": {
      "questionEn": "Q1: What is the impact of fast fashion on the environment?",
      "optionsEn": [
        "It creates a lot of textile waste and pollution.",
        "It helps reduce waste and promotes recycling.",
        "It has no environmental impact."
      ],
      "correctEn": "a",
      "questionFr": "Q1: Quel est l’impact de la mode rapide sur l’environnement?",
      "optionsFr": [
        "Elle génère beaucoup de déchets textiles et de pollution.",
        "Elle aide à réduire les déchets et encourage le recyclage.",
        "Elle n’a aucun impact environnemental."
      ],
      "correctFr": "a"
    },
    "O81-2": {
      "questionEn": "Q2: How can people reduce their fast fashion impact?",
      "optionsEn": [
        "Buying fewer clothes and choosing sustainable brands.",
        "Throwing away clothes after wearing them once.",
        "Only buying the trendiest clothes regardless of quality."
      ],
      "correctEn": "a",
      "questionFr": "Q2: Comment peut-on réduire son impact sur la mode rapide?",
      "optionsFr": [
        "Acheter moins de vêtements et choisir des marques durables.",
        "Jeter les vêtements après les avoir portés une fois.",
        "Acheter uniquement les vêtements à la mode, quelle que soit leur qualité."
      ],
      "correctFr": "a"
    },
    "O81-3": {
      "questionEn": "Q3: Why is sustainable fashion important?",
      "optionsEn": [
        "It reduces textile waste and promotes ethical labor practices.",
        "It encourages disposable clothing.",
        "It makes fashion less accessible."
      ],
      "correctEn": "a",
      "questionFr": "Q3: Pourquoi la mode durable est-elle importante?",
      "optionsFr": [
        "Elle réduit les déchets textiles et favorise des pratiques de travail éthiques.",
        "Elle encourage les vêtements jetables.",
        "Elle rend la mode moins accessible."
      ],
      "correctFr": "a"
    },
  
    "P45-1": {
      "questionEn": "Q1: What does composting do?",
      "optionsEn": [
        "It turns food scraps and organic waste into nutrient-rich soil.",
        "It makes trash smell better.",
        "It increases landfill waste."
      ],
      "correctEn": "a",
      "questionFr": "Q1: Que fait le compostage?",
      "optionsFr": [
        "Il transforme les déchets alimentaires et organiques en sol riche en nutriments.",
        "Il rend les ordures plus parfumées.",
        "Il augmente les déchets dans les décharges."
      ],
      "correctFr": "a"
    },
    "P45-2": {
      "questionEn": "Q2: Why is composting beneficial for the environment?",
      "optionsEn": [
        "It reduces methane emissions from landfills and enriches soil.",
        "It increases food waste.",
        "It makes soil less fertile."
      ],
      "correctEn": "a",
      "questionFr": "Q2: Pourquoi le compostage est-il bénéfique pour l’environnement?",
      "optionsFr": [
        "Il réduit les émissions de méthane des décharges et enrichit le sol.",
        "Il augmente le gaspillage alimentaire.",
        "Il rend le sol moins fertile."
      ],
      "correctFr": "a"
    },
    "P45-3": {
      "questionEn": "Q3: What can be composted?",
      "optionsEn": [
        "Fruit peels, vegetable scraps, and coffee grounds.",
        "Plastic bottles and glass jars.",
        "Metal cans and electronics."
      ],
      "correctEn": "a",
      "questionFr": "Q3: Que peut-on composter?",
      "optionsFr": [
        "Épluchures de fruits, restes de légumes et marc de café.",
        "Bouteilles en plastique et pots en verre.",
        "Boîtes métalliques et appareils électroniques."
      ],
      "correctFr": "a"
    },
      "P78-1": {
        "questionEn": "Q1: What is permaculture?",
        "optionsEn": [
          "A sustainable way of farming that mimics natural ecosystems.",
          "A method of overusing soil with chemicals.",
          "A way to plant only one type of crop forever."
        ],
        "correctEn": "a",
        "questionFr": "Q1: Qu’est-ce que la permaculture?",
        "optionsFr": [
          "Une méthode d’agriculture durable qui imite les écosystèmes naturels.",
          "Une façon d’épuiser le sol avec des produits chimiques.",
          "Une manière de planter un seul type de culture à jamais."
        ],
        "correctFr": "a"
      },
      "P78-2": {
        "questionEn": "Q2: Why is permaculture beneficial?",
        "optionsEn": [
          "It builds healthy soil and promotes biodiversity.",
          "It makes soil less fertile over time.",
          "It reduces food production."
        ],
        "correctEn": "a",
        "questionFr": "Q2: Pourquoi la permaculture est-elle bénéfique?",
        "optionsFr": [
          "Elle améliore la santé du sol et favorise la biodiversité.",
          "Elle rend le sol moins fertile au fil du temps.",
          "Elle réduit la production alimentaire."
        ],
        "correctFr": "a"
      },
      "P78-3": {
        "questionEn": "Q3: What is an example of permaculture practice?",
        "optionsEn": [
          "Using companion planting and natural pest control.",
          "Using excessive pesticides and monoculture.",
          "Clearing forests to expand farmland."
        ],
        "correctEn": "a",
        "questionFr": "Q3: Quel est un exemple de pratique en permaculture?",
        "optionsFr": [
          "Utiliser des plantations complémentaires et le contrôle naturel des ravageurs.",
          "Utiliser beaucoup de pesticides et la monoculture.",
          "Détruire les forêts pour agrandir les terres agricoles."
        ],
        "correctFr": "a"
      },
    
      "P93-1": {
        "questionEn": "Q1: What does reducing landfill waste mean?",
        "optionsEn": [
          "Throwing away less and recycling more.",
          "Increasing garbage piles.",
          "Burning all trash in open air."
        ],
        "correctEn": "a",
        "questionFr": "Q1: Que signifie réduire les déchets en décharge?",
        "optionsFr": [
          "Jeter moins et recycler davantage.",
          "Augmenter les tas d’ordures.",
          "Brûler tous les déchets à l’air libre."
        ],
        "correctFr": "a"
      },
      "P93-2": {
        "questionEn": "Q2: Why is reducing landfill waste important?",
        "optionsEn": [
          "It decreases pollution and conserves resources.",
          "It has no environmental benefits.",
          "It creates more waste to manage."
        ],
        "correctEn": "a",
        "questionFr": "Q2: Pourquoi réduire les déchets en décharge est-il important?",
        "optionsFr": [
          "Cela réduit la pollution et conserve les ressources.",
          "Cela n’a aucun avantage environnemental.",
          "Cela crée plus de déchets à gérer."
        ],
        "correctFr": "a"
      },
      "P93-3": {
        "questionEn": "Q3: What is one way to reduce landfill waste?",
        "optionsEn": [
          "Composting food scraps and recycling materials.",
          "Throwing everything in one trash bin.",
          "Burying waste in your backyard."
        ],
        "correctEn": "a",
        "questionFr": "Q3: Quelle est une façon de réduire les déchets en décharge?",
        "optionsFr": [
          "Composter les restes de nourriture et recycler les matériaux.",
          "Tout jeter dans une seule poubelle.",
          "Enterrer les déchets dans son jardin."
        ],
        "correctFr": "a"
      },
    
      "Q16-1": {
        "questionEn": "Q1: What does eco-friendly transportation mean?",
        "optionsEn": [
          "Using transportation methods that reduce pollution.",
          "Driving a gas-guzzling car everywhere.",
          "Avoiding public transit at all costs."
        ],
        "correctEn": "a",
        "questionFr": "Q1: Que signifie un transport écologique?",
        "optionsFr": [
          "Utiliser des moyens de transport qui réduisent la pollution.",
          "Conduire une voiture très polluante partout.",
          "Éviter le transport en commun à tout prix."
        ],
        "correctFr": "a"
      },
      "Q16-2": {
        "questionEn": "Q2: How does eco-friendly transportation help the planet?",
        "optionsEn": [
          "It reduces carbon emissions and air pollution.",
          "It increases fossil fuel use.",
          "It has no impact on the environment."
        ],
        "correctEn": "a",
        "questionFr": "Q2: Comment le transport écologique aide-t-il la planète?",
        "optionsFr": [
          "Il réduit les émissions de carbone et la pollution de l’air.",
          "Il augmente l’utilisation des combustibles fossiles.",
          "Il n’a aucun impact sur l’environnement."
        ],
        "correctFr": "a"
      },
      "Q16-3": {
        "questionEn": "Q3: What is an example of eco-friendly transportation?",
        "optionsEn": [
          "Using bicycles, electric buses, or carpooling.",
          "Flying private jets for short trips.",
          "Driving alone in a large truck every day."
        ],
        "correctEn": "a",
        "questionFr": "Q3: Quel est un exemple de transport écologique?",
        "optionsFr": [
          "Utiliser des vélos, des bus électriques ou le covoiturage.",
          "Prendre des jets privés pour de courts trajets.",
          "Conduire seul un gros camion tous les jours."
        ],
        "correctFr": "a"
      },
    
      "Q67-1": {
        "questionEn": "Q1: What is energy conservation?",
        "optionsEn": [
          "Using energy efficiently to reduce waste.",
          "Wasting as much electricity as possible.",
          "Leaving devices on all the time."
        ],
        "correctEn": "a",
        "questionFr": "Q1: Qu’est-ce que la conservation de l’énergie?",
        "optionsFr": [
          "Utiliser l’énergie efficacement pour réduire le gaspillage.",
          "Gaspiller autant d’électricité que possible.",
          "Laisser les appareils allumés en permanence."
        ],
        "correctFr": "a"
      },
      "Q67-2": {
        "questionEn": "Q2: Why is conserving energy important?",
        "optionsEn": [
          "It reduces environmental impact and lowers costs.",
          "It increases pollution and expenses.",
          "It has no effect on energy use."
        ],
        "correctEn": "a",
        "questionFr": "Q2: Pourquoi la conservation de l’énergie est-elle importante?",
        "optionsFr": [
          "Elle réduit l’impact environnemental et diminue les coûts.",
          "Elle augmente la pollution et les dépenses.",
          "Elle n’a aucun effet sur l’utilisation de l’énergie."
        ],
        "correctFr": "a"
      },
      "Q67-3": {
        "questionEn": "Q3: What is one way to conserve energy at home?",
        "optionsEn": [
          "Turning off lights and electronics when not in use.",
          "Keeping windows open when the heater is on.",
          "Leaving the fridge door open."
        ],
        "correctEn": "a",
        "questionFr": "Q3: Quelle est une façon d’économiser de l’énergie à la maison?",
        "optionsFr": [
          "Éteindre les lumières et les appareils électroniques quand ils ne sont pas utilisés.",
          "Laisser les fenêtres ouvertes avec le chauffage allumé.",
          "Laisser la porte du frigo ouverte."
        ],
        "correctFr": "a"
      },
        "Q90-1": {
          "questionEn": "Q1: What is a circular economy?",
          "optionsEn": [
            "An economic system that minimizes waste by reusing and recycling materials.",
            "A system that encourages constant waste production.",
            "A way to throw away products faster."
          ],
          "correctEn": "a",
          "questionFr": "Q1: Qu’est-ce qu’une économie circulaire?",
          "optionsFr": [
            "Un système économique qui minimise les déchets en réutilisant et recyclant les matériaux.",
            "Un système qui encourage la production constante de déchets.",
            "Une façon de jeter les produits plus rapidement."
          ],
          "correctFr": "a"
        },
        "Q90-2": {
          "questionEn": "Q2: Why is a circular economy beneficial?",
          "optionsEn": [
            "It reduces waste, conserves resources, and lowers pollution.",
            "It increases waste and environmental damage.",
            "It makes products less durable."
          ],
          "correctEn": "a",
          "questionFr": "Q2: Pourquoi une économie circulaire est-elle bénéfique?",
          "optionsFr": [
            "Elle réduit les déchets, conserve les ressources et diminue la pollution.",
            "Elle augmente les déchets et les dommages environnementaux.",
            "Elle rend les produits moins durables."
          ],
          "correctFr": "a"
        },
        "Q90-3": {
          "questionEn": "Q3: What is an example of a circular economy practice?",
          "optionsEn": [
            "Repairing and repurposing old products instead of discarding them.",
            "Throwing away electronics when they stop working.",
            "Burning waste materials."
          ],
          "correctEn": "a",
          "questionFr": "Q3: Quel est un exemple de pratique d’économie circulaire?",
          "optionsFr": [
            "Réparer et réutiliser les anciens produits au lieu de les jeter.",
            "Jeter les appareils électroniques dès qu’ils cessent de fonctionner.",
            "Brûler les matériaux usagés."
          ],
          "correctFr": "a"
        },
      
        "R23-1": {
          "questionEn": "Q1: What is sustainable urban planning?",
          "optionsEn": [
            "Designing cities to balance environmental, economic, and social needs.",
            "Building as many roads and factories as possible with no green spaces.",
            "Ignoring environmental concerns in city development."
          ],
          "correctEn": "a",
          "questionFr": "Q1: Qu’est-ce que l’urbanisme durable?",
          "optionsFr": [
            "Concevoir des villes en équilibrant les besoins environnementaux, économiques et sociaux.",
            "Construire autant de routes et d’usines que possible sans espaces verts.",
            "Ignorer les préoccupations environnementales dans le développement urbain."
          ],
          "correctFr": "a"
        },
        "R23-2": {
          "questionEn": "Q2: Why is sustainable urban planning important?",
          "optionsEn": [
            "It improves city livability and reduces pollution.",
            "It has no effect on city environments.",
            "It increases congestion and pollution."
          ],
          "correctEn": "a",
          "questionFr": "Q2: Pourquoi l’urbanisme durable est-il important?",
          "optionsFr": [
            "Il améliore la qualité de vie en ville et réduit la pollution.",
            "Il n’a aucun effet sur l’environnement urbain.",
            "Il augmente les embouteillages et la pollution."
          ],
          "correctFr": "a"
        },
        "R23-3": {
          "questionEn": "Q3: What is an example of sustainable urban planning?",
          "optionsEn": [
            "Creating pedestrian zones and efficient public transit.",
            "Expanding highways without alternatives.",
            "Eliminating parks and green spaces."
          ],
          "correctEn": "a",
          "questionFr": "Q3: Quel est un exemple d’urbanisme durable?",
          "optionsFr": [
            "Créer des zones piétonnes et un transport en commun efficace.",
            "Agrandir les autoroutes sans alternatives.",
            "Éliminer les parcs et les espaces verts."
          ],
          "correctFr": "a"
        },
      
        "R38-1": {
          "questionEn": "Q1: What is biodiversity conservation?",
          "optionsEn": [
            "Protecting different species and ecosystems to maintain ecological balance.",
            "Destroying natural habitats.",
            "Ignoring wildlife preservation."
          ],
          "correctEn": "a",
          "questionFr": "Q1: Qu’est-ce que la conservation de la biodiversité?",
          "optionsFr": [
            "Protéger différentes espèces et écosystèmes pour maintenir l’équilibre écologique.",
            "Détruire les habitats naturels.",
            "Ignorer la préservation de la faune."
          ],
          "correctFr": "a"
        },
        "R38-2": {
          "questionEn": "Q2: Why is biodiversity conservation important?",
          "optionsEn": [
            "It supports ecosystems that humans rely on for food, air, and water.",
            "It has no impact on human life.",
            "It only benefits one species."
          ],
          "correctEn": "a",
          "questionFr": "Q2: Pourquoi la conservation de la biodiversité est-elle importante?",
          "optionsFr": [
            "Elle soutient les écosystèmes dont les humains dépendent pour la nourriture, l’air et l’eau.",
            "Elle n’a aucun impact sur la vie humaine.",
            "Elle ne bénéficie qu’à une seule espèce."
          ],
          "correctFr": "a"
        },
        "R38-3": {
          "questionEn": "Q3: How can people help protect biodiversity?",
          "optionsEn": [
            "Supporting conservation programs and reducing habitat destruction.",
            "Polluting natural areas.",
            "Hunting endangered species."
          ],
          "correctEn": "a",
          "questionFr": "Q3: Comment les gens peuvent-ils aider à protéger la biodiversité?",
          "optionsFr": [
            "Soutenir les programmes de conservation et réduire la destruction des habitats.",
            "Polluer les espaces naturels.",
            "Chasser les espèces en danger."
          ],
          "correctFr": "a"
        },
      
        "R89-1": {
          "questionEn": "Q1: What is green infrastructure?",
          "optionsEn": [
            "Using natural solutions like green roofs and rain gardens to manage urban spaces.",
            "Building cities without concern for the environment.",
            "Covering cities entirely in concrete."
          ],
          "correctEn": "a",
          "questionFr": "Q1: Qu’est-ce que l’infrastructure verte?",
          "optionsFr": [
            "Utiliser des solutions naturelles comme les toits verts et les jardins de pluie pour gérer les espaces urbains.",
            "Construire des villes sans se soucier de l’environnement.",
            "Recouvrir les villes entièrement de béton."
          ],
          "correctFr": "a"
        },
        "R89-2": {
          "questionEn": "Q2: Why is green infrastructure beneficial?",
          "optionsEn": [
            "It reduces flooding, improves air quality, and supports biodiversity.",
            "It increases pollution and water runoff.",
            "It replaces green spaces with parking lots."
          ],
          "correctEn": "a",
          "questionFr": "Q2: Pourquoi l’infrastructure verte est-elle bénéfique?",
          "optionsFr": [
            "Elle réduit les inondations, améliore la qualité de l’air et soutient la biodiversité.",
            "Elle augmente la pollution et le ruissellement de l’eau.",
            "Elle remplace les espaces verts par des parkings."
          ],
          "correctFr": "a"
        },
        "R89-3": {
          "questionEn": "Q3: What is an example of green infrastructure?",
          "optionsEn": [
            "Building permeable pavements and tree-lined streets.",
            "Expanding highways with no green spaces.",
            "Draining wetlands for development."
          ],
          "correctEn": "a",
          "questionFr": "Q3: Quel est un exemple d’infrastructure verte?",
          "optionsFr": [
            "Construire des trottoirs perméables et des rues bordées d’arbres.",
            "Élargir les autoroutes sans espaces verts.",
            "Assécher les zones humides pour le développement."
          ],
          "correctFr": "a"
        },
          "S12-1": {
            "questionEn": "Q1: What is an environmental footprint?",
            "optionsEn": [
              "The total impact a person or group has on the environment.",
              "A mark left by shoes on the ground.",
              "A type of endangered species."
            ],
            "correctEn": "a",
            "questionFr": "Q1: Qu’est-ce qu’une empreinte environnementale?",
            "optionsFr": [
              "L’impact total qu’une personne ou un groupe a sur l’environnement.",
              "Une trace laissée par des chaussures sur le sol.",
              "Un type d’espèce en danger."
            ],
            "correctFr": "a"
          },
          "S12-2": {
            "questionEn": "Q2: Why is reducing your environmental footprint important?",
            "optionsEn": [
              "It helps preserve natural resources and reduce pollution.",
              "It has no effect on nature.",
              "It increases environmental damage."
            ],
            "correctEn": "a",
            "questionFr": "Q2: Pourquoi est-il important de réduire son empreinte environnementale?",
            "optionsFr": [
              "Cela aide à préserver les ressources naturelles et à réduire la pollution.",
              "Cela n’a aucun effet sur la nature.",
              "Cela augmente les dommages environnementaux."
            ],
            "correctFr": "a"
          },
          "S12-3": {
            "questionEn": "Q3: What is one way to reduce your environmental footprint?",
            "optionsEn": [
              "Using renewable energy and reducing waste.",
              "Consuming more fossil fuels.",
              "Throwing recyclable materials in the trash."
            ],
            "correctEn": "a",
            "questionFr": "Q3: Quelle est une façon de réduire son empreinte environnementale?",
            "optionsFr": [
              "Utiliser des énergies renouvelables et réduire les déchets.",
              "Consommer plus de combustibles fossiles.",
              "Jeter les matériaux recyclables à la poubelle."
            ],
            "correctFr": "a"
          },
        
          "S45-1": {
            "questionEn": "Q1: What does 'responsible consumption' mean?",
            "optionsEn": [
              "Making choices that minimize environmental and social harm.",
              "Buying as many products as possible.",
              "Throwing away items after one use."
            ],
            "correctEn": "a",
            "questionFr": "Q1: Que signifie « consommation responsable »?",
            "optionsFr": [
              "Faire des choix qui minimisent les impacts environnementaux et sociaux.",
              "Acheter autant de produits que possible.",
              "Jeter les objets après une seule utilisation."
            ],
            "correctFr": "a"
          },
          "S45-2": {
            "questionEn": "Q2: Why is responsible consumption important?",
            "optionsEn": [
              "It reduces waste, pollution, and supports ethical production.",
              "It increases overconsumption and waste.",
              "It has no impact on sustainability."
            ],
            "correctEn": "a",
            "questionFr": "Q2: Pourquoi la consommation responsable est-elle importante?",
            "optionsFr": [
              "Elle réduit les déchets, la pollution et soutient une production éthique.",
              "Elle augmente la surconsommation et les déchets.",
              "Elle n’a aucun impact sur la durabilité."
            ],
            "correctFr": "a"
          },
          "S45-3": {
            "questionEn": "Q3: What is an example of responsible consumption?",
            "optionsEn": [
              "Buying locally-produced and sustainable goods.",
              "Throwing away food before eating it.",
              "Only purchasing fast fashion products."
            ],
            "correctEn": "a",
            "questionFr": "Q3: Quel est un exemple de consommation responsable?",
            "optionsFr": [
              "Acheter des produits locaux et durables.",
              "Jeter la nourriture avant de la manger.",
              "Acheter uniquement des produits de la mode rapide."
            ],
            "correctFr": "a"
          },
        
          "S60-1": {
            "questionEn": "Q1: What is sustainable water management?",
            "optionsEn": [
              "Using and managing water resources efficiently to prevent waste.",
              "Wasting as much water as possible.",
              "Only using bottled water."
            ],
            "correctEn": "a",
            "questionFr": "Q1: Qu’est-ce que la gestion durable de l’eau?",
            "optionsFr": [
              "Utiliser et gérer efficacement les ressources en eau pour éviter le gaspillage.",
              "Gaspiller le plus d’eau possible.",
              "Utiliser uniquement de l’eau en bouteille."
            ],
            "correctFr": "a"
          },
          "S60-2": {
            "questionEn": "Q2: Why is sustainable water management important?",
            "optionsEn": [
              "It ensures long-term water availability and reduces shortages.",
              "It has no effect on water supply.",
              "It makes water more expensive."
            ],
            "correctEn": "a",
            "questionFr": "Q2: Pourquoi la gestion durable de l’eau est-elle importante?",
            "optionsFr": [
              "Elle assure la disponibilité de l’eau à long terme et réduit les pénuries.",
              "Elle n’a aucun effet sur l’approvisionnement en eau.",
              "Elle rend l’eau plus chère."
            ],
            "correctFr": "a"
          },
          "S60-3": {
            "questionEn": "Q3: What is an example of sustainable water use?",
            "optionsEn": [
              "Fixing leaks and using water-efficient appliances.",
              "Letting taps run continuously.",
              "Watering lawns excessively."
            ],
            "correctEn": "a",
            "questionFr": "Q3: Quel est un exemple d’utilisation durable de l’eau?",
            "optionsFr": [
              "Réparer les fuites et utiliser des appareils économes en eau.",
              "Laisser les robinets ouverts en permanence.",
              "Arroser les pelouses de manière excessive."
            ],
            "correctFr": "a"
          },        
            "T34-1": {
              "questionEn": "Q1: What does 'reducing carbon emissions' mean?",
              "optionsEn": [
                "Decreasing the amount of CO₂ released into the atmosphere.",
                "Producing more CO₂ on purpose.",
                "Burning more fossil fuels."
              ],
              "correctEn": "a",
              "questionFr": "Q1: Que signifie « réduire les émissions de carbone »?",
              "optionsFr": [
                "Diminuer la quantité de CO₂ libérée dans l’atmosphère.",
                "Produire plus de CO₂ intentionnellement.",
                "Brûler plus de combustibles fossiles."
              ],
              "correctFr": "a"
            },
            "T34-2": {
              "questionEn": "Q2: Why is reducing carbon emissions important?",
              "optionsEn": [
                "It helps slow climate change and global warming.",
                "It has no effect on the environment.",
                "It makes air pollution worse."
              ],
              "correctEn": "a",
              "questionFr": "Q2: Pourquoi est-il important de réduire les émissions de carbone?",
              "optionsFr": [
                "Cela aide à ralentir le changement climatique et le réchauffement planétaire.",
                "Cela n’a aucun effet sur l’environnement.",
                "Cela aggrave la pollution de l’air."
              ],
              "correctFr": "a"
            },
            "T34-3": {
              "questionEn": "Q3: What is a way to reduce carbon emissions?",
              "optionsEn": [
                "Using public transportation and renewable energy.",
                "Driving more gasoline-powered cars.",
                "Burning coal at home."
              ],
              "correctEn": "a",
              "questionFr": "Q3: Quelle est une façon de réduire les émissions de carbone?",
              "optionsFr": [
                "Utiliser les transports en commun et les énergies renouvelables.",
                "Conduire plus de voitures à essence.",
                "Brûler du charbon à la maison."
              ],
              "correctFr": "a"
            },
          
            "T67-1": {
              "questionEn": "Q1: What does 'recycling electronics' involve?",
              "optionsEn": [
                "Properly disposing of old electronics to recover materials.",
                "Throwing old devices into the trash.",
                "Burning electronics in a fire."
              ],
              "correctEn": "a",
              "questionFr": "Q1: En quoi consiste le recyclage des appareils électroniques?",
              "optionsFr": [
                "Jeter correctement les vieux appareils pour récupérer les matériaux.",
                "Jeter les vieux appareils à la poubelle.",
                "Brûler les appareils électroniques dans un feu."
              ],
              "correctFr": "a"
            },
            "T67-2": {
              "questionEn": "Q2: Why is recycling electronics important?",
              "optionsEn": [
                "It prevents toxic waste from polluting the environment.",
                "It increases electronic waste in landfills.",
                "It has no environmental benefit."
              ],
              "correctEn": "a",
              "questionFr": "Q2: Pourquoi est-il important de recycler les appareils électroniques?",
              "optionsFr": [
                "Cela empêche les déchets toxiques de polluer l’environnement.",
                "Cela augmente les déchets électroniques dans les décharges.",
                "Cela n’a aucun bénéfice environnemental."
              ],
              "correctFr": "a"
            },
            "T67-3": {
              "questionEn": "Q3: How can you recycle electronics responsibly?",
              "optionsEn": [
                "Taking them to certified e-waste recycling centers.",
                "Throwing them into regular trash bins.",
                "Breaking them apart and scattering the pieces."
              ],
              "correctEn": "a",
              "questionFr": "Q3: Comment peut-on recycler les appareils électroniques de manière responsable?",
              "optionsFr": [
                "Les apporter à des centres de recyclage de déchets électroniques certifiés.",
                "Les jeter dans les poubelles ordinaires.",
                "Les casser et disperser les morceaux."
              ],
              "correctFr": "a"
            },
          
            "T82-1": {
              "questionEn": "Q1: What is an energy-efficient building?",
              "optionsEn": [
                "A building designed to use less energy and reduce waste.",
                "A building that wastes as much energy as possible.",
                "A building with no insulation at all."
              ],
              "correctEn": "a",
              "questionFr": "Q1: Qu’est-ce qu’un bâtiment écoénergétique?",
              "optionsFr": [
                "Un bâtiment conçu pour consommer moins d’énergie et réduire le gaspillage.",
                "Un bâtiment qui gaspille le plus d’énergie possible.",
                "Un bâtiment sans isolation du tout."
              ],
              "correctFr": "a"
            },
            "T82-2": {
              "questionEn": "Q2: Why are energy-efficient buildings beneficial?",
              "optionsEn": [
                "They lower electricity costs and reduce carbon emissions.",
                "They increase energy waste.",
                "They make buildings less comfortable."
              ],
              "correctEn": "a",
              "questionFr": "Q2: Pourquoi les bâtiments écoénergétiques sont-ils bénéfiques?",
              "optionsFr": [
                "Ils réduisent les coûts d’électricité et les émissions de carbone.",
                "Ils augmentent le gaspillage d’énergie.",
                "Ils rendent les bâtiments moins confortables."
              ],
              "correctFr": "a"
            },
            "T82-3": {
              "questionEn": "Q3: What is a feature of an energy-efficient building?",
              "optionsEn": [
                "Good insulation and renewable energy sources.",
                "Large single-pane windows with no insulation.",
                "Old appliances that use excessive electricity."
              ],
              "correctEn": "a",
              "questionFr": "Q3: Quelle est une caractéristique d’un bâtiment écoénergétique?",
              "optionsFr": [
                "Une bonne isolation et des sources d’énergie renouvelable.",
                "De grandes fenêtres à simple vitrage sans isolation.",
                "De vieux appareils qui consomment trop d’électricité."
              ],
              "correctFr": "a"
            },
          
            "U56-1": {
              "questionEn": "Q1: What is sustainable transportation?",
              "optionsEn": [
                "Using methods of transport that reduce environmental impact.",
                "Driving everywhere in a diesel truck.",
                "Taking unnecessary flights."
              ],
              "correctEn": "a",
              "questionFr": "Q1: Qu’est-ce que le transport durable?",
              "optionsFr": [
                "Utiliser des modes de transport qui réduisent l’impact environnemental.",
                "Conduire partout en camion diesel.",
                "Prendre des vols inutiles."
              ],
              "correctFr": "a"
            },
            "U56-2": {
              "questionEn": "Q2: Why is sustainable transportation important?",
              "optionsEn": [
                "It reduces air pollution and carbon emissions.",
                "It increases traffic and fuel consumption.",
                "It has no effect on the environment."
              ],
              "correctEn": "a",
              "questionFr": "Q2: Pourquoi le transport durable est-il important?",
              "optionsFr": [
                "Il réduit la pollution de l’air et les émissions de carbone.",
                "Il augmente la circulation et la consommation de carburant.",
                "Il n’a aucun effet sur l’environnement."
              ],
              "correctFr": "a"
            },
            "U56-3": {
              "questionEn": "Q3: What is an example of sustainable transportation?",
              "optionsEn": [
                "Using bicycles, public transit, or electric vehicles.",
                "Driving alone in a gas-powered SUV.",
                "Taking a plane for short trips."
              ],
              "correctEn": "a",
              "questionFr": "Q3: Quel est un exemple de transport durable?",
              "optionsFr": [
                "Utiliser des vélos, le transport en commun ou des véhicules électriques.",
                "Conduire seul dans un VUS à essence.",
                "Prendre l’avion pour de courts trajets."
              ],
              "correctFr": "a"
            },

              "U89-1": {
                "questionEn": "Q1: What is composting?",
                "optionsEn": [
                  "Turning organic waste into nutrient-rich soil.",
                  "Throwing all waste into landfills.",
                  "Burning food scraps for energy."
                ],
                "correctEn": "a",
                "questionFr": "Q1: Qu’est-ce que le compostage?",
                "optionsFr": [
                  "Transformer les déchets organiques en sol riche en nutriments.",
                  "Jeter tous les déchets dans les décharges.",
                  "Brûler les restes de nourriture pour en faire de l’énergie."
                ],
                "correctFr": "a"
              },
              "U89-2": {
                "questionEn": "Q2: Why is composting beneficial?",
                "optionsEn": [
                  "It reduces waste and enriches soil naturally.",
                  "It increases landfill waste.",
                  "It creates more plastic pollution."
                ],
                "correctEn": "a",
                "questionFr": "Q2: Pourquoi le compostage est-il bénéfique?",
                "optionsFr": [
                  "Il réduit les déchets et enrichit le sol naturellement.",
                  "Il augmente les déchets en décharge.",
                  "Il crée plus de pollution plastique."
                ],
                "correctFr": "a"
              },
              "U89-3": {
                "questionEn": "Q3: What items can be composted?",
                "optionsEn": [
                  "Fruit and vegetable scraps, leaves, and coffee grounds.",
                  "Plastic bags and glass bottles.",
                  "Metal cans and batteries."
                ],
                "correctEn": "a",
                "questionFr": "Q3: Quels objets peuvent être compostés?",
                "optionsFr": [
                  "Restes de fruits et légumes, feuilles, et marc de café.",
                  "Sacs en plastique et bouteilles en verre.",
                  "Boîtes métalliques et piles."
                ],
                "correctFr": "a"
              },
            
              "U94-1": {
                "questionEn": "Q1: What is sustainable tourism?",
                "optionsEn": [
                  "Traveling in ways that minimize environmental and cultural impact.",
                  "Visiting places and leaving trash behind.",
                  "Taking unnecessary long-haul flights often."
                ],
                "correctEn": "a",
                "questionFr": "Q1: Qu’est-ce que le tourisme durable?",
                "optionsFr": [
                  "Voyager d’une manière qui minimise l’impact environnemental et culturel.",
                  "Visiter des endroits et y laisser des déchets.",
                  "Prendre fréquemment des vols long-courriers inutiles."
                ],
                "correctFr": "a"
              },
              "U94-2": {
                "questionEn": "Q2: Why is sustainable tourism important?",
                "optionsEn": [
                  "It helps protect natural and cultural heritage.",
                  "It increases pollution in popular destinations.",
                  "It has no effect on the environment."
                ],
                "correctEn": "a",
                "questionFr": "Q2: Pourquoi le tourisme durable est-il important?",
                "optionsFr": [
                  "Il aide à protéger le patrimoine naturel et culturel.",
                  "Il augmente la pollution dans les destinations populaires.",
                  "Il n’a aucun effet sur l’environnement."
                ],
                "correctFr": "a"
              },
              "U94-3": {
                "questionEn": "Q3: What is a responsible travel habit?",
                "optionsEn": [
                  "Respecting local cultures and reducing waste.",
                  "Leaving trash in nature while traveling.",
                  "Overusing water and energy in hotels."
                ],
                "correctEn": "a",
                "questionFr": "Q3: Quelle est une habitude de voyage responsable?",
                "optionsFr": [
                  "Respecter les cultures locales et réduire les déchets.",
                  "Laisser des déchets dans la nature en voyage.",
                  "Surconsommer l’eau et l’énergie dans les hôtels."
                ],
                "correctFr": "a"
              },
            
              "V12-1": {
                "questionEn": "Q1: What is green energy?",
                "optionsEn": [
                  "Energy from renewable sources like wind and solar.",
                  "Energy from burning fossil fuels.",
                  "Electricity generated by waste incineration."
                ],
                "correctEn": "a",
                "questionFr": "Q1: Qu’est-ce que l’énergie verte?",
                "optionsFr": [
                  "L’énergie provenant de sources renouvelables comme le vent et le soleil.",
                  "L’énergie issue de la combustion des combustibles fossiles.",
                  "L’électricité produite par l’incinération des déchets."
                ],
                "correctFr": "a"
              },
              "V12-2": {
                "questionEn": "Q2: Why is green energy important?",
                "optionsEn": [
                  "It reduces pollution and dependence on fossil fuels.",
                  "It increases CO₂ emissions.",
                  "It makes energy less reliable."
                ],
                "correctEn": "a",
                "questionFr": "Q2: Pourquoi l’énergie verte est-elle importante?",
                "optionsFr": [
                  "Elle réduit la pollution et la dépendance aux combustibles fossiles.",
                  "Elle augmente les émissions de CO₂.",
                  "Elle rend l’énergie moins fiable."
                ],
                "correctFr": "a"
              },
              "V12-3": {
                "questionEn": "Q3: What is an example of a green energy source?",
                "optionsEn": [
                  "Solar power.",
                  "Coal-fired power plants.",
                  "Diesel generators."
                ],
                "correctEn": "a",
                "questionFr": "Q3: Quel est un exemple de source d’énergie verte?",
                "optionsFr": [
                  "L’énergie solaire.",
                  "Les centrales à charbon.",
                  "Les générateurs diesel."
                ],
                "correctFr": "a"
              },
            
              "V78-1": {
                "questionEn": "Q1: What does 'eco-friendly packaging' mean?",
                "optionsEn": [
                  "Packaging made with sustainable, biodegradable, or recyclable materials.",
                  "Plastic packaging that is thrown away after one use.",
                  "Using excessive wrapping and plastic."
                ],
                "correctEn": "a",
                "questionFr": "Q1: Que signifie « emballage écologique »?",
                "optionsFr": [
                  "Un emballage fabriqué avec des matériaux durables, biodégradables ou recyclables.",
                  "Un emballage en plastique jeté après une seule utilisation.",
                  "Utiliser un emballage excessif en plastique."
                ],
                "correctFr": "a"
              },
              "V78-2": {
                "questionEn": "Q2: Why is eco-friendly packaging important?",
                "optionsEn": [
                  "It reduces plastic waste and pollution.",
                  "It makes products more expensive.",
                  "It increases environmental damage."
                ],
                "correctEn": "a",
                "questionFr": "Q2: Pourquoi l’emballage écologique est-il important?",
                "optionsFr": [
                  "Il réduit les déchets plastiques et la pollution.",
                  "Il rend les produits plus chers.",
                  "Il augmente les dommages environnementaux."
                ],
                "correctFr": "a"
              },
              "V78-3": {
                "questionEn": "Q3: What is an example of eco-friendly packaging?",
                "optionsEn": [
                  "Compostable or recyclable materials.",
                  "Single-use plastic wrapping.",
                  "Excessive layers of non-recyclable plastic."
                ],
                "correctEn": "a",
                "questionFr": "Q3: Quel est un exemple d’emballage écologique?",
                "optionsFr": [
                  "Des matériaux compostables ou recyclables.",
                  "Un emballage plastique à usage unique.",
                  "Des couches excessives de plastique non recyclable."
                ],
                "correctFr": "a"
              },
              
                "W34-1": {
                  "questionEn": "Q1: What is water conservation?",
                  "optionsEn": [
                    "Using water wisely to avoid waste.",
                    "Leaving taps running all day.",
                    "Flooding gardens on purpose."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q1: Qu’est-ce que la conservation de l’eau?",
                  "optionsFr": [
                    "Utiliser l’eau intelligemment pour éviter le gaspillage.",
                    "Laisser les robinets ouverts toute la journée.",
                    "Inonder les jardins intentionnellement."
                  ],
                  "correctFr": "a"
                },
                "W34-2": {
                  "questionEn": "Q2: Why is water conservation important?",
                  "optionsEn": [
                    "It helps save water for future generations.",
                    "It increases water waste.",
                    "It pollutes rivers and lakes."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q2: Pourquoi la conservation de l’eau est-elle importante?",
                  "optionsFr": [
                    "Elle permet d’économiser de l’eau pour les générations futures.",
                    "Elle augmente le gaspillage d’eau.",
                    "Elle pollue les rivières et les lacs."
                  ],
                  "correctFr": "a"
                },
                "W34-3": {
                  "questionEn": "Q3: What is a simple way to conserve water at home?",
                  "optionsEn": [
                    "Turning off the tap while brushing your teeth.",
                    "Leaving the shower running when not in use.",
                    "Using a hose to wash sidewalks daily."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q3: Quelle est une façon simple d’économiser l’eau à la maison?",
                  "optionsFr": [
                    "Fermer le robinet en se brossant les dents.",
                    "Laisser la douche couler quand elle n’est pas utilisée.",
                    "Utiliser un tuyau d’arrosage pour laver les trottoirs tous les jours."
                  ],
                  "correctFr": "a"
                },
              
                "W39-1": {
                  "questionEn": "Q1: What does 'sustainable shopping' mean?",
                  "optionsEn": [
                    "Buying eco-friendly and ethically sourced products.",
                    "Purchasing as much as possible, regardless of waste.",
                    "Choosing the cheapest products without considering sustainability."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q1: Que signifie « achats durables »?",
                  "optionsFr": [
                    "Acheter des produits écologiques et éthiquement responsables.",
                    "Acheter autant que possible, sans se soucier du gaspillage.",
                    "Choisir les produits les moins chers sans tenir compte de la durabilité."
                  ],
                  "correctFr": "a"
                },
                "W39-2": {
                  "questionEn": "Q2: Why is sustainable shopping important?",
                  "optionsEn": [
                    "It reduces waste and supports ethical production.",
                    "It increases pollution and resource waste.",
                    "It has no effect on the environment."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q2: Pourquoi les achats durables sont-ils importants?",
                  "optionsFr": [
                    "Ils réduisent les déchets et soutiennent une production éthique.",
                    "Ils augmentent la pollution et le gaspillage des ressources.",
                    "Ils n’ont aucun effet sur l’environnement."
                  ],
                  "correctFr": "a"
                },
                "W39-3": {
                  "questionEn": "Q3: What is an example of sustainable shopping?",
                  "optionsEn": [
                    "Choosing locally made and biodegradable products.",
                    "Buying excessive packaging and single-use items.",
                    "Ignoring product origins and waste production."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q3: Quel est un exemple d’achat durable?",
                  "optionsFr": [
                    "Choisir des produits locaux et biodégradables.",
                    "Acheter des produits avec trop d’emballage et à usage unique.",
                    "Ignorer l’origine des produits et la production de déchets."
                  ],
                  "correctFr": "a"
                },
              
                "X23-1": {
                  "questionEn": "Q1: What is a carbon footprint?",
                  "optionsEn": [
                    "The total amount of greenhouse gases a person or activity produces.",
                    "A footprint left on the ground.",
                    "The weight of a car’s tires."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q1: Qu’est-ce qu’une empreinte carbone?",
                  "optionsFr": [
                    "La quantité totale de gaz à effet de serre produite par une personne ou une activité.",
                    "Une empreinte laissée sur le sol.",
                    "Le poids des pneus d’une voiture."
                  ],
                  "correctFr": "a"
                },
                "X23-2": {
                  "questionEn": "Q2: Why is reducing your carbon footprint important?",
                  "optionsEn": [
                    "It helps fight climate change.",
                    "It increases global warming.",
                    "It has no impact on the environment."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q2: Pourquoi est-il important de réduire son empreinte carbone?",
                  "optionsFr": [
                    "Cela aide à lutter contre le changement climatique.",
                    "Cela augmente le réchauffement climatique.",
                    "Cela n’a aucun impact sur l’environnement."
                  ],
                  "correctFr": "a"
                },
                "X23-3": {
                  "questionEn": "Q3: What is one way to reduce your carbon footprint?",
                  "optionsEn": [
                    "Using energy-efficient appliances and reducing car use.",
                    "Driving unnecessarily and wasting electricity.",
                    "Burning trash instead of recycling."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q3: Quelle est une façon de réduire son empreinte carbone?",
                  "optionsFr": [
                    "Utiliser des appareils écoénergétiques et réduire l’usage de la voiture.",
                    "Conduire inutilement et gaspiller l’électricité.",
                    "Brûler les déchets au lieu de les recycler."
                  ],
                  "correctFr": "a"
                },
              
                "X56-1": {
                  "questionEn": "Q1: What is upcycling?",
                  "optionsEn": [
                    "Reusing old items creatively to give them a new purpose.",
                    "Throwing away all used items.",
                    "Burning waste to create new products."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q1: Qu’est-ce que l’upcycling?",
                  "optionsFr": [
                    "Réutiliser de vieux objets de manière créative pour leur donner une nouvelle vie.",
                    "Jeter tous les objets usagés.",
                    "Brûler les déchets pour créer de nouveaux produits."
                  ],
                  "correctFr": "a"
                },
                "X56-2": {
                  "questionEn": "Q2: Why is upcycling beneficial?",
                  "optionsEn": [
                    "It reduces waste and promotes sustainability.",
                    "It increases landfill waste.",
                    "It makes waste disappear instantly."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q2: Pourquoi l’upcycling est-il bénéfique?",
                  "optionsFr": [
                    "Il réduit les déchets et favorise la durabilité.",
                    "Il augmente les déchets en décharge.",
                    "Il fait disparaître les déchets instantanément."
                  ],
                  "correctFr": "a"
                },
                "X56-3": {
                  "questionEn": "Q3: What is an example of upcycling?",
                  "optionsEn": [
                    "Turning old clothes into new accessories.",
                    "Throwing away reusable materials.",
                    "Buying only disposable items."
                  ],
                  "correctEn": "a",
                  "questionFr": "Q3: Quel est un exemple d’upcycling?",
                  "optionsFr": [
                    "Transformer de vieux vêtements en nouveaux accessoires.",
                    "Jeter des matériaux réutilisables.",
                    "N’acheter que des objets jetables."
                  ],
                  "correctFr": "a"
                },              
                  "X61-1": {
                    "questionEn": "Q1: What is 'fast fashion'?",
                    "optionsEn": [
                      "The rapid production of cheap, trendy clothing with a high environmental cost.",
                      "Clothing that lasts a lifetime.",
                      "A brand of running shoes."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q1: Qu’est-ce que la « fast fashion »?",
                    "optionsFr": [
                      "La production rapide de vêtements bon marché et tendance avec un coût environnemental élevé.",
                      "Des vêtements qui durent toute une vie.",
                      "Une marque de chaussures de course."
                    ],
                    "correctFr": "a"
                  },
                  "X61-2": {
                    "questionEn": "Q2: Why is fast fashion harmful?",
                    "optionsEn": [
                      "It leads to excessive waste, pollution, and unethical labor practices.",
                      "It makes clothes last longer.",
                      "It helps the environment by using more plastic."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q2: Pourquoi la fast fashion est-elle nuisible?",
                    "optionsFr": [
                      "Elle entraîne un gaspillage excessif, de la pollution et des pratiques de travail non éthiques.",
                      "Elle rend les vêtements plus durables.",
                      "Elle aide l’environnement en utilisant plus de plastique."
                    ],
                    "correctFr": "a"
                  },
                  "X61-3": {
                    "questionEn": "Q3: What is a sustainable alternative to fast fashion?",
                    "optionsEn": [
                      "Buying second-hand clothing or investing in sustainable brands.",
                      "Throwing away clothes after one use.",
                      "Buying as many cheap clothes as possible."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q3: Quelle est une alternative durable à la fast fashion?",
                    "optionsFr": [
                      "Acheter des vêtements d’occasion ou investir dans des marques durables.",
                      "Jeter les vêtements après une seule utilisation.",
                      "Acheter le plus de vêtements bon marché possible."
                    ],
                    "correctFr": "a"
                  },
                
                  "Y45-1": {
                    "questionEn": "Q1: What does 'carbon offsetting' mean?",
                    "optionsEn": [
                      "Compensating for carbon emissions by funding environmental projects.",
                      "Increasing carbon emissions intentionally.",
                      "Ignoring the effects of pollution."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q1: Que signifie la « compensation carbone »?",
                    "optionsFr": [
                      "Compenser les émissions de carbone en finançant des projets environnementaux.",
                      "Augmenter volontairement les émissions de carbone.",
                      "Ignorer les effets de la pollution."
                    ],
                    "correctFr": "a"
                  },
                  "Y45-2": {
                    "questionEn": "Q2: Why is carbon offsetting useful?",
                    "optionsEn": [
                      "It helps balance emissions and supports sustainability.",
                      "It increases air pollution.",
                      "It makes carbon emissions disappear instantly."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q2: Pourquoi la compensation carbone est-elle utile?",
                    "optionsFr": [
                      "Elle aide à équilibrer les émissions et favorise la durabilité.",
                      "Elle augmente la pollution de l’air.",
                      "Elle fait disparaître les émissions de carbone instantanément."
                    ],
                    "correctFr": "a"
                  },
                  "Y45-3": {
                    "questionEn": "Q3: What is an example of carbon offsetting?",
                    "optionsEn": [
                      "Planting trees or investing in renewable energy projects.",
                      "Burning more fossil fuels.",
                      "Using more plastic packaging."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q3: Quel est un exemple de compensation carbone?",
                    "optionsFr": [
                      "Planter des arbres ou investir dans des projets d’énergie renouvelable.",
                      "Brûler plus de combustibles fossiles.",
                      "Utiliser plus d’emballages plastiques."
                    ],
                    "correctFr": "a"
                  },
                
                  "Y78-1": {
                    "questionEn": "Q1: What is 'minimalism' in sustainability?",
                    "optionsEn": [
                      "Living with fewer possessions to reduce waste and environmental impact.",
                      "Buying as much as possible without considering waste.",
                      "Throwing away items frequently."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q1: Qu’est-ce que le « minimalisme » en matière de durabilité?",
                    "optionsFr": [
                      "Vivre avec moins de possessions pour réduire les déchets et l’impact environnemental.",
                      "Acheter autant que possible sans se soucier du gaspillage.",
                      "Jeter des objets fréquemment."
                    ],
                    "correctFr": "a"
                  },
                  "Y78-2": {
                    "questionEn": "Q2: Why is minimalism good for the environment?",
                    "optionsEn": [
                      "It reduces overconsumption and waste production.",
                      "It increases demand for unnecessary items.",
                      "It encourages mass production of cheap goods."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q2: Pourquoi le minimalisme est-il bénéfique pour l’environnement?",
                    "optionsFr": [
                      "Il réduit la surconsommation et la production de déchets.",
                      "Il augmente la demande d’objets inutiles.",
                      "Il encourage la production de masse d’objets bon marché."
                    ],
                    "correctFr": "a"
                  },
                  "Y78-3": {
                    "questionEn": "Q3: What is a way to practice minimalism?",
                    "optionsEn": [
                      "Buying only necessary and durable items.",
                      "Hoarding as many things as possible.",
                      "Replacing everything frequently."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q3: Quelle est une façon de pratiquer le minimalisme?",
                    "optionsFr": [
                      "Acheter seulement les objets nécessaires et durables.",
                      "Accumuler le plus d’objets possible.",
                      "Tout remplacer fréquemment."
                    ],
                    "correctFr": "a"
                  },
                
                  "Z67-1": {
                    "questionEn": "Q1: What does 'eco-friendly commuting' mean?",
                    "optionsEn": [
                      "Using sustainable transportation like biking, walking, or public transit.",
                      "Driving alone in a gas-powered car daily.",
                      "Taking long flights for short trips."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q1: Que signifie « transport écoresponsable »?",
                    "optionsFr": [
                      "Utiliser des moyens de transport durables comme le vélo, la marche ou le transport en commun.",
                      "Conduire seul dans une voiture à essence tous les jours.",
                      "Prendre des vols longs pour de courts trajets."
                    ],
                    "correctFr": "a"
                  },
                  "Z67-2": {
                    "questionEn": "Q2: Why is eco-friendly commuting important?",
                    "optionsEn": [
                      "It reduces carbon emissions and traffic congestion.",
                      "It increases pollution.",
                      "It makes travel more expensive."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q2: Pourquoi le transport écoresponsable est-il important?",
                    "optionsFr": [
                      "Il réduit les émissions de carbone et la congestion routière.",
                      "Il augmente la pollution.",
                      "Il rend les déplacements plus coûteux."
                    ],
                    "correctFr": "a"
                  },
                  "Z67-3": {
                    "questionEn": "Q3: What is an example of eco-friendly commuting?",
                    "optionsEn": [
                      "Carpooling, biking, or taking public transit.",
                      "Driving a large SUV alone for short trips.",
                      "Taking unnecessary flights."
                    ],
                    "correctEn": "a",
                    "questionFr": "Q3: Quel est un exemple de transport écoresponsable?",
                    "optionsFr": [
                      "Le covoiturage, le vélo ou les transports en commun.",
                      "Conduire un gros VUS seul pour de courts trajets.",
                      "Prendre des vols inutiles."
                    ],
                    "correctFr": "a"
                  },
                    "W90-1": {
                      "questionEn": "Q1: What does creating laws for environmental protection involve?",
                      "optionsEn": [
                        "Making no rules at all.",
                        "Setting regulations to protect air, water, and wildlife.",
                        "Allowing unlimited pollution."
                      ],
                      "correctEn": "b",
                      "questionFr": "Q1: En quoi consiste la création de lois pour la protection de l’environnement?",
                      "optionsFr": [
                        "Ne faire aucune règle.",
                        "Établir des règlements pour protéger l’air, l’eau et la faune.",
                        "Permettre la pollution illimitée."
                      ],
                      "correctFr": "b"
                    },
                    "W90-2": {
                      "questionEn": "Q2: Why are environmental laws important?",
                      "optionsEn": [
                        "They have no effect on pollution.",
                        "They hold businesses and individuals accountable, reducing harm.",
                        "They apply only in outer space."
                      ],
                      "correctEn": "b",
                      "questionFr": "Q2: Pourquoi les lois environnementales sont-elles importantes?",
                      "optionsFr": [
                        "Elles n’ont aucun impact sur la pollution.",
                        "Elles responsabilisent les entreprises et les individus, réduisant les dommages.",
                        "Elles ne s’appliquent que dans l’espace."
                      ],
                      "correctFr": "b"
                    },
                    "W90-3": {
                      "questionEn": "Q3: What can happen if a law is violated?",
                      "optionsEn": [
                        "Nothing at all.",
                        "Fines, penalties, or even shutdown of illegal practices.",
                        "The government rewards polluters."
                      ],
                      "correctEn": "b",
                      "questionFr": "Q3: Que peut-il arriver si une loi est violée?",
                      "optionsFr": [
                        "Absolument rien.",
                        "Des amendes, des sanctions ou même la fermeture des pratiques illégales.",
                        "Le gouvernement récompense les pollueurs."
                      ],
                      "correctFr": "b"
                    },
                    "Z90-1": {
                      "questionEn": "Q1: What does it mean to reduce wildfires?",
                      "optionsEn": [
                        "Setting forests on fire for fun.",
                        "Implementing measures to prevent or limit forest fires.",
                        "Removing all water from forests."
                      ],
                      "correctEn": "b",
                      "questionFr": "Q1: Que signifie « réduire les feux de forêt »?",
                      "optionsFr": [
                        "Mettre le feu aux forêts pour s’amuser.",
                        "Mettre en place des mesures pour prévenir ou limiter les incendies.",
                        "Retirer toute l’eau des forêts."
                      ],
                      "correctFr": "b"
                    },
                    "Z90-2": {
                      "questionEn": "Q2: Why do wildfires cause environmental damage?",
                      "optionsEn": [
                        "They create oxygen.",
                        "They destroy habitats, release CO₂, and can harm communities.",
                        "They clean the air of pollutants entirely."
                      ],
                      "correctEn": "b",
                      "questionFr": "Q2: Pourquoi les feux de forêt causent-ils des dommages environnementaux?",
                      "optionsFr": [
                        "Ils créent de l’oxygène.",
                        "Ils détruisent les habitats, libèrent du CO₂ et peuvent nuire aux communautés.",
                        "Ils purifient complètement l’air des polluants."
                      ],
                      "correctFr": "b"
                    },
                    "Z90-3": {
                      "questionEn": "Q3: How can we reduce the risk of wildfires?",
                      "optionsEn": [
                        "Leave campfires unattended.",
                        "Clear dead vegetation, follow fire bans, and manage forests responsibly.",
                        "Throw cigarettes into dry grass."
                      ],
                      "correctEn": "b",
                      "questionFr": "Q3: Comment peut-on réduire le risque de feux de forêt?",
                      "optionsFr": [
                        "Laisser les feux de camp sans surveillance.",
                        "Nettoyer la végétation morte, respecter les interdictions de feu et gérer les forêts de manière responsable.",
                        "Jeter des mégots de cigarette dans l’herbe sèche."
                      ],
                      "correctFr": "b"
                    },
                    "V17-1": {
                      "questionEn": "Q1: What does creating nature reserves involve?",
                      "optionsEn": [
                        "Building malls in forests.",
                        "Designating protected areas for wildlife and plants.",
                        "Letting factories dump chemicals anywhere."
                      ],
                      "correctEn": "b",
                      "questionFr": "Q1: En quoi consiste la création de réserves naturelles?",
                      "optionsFr": [
                        "Construire des centres commerciaux dans les forêts.",
                        "Désigner des zones protégées pour la faune et la flore.",
                        "Laisser les usines déverser des produits chimiques partout."
                      ],
                      "correctFr": "b"
                    },
                    "V17-2": {
                      "questionEn": "Q2: Why are nature reserves important?",
                      "optionsEn": [
                        "They keep animals locked away from humans.",
                        "They preserve ecosystems and species from human impacts.",
                        "They have no role in conservation."
                      ],
                      "correctEn": "b",
                      "questionFr": "Q2: Pourquoi les réserves naturelles sont-elles importantes?",
                      "optionsFr": [
                        "Elles gardent les animaux à l’écart des humains.",
                        "Elles préservent les écosystèmes et les espèces de l’impact humain.",
                        "Elles n’ont aucun rôle dans la conservation."
                      ],
                      "correctFr": "b"
                    },
                    "V17-3": {
                      "questionEn": "Q3: How can people support new nature reserves?",
                      "optionsEn": [
                        "By protesting against protected areas.",
                        "By advocating for legal protection and funding conservation.",
                        "By only visiting them to litter."
                      ],
                      "correctEn": "b",
                      "questionFr": "Q3: Comment peut-on soutenir la création de nouvelles réserves naturelles?",
                      "optionsFr": [
                        "En manifestant contre les zones protégées.",
                        "En faisant valoir une protection légale et en finançant la conservation.",
                        "En ne les visitant que pour y jeter des déchets."
                      ],
                      "correctFr": "b"
                    },
                                 


};

interface ScenarioData {
  id: number;
  shortHintFr: string;
  shortHintEn: string;
  descFr: string;
  descEn: string;
}

const scenarioList: ScenarioData[] = [
  {
    id: 1,
    shortHintFr: "La région est dévastée. Les tornades surviennent généralement quand l'air est chaude et humide.",
    shortHintEn: " The area is devastated. Tornadoes usually occur when the air is warm and humid. Are there any actions that make the air warmer?",
    descFr: "Une tornade a frappé la ville, détruisant des maisons et des arbres.",
    descEn: "A tornado hit the city, destroying homes and trees."
  },
  {
    id: 2,
    shortHintFr: " Les bâtiments sont cassés et les routes bloquées. Quelles actions peut-on poser pour réduire les changements climatiques?",
    shortHintEn: "Buildings are broken and roads are blocked. What actions can be taken to reduce climate change?",
    descFr: "Un grand séisme a secoué la région, cassant des routes et des bâtiments.",
    descEn: "A big earthquake shook the region, breaking roads and buildings."
  },
  {
    id: 3,
    shortHintFr: " L'eau a tout envahi. Les inondations sont des catastrophes naturelles. Qu'est-ce qui cause ces catastrophes naturelles?",
    shortHintEn: "Water is flooding everything. Floods are natural disasters. What causes these natural disasters?",
    descFr: "Il a beaucoup plu, et les rivières ont débordé, noyant des villes entières. Les gens ont dû quitter leurs maisons et les champs ont été inondés.",
    descEn: "It rained a lot, and the rivers overflowed, flooding entire cities. People had to leave their homes, and fields were flooded."
  },
  {
    id: 4,
    shortHintFr: "Les arbres sont coupés. Pourquoi sont-ils coupés? Que fabrique-t-on avec des arbres? ( bois, papier etc…) ",
    shortHintEn: "Trees are cut down. Why are they cut down? What is made from trees? (wood, paper, etc.)",
    descFr: "Des arbres ont été coupés pour faire de la place pour des maisons. Cela a détruit les maisons des animaux et endommagé la terre.",
    descEn: "Trees were cut down to make room for houses. This destroyed animal homes and damaged the land."
  },
  {
    id: 5,
    shortHintFr: "Les vents et l'eau détruisent tout. Qu’est ce qui cause ce genre de catastrophes naturelles? ",
    shortHintEn: "Wind and water are destroying everything. What causes these kinds of natural disasters? ",
    descFr: "Un ouragan puissant a frappé, détruisant des maisons et emportant tout sur son passage. L'eau a submergé les rues, et tout est désormais en ruines.",
    descEn: "A powerful hurricane hit, destroying homes and sweeping everything away. Water flooded the streets, and everything is now in ruins."
  },
  {
    id: 6,
    shortHintFr: "L'eau est rare et les récoltes sont en danger. Comment peut-on économiser de l’eau?",
    shortHintEn: "Water is scarce, and crops are in danger. How can we save water?",
    descFr: "Il ne pleut pas assez, et le niveau d’eau des rivières et des lacs diminue. Cela rend difficile la culture des plantes et l'accès à l'eau.",
    descEn: "There is not enough rain, and the water level in rivers and lakes is dropping. This makes it difficult to grow plants and access water."
  },
  {
    id: 7,
    shortHintFr: "Les ressources sont épuisées. Pourquoi elles sont épuisées?",
    shortHintEn: "Resources are gone. Why are they gone? ",
    descFr: "Il n'y a pas assez d'eau ni de matières pour tout le monde. Cela crée des conflits entre les gens pour ces ressources.",
    descEn: "It isn’t raining enough, and rivers and lakes are almost empty. This makes it hard to grow plants and get waterThere isn’t enough water or materials for everyone. This creates conflicts between people for these resources."
  },
  {
    id: 8,
    shortHintFr: "Des animaux disparaissent. Quelles actions font disparaître ces animaux?",
    shortHintEn: "Animals are disappearing. What actions are causing these animals to disappear?",
    descFr: "Des animaux comme les zèbres et les rhinocéros sont en voie d’extinction. Cela a perturbé la nature et a rendu difficile la survie d'autres animaux.",
    descEn: "Animals like zebras and rhinos are on the verge of extinction. This has disrupted nature and made it difficult for other animals to survive."
  },
  {
    id: 9,
    shortHintFr: "L'air est pollué. Qu’est-ce qui pollue l’air?( maison, voiture..)",
    shortHintEn: "The air is polluted. What pollutes the air? (house, car, etc.) ",
    descFr: "L'air dans les grandes villes est sale et les gens ont du mal à respirer. Cela rend beaucoup de gens malades.",
    descEn: "The air in big cities is dirty and people are having trouble breathing. It makes many people sick."
  },
  {
    id: 10,
    shortHintFr: "Le bruit est trop fort. Qu’est-ce qui fait du bruit dans une ville? (construction, avion, voiture etc)",
    shortHintEn: "The noise is too loud. What makes noise in a city? (construction, airplane etc.)",
    descFr: "La pollution sonore est présente dans plusieurs grandes villes. Le bruit empêche les gens de se reposer et les rend stressés.",
    descEn: " Noise pollution is present in many big cities. Noise prevents people from resting and makes them stressed."
  },
  {
    id: 11,
    shortHintFr: " Les océans sont pollués de déchets. D'où proviennent ces déchets? Comment peut-on améliorer la situation?",
    shortHintEn: "The oceans are polluted with waste. Where does this waste come from? How can the situation be improved?",
    descFr: "Les océans sont remplis de déchets comme des plastiques, ce qui tue beaucoup d'animaux marins.",
    descEn: "The oceans are full of trash like plastics, which is killing many sea animals."
  },
  {
    id: 12,
    shortHintFr: "Il manque de la nourriture. D'où provient la nourriture? Qu’est-ce qu’il faut à une plante pour grandir?",
    shortHintEn: "There is a lack of food. Where does food come from? What does a plant need to grow?",
    descFr: "Une grande famine a frappé un pays, et beaucoup de gens n'ont pas assez à manger.",
    descEn: "A big famine hit a country, and many people don’t have enough food."
  },
  {
    id: 13,
    shortHintFr: "Les incendies se propagent. Qu’est-ce qui cause les feux de forêts? ( chaleur dû aux changements climatiques..)",
    shortHintEn: "The fires are spreading. What causes wildfires?  (heat due to climate change..)",
    descFr: "Des feux de forêt ont brûlé de grandes forêts, détruisant des maisons et mettant en danger des animaux.",
    descEn: "Wildfires burned big forests, destroying homes and putting animals in danger."
  },
  {
    id: 14,
    shortHintFr: "Il fait trop chaud. Pourquoi il fait plus chaud? ( changements climatiques)",
    shortHintEn: "It’s too hot. Why is it getting hotter? (climate change)",
    descFr: "Une chaleur extrême touche la ville. Les gens ont du mal à respirer et les enfants et les personnes âgées sont en danger.",
    descEn: "Extreme heat is hitting the city. People are having trouble breathing, and children and the elderly are in danger."
  },
  {
    id: 15,
    shortHintFr: "Le sol est emporté. Qu’est ce qui peut perturber les sols?( détruit des arbres) Pensez à tout ce qui est construit sur le sol.",
    shortHintEn: "The soil is being washed away. What can disturb the soil? (destroys trees) Think of everything that is built on the soil.",
    descFr: "Le vent et l'eau ont emporté la terre des champs. Cela rend difficile la culture des plantes et diminue la nourriture disponible.",
    descEn: "Wind and water have washed away the soil from fields. This makes it hard to grow plants and reduces available food."
  },
  {
    id: 16,
    shortHintFr: "Les glaciers fondent, faisant monter la mer. Y a t-il des animaux qui habitent sur les glaciers? Quand est-ce que la glace fond? ( chaleur..) ",
    shortHintEn: "The glaciers are melting, raising the sea. Are there animals that live on glaciers? When does the ice melt? (heat..)",
    descFr: "Les glaciers fondent rapidement, et l'eau monte, inondant les villes près de la mer.",
    descEn: "Glaciers are melting quickly, and the water is rising, flooding cities near the sea."
  },
];


const uiTranslations = {
  en: {
    sectionLabel: "Section:",
    team1Label: "Team 1",
    team2Label: "Team 2",
    scenario: "Scenario",
    hints: "Hints",
    hintsText: "Think long-term before choosing a card!",
    cardIdLabel: "CARD ID",
    cardPlaceholder: "Enter your card ID",
    skipRound: "Skip Timer",
    endGame: "End Game",
    endGameConfirm: "Are you sure you want to end the game now?",
    submitCards: "Submit Cards",
    answerQuestion: "Answer the following question:",
    confirmAnswer: "Confirm Answer",
    extraCardMsg: "Correct! You earn an extra bonus card next round!",
    noBonusMsg: "Incorrect. No bonus awarded.",
    roundScore: "Round",
    overallScore: "Score",
    newRoundMsg: "New Round!",
    cardReuseError: "You have already used this card!",
    winnerText: "Round Winner:",
    tieText: "Tie!",
    finalWinnerText: "Winner of the Game:",
    finalCertified: "is a Certified Earth Helper!",
    finalStats: "Final Score",
    finalOk: "OK",
    teamXCards: "CARDS",
    waitForTimerOrSkip:
      "Please wait for the timer to finish or click Skip to proceed to card selection.",
    invalidCardsError: "Invalid card(s) for this scenario.",
    noQuestionDataError: "No question data for one or both cards.",
    waitTimerError: "Wait until the timer ends or skip the round first!",
    bothTeamsCardError: "Both teams must enter a card.",
  },
  fr: {
    sectionLabel: "Classe:",
    team1Label: "Équipe 1",
    team2Label: "Équipe 2",
    scenario: "Scénario",
    hints: "Conseils",
    hintsText: "Pensez à long terme avant de choisir une carte!",
    cardIdLabel: "ID de la Carte",
    cardPlaceholder: "Entrez l'ID de votre carte",
    skipRound: "Passer la tour",
    endGame: "Terminer la Partie",
    endGameConfirm: "Êtes-vous sûr de vouloir terminer la partie maintenant ?",
    submitCards: "Valider les cartes",
    answerQuestion: "Répondez à la question suivante:",
    confirmAnswer: "Confirmer la réponse",
    extraCardMsg: "Correct ! Vous gagnez une carte bonus pour la prochaine manche !",
    noBonusMsg: "Incorrect. Aucun bonus n'est attribué.",
    roundScore: "Ronde",
    overallScore: "Score",
    newRoundMsg: "Nouvelle Ronde!",
    cardReuseError: "Vous avez déjà utilisé cette carte !",
    winnerText: "Vainqueur de la manche :",
    tieText: "Égalité!",
    finalWinnerText: "Vainqueur du jeu :",
    finalCertified: "est certifié Protecteur de la Terre !",
    finalStats: "Score Final",
    finalOk: "OK",
    teamXCards: "CARTES",
    waitForTimerOrSkip:
      "Veuillez attendre la fin du minuteur ou cliquer sur Passer pour accéder à la sélection de carte.",
    invalidCardsError: "Carte(s) invalide(s) pour ce scénario.",
    noQuestionDataError: "Pas de données de question pour une ou les deux cartes.",
    waitTimerError: "Attendez la fin du minuteur ou passez la manche d'abord!",
    bothTeamsCardError: "Les deux équipes doivent saisir une carte.",
  },
};

// -----------------------------------------------------------------------------
// HELPER: Get a random question for a card
// -----------------------------------------------------------------------------
function getRandomQuestionForCard(cardId: string): CardQuestion | null {
  if (cardQuestions[cardId]) {
    return cardQuestions[cardId];
  } else {
    // Some cards might have suffixes like "A12-1", "A12-2", "A12-3"
    const variants: CardQuestion[] = [];
    for (let i = 1; i <= 3; i++) {
      const variantKey = `${cardId}-${i}`;
      if (cardQuestions[variantKey]) {
        variants.push(cardQuestions[variantKey]);
      }
    }
    if (variants.length > 0) {
      return variants[Math.floor(Math.random() * variants.length)];
    }
  }
  return null;
}
// BEGINNING FROM function GameContent() ONWARDS
// (Ensure you've already defined uiTranslations, scenarioList, newScenarioRankings, etc. above this.)
function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Language State
  const [lang, setLang] = useState<"en" | "fr">("en");

  // On mount, check URL param first then localStorage
  useEffect(() => {
    const urlLang = searchParams.get("lang") as "en" | "fr" | null;
    if (urlLang) {
      setLang(urlLang);
      localStorage.setItem("selectedLang", urlLang);
    } else if (typeof window !== "undefined") {
      const storedLang = localStorage.getItem("selectedLang") as "en" | "fr" | null;
      if (storedLang) {
        setLang(storedLang);
      }
    }
  }, [searchParams]);

  // Switch language function
  const switchLanguage = (newLang: "en" | "fr") => {
    setLang(newLang);
    localStorage.setItem("selectedLang", newLang);
  };

  // Shortcuts for translations
  const t = uiTranslations[lang];

  // Team names
  const team1Name = searchParams.get("team1") || (lang === "fr" ? "Équipe 1" : "Team 1");
  const team2Name = searchParams.get("team2") || (lang === "fr" ? "Équipe 2" : "Team 2");

  // Game constants
  const totalRounds = 15;
  const initialTime = 90;

  // Round states
  const [roundsPlayed, setRoundsPlayed] = useState(0);
  const [team1Wins, setTeam1Wins] = useState(0);
  const [team2Wins, setTeam2Wins] = useState(0);

  // Card counts
  const [team1CardCount, setTeam1CardCount] = useState(5);
  const [team2CardCount, setTeam2CardCount] = useState(5);

  // Used cards (only appended after round finishes)
  const [usedCardsTeam1, setUsedCardsTeam1] = useState<string[]>([]);
  const [usedCardsTeam2, setUsedCardsTeam2] = useState<string[]>([]);

  // Shuffle scenarios on mount
  const [shuffledScenarios, setShuffledScenarios] = useState(scenarioList);
  useEffect(() => {
    // Simple shuffle
    const arr = [...scenarioList];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledScenarios(arr);
  }, []);

  // Scenario index
  const [scenarioIndex, setScenarioIndex] = useState(0);

  // Timer
  const [timeLeft, setTimeLeft] = useState(initialTime);

  // UI states
  const [showQuestionPhase, setShowQuestionPhase] = useState(false);
  const [cardError, setCardError] = useState("");

  // Round winner overlay
  const [roundWinner, setRoundWinner] = useState<"team1" | "team2" | "tie" | null>(null);
  const [showRoundWinner, setShowRoundWinner] = useState(false);

  // New round animation
  const [showNewRoundAnim, setShowNewRoundAnim] = useState(false);

  // Card input
  const [team1Card, setTeam1Card] = useState("");
  const [team2Card, setTeam2Card] = useState("");

  // Q&A
  const [team1Question, setTeam1Question] = useState<any>(null);
  const [team2Question, setTeam2Question] = useState<any>(null);
  const [team1Answer, setTeam1Answer] = useState("");
  const [team2Answer, setTeam2Answer] = useState("");
  const [team1Confirmed, setTeam1Confirmed] = useState(false);
  const [team2Confirmed, setTeam2Confirmed] = useState(false);
  const [team1Bonus, setTeam1Bonus] = useState(false);
  const [team2Bonus, setTeam2Bonus] = useState(false);

  // For coloring correct/incorrect:
  const [team1AnswerCorrect, setTeam1AnswerCorrect] = useState(false);
  const [team2AnswerCorrect, setTeam2AnswerCorrect] = useState(false);

  // End Game / Final Certificate
  const [showFinalCertificate, setShowFinalCertificate] = useState(false);

  // Admin password (optional)
  const [adminPassword, setAdminPassword] = useState("");
  // Admin panel collapsible
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Collapsible hints
  const [showHints, setShowHints] = useState(false);

  // On scenario or round change
  useEffect(() => {
    if (roundsPlayed >= totalRounds) {
      setShowFinalCertificate(true);
    } else if (shuffledScenarios.length > 0) {
      setScenarioIndex(roundsPlayed % shuffledScenarios.length);
    }
  }, [roundsPlayed, totalRounds, shuffledScenarios]);

  // Current scenario
  const currentScenario = shuffledScenarios[scenarioIndex];
  const scenarioDescription = currentScenario
    ? lang === "fr"
      ? currentScenario.descFr
      : currentScenario.descEn
    : "No scenario available.";

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // End game
  function handleEndGame() {
    if (window.confirm(t.endGameConfirm)) {
      setRoundsPlayed(totalRounds);
      setShowFinalCertificate(true);
    }
  }

  // Submit cards
  function handleSubmitCards() {
    if (timeLeft > 0) {
      setCardError(t.waitTimerError);
      return;
    }
    const c1 = team1Card.trim().toUpperCase();
    const c2 = team2Card.trim().toUpperCase();
    if (!c1 || !c2) {
      setCardError(t.bothTeamsCardError);
      return;
    }

    // We only check if it's valid scenario card, not if it's "already used" here
    // The "used" logic is now handled after awarding the round.
    setCardError("");
    triggerQuestionPhase();
  }

  // Trigger question phase
  const triggerQuestionPhase = useCallback(() => {
    if (!currentScenario) return;
    const scenarioId = currentScenario.id;
    const ranking = newScenarioRankings[scenarioId] || [];
    const c1 = team1Card.trim().toUpperCase();
    const c2 = team2Card.trim().toUpperCase();

    // Check if these cards are valid for the scenario
    if (!ranking.includes(c1) || !ranking.includes(c2)) {
      setCardError(t.invalidCardsError);
      return;
    }

    // Attempt to get question data
    const qData1 = getRandomQuestionForCard(c1);
    const qData2 = getRandomQuestionForCard(c2);
    if (!qData1 || !qData2) {
      setCardError(t.noQuestionDataError);
      return;
    }
    setTeam1Question(qData1);
    setTeam2Question(qData2);
    setTeam1Answer("");
    setTeam2Answer("");
    setTeam1Confirmed(false);
    setTeam2Confirmed(false);
    setTeam1Bonus(false);
    setTeam2Bonus(false);
    setTeam1AnswerCorrect(false);
    setTeam2AnswerCorrect(false);

    setShowQuestionPhase(true);
  }, [currentScenario, team1Card, team2Card, t]);

  // Handle answers
  function handleAnswer(team: "team1" | "team2", answer: string) {
    if (team === "team1") setTeam1Answer(answer);
    else setTeam2Answer(answer);
  }

  function confirmAnswer(team: "team1" | "team2") {
    if (team === "team1" && team1Question) {
      const correctKey = lang === "fr" ? team1Question.correctFr : team1Question.correctEn;
      const isCorrect = team1Answer === correctKey;
      setTeam1Confirmed(true);
      setTeam1Bonus(isCorrect);
      setTeam1AnswerCorrect(isCorrect);
    } else if (team === "team2" && team2Question) {
      const correctKey = lang === "fr" ? team2Question.correctFr : team2Question.correctEn;
      const isCorrect = team2Answer === correctKey;
      setTeam2Confirmed(true);
      setTeam2Bonus(isCorrect);
      setTeam2AnswerCorrect(isCorrect);
    }
  }

  // Award round
  const awardRound = useCallback(
    (winner: "team1" | "team2", tie = false) => {
      const c1 = team1Card.trim().toUpperCase();
      const c2 = team2Card.trim().toUpperCase();

      // Mark these cards as used, but only once per round
      // (If there's a tie, awardRound might be called twice, so we guard against duplicates)
      setUsedCardsTeam1((prev) =>
        prev.includes(c1) ? prev : [...prev, c1]
      );
      setUsedCardsTeam2((prev) =>
        prev.includes(c2) ? prev : [...prev, c2]
      );

      if (!tie) {
        if (winner === "team1") {
          setTeam1Wins((prev) => prev + 1);
          setRoundWinner("team1");
        } else {
          setTeam2Wins((prev) => prev + 1);
          setRoundWinner("team2");
        }
      } else {
        setRoundWinner("tie");
      }
      // Bonus cards
      if (team1Bonus) setTeam1CardCount((prev) => prev + 1);
      if (team2Bonus) setTeam2CardCount((prev) => prev + 1);

      // Show round winner
      setShowRoundWinner(true);
      setTimeout(() => {
        setShowRoundWinner(false);
        setShowNewRoundAnim(true);
        setTimeout(() => {
          setShowNewRoundAnim(false);
          setTeam1Card("");
          setTeam2Card("");
          setTeam1Question(null);
          setTeam2Question(null);
          setTeam1Answer("");
          setTeam2Answer("");
          setTeam1Confirmed(false);
          setTeam2Confirmed(false);
          setTeam1Bonus(false);
          setTeam2Bonus(false);
          setTeam1AnswerCorrect(false);
          setTeam2AnswerCorrect(false);

          setTimeLeft(initialTime);
          setCardError("");
          setShowQuestionPhase(false);
          setRoundsPlayed((prev) => prev + 1);
        }, 2000);
      }, 2000);
    },
    [team1Bonus, team2Bonus, team1Card, team2Card, initialTime]
  );

  // Decide round winner after both confirm Q
  useEffect(() => {
    if (
      showQuestionPhase &&
      team1Confirmed &&
      team2Confirmed &&
      team1Card &&
      team2Card &&
      currentScenario &&
      !showFinalCertificate
    ) {
      const scenarioId = currentScenario.id;
      const ranking = newScenarioRankings[scenarioId] || [];
      const c1 = team1Card.trim().toUpperCase();
      const c2 = team2Card.trim().toUpperCase();
      const idx1 = ranking.indexOf(c1);
      const idx2 = ranking.indexOf(c2);

      if (idx1 < 0 || idx2 < 0) {
        // tie if both invalid
        awardRound("team1", true);
        awardRound("team2", true);
      } else if (idx1 < idx2) {
        awardRound("team1");
      } else if (idx2 < idx1) {
        awardRound("team2");
      } else {
        // tie
        awardRound("team1", true);
        awardRound("team2", true);
      }
    }
  }, [
    showQuestionPhase,
    team1Confirmed,
    team2Confirmed,
    team1Card,
    team2Card,
    currentScenario,
    showFinalCertificate,
    awardRound,
  ]);

  // Final winner
  const winningTeam =
    team1Wins > team2Wins ? team1Name : team2Wins > team1Wins ? team2Name : null;

  const gameOver = roundsPlayed >= totalRounds || showFinalCertificate;

  // When certificate is acknowledged, redirect to mini-game
  function handleCertificateOk() {
    router.push("/mini-game");
  }

  // Admin force mini-game
  function handleAdminForceStart() {
    if (adminPassword === "1234") {
      router.push("/mini-game");
    } else {
      alert("Incorrect admin password!");
    }
  }

  // Toggle admin panel
  function toggleAdminPanel() {
    setShowAdminPanel((prev) => !prev);
  }

  // We only allow card entry if timeLeft == 0 and not in question phase
  const inCardEntryMode = timeLeft <= 0 && !showQuestionPhase && !gameOver;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/bgsimple.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        flexDirection: "column",
        color: "white",
      }}
    >
      {/* TOP BAR / HEADER */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3rem",
          backgroundColor: "#1f2937",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0 1rem",
          zIndex: 9999,
        }}
      >
        {/* Language Switch Buttons */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={() => switchLanguage("en")}
            style={{
              padding: "0.3rem 0.6rem",
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
            onClick={() => switchLanguage("fr")}
            style={{
              padding: "0.3rem 0.6rem",
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
      </div>

      {/* MAIN CONTAINER */}
      <div
        className="flex flex-col items-center w-full px-4 py-6 space-y-6 relative"
        style={{ marginTop: "3rem" }}
      >
        {/* CARD COUNTS & SCOREBOARD (always visible unless game over) */}
        {!gameOver && (
          <>
            {/* Card counts (top-left) */}
            <div
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                backgroundColor: "#ffffff",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #1e3a8a",
                display: "flex",
                flexDirection: "column",
                gap: "0.25rem",
                color: "#1e3a8a",
              }}
            >
              <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                {team1Name.toUpperCase()}: {team1CardCount} {t.teamXCards}
              </h2>
              <h2 style={{ fontSize: "1rem", fontWeight: "bold" }}>
                {team2Name.toUpperCase()}: {team2CardCount} {t.teamXCards}
              </h2>
            </div>

            {/* Round / Score (top-center) */}
            <div
              style={{
                position: "absolute",
                top: "1rem",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(0,0,0,0.7)",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                textAlign: "center",
                minWidth: "16rem",
              }}
            >
              <p style={{ fontSize: "1.2rem", fontWeight: "bold", margin: 0 }}>
                {t.roundScore}: {roundsPlayed}/{totalRounds} — {t.overallScore}:{" "}
                {team1Wins} - {team2Wins}
              </p>
            </div>
          </>
        )}

        {/* 
          TIMER / SKIP / ENDGAME
          (Hide this entire block in question phase)
        */}
        {!gameOver && !inCardEntryMode && !showQuestionPhase && (
          <div
            style={{
              marginTop: "4rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <motion.h2
              key={timeLeft}
              style={{ fontSize: "2rem", fontWeight: "bold" }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {timeLeft}s
            </motion.h2>
            {timeLeft > 0 && (
              <button
                onClick={() => setTimeLeft(0)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#4b5563",
                  color: "white",
                  borderRadius: "0.5rem",
                }}
              >
                {t.skipRound}
              </button>
            )}
            <button
              onClick={handleEndGame}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#dc2626",
                color: "white",
                borderRadius: "0.5rem",
              }}
            >
              {t.endGame}
            </button>
          </div>
        )}

        {/* 
          SCENARIO + COLLAPSIBLE HINT 
          (Hide both if question phase or if gameOver or if in card entry mode)
        */}
        {!gameOver && !inCardEntryMode && !showQuestionPhase && (
          <>
            {/* Scenario box first */}
            <motion.div
              style={{
                padding: "1rem",
                backgroundColor: "rgba(31,41,55,0.8)",
                borderRadius: "0.5rem",
                maxWidth: "40rem",
                width: "100%",
                marginTop: "1rem",
                textAlign: "center",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h3 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {t.scenario}
              </h3>
              <p style={{ fontSize: "0.9rem" }}>{scenarioDescription}</p>
            </motion.div>

            {/* Collapsible Hints */}
            <motion.div
              style={{
                padding: "1rem",
                backgroundColor: "rgba(31,41,55,0.8)",
                borderRadius: "0.5rem",
                maxWidth: "40rem",
                width: "100%",
                marginTop: "1rem",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                    marginBottom: "0.25rem",
                  }}
                >
                  {t.hints}
                </h4>
                <button
                  onClick={() => setShowHints(!showHints)}
                  style={{
                    backgroundColor: "#6b7280",
                    color: "#fff",
                    border: "none",
                    borderRadius: "0.25rem",
                    padding: "0.25rem 0.5rem",
                    cursor: "pointer",
                  }}
                >
                  {showHints
                    ? lang === "fr"
                      ? "Fermer"
                      : "Hide"
                    : lang === "fr"
                    ? "Ouvrir"
                    : "Show"}
                </button>
              </div>
              {showHints && (
                <div style={{ marginTop: "0.25rem" }}>
                  <p style={{ fontSize: "0.8rem", marginBottom: "0.25rem" }}>{t.hintsText}</p>
                  {currentScenario && (
                    <p style={{ fontStyle: "italic", fontSize: "0.8rem" }}>
                      {lang === "fr"
                        ? currentScenario.shortHintFr
                        : currentScenario.shortHintEn}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* WAIT PHASE: "Please wait" message if timeLeft>0, no question, no game over, not in card entry */}
        {!showQuestionPhase && !gameOver && !inCardEntryMode && timeLeft > 0 && (
          <motion.div
            key="waitPhase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                padding: "1rem",
                backgroundColor: "rgba(31,41,55,0.8)",
                color: "#ffffff",
                borderRadius: "0.5rem",
                textAlign: "center",
                maxWidth: "30rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                }}
              >
                {lang === "fr" ? "Veuillez patienter!" : "Please Wait!"}
              </h2>
              <p style={{ fontSize: "1rem" }}>{t.waitForTimerOrSkip}</p>
            </div>
          </motion.div>
        )}

        {/* CARD ENTRY PHASE */}
        {inCardEntryMode && (
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
              marginTop: "6rem", // extra top margin so it sits lower
            }}
          >
            <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {lang === "fr" ? "Sélectionnez vos cartes!" : "Select Your Cards!"}
            </h2>

            {cardError && (
              <div
                style={{
                  color: "#f87171",
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  textAlign: "center",
                }}
              >
                {cardError}
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
                justifyContent: "center",
              }}
            >
              {/* Team 1 input */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#ffffff",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #1e3a8a",
                }}
              >
                <span
                  style={{
                    color: "#1e3a8a",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    fontSize: "1rem",
                  }}
                >
                  {team1Name.toUpperCase()}
                </span>
                <label
                  style={{
                    color: "#1e3a8a",
                    fontWeight: "bold",
                    marginBottom: "0.25rem",
                    fontSize: "1rem",
                  }}
                >
                  {t.cardIdLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.cardPlaceholder}
                  value={team1Card}
                  onChange={(e) => setTeam1Card(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    fontSize: "1rem",
                    borderRadius: "0.25rem",
                    border: "1px solid #1e3a8a",
                    width: "12rem",
                    outline: "none",
                    color: "#1e3a8a",
                    backgroundColor: "#ffffff",
                  }}
                />
                {team1Card.trim() && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <img
                      src={
                        lang === "fr"
                          ? `/Cards/FRgng1503${team1Card.trim().toUpperCase()}.png`
                          : `/Cards/ENgng1503${team1Card.trim().toUpperCase()}.png`
                      }
                      alt={team1Card.trim().toUpperCase()}
                      style={{
                        width: "12rem",
                        height: "auto",
                        objectFit: "contain",
                        border: "2px solid white",
                        borderRadius: "0.25rem",
                        marginTop: "0.5rem",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Team 2 input */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#ffffff",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #1e3a8a",
                }}
              >
                <span
                  style={{
                    color: "#1e3a8a",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    fontSize: "1rem",
                  }}
                >
                  {team2Name.toUpperCase()}
                </span>
                <label
                  style={{
                    color: "#1e3a8a",
                    fontWeight: "bold",
                    marginBottom: "0.25rem",
                    fontSize: "1rem",
                  }}
                >
                  {t.cardIdLabel}
                </label>
                <input
                  type="text"
                  placeholder={t.cardPlaceholder}
                  value={team2Card}
                  onChange={(e) => setTeam2Card(e.target.value)}
                  style={{
                    padding: "0.5rem",
                    fontSize: "1rem",
                    borderRadius: "0.25rem",
                    border: "1px solid #1e3a8a",
                    width: "12rem",
                    outline: "none",
                    color: "#1e3a8a",
                    backgroundColor: "#ffffff",
                  }}
                />
                {team2Card.trim() && (
                  <div style={{ marginTop: "0.5rem" }}>
                    <img
                      src={
                        lang === "fr"
                          ? `/Cards/FRgng1503${team2Card.trim().toUpperCase()}.png`
                          : `/Cards/ENgng1503${team2Card.trim().toUpperCase()}.png`
                      }
                      alt={team2Card.trim().toUpperCase()}
                      style={{
                        width: "12rem",
                        height: "auto",
                        objectFit: "contain",
                        border: "2px solid white",
                        borderRadius: "0.25rem",
                        marginTop: "0.5rem",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmitCards}
              style={{
                marginTop: "0.5rem",
                padding: "0.75rem 1.5rem",
                backgroundColor: "#059669",
                color: "white",
                fontSize: "1.25rem",
                fontWeight: "bold",
                borderRadius: "0.5rem",
              }}
            >
              {t.submitCards}
            </button>
          </motion.div>
        )}

        {/* Q&A PHASE (only show questions + scoreboard/card count). 
            Hide scenario/hint/timer. 
        */}
        <AnimatePresence>
          {showQuestionPhase && !gameOver && (
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
                marginTop: "5rem", // push down below scoreboard
                width: "100%",
                maxWidth: "40rem",
              }}
            >
              {/* Team 1 Q&A */}
              <div
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  // If answered, color green or red, else dark gray
                  backgroundColor: team1Confirmed
                    ? team1AnswerCorrect
                      ? "rgba(34,197,94,0.8)" // green
                      : "rgba(239,68,68,0.8)" // red
                    : "rgba(31,41,55,0.8)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  {team1Name.toUpperCase()} –{" "}
                  {team1Question
                    ? lang === "fr"
                      ? team1Question.questionFr
                      : team1Question.questionEn
                    : ""}
                </h3>
                <p style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
                  {t.answerQuestion}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  {team1Question?.[lang === "fr" ? "optionsFr" : "optionsEn"].map(
                    (option: string, idx: number) => {
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
                            border:
                              team1Answer === letter
                                ? "4px solid #1e3a8a"
                                : "none",
                          }}
                        >
                          {letter}) {option}
                        </button>
                      );
                    }
                  )}
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
                    }}
                  >
                    {t.confirmAnswer}
                  </button>
                )}
                {team1Confirmed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "#ffffff",
                    }}
                  >
                    {team1AnswerCorrect ? t.extraCardMsg : t.noBonusMsg}
                  </motion.div>
                )}
              </div>

              {/* Team 2 Q&A */}
              <div
                style={{
                  width: "100%",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  backgroundColor: team2Confirmed
                    ? team2AnswerCorrect
                      ? "rgba(34,197,94,0.8)" // green
                      : "rgba(239,68,68,0.8)" // red
                    : "rgba(31,41,55,0.8)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                  }}
                >
                  {team2Name.toUpperCase()} –{" "}
                  {team2Question
                    ? lang === "fr"
                      ? team2Question.questionFr
                      : team2Question.questionEn
                    : ""}
                </h3>
                <p style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>
                  {t.answerQuestion}
                </p>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "0.5rem",
                  }}
                >
                  {team2Question?.[lang === "fr" ? "optionsFr" : "optionsEn"].map(
                    (option: string, idx: number) => {
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
                            border:
                              team2Answer === letter
                                ? "4px solid #1e3a8a"
                                : "none",
                          }}
                        >
                          {letter}) {option}
                        </button>
                      );
                    }
                  )}
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
                    }}
                  >
                    {t.confirmAnswer}
                  </button>
                )}
                {team2Confirmed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    style={{
                      marginTop: "0.5rem",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      color: "#ffffff",
                    }}
                  >
                    {team2AnswerCorrect ? t.extraCardMsg : t.noBonusMsg}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Round Winner Overlay */}
        <AnimatePresence>
          {showRoundWinner && roundWinner && (
            <motion.div
              key="roundWinnerOverlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: "fixed",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.7)",
                zIndex: 50,
              }}
            >
              <div style={{ textAlign: "center" }}>
                {roundWinner === "team1" && (
                  <>
                    <h2
                      style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        marginBottom: "1rem",
                        color: "#ffffff",
                      }}
                    >
                      {t.winnerText} {team1Name.toUpperCase()}
                    </h2>
                    <img
                      src="/roundteam1win.jpg"
                      alt="Team 1 Winner"
                      style={{
                        width: "24rem",
                        height: "auto",
                        border: "4px solid white",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </>
                )}
                {roundWinner === "team2" && (
                  <>
                    <h2
                      style={{
                        fontSize: "2rem",
                        fontWeight: "bold",
                        marginBottom: "1rem",
                        color: "#ffffff",
                      }}
                    >
                      {t.winnerText} {team2Name.toUpperCase()}
                    </h2>
                    <img
                      src="/roundteam2win.jpg"
                      alt="Team 2 Winner"
                      style={{
                        width: "24rem",
                        height: "auto",
                        border: "4px solid white",
                        borderRadius: "0.5rem",
                      }}
                    />
                  </>
                )}
                {roundWinner === "tie" && (
                  <h2
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      marginBottom: "1rem",
                      color: "#ffffff",
                    }}
                  >
                    {t.tieText}
                  </h2>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsible Admin Panel */}
        {!gameOver && (
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <button
              onClick={toggleAdminPanel}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#6b7280",
                color: "white",
                borderRadius: "0.5rem",
              }}
            >
              {showAdminPanel
                ? lang === "fr"
                  ? "Fermer le panneau Admin"
                  : "Hide Admin Panel"
                : lang === "fr"
                ? "Ouvrir le panneau Admin"
                : "Show Admin Panel"}
            </button>

            {showAdminPanel && (
              <div
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  color: "#1f2937",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                }}
              >
                <h3 style={{ fontSize: "1rem", fontWeight: "bold" }}>Admin Panel</h3>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter Admin Password (1234)"
                  style={{
                    padding: "0.5rem",
                    fontSize: "1rem",
                    borderRadius: "0.25rem",
                    color: "black",
                  }}
                />
                <button
                  onClick={handleAdminForceStart}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "#dc2626",
                    color: "white",
                    borderRadius: "0.5rem",
                  }}
                >
                  {lang === "fr"
                    ? "Forcer le Mini-Jeu de Crise"
                    : "Force Crisis Mini-Game"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* New Round Animation */}
        <AnimatePresence>
          {showNewRoundAnim && (
            <motion.div
              key="newRoundAnim"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.8 }}
              style={{
                padding: "1rem",
                backgroundColor: "#3b82f6",
                borderRadius: "0.5rem",
                fontSize: "2rem",
                fontWeight: "bold",
                marginTop: "1rem",
              }}
            >
              {t.newRoundMsg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Final Certificate */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            key="finalCertificate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.8)",
              zIndex: 50,
              padding: "1rem",
            }}
          >
            <div
              style={{
                position: "relative",
                background: "linear-gradient(to bottom right, #bbf7d0, #f0fdf4)",
                color: "black",
                borderRadius: "1rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                padding: "2rem",
                maxWidth: "32rem",
                width: "100%",
                textAlign: "center",
              }}
            >
              <h2
                style={{ fontSize: "2rem", fontWeight: "bold", color: "#16a34a" }}
              >
                {t.finalWinnerText}{" "}
                {winningTeam ? winningTeam.toUpperCase() : t.tieText}
              </h2>
              <p
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  color: "#15803d",
                  marginTop: "1rem",
                }}
              >
                {winningTeam
                  ? `${winningTeam.toUpperCase()} ${t.finalCertified}`
                  : t.tieText}
              </p>
              <p style={{ fontSize: "1.25rem", marginTop: "1rem" }}>
                {t.finalStats}: {team1Name} {team1Wins} - {team2Name} {team2Wins}
              </p>
              <button
                onClick={handleCertificateOk}
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem 1.5rem",
                  backgroundColor: "#16a34a",
                  color: "white",
                  fontWeight: "bold",
                  borderRadius: "9999px",
                  fontSize: "1.25rem",
                }}
              >
                {t.finalOk}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// MAIN PAGE EXPORT
export default function GamePage() {
  return (
    <Suspense fallback={<div style={{ color: "white", padding: "2rem" }}>Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}