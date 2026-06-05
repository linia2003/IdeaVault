import Navbar from "./components/navbar";
import "@/app/globals.css";

export const metadata = {
  title: "IdeaVault - Startup Idea Sharing Platform",
  description: "Share and validate innovative startup concepts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 antialiased">
        <Navbar />
        <main className="container mx-auto max-w-7xl px-6 pt-6">
          {children}
        </main>
      </body>
    </html>
  );
}