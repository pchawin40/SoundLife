import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoundLife Daily - Sound of the Day",
  description: "A deterministic daily SoundLife prompt for today's mood.",
  openGraph: {
    images: ["/og/scenario-random.png"],
  },
};

export default function DailyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
