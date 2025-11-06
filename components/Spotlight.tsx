"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface Anime {
  id: number;
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    large: string;
    extraLarge: string;
  };
  bannerImage: string;
  description: string;
  episodes: number;
  averageScore: number;
  seasonYear: number;
  format: string;
  duration: number;
  genres: string[];
  status: string;
}

export default function Spotlight() {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTopAnime = async () => {
      try {
        const response = await fetch("/api/top-anime");
        const data = await response.json();
        setAnime(data);
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
    };

    fetchTopAnime();
  }, []);

  useEffect(() => {
    if (anime.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % anime.length);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [anime.length]);

  if (anime.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const currentAnime = anime[currentIndex];

  return (
    <div className="w-full h-[700px] flex flex-row items-center gap-4 relative overflow-hidden">
      {/* Background Banner with Fade Overlays */}
      <div className="absolute inset-0 z-0">
        {currentAnime.bannerImage && (
          <Image
            src={currentAnime.bannerImage}
            alt={currentAnime.title.english || currentAnime.title.romaji}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Left Fade Overlay */}
        <div className="absolute inset-y-0 left-0 w-3/4 bg-linear-to-r from-zinc-950 via-zinc-950 to-transparent z-10" />
        {/* Right Fade Overlay */}
        <div className="absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-zinc-950 via-zinc-950/50 to-transparent z-10" />
        {/* Bottom Fade Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-transparent z-10" />
      </div>

      <SpotlightAnimeInfo anime={currentAnime} index={currentIndex} />
      <SpotlightBanner anime={currentAnime} />
    </div>
  );
}

const SpotlightAnimeInfo = ({
  anime,
  index,
}: {
  anime: Anime;
  index: number;
}) => {
  const stripHtml = (html: string) => {
    if (!html) return "";
    return html.replace(/<[^>]*>/g, "");
  };

  return (
    <div className="basis-1/2 h-full px-20 flex flex-col justify-center relative z-20">
      {/* SPOTLIGHT NUMBER */}
      <h3 className="mb-5 text-xl text-purple-500 font-black">
        #{index + 1} Spotlight
      </h3>
      <h1 className="text-4xl font-bold mb-4 text-white">
        {anime.title.english || anime.title.romaji}
      </h1>
      <div className="flex gap-3 mb-4">
        <span className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm md:text-lg font-semibold">
          {anime.format}
        </span>
        <span className="px-3 py-1 bg-green-600 text-white rounded-md text-sm md:text-lg font-semibold">
          Score: {anime.averageScore}
        </span>
        {anime.episodes && (
          <span className="px-3 py-1 bg-purple-600 text-white rounded-md text-sm md:text-lg font-semibold">
            {anime.episodes} Episodes
          </span>
        )}
      </div>
      <p className="text-gray-400 font-medium text-sm mb-4 line-clamp-4 md:text-lg">
        {stripHtml(anime.description)}
      </p>
      <div className="mt-5 flex gap-2 flex-wrap">
        {anime.genres.slice(0, 5).map((genre) => (
          <span
            key={genre}
            className="px-4 py-1 bg-zinc-800/80 text-gray-300 font-semibold rounded-lg text-md"
          >
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
};

const SpotlightBanner = ({ anime }: { anime: Anime }) => {
  return (
    <div className="basis-1/2 h-full flex items-center justify-center relative z-20">
      <div className="relative w-[300px] h-[400px]">
        <Image
          src={anime.coverImage.extraLarge || anime.coverImage.large}
          alt={anime.title.english || anime.title.romaji}
          fill
          className="w-full h-full object-cover rounded-lg shadow-2xl"
          priority
        />
      </div>
    </div>
  );
};
