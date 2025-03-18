"use client";

import React, { useState, useRef } from "react";
import "./FlowchartPage.css"; // <-- Import the external CSS file

interface FlowchartNode {
  id: string;
  title: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: "rectangle" | "diamond" | "circle";
  briefDescription?: string[];
  features?: string[];
  codeExplanation?: string[];
}

interface FlowchartConnection {
  from: string;
  to: string;
  points?: { x: number; y: number }[];
}

const FlowchartPage: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<FlowchartNode | null>(null);
  const flowchartRef = useRef<HTMLDivElement>(null);

  // Updated nodes with revised info from the document
  const nodes: FlowchartNode[] = [
    {
      id: "about",
      title: "About",
      description: "Provides information about 'Save the Earth', including game instructions and language support.",
      x: 60,
      y: 60,
      width: 120,
      height: 70,
      shape: "diamond",
      briefDescription: [
        "Explains the game purpose and instructions.",
        "Supports English and French languages."
      ],
      features: [
        "Multilingual support with language toggle.",
        "Animated UI elements using Framer Motion.",
        "Responsive layout styled with Tailwind CSS.",
        "Navigation controls with a back button."
      ],
      codeExplanation: [
        "Client-side rendering with 'use client' directive.",
        "Localized content object for English and French.",
        "Language determination via URL query parameter.",
        "Animated transitions using Framer Motion and Suspense integration."
      ],
    },
    {
      id: "cards",
      title: "Cards",
      description: "Displays a grid of environmental positive cards with localized content.",
      x: 380,
      y: 60,
      width: 120,
      height: 70,
      shape: "diamond",
      briefDescription: [
        "Grid display of cards with environmental actions.",
        "Supports English and French with language toggle."
      ],
      features: [
        "Responsive grid layout with card images and index badges.",
        "Animated hover effects using Framer Motion.",
        "Navigation controls for language switching and back navigation."
      ],
      codeExplanation: [
        "Client-side rendering using 'use client' directive.",
        "Utilizes Next.js useSearchParams and useRouter for language and navigation.",
        "Cards rendered with responsive grid and Framer Motion animations.",
        "Localized card data structure for names and descriptions."
      ],
    },
    {
      id: "chooselanguage",
      title: "Choose Language",
      description: "Select your preferred language for the game.",
      x: 220,
      y: 130,
      width: 140,
      height: 70,
      shape: "circle",
      briefDescription: [
        "Enables switching between English and French."
      ],
      features: [
        "Language toggle button that updates UI text.",
        "Stores preference in local storage and updates URL."
      ],
      codeExplanation: [
        "Toggles language state and refreshes translations.",
        "Uses URL query parameter to determine default language.",
        "Updates global context with selected language."
      ],
    },
    {
      id: "team setup",
      title: "Team Setup",
      description: "Configure your team with names, members, and roles for the game.",
      x: 120,
      y: 230,
      width: 130,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Select team names and member details.",
        "Supports dynamic input fields for team member names."
      ],
      features: [
        "Multilingual support with language-specific labels.",
        "Dynamic rendering of input fields based on team size.",
        "Routing with URL parameters to pass team setup data."
      ],
      codeExplanation: [
        "Uses 'use client' for client-side rendering and state management.",
        "Retrieves language settings via useSearchParams.",
        "Dynamically creates input fields for team members.",
        "Navigates to tutorial page with team details encoded in URL."
      ],
    },
    {
      id: "tutorial",
      title: "Tutorial",
      description: "Walkthrough and practice run for new users with simulated gameplay.",
      x: 400,
      y: 230,
      width: 130,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Step-by-step guide and simulated round.",
        "Bilingual instructions with interactive animations."
      ],
      features: [
        "Sequential walkthrough steps with dynamic instructions.",
        "Simulated game round using fake data.",
        "Animated transitions using Framer Motion.",
        "Language toggle support."
      ],
      codeExplanation: [
        "Implements a walkthrough using state-based navigation.",
        "Uses Framer Motion for smooth transitions and animated feedback.",
        "Handles both instructional content and fake simulation round.",
        "Retrieves language settings from URL or localStorage."
      ],
    },
    {
      id: "practiceround",
      title: "Practice Round",
      description: "A non-scoring round to familiarize players with game mechanics.",
      x: 600,
      y: 265,
      width: 130,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Simulates a game round without affecting final score.",
        "Provides immediate feedback on gameplay actions."
      ],
      features: [
        "Mock scoring system for practice purposes.",
        "Replayable simulation round with no penalties."
      ],
      codeExplanation: [
        "Reuses game logic with a practice flag to disable scoring.",
        "Resets practice data upon exit or replay.",
        "Provides interactive tips during the simulation round."
      ],
    },
    {
      id: "startofgame",
      title: "Start of Game",
      description: "Begins the main game with initialization of game data.",
      x: 800,
      y: 265,
      width: 130,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Initializes game state and transitions from setup to active gameplay."
      ],
      features: [
        "Game state reset and initialization.",
        "Countdown or ready-check mechanism.",
        "Preloads necessary assets for gameplay."
      ],
      codeExplanation: [
        "Sets up round counters, player states, and loads required assets.",
        "May fetch scenario data from a server or local storage.",
        "Synchronizes game state for multiplayer scenarios."
      ],
    },
    {
      id: "hintscenario",
      title: "Hint + Scenario",
      description: "Displays environmental scenario details and contextual hints.",
      x: 1000,
      y: 205,
      width: 130,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Provides scenario info with helpful hints in both languages."
      ],
      features: [
        "Contextual hints based on scenario difficulty.",
        "Scenario descriptions with images and descriptive text."
      ],
      codeExplanation: [
        "Fetches scenario data from local or external sources.",
        "Triggers state updates to display hints and scenario details.",
        "Incorporates dynamic difficulty scaling based on user progress."
      ],
    },
    {
      id: "entercard",
      title: "Enter Card",
      description: "Submit your environmental action card for the current round.",
      x: 1200,
      y: 155,
      width: 130,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Players select and submit a card representing an action."
      ],
      features: [
        "Validates card input against scenario ranking.",
        "Locks in submission to prevent card reuse."
      ],
      codeExplanation: [
        "Captures card selection in game state.",
        "Triggers transition to the question phase upon submission.",
        "Stores submitted card for later scoring."
      ],
    },
    {
      id: "questionphase",
      title: "Question Phase",
      description: "Answer a multiple-choice question related to your submitted card.",
      x: 1400,
      y: 155,
      width: 130,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Presents a quiz question for bonus points."
      ],
      features: [
        "Timed questions with immediate feedback.",
        "Bonus scoring for correct responses."
      ],
      codeExplanation: [
        "Tracks player responses and validates answers.",
        "Updates bonus points and displays animated feedback.",
        "Renders conditionally based on game state."
      ],
    },
    {
      id: "winnerannounce",
      title: "Round Winner",
      description: "Announces the winner of the current round with highlights.",
      x: 1600,
      y: 155,
      width: 130,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Displays winning card and round summary."
      ],
      features: [
        "Updates scoreboard with round results.",
        "Celebratory animations and highlights for the winning card."
      ],
      codeExplanation: [
        "Aggregates round points to determine the winner.",
        "Triggers animations for winner announcement.",
        "Stores round data for continuity in scoring."
      ],
    },
    {
      id: "gamewinner",
      title: "Full Game Winner",
      description: "Shows final results and crowns the overall winner.",
      x: 1800,
      y: 260,
      width: 140,
      height: 90,
      shape: "diamond",
      briefDescription: [
        "Final tally of rounds to determine the champion."
      ],
      features: [
        "Comprehensive leaderboard and final score display.",
        "Options to replay or transition to mini-games."
      ],
      codeExplanation: [
        "Calculates total points across all rounds.",
        "Triggers final certificate overlay.",
        "Resets or archives game data after completion."
      ],
    },
    {
      id: "minigamesetup",
      title: "Mini Game Team Setup",
      description: "Configure teams for side mini-games with simplified options.",
      x: 2000,
      y: 230,
      width: 130,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Adjust team arrangement for mini-game participation."
      ],
      features: [
        "Flexible team setup with randomization options.",
        "Preview of mini-game rules and layout."
      ],
      codeExplanation: [
        "Operates similarly to main team setup with streamlined options.",
        "Merges or adjusts team data for mini-game context.",
        "Validates new setup to prevent role conflicts."
      ],
    },
    {
      id: "instructions",
      title: "Instructions",
      description: "Detailed game instructions and rules for players.",
      x: 2200,
      y: 230,
      width: 130,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Step-by-step guide on game rules and mechanics."
      ],
      features: [
        "Interactive rule guide with visual examples.",
        "Expandable FAQ section and language toggle support."
      ],
      codeExplanation: [
        "Loads an instruction overlay with text and images.",
        "Uses a shared component for instructions.",
        "Caches instructions data for offline use if necessary."
      ],
    },
    {
      id: "firefightergame",
      title: "Forest Fire Game",
      description: "Engage in the Fire Mini-Game to extinguish fires and plant trees.",
      x: 2400,
      y: 230,
      width: 140,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Control a firefighter to manage fire hazards.",
        "Interactive gameplay with immediate feedback."
      ],
      features: [
        "Real-time resource management and fire extinguishing mechanics.",
        "Animated UI elements using Framer Motion for dynamic feedback."
      ],
      codeExplanation: [
        "Specialized mini-game component for the fire scenario.",
        "Handles movement, fire extinguishing, and tree planting.",
        "Uses set intervals for smooth animations and key press detection."
      ],
    },
    {
      id: "learnquestion",
      title: "Learning + Questions",
      description: "Presents educational content with an integrated quiz on conservation.",
      x: 2600,
      y: 260,
      width: 160,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Provides facts on conservation alongside quiz questions."
      ],
      features: [
        "Interactive reading material with comprehension checks.",
        "Immediate feedback on quiz responses."
      ],
      codeExplanation: [
        "Loads educational content and quiz data from an API or JSON.",
        "Scores user responses and tracks engagement.",
        "Utilizes a modular quiz engine with bilingual support."
      ],
    },
    {
      id: "oceangame",
      title: "Cleaning Ocean Game",
      description: "Engage in the Ocean Mini-Game to collect trash and avoid obstacles.",
      x: 2800,
      y: 230,
      width: 160,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Navigate a boat to clean up ocean pollution.",
        "Interactive gameplay with dynamic obstacles."
      ],
      features: [
        "Real-time scoring for trash collection.",
        "Dynamic obstacles (e.g., fish and turtles) affecting score."
      ],
      codeExplanation: [
        "Handles boat movement and trash collection mechanics.",
        "Calculates score based on cleanup efficiency.",
        "Integrates dynamic obstacles with responsive controls."
      ],
    },
    {
      id: "learnquestion2",
      title: "Learning + Questions",
      description: "Additional educational content focused on marine ecosystems and environmental impact.",
      x: 3000,
      y: 260,
      width: 160,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Deep dive into ocean conservation with follow-up quizzes."
      ],
      features: [
        "Detailed insights on marine ecosystems.",
        "Interactive Q&A to reinforce learning."
      ],
      codeExplanation: [
        "Displays secondary educational content related to ocean cleanup.",
        "Prompts user responses and cross-references case studies.",
        "Stores feedback for analytics and achievement tracking."
      ],
    },
    {
      id: "completion",
      title: "Certificate",
      description: "Generates a completion certificate upon finishing the game.",
      x: 3200,
      y: 230,
      width: 130,
      height: 60,
      shape: "rectangle",
      briefDescription: [
        "Awards a dynamic certificate with team details and final score."
      ],
      features: [
        "Downloadable certificate with personalized data.",
        "Social media sharing options and achievement badge."
      ],
      codeExplanation: [
        "Generates a dynamic certificate (PDF or image) using user data.",
        "Displays final congratulatory overlay with final score.",
        "Resets or archives game data after completion."
      ],
    },
  ];

  const connections: FlowchartConnection[] = [
    { from: "chooselanguage", to: "about" },
    { from: "chooselanguage", to: "cards" },
    { from: "chooselanguage", to: "team setup" },
    { from: "team setup", to: "tutorial" },
    { from: "tutorial", to: "practiceround" },
    { from: "practiceround", to: "startofgame" },
    { from: "startofgame", to: "hintscenario" },
    { from: "hintscenario", to: "entercard" },
    { from: "entercard", to: "questionphase" },
    { from: "questionphase", to: "winnerannounce" },
    { from: "winnerannounce", to: "hintscenario" },
    { from: "winnerannounce", to: "gamewinner" },
    { from: "gamewinner", to: "minigamesetup" },
    { from: "minigamesetup", to: "instructions" },
    { from: "instructions", to: "firefightergame" },
    { from: "firefightergame", to: "learnquestion" },
    { from: "learnquestion", to: "oceangame" },
    { from: "oceangame", to: "learnquestion2" },
    { from: "learnquestion2", to: "completion" },
  ];

  const handleNodeClick = (node: FlowchartNode) => {
    setSelectedNode(node);
  };

  const handleBackClick = () => {
    setSelectedNode(null);
  };

  // Renders each node
  const renderNode = (node: FlowchartNode) => {
    let nodeClass = "flowchart-node";
    if (node.shape === "rectangle") {
      nodeClass += " rectangle-node";
    } else if (node.shape === "diamond") {
      nodeClass += " diamond-node";
    } else if (node.shape === "circle") {
      nodeClass += " circle-node";
    }

    const widthAdjust = node.shape === "diamond" ? 0.7 : 1;
    const heightAdjust = node.shape === "diamond" ? 0.7 : 1;

    return (
      <div
        key={node.id}
        className={nodeClass}
        style={{
          left: `${node.x}px`,
          top: `${node.y}px`,
          width: `${node.width * widthAdjust}px`,
          height: `${node.height * heightAdjust}px`,
          minWidth: node.shape === "diamond" ? `${node.width * 0.7}px` : `${node.width}px`,
          minHeight: node.shape === "diamond" ? `${node.height * 0.7}px` : `${node.height}px`,
        }}
        onClick={() => handleNodeClick(node)}
      >
        <div className="node-title">{node.title}</div>
        <div className="node-preview">
          <h3>{node.title}</h3>
          <p>{node.description}</p>
        </div>
      </div>
    );
  };

  // Renders connections between nodes
  const renderConnections = () => {
    return connections.map((connection, index) => {
      const fromNode = nodes.find((n) => n.id === connection.from);
      const toNode = nodes.find((n) => n.id === connection.to);
      if (!fromNode || !toNode) return null;

      const x1 = fromNode.x + fromNode.width / 2;
      const y1 = fromNode.y + fromNode.height / 2;
      const x2 = toNode.x + toNode.width / 2;
      const y2 = toNode.y + toNode.height / 2;

      let pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
      let strokeW = 1.5;

      // Thicker line from Round Winner -> Hint + Scenario
      if (connection.from === "winnerannounce" && connection.to === "hintscenario") {
        pathD = `M ${x1 - 20} ${y1 + 25} L ${x1 - 150} ${y1 + 150} L ${x2 - 40} ${y2 + 30}`;
        strokeW = 2.5;
      }

      if (connection.points) {
        pathD = `M ${x1} ${y1}`;
        connection.points.forEach((pt) => {
          pathD += ` L ${pt.x} ${pt.y}`;
        });
        pathD += ` L ${x2} ${y2}`;
      }

      return (
        <svg
          key={index}
          className="connection-line"
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        >
          <path
            d={pathD}
            stroke="#333"
            strokeWidth={strokeW}
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        </svg>
      );
    });
  };

  return (
    <div className="flowchart-page">
      {selectedNode ? (
        <div className="node-detail-view">
          <div className="node-detail-content">
            <div className="node-detail-header">
              <h2>{selectedNode.title}</h2>
              <p className="node-description">{selectedNode.description}</p>
            </div>
            <div className="node-sections">
              {selectedNode.briefDescription && (
                <div className="node-section">
                  <h3>Brief Description</h3>
                  <ul>
                    {selectedNode.briefDescription.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedNode.features && (
                <div className="node-section">
                  <h3>Features</h3>
                  <ul>
                    {selectedNode.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedNode.codeExplanation && (
                <div className="node-section code-explanation">
                  <h3>Code Explanation</h3>
                  {selectedNode.codeExplanation.map((exp, i) => (
                    <p key={i}>{exp}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="node-detail-footer">
            <button className="back-button" onClick={handleBackClick}>
              Back to Flowchart
            </button>
          </div>
        </div>
      ) : (
        <div className="flowchart-container">
          <div className="flowchart-title">
            <h2>Earth Dual Process Flow</h2>
            <p>Hover over any element to see details, click to expand</p>
          </div>
          <div className="flowchart-scrollable">
            <div className="flowchart-content" style={{ width: "3200px", height: "500px" }}>
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="12"
                    markerHeight="8"
                    refX="10"
                    refY="4"
                    orient="auto"
                  >
                    <polygon points="0 0, 12 4, 0 8" fill="#333" />
                  </marker>
                </defs>
              </svg>
              {renderConnections()}
              {nodes.map((node) => renderNode(node))}
            </div>
          </div>
          <div className="instructions">
            <p>Scroll horizontally to view the full process flow</p>
          </div>
          <div className="home-button-container-left">
            <a href="/" className="home-button">
              Back to Home
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlowchartPage;
