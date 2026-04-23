import VideoPlayer from "@/app/components/VideoPlayer";

function page() {
  return (
    <div className=" w-full min-h-screen flex items-center justify-center flex-col gap-8">
      <h1>video page</h1>
      <VideoPlayer />
    </div>
  );
}

export default page;
