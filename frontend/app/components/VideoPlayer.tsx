type VidData = {
  otp: string;
  playbackInfo: string;
};

export default function VideoPlayer({
  videoData,
}: {
  videoData: VidData;
}) {
  return (
    <div className="w-full aspect-video overflow-hidden rounded-3xl">
      <iframe
        src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
        className="h-full w-full"
        allow="encrypted-media"
        allowFullScreen
      />
    </div>
  );
}