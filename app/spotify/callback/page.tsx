"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  completeSpotifyPlaylistExport,
  SpotifyExportError,
  type SpotifyApiStep,
  type SpotifyExportStep,
} from "@/lib/spotify";

const STEPS: Array<{ id: SpotifyExportStep; label: string }> = [
  { id: "connecting", label: "Connecting" },
  { id: "matching-tracks", label: "Matching tracks" },
  { id: "creating-playlist", label: "Creating playlist" },
  { id: "adding-tracks", label: "Adding tracks" },
  { id: "done", label: "Done" },
];

const STEP_LABELS: Record<SpotifyApiStep, string> = {
  "token-exchange": "Token exchange",
  "search-tracks": "Search tracks",
  "create-playlist": "Create playlist",
  "add-tracks": "Add tracks",
};

function SpotifyCallbackContent() {
  const params = useSearchParams();
  const [step, setStep] = useState<SpotifyExportStep>("connecting");
  const [message, setMessage] = useState("Spotify is handing the aux cable back.");
  const [playlistUrl, setPlaylistUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [failedStep, setFailedStep] = useState<SpotifyApiStep | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = params.get("code");
    const state = params.get("state");
    const spotifyError = params.get("error");
    if (spotifyError) {
      setError("Spotify login was cancelled.");
      return;
    }
    if (!code) {
      setError("Spotify did not return an authorization code.");
      return;
    }

    completeSpotifyPlaylistExport(code, state, setStep)
      .then((result) => {
        setPlaylistUrl(result.playlistUrl);
        setMessage(
          result.searchPartialFailure
            ? `Playlist created with ${result.matchedCount} tracks. Some tracks could not be matched yet.`
            : `Matched ${result.matchedCount} tracks. ${result.skippedCount} needed a safer manual search later.`
        );
        window.setTimeout(() => {
          window.location.assign(result.playlistUrl);
        }, 900);
      })
      .catch((caught: unknown) => {
        if (caught instanceof SpotifyExportError) {
          setFailedStep(caught.step);
          setError(caught.message);
          return;
        }
        setError(caught instanceof Error ? caught.message : "Spotify export failed.");
      });
  }, [params]);

  const activeIndex = STEPS.findIndex((item) => item.id === step);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-sm font-black uppercase tracking-[0.18em] text-paper">
        SL
      </div>
      <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-brand-amber">
        Spotify export
      </p>
      <h1 className="mt-3 text-4xl font-black leading-none tracking-tight text-ink">
        {error ? "Playlist export needs a retry" : "Creating your private playlist"}
      </h1>
      <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-gray-500">
        {error ?? message}
      </p>
      {failedStep && (
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
          Failed step: {STEP_LABELS[failedStep]}
        </p>
      )}

      {!error && (
        <ol className="mt-8 w-full space-y-2 rounded-3xl border border-gray-100 bg-surface p-4 text-left shadow-sm">
          {STEPS.map((item, index) => {
            const complete = index < activeIndex || step === "done";
            const active = index === activeIndex && step !== "done";
            return (
              <li
                key={item.id}
                className={`flex min-h-[42px] items-center justify-between rounded-2xl px-3 text-sm font-black ${
                  complete
                    ? "bg-brand-teal/10 text-brand-teal"
                    : active
                      ? "bg-gray-100 text-ink"
                      : "text-gray-300"
                }`}
              >
                <span>{item.label}</span>
                <span>{complete ? "✓" : active ? "..." : ""}</span>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-8 flex flex-col gap-2 sm:flex-row">
        {playlistUrl && (
          <a
            href={playlistUrl}
            className="flex min-h-[48px] items-center justify-center rounded-full bg-ink px-6 text-sm font-black text-paper"
          >
            Open Spotify playlist
          </a>
        )}
        <Link
          href="/"
          className="flex min-h-[48px] items-center justify-center rounded-full border border-gray-200 bg-surface px-6 text-sm font-black text-gray-700"
        >
          Back to SoundLife
        </Link>
      </div>
    </div>
  );
}

export default function SpotifyCallbackPage() {
  return (
    <main className="app-surface relative min-h-dvh overflow-x-hidden">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col px-5 py-6 sm:px-7 lg:px-8">
        <Suspense fallback={<div className="flex flex-1 items-center justify-center text-sm font-semibold text-gray-500">Connecting Spotify...</div>}>
          <SpotifyCallbackContent />
        </Suspense>
      </div>
    </main>
  );
}
