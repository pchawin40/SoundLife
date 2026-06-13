import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoundLife Result - Your Music Identity",
  description: "A shareable SoundLife music diagnosis and tracklist.",
  openGraph: {
    images: ["/og/identity-main-character-damage.png"],
  },
};

export default function ResultLayout({ children }: { children: React.ReactNode }) {
  return children;
}
