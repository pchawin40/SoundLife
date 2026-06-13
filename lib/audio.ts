type AudioState = "idle" | "loading" | "playing" | "paused" | "failed";

let sharedAudio: HTMLAudioElement | null = null;
let currentUrl: string | null = null;
const listeners = new Set<() => void>();

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = "none";
    sharedAudio.addEventListener("ended", () => { currentUrl = null; notify(); });
    sharedAudio.addEventListener("pause", notify);
    sharedAudio.addEventListener("play", notify);
    sharedAudio.addEventListener("playing", notify);
    sharedAudio.addEventListener("waiting", notify);
    sharedAudio.addEventListener("timeupdate", notify);
    sharedAudio.addEventListener("error", () => { currentUrl = null; notify(); });
  }
  return sharedAudio;
}

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribeAudio(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getAudioSnapshot(url: string): {
  state: AudioState;
  currentTime: number;
  duration: number;
} {
  const audio = sharedAudio;
  if (!audio || currentUrl !== url) {
    return { state: "idle", currentTime: 0, duration: 0 };
  }
  let state: AudioState;
  if (audio.readyState < 2 && !audio.paused) {
    state = "loading";
  } else if (!audio.paused) {
    state = "playing";
  } else {
    state = "paused";
  }
  return {
    state,
    currentTime: audio.currentTime,
    duration: isFinite(audio.duration) ? audio.duration : 0,
  };
}

export async function togglePreview(url: string): Promise<"playing" | "paused" | "failed"> {
  const audio = getAudio();
  if (!audio) return "failed";
  try {
    if (currentUrl === url && !audio.paused) {
      audio.pause();
      return "paused";
    }
    if (currentUrl !== url) {
      audio.pause();
      audio.src = url;
      currentUrl = url;
      notify();
    }
    await audio.play();
    return "playing";
  } catch {
    currentUrl = null;
    notify();
    return "failed";
  }
}

export function pausePreview(): void {
  if (!sharedAudio) return;
  sharedAudio.pause();
}

export function isPreviewPlaying(url: string): boolean {
  return currentUrl === url && Boolean(sharedAudio && !sharedAudio.paused);
}
