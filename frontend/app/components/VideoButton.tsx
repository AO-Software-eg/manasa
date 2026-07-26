import { lecture } from '@manasa/shared';

interface VideoButtonProps {
  video: lecture['lectureVideos'][0];
  onClick: () => void;
}

export default function VideoButton({ video, onClick }: VideoButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between rounded-xl border border-zinc-700 bg-zinc-900/60 p-4 transition-all hover:border-blue-500 hover:bg-zinc-800"
    >
      <div className="flex items-center gap-3">
        <span className="font-medium text-zinc-100">{video.title}</span>
      </div>
      <span className="text-sm text-zinc-400">مشاهدة</span>
    </button>
  );
}