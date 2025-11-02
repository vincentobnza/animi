import React from "react";
import { FaStar, FaCalendar, FaClock, FaTv } from "react-icons/fa";
import { MdFormatListNumbered } from "react-icons/md";

interface AnimeInfoProps {
  animeInfo: any;
  currentEpisode: string;
}

export default function AnimeInfo({
  animeInfo,
  currentEpisode,
}: AnimeInfoProps) {
  // Clean HTML from description
  const cleanDescription = animeInfo.description
    ?.replace(/<br>/g, "\n")
    .replace(/<[^>]*>/g, "")
    .trim();

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<FaStar className="text-yellow-400" />}
          label="Score"
          value={animeInfo.averageScore ? `${animeInfo.averageScore}%` : "N/A"}
          gradient="from-yellow-500/20 to-orange-500/20"
        />
        <StatCard
          icon={<MdFormatListNumbered className="text-blue-400" />}
          label="Episodes"
          value={animeInfo.episodes || "?"}
          gradient="from-blue-500/20 to-cyan-500/20"
        />
        <StatCard
          icon={<FaClock className="text-green-400" />}
          label="Duration"
          value={animeInfo.duration ? `${animeInfo.duration} min` : "N/A"}
          gradient="from-green-500/20 to-emerald-500/20"
        />
        <StatCard
          icon={<FaTv className="text-purple-400" />}
          label="Format"
          value={animeInfo.format || "N/A"}
          gradient="from-purple-500/20 to-pink-500/20"
        />
      </div>

      {/* Main Info Card */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 shadow-xl">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cover Image */}
          <div className="shrink-0">
            <img
              src={
                animeInfo.coverImage.extraLarge || animeInfo.coverImage.large
              }
              alt={animeInfo.title.romaji}
              className="w-full md:w-48 h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                {animeInfo.title.romaji || animeInfo.title.english}
              </h1>
              {animeInfo.title.english &&
                animeInfo.title.english !== animeInfo.title.romaji && (
                  <p className="text-gray-400 text-lg">
                    {animeInfo.title.english}
                  </p>
                )}
              {animeInfo.title.native && (
                <p className="text-gray-500 text-sm">
                  {animeInfo.title.native}
                </p>
              )}
            </div>

            {/* Genres */}
            {animeInfo.genres && animeInfo.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {animeInfo.genres.map((genre: string) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-sm text-purple-200 font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Additional Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {animeInfo.season && animeInfo.seasonYear && (
                <div className="flex items-center gap-2">
                  <FaCalendar className="text-purple-400" />
                  <span>
                    {animeInfo.season} {animeInfo.seasonYear}
                  </span>
                </div>
              )}
              {animeInfo.status && (
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      animeInfo.status === "RELEASING"
                        ? "bg-green-500"
                        : animeInfo.status === "FINISHED"
                        ? "bg-blue-500"
                        : "bg-gray-500"
                    }`}
                  />
                  <span className="capitalize">
                    {animeInfo.status.toLowerCase().replace("_", " ")}
                  </span>
                </div>
              )}
              {animeInfo.studios?.nodes?.[0]?.name && (
                <div className="flex items-center gap-2">
                  <FaTv className="text-purple-400" />
                  <span>{animeInfo.studios.nodes[0].name}</span>
                </div>
              )}
            </div>

            {/* Next Episode */}
            {animeInfo.nextAiringEpisode && (
              <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-3">
                <p className="text-purple-200 text-sm font-medium">
                  Next Episode: Episode {animeInfo.nextAiringEpisode.episode}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Airing{" "}
                  {new Date(
                    animeInfo.nextAiringEpisode.airingAt * 1000
                  ).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {cleanDescription && (
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-xl font-bold text-white mb-3">Synopsis</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">
              {cleanDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  gradient,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  gradient: string;
}) {
  return (
    <div
      className={`bg-linear-to-br ${gradient} backdrop-blur-sm rounded-xl p-4 border border-gray-800/50 shadow-lg hover:shadow-xl transition-shadow`}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">{icon}</div>
        <div>
          <p className="text-gray-400 text-xs uppercase tracking-wider">
            {label}
          </p>
          <p className="text-white text-lg font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
