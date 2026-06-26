'use client';

import { useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

type VidData = {
  otp: string;
  playbackInfo: string;
};

type Props = {
  videoData: VidData;
};

export default function VideoPlayer({ videoData }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastPositionRef = useRef(0);
  const isSavingRef = useRef(false);

  const lectureId = useParams().lid;

  useEffect(() => {
    if (!iframeRef.current) return;

    let player: any;

    const init = async () => {
      player = window.VdoPlayer.getInstance(iframeRef.current!);

      const saveProgress = async (reason: string) => {
        if (isSavingRef.current) return;

        isSavingRef.current = true;

        try {
          const covered: number[] = await player.api.getTotalCoveredArray();

          const watchedSeconds = covered.filter(Boolean).length;

          const duration = Math.floor(player.video.duration);

          const lastPosition = Number(
            lastPositionRef.current.toFixed(2)
          );

          const progress = watchedSeconds / duration;

          const progressPercentage = Number(
            (progress * 100).toFixed(2)
          );

          const completed = progress >= 0.9;

          const payload = {
            lectureId,

            // Resume
            lastPosition,

            // Video
            duration,

            // Coverage
            covered,
            watchedSeconds,

            // Progress
            progress,
            progressPercentage,
            completed,

            // Extra
            remainingSeconds: duration - watchedSeconds,
            playbackRate: player.video.playbackRate,

            // Debug
            reason,
          };

          console.clear();
          console.log(payload);

          // backend goes here
        } catch (err) {
          console.error(err);
        } finally {
          isSavingRef.current = false;
        }
      };

      const handleTimeUpdate = () => {
        lastPositionRef.current = player.video.currentTime;
      };

      const handlePause = () => {
        saveProgress('pause');
      };

      const handleEnded = () => {
        lastPositionRef.current = player.video.duration;
        saveProgress('ended');
      };

      const handleBeforeUnload = () => {
        saveProgress('beforeunload');
      };

      player.video.addEventListener('timeupdate', handleTimeUpdate);
      player.video.addEventListener('pause', handlePause);
      player.video.addEventListener('ended', handleEnded);

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        player.video.removeEventListener('timeupdate', handleTimeUpdate);
        player.video.removeEventListener('pause', handlePause);
        player.video.removeEventListener('ended', handleEnded);

        window.removeEventListener('beforeunload', handleBeforeUnload);

        saveProgress('unmount');
      };
    };

    // cleanup for each video in the future

    let cleanup: (() => void) | undefined;

    init().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cleanup?.();
    };
  }, [lectureId]);

  return (
    <div className="aspect-video w-full overflow-hidden rounded-3xl">
      <iframe
        ref={iframeRef}
        src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
        className="h-full w-full"
        allow="encrypted-media"
        allowFullScreen
      />
    </div>
  );
}