// -----------------------------------------------------------------------------
// Global Imports & Metadata
// - Imports the global CSS styles from "globals.css" to apply universal styling.
// - Imports React and other required components such as Header and Analytics.
// - Imports Next.js's Link component (if needed elsewhere).
// - The metadata object sets the page title and description, which are used for SEO
//   and to describe the application ("Earth Dual") and its purpose.
// -----------------------------------------------------------------------------

import "./globals.css";
import React from "react";
import Header from "./header"; // Adjust the path if needed
import { Analytics } from "@vercel/analytics/react"
import Link from "next/link";

export const metadata = {
  title: "Earth Dual",
  description: "Bilingual Next.js game about saving the Earth and educating kids.",
};



// -----------------------------------------------------------------------------
// RootLayout Component - Main Application Layout
// This component wraps the entire application and provides a consistent layout across all pages.
// It includes:
//   • An HTML structure with a defined language attribute.
//   • A body element styled with Tailwind CSS classes to ensure minimum screen height
//     and a flexible column layout.
//   • A Header component at the top, which renders the navigation bar.
//   • A main element that dynamically renders page content (children).
//   • A Footer component at the bottom that displays copyright information.
// -----------------------------------------------------------------------------
export default function RootLayout({ children }: { children: React.ReactNode }) {

  // -----------------------------------------------------------------------------
// Layout Structure
// - HEADER: Renders the Header component which includes navigation links.
// - MAIN CONTENT: Uses the "main" element with a flex-grow class to hold the unique content
//   of each page. This area is positioned relative for further styling if needed.
// - FOOTER: Displays a footer with a background color, padding, and centered text,
//   including a copyright notice with the current year.
// -----------------------------------------------------------------------------
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        {/* HEADER */}
        <Header />

        {/* MAIN CONTENT */}
        <main className="flex-grow relative">{children}</main>

        {/* FOOTER */}
        <footer className="w-full bg-gray-600 text-white p-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Earth Dual. All rights reserved.
          </p>
        </footer>
      </body>
    </html>
  );
}
