
// -----------------------------------------------------------------------------
// File Header & Import Statements
// "use client" indicates that this component is rendered on the client side.
// The component imports Next.js's Link component for navigation and React for building UI.
// -----------------------------------------------------------------------------
"use client";

import Link from "next/link";
import React from "react";

// -----------------------------------------------------------------------------
// Navigation Confirmation Handler
// The handleNavClick function is triggered when the user clicks any navigation link.
// It shows a confirmation dialog warning that game progress will be lost if the user leaves the page.
// If the user cancels the dialog, the event's default action is prevented, stopping navigation.
// -----------------------------------------------------------------------------
const Header = () => {
  // This function is called whenever the user clicks on the "Cards" or "About" link.
  // It shows a confirmation dialog. If the user cancels, navigation is prevented.
  function handleNavClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const proceed = window.confirm(
      "Warning: Any game progress will be lost if you leave this page. Continue?"
    );
    if (!proceed) {
      e.preventDefault();
    }
  }

  return (
    <header className="w-full bg-gray-600 text-white p-4 shadow z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold">Earth Dual</h1>
        <nav className="space-x-8">
          <Link href="/cards" onClick={handleNavClick} className="hover:underline">
            Cards
          </Link>
          <Link href="/about" onClick={handleNavClick} className="hover:underline">
            About
          </Link>
          <Link href="/flowchart" onClick={handleNavClick} className="hover:underline">
            How It Works
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;