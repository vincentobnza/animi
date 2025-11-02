import React from "react";
import { notFound } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import AnimeInfo from "./AnimeInfo";
import EpisodeList from "./EpisodeList";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    episode?: string;
  }>;
}

// Fetch anime info from AniList
async function getAnimeInfo(id: string) {
  const query = `
    query ($id: Int) {
      Media(id: $id, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          extraLarge
          large
          color
        }
        bannerImage
        description
        episodes
        duration
        status
        format
        season
        seasonYear
        averageScore
        popularity
        genres
        studios {
          nodes {
            name
          }
        }
        nextAiringEpisode {
          episode
          airingAt
        }
      }
    }
  `;

  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { id: parseInt(id) } }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const { data } = await response.json();
    return data?.Media;
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return null;
  }
}

// Fetch streaming links from Consumet API
async function getStreamingData(animeId: string, episodeNumber: string) {
  try {
    console.log(`[Consumet API] Fetching info for anime ID: ${animeId}`);

    // First, get the anime info from Consumet's AniList provider
    const infoResponse = await fetch(
      `https://api.consumet.org/meta/anilist/info/${animeId}`,
      { next: { revalidate: 3600 } }
    );

    console.log(`[Consumet API] Info response status: ${infoResponse.status}`);

    // Check if response is actually JSON
    const contentType = infoResponse.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const errorText = await infoResponse.text();
      console.error(
        `[Consumet API] Received HTML instead of JSON:`,
        errorText.substring(0, 200)
      );
      return {
        episodes: [],
        currentEpisode: null,
        streamingLinks: null,
        error:
          "⚠️ Consumet API is currently unavailable (returned HTML instead of JSON). The service might be down or undergoing maintenance. Please try again later.",
      };
    }

    if (!infoResponse.ok) {
      const errorText = await infoResponse.text();
      console.error(
        `[Consumet API] Error response:`,
        errorText.substring(0, 500)
      );
      return {
        episodes: [],
        currentEpisode: null,
        streamingLinks: null,
        error: `Failed to fetch anime info: ${infoResponse.status}`,
      };
    }

    const animeData = await infoResponse.json();
    console.log(
      `[Consumet API] Found ${animeData?.episodes?.length || 0} episodes`
    );

    if (!animeData?.episodes) {
      console.warn(`[Consumet API] No episodes found for anime ${animeId}`);
      return {
        episodes: [],
        currentEpisode: null,
        streamingLinks: null,
        error: "No episodes available",
      };
    }

    // Find the specific episode
    const episode = animeData.episodes.find(
      (ep: any) => ep.number === parseInt(episodeNumber)
    );

    if (!episode?.id) {
      console.warn(`[Consumet API] Episode ${episodeNumber} not found`);
      return {
        episodes: animeData.episodes,
        currentEpisode: null,
        streamingLinks: null,
        error: `Episode ${episodeNumber} not found`,
      };
    }

    console.log(
      `[Consumet API] Fetching streams for episode ID: ${episode.id}`
    );

    // Get streaming links
    const streamResponse = await fetch(
      `https://api.consumet.org/meta/anilist/watch/${episode.id}`,
      { next: { revalidate: 3600 } }
    );

    console.log(
      `[Consumet API] Stream response status: ${streamResponse.status}`
    );

    // Check if stream response is JSON
    const streamContentType = streamResponse.headers.get("content-type");
    if (!streamContentType || !streamContentType.includes("application/json")) {
      const errorText = await streamResponse.text();
      console.error(
        `[Consumet API] Stream returned HTML:`,
        errorText.substring(0, 200)
      );
      return {
        episodes: animeData.episodes,
        currentEpisode: episode,
        streamingLinks: null,
        error:
          "⚠️ Streaming links unavailable. The Consumet API is currently down or undergoing maintenance.",
      };
    }

    if (!streamResponse.ok) {
      const errorText = await streamResponse.text();
      console.error(
        `[Consumet API] Stream error:`,
        errorText.substring(0, 500)
      );
      return {
        episodes: animeData.episodes,
        currentEpisode: episode,
        streamingLinks: null,
        error: `Failed to fetch streaming links: ${streamResponse.status}`,
      };
    }

    const streamData = await streamResponse.json();
    console.log(
      `[Consumet API] Stream sources:`,
      streamData?.sources?.length || 0
    );

    return {
      episodes: animeData.episodes,
      currentEpisode: episode,
      streamingLinks: streamData,
      error: null,
    };
  } catch (error) {
    console.error("[Consumet API] Exception:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // Provide user-friendly error message
    let userMessage = errorMessage;
    if (errorMessage.includes("JSON") || errorMessage.includes("<!DOCTYPE")) {
      userMessage =
        "🚫 Consumet API is currently down (returning error pages). This is a known issue with the free API service. Please try again later.";
    } else if (
      errorMessage.includes("fetch") ||
      errorMessage.includes("network")
    ) {
      userMessage =
        "🌐 Network error: Unable to connect to Consumet API. Please check your internet connection.";
    }

    return {
      episodes: [],
      currentEpisode: null,
      streamingLinks: null,
      error: userMessage,
    };
  }
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  // Await params and searchParams in Next.js 15+
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const episodeNumber = resolvedSearchParams.episode || "1";

  // Fetch data in parallel
  const [animeInfo, streamingData] = await Promise.all([
    getAnimeInfo(id),
    getStreamingData(id, episodeNumber),
  ]);

  if (!animeInfo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-purple-950/10">
      <div className="max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-12">
        {/* Video Player Section */}
        <div className="mb-8 lg:mb-12">
          <VideoPlayer
            streamingData={streamingData}
            episodeNumber={episodeNumber}
            animeTitle={animeInfo.title.romaji || animeInfo.title.english}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimeInfo animeInfo={animeInfo} currentEpisode={episodeNumber} />
          </div>

          {/* Episode List Sidebar */}
          <div className="lg:col-span-1">
            <EpisodeList
              episodes={streamingData?.episodes || []}
              animeId={id}
              currentEpisode={episodeNumber}
              totalEpisodes={animeInfo.episodes}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
