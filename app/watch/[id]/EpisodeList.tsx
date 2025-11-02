"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FaPlay, FaCheckCircle, FaSearch } from "react-icons/fa";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

interface EpisodeListProps {
  episodes: any[];
  animeId: string;
  currentEpisode: string;
  totalEpisodes: number | null;
}

export default function EpisodeList({
  episodes,
  animeId,
  currentEpisode,
  totalEpisodes,
}: EpisodeListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(
    Math.floor((parseInt(currentEpisode) - 1) / 20)
  );
  const episodesPerPage = 20;

  // Generate episode list (use available episodes or generate from total)
  const episodeList =
    episodes.length > 0
      ? episodes
      : totalEpisodes
      ? Array.from({ length: totalEpisodes }, (_, i) => ({
          number: i + 1,
          id: `${animeId}-episode-${i + 1}`,
          title: `Episode ${i + 1}`,
        }))
      : [];

  // Filter episodes based on search
  const filteredEpisodes = episodeList.filter((ep) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      ep.number.toString().includes(searchLower) ||
      ep.title?.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredEpisodes.length / episodesPerPage);
  const startIndex = currentPage * episodesPerPage;
  const endIndex = startIndex + episodesPerPage;
  const currentEpisodes = filteredEpisodes.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 shadow-xl overflow-hidden sticky top-6">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h3 className="text-xl font-bold text-white mb-3">Episodes</h3>

        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search episodes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Episode List */}
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        {currentEpisodes.length > 0 ? (
          <div className="p-2">
            {currentEpisodes.map((episode) => {
              const isCurrent = episode.number.toString() === currentEpisode;
              const isPast = episode.number < parseInt(currentEpisode);

              return (
                <Link
                  key={episode.id || episode.number}
                  href={`/watch/${animeId}?episode=${episode.number}`}
                  className={`block mb-2 p-3 rounded-lg transition-all hover:scale-[1.02] ${
                    isCurrent
                      ? "bg-purple-600 shadow-lg shadow-purple-500/50"
                      : isPast
                      ? "bg-gray-800/50 hover:bg-gray-700/50"
                      : "bg-gray-800/30 hover:bg-gray-700/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Episode Number */}
                    <div
                      className={`shrink-0 w-12 h-12 rounded-lg flex items-center justify-center font-bold ${
                        isCurrent
                          ? "bg-purple-700 text-white"
                          : "bg-gray-900 text-gray-400"
                      }`}
                    >
                      {episode.number}
                    </div>

                    {/* Episode Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate ${
                          isCurrent ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {episode.title || `Episode ${episode.number}`}
                      </p>
                      {episode.description && (
                        <p className="text-xs text-gray-400 truncate mt-1">
                          {episode.description}
                        </p>
                      )}
                    </div>

                    {/* Status Icon */}
                    <div className="shrink-0">
                      {isCurrent ? (
                        <FaPlay className="text-white text-lg" />
                      ) : isPast ? (
                        <FaCheckCircle className="text-green-400 text-lg" />
                      ) : null}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            <p>No episodes found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <MdNavigateBefore className="text-white text-xl" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (currentPage < 3) {
                  pageNum = i;
                } else if (currentPage > totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-8 h-8 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <MdNavigateNext className="text-white text-xl" />
            </button>
          </div>

          <p className="text-center text-gray-400 text-xs mt-2">
            Page {currentPage + 1} of {totalPages}
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="p-4 border-t border-gray-800 flex gap-2">
        <Link
          href={`/watch/${animeId}?episode=${Math.max(
            1,
            parseInt(currentEpisode) - 1
          )}`}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-center transition-colors ${
            parseInt(currentEpisode) <= 1
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Previous
        </Link>
        <Link
          href={`/watch/${animeId}?episode=${parseInt(currentEpisode) + 1}`}
          className={`flex-1 py-2 px-4 rounded-lg font-medium text-center transition-colors ${
            totalEpisodes && parseInt(currentEpisode) >= totalEpisodes
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-purple-600 text-white hover:bg-purple-500"
          }`}
        >
          Next
        </Link>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(107, 114, 128, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }
      `}</style>
    </div>
  );
}
