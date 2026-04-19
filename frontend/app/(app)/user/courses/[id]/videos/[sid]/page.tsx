import React from 'react';

function page() {
  return (
    <div className=" w-full min-h-screen flex items-center justify-center flex-col gap-8">
      <h1>video page</h1>
      <iframe
        src="https://player.vimeo.com/video/1184530230?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
        width="600"
        height="300"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
        title="file_example_MOV_1920_2_2MB"
      ></iframe>
    </div>
  );
}

export default page;
