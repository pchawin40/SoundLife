let sharedAudio: HTMLAudioElement | null = null;
let currentUrl: string | null = null;

function getAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!sharedAudio) {
    sharedAudio = new Audio();
    sharedAudio.preload = "none";
  }
  return sharedAudio;
}

export function isPreviewPlaying(url: string): boolean {
  return currentUrl === url && Boolean(sharedAudio && !sharedAudio.paused);
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
    }
    await audio.play();
    return "playing";
  } catch {
    return "failed";
  }
}

export function pausePreview(): void {
  if (!sharedAudio) return;
  sharedAudio.pause();
}
