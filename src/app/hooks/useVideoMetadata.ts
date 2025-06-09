function getYouTubeVideoId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") {
      return parsed.pathname.slice(1);
    }
    if (
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "m.youtube.com"
    ) {
      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/embed/")[1];
      }
      if (parsed.pathname.startsWith("/shorts/")) {
        return parsed.pathname.split("/shorts/")[1];
      }
    }
  } catch {
    return null;
  }
  return null;
}

export async function fetchVideoMetadata(url: string | undefined) {
  if (!url) {
    return { title: null, thumbnail: null, error: "No URL provided" };
  }

  const videoId = getYouTubeVideoId(url);

  if (!videoId)
    return { title: null, thumbnail: null, error: "Invalid YouTube URL" };

  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`
    );
    if (!res.ok) {
      throw new Error("Failed to fetch video metadata");
    }
    const data = await res.json();
    return {
      title: data.title,
      thumbnail: data.thumbnail_url,
      error: null,
    };
  } catch (err: any) {
    return {
      title: null,
      thumbnail: null,
      error: err.message || "Failed to fetch video metadata",
    };
  }
}
