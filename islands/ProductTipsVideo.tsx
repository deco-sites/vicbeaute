import { useState } from "preact/hooks";

interface Props {
  videoId: string;
}

export default function ProductTipsVideo({ videoId }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title="Youtube Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        class="w-full h-full object-cover rounded-md"
      ></iframe>
    );
  }

  return (
    <div 
      class="w-full h-full relative cursor-pointer group rounded-md overflow-hidden"
      onClick={() => setPlaying(true)}
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
        alt="Video thumbnail"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
        {/* Play Button Overlay */}
        <div class="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] border-[1.5px] border-[#FFF] rounded-full flex items-center justify-center backdrop-blur-sm bg-black/10 transition-transform group-hover:scale-110">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="ml-1 w-6 h-6 lg:w-8 lg:h-8">
              <path d="M6 4L20 12L6 20V4Z" fill="white" stroke="white" stroke-width="2" stroke-linejoin="round" />
            </svg>
        </div>
      </div>
    </div>
  );
}
