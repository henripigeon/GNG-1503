// -----------------------------------------------------------------------------
// File Header and Import Statements
// This section ensures the code runs on the client-side (with "use client") and imports
// the necessary modules from React, Next.js, and Framer Motion. These modules provide:
// - React: For building UI components and managing state.
// - Next.js: For routing and URL query parameter management.
// - Framer Motion: For adding smooth animations to UI elements.
// - Suspense: For handling lazy loading with a fallback UI.
// -----------------------------------------------------------------------------
"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";


// -----------------------------------------------------------------------------
// getCategoryBgColor Function - Determine background color for card categories
// This function receives a category string as input and returns a corresponding CSS class
// that sets the background color. It styles the cards based on their category (e.g., recycling, energy).
// -----------------------------------------------------------------------------
  const getCategoryBgColor = (category: string) => {
    switch(category) {
      case 'recycling': return 'bg-blue-500';
      case 'transport': return 'bg-blue-600';
      case 'energy': return 'bg-blue-700';
      case 'water': return 'bg-blue-400';
      case 'community': return 'bg-indigo-500';
      default: return 'bg-gray-500';
    }
  };


// -----------------------------------------------------------------------------
// positiveCards Array - Definition of Ecological Action Cards Data
// This constant is an array that holds all the card objects used in the game. Each card contains:
// - A unique ID.
// - Names and descriptions in both French and English.
// The array represents various positive ecological actions and serves as the data source for the card display.
// -----------------------------------------------------------------------------
const positiveCards = [
  [
    {
      "id": "A12",
      "nameFr": "Planter arbres",
      "nameEn": "Plant Trees",
      "descFr": "Planter des arbres pour aider à absorber le dioxyde de carbone et améliorer la qualité de l'air.",
      "descEn": "Plant trees to help absorb carbon dioxide and improve air quality."
    },
    {
      "id": "B34",
      "nameFr": "Recyclage (10 tonnes)",
      "nameEn": "Recycling (10 Tons)",
      "descFr": "Recycler 10 tonnes de déchets pour réduire l'empreinte écologique.",
      "descEn": "Recycle 10 tons of waste to reduce the ecological footprint."
    },
    {
      "id": "C56",
      "nameFr": "Recyclage (100 tonnes)",
      "nameEn": "Recycling (100 Tons)",
      "descFr": "Recycler 100 tonnes de déchets pour promouvoir l'économie circulaire.",
      "descEn": "Recycle 100 tons of waste to promote a circular economy."
    },
    {
      "id": "D78",
      "nameFr": "Recyclage (1000 tonnes)",
      "nameEn": "Recycling (1000 Tons)",
      "descFr": "Recycler 1000 tonnes de déchets pour réduire la pollution et préserver les ressources naturelles.",
      "descEn": "Recycle 1000 tons of waste to reduce pollution and conserve natural resources."
    },
  
    {
      "id": "E23",
      "nameFr": "Éolienne",
      "nameEn": "Wind Turbine",
      "descFr": "Installer des éoliennes pour produire de l'énergie propre et renouvelable.",
      "descEn": "Install wind turbines to generate clean and renewable energy."
    },
    {
      "id": "F45",
      "nameFr": "Hydraulique",
      "nameEn": "Hydropower",
      "descFr": "Utiliser l'énergie hydraulique pour produire de l'électricité en utilisant le mouvement de l'eau.",
      "descEn": "Use hydropower to generate electricity through water movement."
    },
    {
      "id": "G67",
      "nameFr": "Solaire",
      "nameEn": "Solar Energy",
      "descFr": "Installer des panneaux solaires pour produire de l'énergie propre à partir du soleil.",
      "descEn": "Install solar panels to generate clean energy from the sun."
    },
    {
      "id": "H89",
      "nameFr": "Énergie nucléaire",
      "nameEn": "Nuclear Energy",
      "descFr": "Utiliser l'énergie nucléaire de manière sécurisée pour produire de l'électricité avec peu d'émissions.",
      "descEn": "Use nuclear energy safely to generate electricity with minimal emissions."
    },
  
    {
      "id": "J12",
      "nameFr": "Fermer lumière (x3)",
      "nameEn": "Turn off lights (x3)",
      "descFr": "Éteindre les lumières inutiles pour économiser de l'énergie.",
      "descEn": "Turn off unused lights to save energy."
    },
    {
      "id": "K34",
      "nameFr": "Autobus",
      "nameEn": "Bus",
      "descFr": "Utiliser les transports en commun, comme les bus, pour réduire les émissions de gaz à effet de serre.",
      "descEn": "Use public transportation, like buses, to reduce greenhouse gas emissions."
    },
    {
      "id": "L56",
      "nameFr": "Train",
      "nameEn": "Train",
      "descFr": "Prendre le train pour réduire la consommation de carburant et l'empreinte carbone.",
      "descEn": "Take the train to reduce fuel consumption and carbon footprint."
    },
    {
      "id": "M78",
      "nameFr": "Vélo",
      "nameEn": "Bicycle",
      "descFr": "Utiliser le vélo comme moyen de transport pour réduire la pollution et promouvoir la santé.",
      "descEn": "Use bicycles as transportation to reduce pollution and promote health."
    },
  
    {
      "id": "N90",
      "nameFr": "Covoiturage",
      "nameEn": "Carpooling",
      "descFr": "Partager des trajets en voiture pour réduire les émissions et économiser des ressources.",
      "descEn": "Share car rides to reduce emissions and save resources."
    },
    {
      "id": "O23",
      "nameFr": "Acheter localement",
      "nameEn": "Buy Locally",
      "descFr": "Acheter des produits locaux pour réduire l'empreinte carbone liée au transport.",
      "descEn": "Buy local products to reduce the carbon footprint of transportation."
    },
    {
      "id": "P45",
      "nameFr": "Labourage",
      "nameEn": "Plowing",
      "descFr": "Utiliser des méthodes agricoles durables pour préserver la terre et la biodiversité.",
      "descEn": "Use sustainable farming practices to preserve the land and biodiversity."
    },
    {
      "id": "Q67",
      "nameFr": "Compostage",
      "nameEn": "Composting",
      "descFr": "Recycler les déchets organiques en compost pour enrichir le sol et réduire les déchets.",
      "descEn": "Recycle organic waste into compost to enrich soil and reduce waste."
    },
    {
      "id": "S12",
      "nameFr": "Don organisation but non lucratif (100$)",
      "nameEn": "Donation to Non-profit Organization (100$)",
      "descFr": "Faire un don de 100$ à une organisation à but non lucratif pour renforcer son impact.",
      "descEn": "Donate $100 to a non-profit organization to amplify its impact."
    },
    {
      "id": "T34",
      "nameFr": "Don organisation but non lucratif (1000$)",
      "nameEn": "Donation to Non-profit Organization (1000$)",
      "descFr": "Faire un don de 1000$ pour aider à financer des projets de grande envergure dans des organisations à but non lucratif.",
      "descEn": "Donate $1000 to help fund large-scale projects in non-profit organizations."
    },
    {
      "id": "U56",
      "nameFr": "Sensibiliser le public",
      "nameEn": "Raise Public Awareness",
      "descFr": "Organiser des événements ou des campagnes pour sensibiliser le public aux enjeux environnementaux.",
      "descEn": "Organize events or campaigns to raise public awareness about environmental issues."
    },
  
    {
      "id": "V78",
      "nameFr": "Programme de protection des espèces en danger",
      "nameEn": "Rescue and Rehabilitation Program",
      "descFr": "Participer à des programmes de sauvetage et de réhabilitation pour protéger les espèces en danger.",
      "descEn": "Participate in rescue and rehabilitation programs to protect endangered species."
    },
    {
      "id": "W90",
      "nameFr": "Former lois et législations",
      "nameEn": "Create Laws and Legislation",
      "descFr": "Mettre en place des lois et législations pour soutenir la protection de l'environnement.",
      "descEn": "Create laws and legislation to support environmental protection."
    },
    {
      "id": "X23",
      "nameFr": "Lois pour entreprise",
      "nameEn": "Laws for Businesses",
      "descFr": "Créer des lois obligeant les entreprises à adopter des pratiques durables.",
      "descEn": "Create laws requiring businesses to adopt sustainable practices."
    },
    {
      "id": "Y45",
      "nameFr": "Réduire consommation de viande",
      "nameEn": "Reduce Meat Consumption",
      "descFr": "Réduire la consommation de viande pour diminuer l'impact environnemental de l'élevage.",
      "descEn": "Reduce meat consumption to decrease the environmental impact of livestock farming."
    },
  
    {
      "id": "Z67",
      "nameFr": "Voiture électrique",
      "nameEn": "Electric Car",
      "descFr": "Utiliser une voiture électrique pour réduire les émissions de gaz à effet de serre.",
      "descEn": "Use an electric car to reduce greenhouse gas emissions"
    },
    {
      "id": "A90",
      "nameFr": "Courte douche",
      "nameEn": "Short Shower",
      "descFr": "Prendre des douches plus courtes pour économiser de l'eau.",
      "descEn": "Take shorter showers to conserve water."
    },
    {
      "id": "B23",
      "nameFr": "Fermer robinet",
      "nameEn": "Turn off Tap",
      "descFr": "Fermer le robinet lorsque vous ne l'utilisez pas pour économiser de l'eau.",
      "descEn": "Turn off the tap when not in use to conserve water."
    },
  
    {
      "id": "C45",
      "nameFr": "Bouteille d'eau réutilisable",
      "nameEn": "Reusable Water Bottle",
      "descFr": "Utiliser une bouteille d'eau réutilisable pour éviter les déchets plastiques.",
      "descEn": "Use a reusable water bottle to avoid plastic waste."
    },
    {
      "id": "D67",
      "nameFr": "Réduire usage de papier (papier toilette, papier pour essuyer les mains)",
      "nameEn": "Reduce Paper Usage (Toilet Paper, Paper Towels)",
      "descFr": "Réduire l'utilisation de papier pour diminuer la déforestation et les déchets.",
      "descEn": "Reduce paper usage to decrease deforestation and waste."
    },
    {
      "id": "E89",
      "nameFr": "Consignation déchets",
      "nameEn": "Deposit Waste",
      "descFr": "Mettre en place un système de consignation des déchets pour encourager le recyclage.",
      "descEn": "Implement a waste deposit system to encourage recycling."
    },
    {
      "id": "F12",
      "nameFr": "Taxe carbone",
      "nameEn": "Carbon Tax",
      "descFr": "Instaurer une taxe sur le carbone pour inciter les entreprises à réduire leurs émissions.",
      "descEn": "Implement a carbon tax to incentivize businesses to reduce emissions."
    },
    {
      "id": "G34",
      "nameFr": "Sac réutilisable",
      "nameEn": "Reusable Bag",
      "descFr": "Utiliser un sac réutilisable pour réduire les déchets plastiques.",
      "descEn": "Use a reusable bag to reduce plastic waste."
    },
    {
      "id": "H56",
      "nameFr": "Réduire chauffage/climatisation",
      "nameEn": "Reduce Heating/AC",
      "descFr": "Réduire l'utilisation du chauffage et de la climatisation pour économiser de l'énergie.",
      "descEn": "Reduce heating and air conditioning usage to save energy."
    },
    {
      "id": "I78",
      "nameFr": "Nettoyer déchet (rue)",
      "nameEn": "Clean up Waste (Street)",
      "descFr": "Participer à des nettoyages communautaires pour réduire les déchets dans les rues.",
      "descEn": "Participate in community clean-ups to reduce waste in the streets."
    },
    {
      "id": "J90",
      "nameFr": "Jardin communautaire",
      "nameEn": "Community Garden",
      "descFr": "Créer un jardin communautaire pour encourager la production alimentaire locale.",
      "descEn": "Create a community garden to encourage local food production."
    },
    {
      "id": "K23",
      "nameFr": "Éliminer plastique usage unique",
      "nameEn": "Eliminate Single-Use Plastics",
      "descFr": "Éliminer l'utilisation de plastiques à usage unique pour réduire la pollution plastique.",
      "descEn": "Eliminate the use of single-use plastics to reduce plastic pollution."
    },
    {
      "id": "L45",
      "nameFr": "Bac récupération eau pluie (arroser plantes)",
      "nameEn": "Rainwater Harvesting Bin (Water Plants)",
      "descFr": "Installer un bac de récupération d'eau de pluie pour arroser les plantes.",
      "descEn": "Install a rainwater harvesting bin to water plants."
    },
  
    {
      "id": "M12",
      "nameFr": "Protection des forêts",
      "nameEn": "Forest Protection",
      "descFr": "Préserver les forêts pour absorber le carbone et protéger la biodiversité.",
      "descEn": "Preserve forests to absorb carbon and protect biodiversity."
    },
    {
      "id": "N34",
      "nameFr": "Toiture végétalisée",
      "nameEn": "Green Roof",
      "descFr": "Installer une toiture végétalisée pour améliorer l'isolation et absorber le CO2.",
      "descEn": "Install a green roof to improve insulation and absorb CO2."
    },
    {
      "id": "O56",
      "nameFr": "Plantation de haies Haie végétale",
      "nameEn": "Hedge Planting",
      "descFr": "Planter des haies pour protéger la faune et stocker du carbone.",
      "descEn": "Plant hedges to protect wildlife and store carbon."
    },
  
    {
      "id": "P78",
      "nameFr": "Mode écoresponsable",
      "nameEn": "Sustainable Fashion",
      "descFr": "Acheter des vêtements durables et éthiques pour réduire l'empreinte carbone de l'industrie textile.",
      "descEn": "Buy sustainable and ethical clothing to reduce the carbon footprint of the fashion industry."
    },
    {
      "id": "Q90",
      "nameFr": "Isolation thermique",
      "nameEn": "Thermal Insulation",
      "descFr": "Améliorer l'isolation des bâtiments pour réduire la consommation d'énergie.",
      "descEn": "Improve building insulation to reduce energy consumption."
    },
  
    {
      "id": "R23",
      "nameFr": "Éducation environnementale",
      "nameEn": "Environmental Education",
      "descFr": "Sensibiliser les jeunes aux enjeux climatiques et aux gestes éco-responsables.",
      "descEn": "Educate young people on climate issues and eco-friendly actions."
    },
    {
      "id": "S45",
      "nameFr": "Réduction du gaspillage alimentaire",
      "nameEn": "Reduce Food Waste",
      "descFr": "Éviter le gaspillage alimentaire en consommant intelligemment et en compostant les déchets organiques.",
      "descEn": "Avoid food waste by consuming smartly and composting organic waste."
    },
    {
      "id": "T67",
      "nameFr": "Réduction des déchets électroniques",
      "nameEn": "Reduce Electronic Waste",
      "descFr": "Recycler et réparer les appareils électroniques pour limiter les déchets toxiques.",
      "descEn": "Recycle and repair electronic devices to reduce toxic waste."
    },
  
    {
      "id": "U89",
      "nameFr": "Réduction de plastique dans l'océan",
      "nameEn": "Reduce Ocean Plastic",
      "descFr": "Participer aux initiatives visant à réduire la pollution plastique dans les océans.",
      "descEn": "Participate in initiatives to reduce plastic pollution in the oceans."
    },
    {
      "id": "V12",
      "nameFr": "Encourager l'agroécologie",
      "nameEn": "Encourage Agroecology",
      "descFr": "Soutenir des pratiques agricoles durables qui respectent les écosystèmes.",
      "descEn": "Support sustainable farming practices that respect ecosystems."
    },
    {
      "id": "W34",
      "nameFr": "Récupération de chaleur industrielle",
      "nameEn": "Industrial Heat Recovery",
      "descFr": "Réutiliser la chaleur produite par les industries pour économiser de l'énergie.",
      "descEn": "Reuse heat produced by industries to save energy."
    },
    {
      "id": "X56",
      "nameFr": "Encourager le télétravail",
      "nameEn": "Encourage Remote Work",
      "descFr": "Favoriser le télétravail pour réduire les déplacements et les émissions de CO2.",
      "descEn": "Promote remote work to reduce commuting and CO2 emissions."
    },
    {
      "id": "Y78",
      "nameFr": "Réutilisation des matériaux de construction",
      "nameEn": "Reuse Construction Materials",
      "descFr": "Recycler et réutiliser des matériaux de construction pour limiter l'extraction de ressources.",
      "descEn": "Recycle and reuse construction materials to limit resource extraction."
    },
    {
      "id":"A13",
      "nameFr": "Plan de reforestation",
      "nameEn": "Reforestation plan",
      "descFr": "Des plans de reforestation sont une bonne manière d'aider notre planète et d'augmenter la flore.",
      "descEn": "Reforestation plans are a great way to help our planet and increase flora.",
    }
  ]
];


// -----------------------------------------------------------------------------
// CardsInfoContent Component - Main Content for the Cards Information Page
// This React component handles the display and interactivity of ecological action cards.
// It includes features such as:
// • Filtering cards by category and search term.
// • Toggling between grid and list views.
// • Localization support (English/French) using URL query parameters.
// • Smooth animations provided by Framer Motion.
// -----------------------------------------------------------------------------
function CardsInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = (searchParams.get("lang") as "en" | "fr") || "en";
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGridView, setIsGridView] = useState(true);
  
 // -----------------------------------------------------------------------------
// Categories Array - Define Filter Options for Ecological Action Cards
// This array contains objects for each category filter option (e.g., energy, recycling, transport).
// Each object includes an ID and localized labels (English and French) for display on the UI.
// -----------------------------------------------------------------------------
  const categories = [
    { id: "all", labelEn: "All Cards", labelFr: "Toutes les Cartes" },
    { id: "energy", labelEn: "Energy", labelFr: "Énergie" },
    { id: "recycling", labelEn: "Recycling", labelFr: "Recyclage" },
    { id: "transport", labelEn: "Transportation", labelFr: "Transport" },
    { id: "water", labelEn: "Water Conservation", labelFr: "Conservation de l'Eau" },
    { id: "community", labelEn: "Community", labelFr: "Communauté" },
  ];

 // -----------------------------------------------------------------------------
// getCategoryText Function - Retrieve Localized Text for a Category
// This function returns the display text for a given category, based on the current language.
// It ensures that category labels are shown in the correct language (English or French).
// -----------------------------------------------------------------------------
  const getCategoryText = (category: string) => {
    switch(category) {
      case 'recycling': return lang === 'fr' ? 'recyclage' : 'recycling';
      case 'transport': return lang === 'fr' ? 'transport' : 'transport';
      case 'energy': return lang === 'fr' ? 'énergie' : 'energy';
      case 'water': return lang === 'fr' ? 'eau' : 'water';
      case 'community': return lang === 'fr' ? 'communauté' : 'community';
      default: return lang === 'fr' ? 'autre' : 'other';
    }
  };
  
// -----------------------------------------------------------------------------
// categorizeCard Function - Determine the Category of a Card
// This function analyzes the card's title and description (in the current language) to assign
// a category identifier (e.g., "recycling", "energy"). It does so by checking for specific keywords
// in the text, helping to automatically categorize each card based on its content.
// -----------------------------------------------------------------------------
  const categorizeCard = (card: { id: string; nameFr: string; nameEn: string; descFr: string; descEn: string }) => {
    const title = lang === "fr" ? card.nameFr.toLowerCase() : card.nameEn.toLowerCase();
    const desc = lang === "fr" ? card.descFr.toLowerCase() : card.descEn.toLowerCase();
    const fullText = title + " " + desc;
    
    if (fullText.includes("recycl") || fullText.includes("waste") || fullText.includes("déchets") || fullText.includes("compost")) {
      return "recycling";
    } else if (fullText.includes("energy") || fullText.includes("énergie") || fullText.includes("solar") || 
               fullText.includes("wind") || fullText.includes("nucléaire") || fullText.includes("éolienne") ||
               fullText.includes("electricity") || fullText.includes("électricité")) {
      return "energy";
    } else if (fullText.includes("car") || fullText.includes("bus") || fullText.includes("train") || 
               fullText.includes("vélo") || fullText.includes("bicycle") || fullText.includes("transport")) {
      return "transport";
    } else if (fullText.includes("water") || fullText.includes("eau") || fullText.includes("shower") || 
               fullText.includes("douche") || fullText.includes("rain") || fullText.includes("pluie")) {
      return "water";
    } else if (fullText.includes("communit") || fullText.includes("communau") || fullText.includes("public") || 
               fullText.includes("garden") || fullText.includes("jardin") || fullText.includes("awareness") ||
               fullText.includes("sensibilis")) {
      return "community";
    }
    return "other";
  };

// -----------------------------------------------------------------------------
// Filter Cards Logic - Filter Cards by Category and Search Term
// This section flattens the positiveCards array and filters it based on:
// • The selected category (or 'all' if no specific filter is applied).
// • The search term entered by the user (checking against the card's title, description, and ID).
// It ensures that only cards matching both criteria are displayed.
// -----------------------------------------------------------------------------
  const filteredCards = positiveCards.flat().filter(card => {
    const cardCategory = categorizeCard(card);
    const matchesCategory = category === "all" || cardCategory === category;
    
    const searchMatches = (
      (lang === "fr" ? card.nameFr : card.nameEn).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lang === "fr" ? card.descFr : card.descEn).toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return matchesCategory && searchMatches;
  });

  // -----------------------------------------------------------------------------
// UI Text Variables - Define Dynamic Text Content Based on Language
// This section sets up variables that store the localized text for various UI elements such as:
// • Page title.
// • Navigation button texts.
// • Search input placeholder.
// • View toggle button text.
// These variables change based on the current language (English or French).
// -----------------------------------------------------------------------------
  const pageTitle = lang === "fr" ? "Cartes d'Action Écologique" : "Ecological Action Cards";
  const backButtonText = lang === "fr" ? "Retour à l'accueil" : "Back to Home";
  const toggleButtonText = lang === "fr" ? "Passer en français" : "Switch to English";
  const searchPlaceholder = lang === "fr" ? "Rechercher des cartes ou IDs..." : "Search cards or IDs...";
  const viewToggleText = lang === "fr" 
    ? (isGridView ? "Vue liste" : "Vue grille") 
    : (isGridView ? "List View" : "Grid View");


// -----------------------------------------------------------------------------
// toggleLanguage Function - Switch Between English and French
// This function toggles the current language setting by modifying the URL query parameters.
// It preserves any existing query parameters and updates the 'lang' value,
// ensuring the page content is reloaded in the selected language.
// -----------------------------------------------------------------------------

  const toggleLanguage = () => {
    const newLang = lang === "en" ? "fr" : "en";
    const currentQuery = Object.fromEntries([...searchParams.entries()]);
    const newQuery = { ...currentQuery, lang: newLang };
    const queryString = new URLSearchParams(newQuery).toString();
    router.push(`/cards?${queryString}`);
  };

// -----------------------------------------------------------------------------
// Animation Variants - Define Animations for Containers and Cards
// These objects configure the appearance and transition effects using Framer Motion:
// • containerVariants: Manages the overall fade-in effect with a staggered reveal of child elements.
// • cardVariants: Controls the fade-in and upward motion for individual cards.
// -----------------------------------------------------------------------------
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 to-blue-400 text-gray-800 font-sans">
      <div className="relative z-10 p-4 md:p-8 flex flex-col min-h-screen max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-white text-blue-700 rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              {backButtonText}
            </button>
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-white text-blue-700 rounded-full shadow-lg hover:shadow-xl transition"
            >
              {toggleButtonText}
            </button>
          </div>
          
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              aria-label={lang === "fr" ? "Rechercher par titre, description ou ID" : "Search by title, description or ID"}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <button
            onClick={() => setIsGridView(!isGridView)}
            className="px-4 py-2 bg-white text-blue-700 rounded-full shadow-lg hover:shadow-xl transition flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            {viewToggleText}
          </button>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-6 text-white drop-shadow-lg">
          {pageTitle}
        </h1>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                category === cat.id 
                  ? "bg-white text-blue-600 shadow-lg" 
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              onClick={() => setCategory(cat.id)}
            >
              {lang === "fr" ? cat.labelFr : cat.labelEn}
            </button>
          ))}
        </div>
        
        {/* Result count */}
        <p className="text-white font-semibold text-center mb-6">
          {filteredCards.length} {lang === "fr" ? "cartes trouvées" : "cards found"}
        </p>

        {/* Card Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={isGridView ? "grid" : "list"}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={isGridView 
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "flex flex-col gap-4"
            }
            variants={containerVariants}
          >
            {filteredCards.map((card, idx) => {
              const cardCategory = categorizeCard(card);
              const categoryColor = getCategoryBgColor(cardCategory);
              
              return (
                <motion.div
                  key={card.id}
                  className={isGridView 
                    ? "bg-blue-100 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300" 
                    : "bg-blue-100 rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row hover:shadow-xl transition-all duration-300"
                  }
                  variants={cardVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  {/* Card Image */}
                  <div className={isGridView ? "w-full h-48" : "w-full md:w-1/3 h-40 md:h-auto"}>
                    <div className="w-full h-full relative overflow-hidden bg-white">
                      <img
                        src={`/Cards/${lang === "en" ? "ENgng1503" : "FRgng1503"}${card.id}.png`}
                        alt={lang === "fr" ? card.nameFr : card.nameEn}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.src = "/api/placeholder/200/200";
                          e.currentTarget.alt = "Image unavailable";
                        }}
                      />
                      {/* Overlay category badge */}
                      <div className={`absolute top-2 left-2 ${getCategoryBgColor(cardCategory)} text-white text-xs font-bold px-2 py-1 rounded-full`}>
                        {getCategoryText(cardCategory)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className={isGridView ? "p-5" : "p-5 md:w-2/3"}>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl md:text-2xl font-bold text-blue-600">
                        {lang === "fr" ? card.nameFr : card.nameEn}
                      </h3>
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {card.id}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {lang === "fr" ? card.descFr : card.descEn}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
        
        {/* If no results */}
        {filteredCards.length === 0 && (
          <div className="text-center text-blue-800 text-xl p-10 bg-blue-200 rounded-xl shadow-md">
            {lang === "fr" 
              ? "Aucune carte trouvée. Veuillez modifier votre recherche." 
              : "No cards found. Please adjust your search."}
          </div>
        )}
      </div>
    </div>
  );
}


// -----------------------------------------------------------------------------
// Main Render Section - JSX Structure for Cards Display
// This section returns the overall JSX layout for the page, which includes:
// • A main container with a background gradient and responsive layout.
// • Multiple UI sections such as the top navigation bar, category tabs, search input,
//   result count display, and the grid/list view of cards.
// • Conditional rendering for cases when no cards match the search criteria.
// • Integration of Framer Motion for smooth transitions and animations.
// -----------------------------------------------------------------------------
export default function CardsInfoPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-blue-400">
        <div className="bg-white bg-opacity-20 backdrop-blur-md p-6 rounded-xl shadow-lg text-white text-xl">
          <svg className="animate-spin h-8 w-8 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading Cards...
        </div>
      </div>
    }>
      <CardsInfoContent />
    </Suspense>
  );
}