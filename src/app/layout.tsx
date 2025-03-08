import "./globals.css";
import React from "react";
import Header from "./header"; // Adjust the path if needed
import Link from "next/link";

export const metadata = {
  title: "Earth Dual",
  description: "Bilingual Next.js game about saving the Earth and educating kids.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
