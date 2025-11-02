"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { MdSettings, MdHighQuality } from "react-icons/md";

interface VideoPlayerProps {
  streamingData: any;
  episodeNumber: string;
  animeTitle: string;
}

export default function VideoPlayer({
  streamingData,
  episodeNumber,
  animeTitle,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedQuality, setSelectedQuality] = useState("");
  const [showQualityMenu, setShowQualityMenu] = useState(false);

  // Debug logs
  useEffect(() => {
    console.log("[VideoPlayer] Streaming Data:", streamingData);
    console.log("[VideoPlayer] Episode:", episodeNumber);
    console.log("[VideoPlayer] Error:", streamingData?.error);
    console.log(
      "[VideoPlayer] Sources:",
      streamingData?.streamingLinks?.sources
    );
  }, [streamingData, episodeNumber]);

  const videoSource = streamingData?.streamingLinks?.sources?.[0]?.url || "";
  const qualities = streamingData?.streamingLinks?.sources || [];

  useEffect(() => {
    if (qualities.length > 0 && !selectedQuality) {
      // Default to highest quality or "default"
      const defaultQuality =
        qualities.find((q: any) => q.quality === "default") || qualities[0];
      setSelectedQuality(defaultQuality.url);
    }
  }, [qualities, selectedQuality]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleQualityChange = (url: string) => {
    const currentTime = videoRef.current?.currentTime || 0;
    const wasPlaying = isPlaying;

    setSelectedQuality(url);
    setShowQualityMenu(false);

    // Restore playback position after quality change
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime;
      if (wasPlaying) {
        videoRef.current.play();
      }
    }
  };

  if (!streamingData?.streamingLinks) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
        <div className="text-center space-y-4 p-8 max-w-md">
          {streamingData?.error ? (
            <>
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-red-400 text-xl font-bold">
                Streaming Error
              </h3>
              <p className="text-gray-400 text-base">{streamingData.error}</p>
              <div className="mt-6 p-4 bg-gray-800 rounded-lg text-left">
                <p className="text-gray-300 text-sm font-semibold mb-2">
                  Possible reasons:
                </p>
                <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                  <li>Consumet API is temporarily down</li>
                  <li>Episode not yet available</li>
                  <li>Network connection issue</li>
                  <li>CORS or API rate limiting</li>
                </ul>
              </div>
              <p className="text-gray-500 text-xs mt-4">
                Check the browser console for detailed logs
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-400 text-lg">
                Loading episode {episodeNumber}...
              </p>
              <p className="text-gray-500 text-sm">
                If this takes too long, the episode might not be available yet.
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        src={selectedQuality || videoSource}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        crossOrigin="anonymous"
      />

      {/* Episode Info Overlay */}
      <div
        className={`absolute top-0 left-0 right-0 p-6 bg-linear-to-b from-black/80 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-white text-xl md:text-2xl font-bold mb-1">
          {animeTitle}
        </h2>
        <p className="text-gray-300 text-sm md:text-base">
          Episode {episodeNumber}
        </p>
      </div>

      {/* Play/Pause Button Overlay */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-purple-600/90 hover:bg-purple-500 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-2xl"
          >
            <FaPlay className="text-white text-3xl ml-1" />
          </button>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/90 to-transparent transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 mb-4 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:h-2 transition-all"
        />

        {/* Control Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {isPlaying ? (
                <FaPause className="text-2xl" />
              ) : (
                <FaPlay className="text-2xl" />
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="text-white hover:text-purple-400 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <FaVolumeMute className="text-2xl" />
                ) : (
                  <FaVolumeUp className="text-2xl" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-all duration-300 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Time */}
            <div className="text-white text-sm font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quality Selector */}
            {qualities.length > 1 && (
              <div className="relative">
                <button
                  onClick={() => setShowQualityMenu(!showQualityMenu)}
                  className="text-white hover:text-purple-400 transition-colors flex items-center gap-2"
                >
                  <MdHighQuality className="text-2xl" />
                  <span className="text-sm font-medium">
                    {qualities.find((q: any) => q.url === selectedQuality)
                      ?.quality || "Auto"}
                  </span>
                </button>

                {showQualityMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-900 rounded-lg shadow-xl overflow-hidden">
                    {qualities.map((quality: any) => (
                      <button
                        key={quality.url}
                        onClick={() => handleQualityChange(quality.url)}
                        className={`block w-full px-4 py-2 text-left text-sm hover:bg-purple-600 transition-colors ${
                          quality.url === selectedQuality
                            ? "bg-purple-700 text-white"
                            : "text-gray-300"
                        }`}
                      >
                        {quality.quality}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {isFullscreen ? (
                <FaCompress className="text-2xl" />
              ) : (
                <FaExpand className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
