"use client";
import { useEffect, useState } from "react";

export default function VideoPlayer() {
  const [videoData, setVideoData] = useState<any>(null);

  useEffect(() => {
    async function loadVideo() {
      const res = await fetch(
        "http://localhost:5000/video/2d076a459fca4e82a5f68bbb25a51fce",
        {
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log("video data:", data);

      setVideoData(data);
    }

    loadVideo();
  }, []);

  if (!videoData) return <p>Loading...</p>;

  return (
    <iframe
      src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
      style={{ border: 0, width: "720px", height: "405px" }}
      allow="encrypted-media"
      allowFullScreen
    />
  );
}