import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topAnime }),
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
