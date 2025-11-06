import { NextResponse } from "next/server";

const topAnime = `
  query {
    Page(page: 1, perPage: 10) {
      media(type: ANIME, sort: TRENDING_DESC, status: RELEASING) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
          extraLarge
        }
        bannerImage
        description
        episodes
        averageScore
        seasonYear
        format
        duration
        genres
        status
      }
    }
  }
`;

export async function GET() {
  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: topAnime }),
    });

    const { data } = await response.json();
    return NextResponse.json(data.Page.media);
  } catch (error) {
    console.error("Error fetching top anime:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime" },
      { status: 500 }
    );
  }
}
