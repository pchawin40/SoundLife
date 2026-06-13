import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoundLife Match - Compare With a Friend",
  description: "Compare two SoundLife identities and see who gets aux.",
  openGraph: {
    images: ["/og/identity-main-stage-delusion.png"],
  },
};

export default function MatchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
