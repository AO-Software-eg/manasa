
export default function VideoPlayer({ videoData }: { videoData: any }) {


  if (!videoData) return <p>Loading...</p>;

  return (
    <iframe
      src={`https://player.vdocipher.com/v2/?otp=${videoData.otp}&playbackInfo=${videoData.playbackInfo}`}
      style={{ border: 0, width: '720px', height: '405px' }}
      allow="encrypted-media"
      allowFullScreen
    />
  );
}
