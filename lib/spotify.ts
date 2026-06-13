import type { ResultData } from "./types";

const AUTH_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_URL = "https://api.spotify.com/v1";
const VERIFIER_KEY = "soundlife:spotify:verifier";
const STATE_KEY = "soundlife:spotify:state";
const PAYLOAD_KEY = "soundlife:spotify:playlist";
const SPOTIFY_SCOPE = "playlist-modify-private";

const SPOTIFY_403_HELP =
  "Spotify rejected this request. If this app is still in development mode, add your Spotify account under Spotify Developer Dashboard → User Management.";
const SPOTIFY_PLAYLIST_403_HELP =
  "Spotify accepted login but rejected playlist creation. Confirm this Spotify account is added under Developer Dashboard → User Management, then disconnect/reconnect SoundLife.";

export type SpotifyExportStep =
  | "connecting"
  | "matching-tracks"
  | "creating-playlist"
  | "adding-tracks"
  | "done";

export type SpotifyApiStep =
  | "token-exchange"
  | "search-tracks"
  | "create-playlist"
  | "add-tracks";

export class SpotifyExportError extends Error {
  readonly step: SpotifyApiStep;
  readonly status: number;
  readonly responseBody?: string;

  constructor(step: SpotifyApiStep, status: number, message: string, responseBody?: string) {
    super(message);
    this.name = "SpotifyExportError";
    this.step = step;
    this.status = status;
    this.responseBody = responseBody;
  }
}

export interface SpotifyExportSong {
  title: string;
  artist: string;
  spotifyUri?: string | null;
  spotifyUrl?: string | null;
}

export interface SpotifyPlaylistPayload {
  identity: string;
  matchPercent: number;
  songs: SpotifyExportSong[];
}

export interface SpotifyExportResult {
  playlistUrl: string;
  matchedCount: number;
  skippedCount: number;
  searchPartialFailure: boolean;
}

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface SpotifyPlaylist {
  id: string;
  external_urls?: { spotify?: string };
}

interface SpotifySearchTrack {
  uri: string;
  name: string;
  artists: Array<{ name: string }>;
}

interface SpotifySearchResponse {
  tracks?: {
    items?: SpotifySearchTrack[];
  };
}

interface ResolveTrackUrisResult {
  uris: string[];
  searchPartialFailure: boolean;
}

function getClientId(): string | null {
  return process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || null;
}

function getSessionStorage(): Storage {
  if (typeof window === "undefined") {
    throw new Error("Spotify export must run in the browser.");
  }
  return window.sessionStorage;
}

function clearSpotifyExportState(storage: Storage): void {
  storage.removeItem(VERIFIER_KEY);
  storage.removeItem(STATE_KEY);
  storage.removeItem(PAYLOAD_KEY);
}

function base64Url(bytes: ArrayBuffer | Uint8Array): string {
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const byte of array) binary += String.fromCharCode(byte);
  return window
    .btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function randomBase64Url(byteLength: number): string {
  const bytes = new Uint8Array(byteLength);
  window.crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

async function challengeForVerifier(verifier: string): Promise<string> {
  const encoded = new TextEncoder().encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", encoded);
  return base64Url(digest);
}

function payloadFromResult(result: ResultData): SpotifyPlaylistPayload {
  return {
    identity: result.identity,
    matchPercent: result.matchPercent,
    songs: result.songs.map((song) => ({
      title: song.title,
      artist: song.artist,
      spotifyUri: song.platforms.spotifyUri ?? null,
      spotifyUrl: song.platforms.spotifyUrl ?? null,
    })),
  };
}

function sanitizeForLog(data: unknown): unknown {
  if (!data || typeof data !== "object" || Array.isArray(data)) return data;
  const copy = { ...(data as Record<string, unknown>) };
  for (const key of ["access_token", "refresh_token"]) {
    if (key in copy) copy[key] = "[redacted]";
  }
  return copy;
}

async function readResponseBody(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch {
    return "";
  }
}

function logSpotifyFailure(step: SpotifyApiStep, status: number, body: string): void {
  let loggedBody: unknown = body;
  if (body) {
    try {
      loggedBody = sanitizeForLog(JSON.parse(body));
    } catch {
      loggedBody = body;
    }
  }
  console.error(`[SoundLife Spotify] ${step} failed`, {
    status,
    body: loggedBody,
  });
}

function messageForFailure(step: SpotifyApiStep, status: number): string {
  if (step === "create-playlist" && status === 403) {
    return SPOTIFY_PLAYLIST_403_HELP;
  }
  if (status === 403) {
    return SPOTIFY_403_HELP;
  }
  return `Spotify ${step.replace(/-/g, " ")} failed (${status}).`;
}

function throwSpotifyFailure(step: SpotifyApiStep, status: number, body: string): never {
  logSpotifyFailure(step, status, body);
  throw new SpotifyExportError(step, status, messageForFailure(step, status), body);
}

export function isSpotifyPlaylistExportConfigured(): boolean {
  return Boolean(getClientId());
}

export async function beginSpotifyPlaylistExport(result: ResultData): Promise<void> {
  if (typeof window === "undefined") return;
  const clientId = getClientId();
  if (!clientId) {
    throw new Error("Spotify playlist export is not configured.");
  }

  const verifier = randomBase64Url(64);
  const challenge = await challengeForVerifier(verifier);
  const state = randomBase64Url(24);
  const redirectUri = `${window.location.origin}/spotify/callback`;
  const storage = getSessionStorage();
  clearSpotifyExportState(storage);
  storage.setItem(VERIFIER_KEY, verifier);
  storage.setItem(STATE_KEY, state);
  storage.setItem(PAYLOAD_KEY, JSON.stringify(payloadFromResult(result)));

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: SPOTIFY_SCOPE,
    redirect_uri: redirectUri,
    state,
    code_challenge_method: "S256",
    code_challenge: challenge,
    show_dialog: "true",
  });
  window.location.assign(`${AUTH_URL}?${params.toString()}`);
}

async function exchangeCodeForToken(input: {
  code: string;
  verifier: string;
  redirectUri: string;
}): Promise<string> {
  const clientId = getClientId();
  if (!clientId) throw new Error("Missing Spotify client ID.");

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code: input.code,
    redirect_uri: input.redirectUri,
    code_verifier: input.verifier,
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const responseBody = await readResponseBody(response);
  if (!response.ok) {
    throwSpotifyFailure("token-exchange", response.status, responseBody);
  }

  const data = JSON.parse(responseBody) as SpotifyTokenResponse;
  return data.access_token;
}

async function spotifyFetch<T>(
  accessToken: string,
  path: string,
  step: SpotifyApiStep,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!response.ok) {
    const body = await readResponseBody(response);
    throwSpotifyFailure(step, response.status, body);
  }
  return (await response.json()) as T;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\([^)]*\)|\[[^\]]*\]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function parseSpotifyTrackUri(song: SpotifyExportSong): string | null {
  if (song.spotifyUri?.startsWith("spotify:track:")) return song.spotifyUri;
  if (!song.spotifyUrl) return null;
  try {
    const url = new URL(song.spotifyUrl);
    const [, type, id] = url.pathname.split("/");
    if (url.hostname.includes("spotify.com") && type === "track" && id) {
      return `spotify:track:${id}`;
    }
  } catch {
    return null;
  }
  return null;
}

function pickConservativeMatch(
  song: SpotifyExportSong,
  tracks: SpotifySearchTrack[]
): string | null {
  const wantedTitle = normalize(song.title);
  const wantedArtist = normalize(song.artist);

  for (const track of tracks) {
    const title = normalize(track.name);
    const artistMatch = track.artists.some((artist) => {
      const candidate = normalize(artist.name);
      return candidate === wantedArtist || wantedArtist.includes(candidate) || candidate.includes(wantedArtist);
    });
    const titleMatch =
      title === wantedTitle ||
      title.includes(wantedTitle) ||
      wantedTitle.includes(title);
    if (artistMatch && titleMatch) return track.uri;
  }

  return null;
}

async function searchTrackUri(
  accessToken: string,
  song: SpotifyExportSong
): Promise<{ uri: string | null; blocked: boolean }> {
  const query = encodeURIComponent(`track:${song.title} artist:${song.artist}`);
  const response = await fetch(`${API_URL}/search?type=track&limit=5&q=${query}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const body = await readResponseBody(response);
    logSpotifyFailure("search-tracks", response.status, body);
    if (response.status === 403) {
      return { uri: null, blocked: true };
    }
    throwSpotifyFailure("search-tracks", response.status, body);
  }

  const data = (await response.json()) as SpotifySearchResponse;
  return {
    uri: pickConservativeMatch(song, data.tracks?.items ?? []),
    blocked: false,
  };
}

async function resolveTrackUris(
  accessToken: string,
  songs: SpotifyExportSong[]
): Promise<ResolveTrackUrisResult> {
  const uris: string[] = [];
  let searchPartialFailure = false;

  for (const song of songs) {
    const directUri = parseSpotifyTrackUri(song);
    if (directUri) {
      uris.push(directUri);
      continue;
    }

    if (searchPartialFailure) continue;

    const result = await searchTrackUri(accessToken, song);
    if (result.blocked) {
      searchPartialFailure = true;
      continue;
    }
    if (result.uri) uris.push(result.uri);
  }

  return {
    uris: [...new Set(uris)],
    searchPartialFailure,
  };
}

export async function completeSpotifyPlaylistExport(
  code: string,
  state: string | null,
  onStep: (step: SpotifyExportStep) => void
): Promise<SpotifyExportResult> {
  if (typeof window === "undefined") {
    throw new Error("Spotify callback must run in the browser.");
  }

  onStep("connecting");
  const storage = getSessionStorage();
  const expectedState = storage.getItem(STATE_KEY);
  const verifier = storage.getItem(VERIFIER_KEY);
  const rawPayload = storage.getItem(PAYLOAD_KEY);
  if (!expectedState || !verifier || !rawPayload || state !== expectedState) {
    throw new Error("Spotify export session expired. Please retry from your result.");
  }

  const payload = JSON.parse(rawPayload) as SpotifyPlaylistPayload;
  const accessToken = await exchangeCodeForToken({
    code,
    verifier,
    redirectUri: `${window.location.origin}/spotify/callback`,
  });

  onStep("matching-tracks");
  const { uris, searchPartialFailure } = await resolveTrackUris(accessToken, payload.songs);
  if (uris.length === 0) {
    throw new Error(
      searchPartialFailure
        ? "Spotify blocked track search and no songs had a direct Spotify link. Add your account under Spotify Developer Dashboard → User Management, then retry."
        : "Spotify could not confidently match any tracks."
    );
  }

  onStep("creating-playlist");
  const playlist = await spotifyFetch<SpotifyPlaylist>(
    accessToken,
    "/me/playlists",
    "create-playlist",
    {
      method: "POST",
      body: JSON.stringify({
        name: `SoundLife: ${payload.identity}`,
        description: `Made by SoundLife from a ${payload.matchPercent}% ${payload.identity} result.`,
        public: false,
        collaborative: false,
      }),
    }
  );

  onStep("adding-tracks");
  await spotifyFetch(
    accessToken,
    `/playlists/${encodeURIComponent(playlist.id)}/tracks`,
    "add-tracks",
    {
      method: "POST",
      body: JSON.stringify({ uris }),
    }
  );

  clearSpotifyExportState(storage);
  onStep("done");

  return {
    playlistUrl: playlist.external_urls?.spotify ?? `https://open.spotify.com/playlist/${playlist.id}`,
    matchedCount: uris.length,
    skippedCount: payload.songs.length - uris.length,
    searchPartialFailure,
  };
}
