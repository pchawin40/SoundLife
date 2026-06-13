import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoundLife Spotify Export",
  description: "Create a private Spotify playlist from a SoundLife result.",
};

export default function SpotifyCallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
