import type { Metadata, Viewport } from "next";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('soundlife:theme');var d=t==='dark'||((t==='system'||!t)&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

function getMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://soundlife.app";
  const value = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(value);
  } catch {
    return new URL("https://soundlife.app");
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "SoundLife — A soundtrack for every part of your day",
  description:
    "Pick a moment, swipe a few vibe cards, and find real music that fits you. No account. No listening history. Just your vibe.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎧</text></svg>",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0D10" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <div className="fixed right-4 top-4 z-[60]">
          <ThemeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
