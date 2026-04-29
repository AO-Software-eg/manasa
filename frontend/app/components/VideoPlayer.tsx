type vidData = {
  otp: string;
  playbackInfo: string;
};

export default function VideoPlayer({ videoData }: { videoData: vidData }) {
  return (
    <iframe
      src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
      style={{ border: 0, width: '720px', height: '405px' }}
      allow="encrypted-media"
      allowFullScreen
    />
  );
}