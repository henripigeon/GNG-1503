// app/game/layout.tsx
export const metadata = {
    title: "Game - Earth Dual",
  };
  
  export default function GameLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    );
  }
  