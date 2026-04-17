import Image from 'next/image';
import Link from 'next/link';



type Course = {
  id: string;
  title: string;
  description: string;
  price: number;
  tags: string[];
  imageUrl: string | null;
};

function CourseComp({ imageUrl, title, id, description, price, tags }: Course) {
  return (
    <div className="w-full flex flex-col text-right rounded-2xl bg-[#e6d3a3]/20 overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] border border-[#e6d3a3]/20">
      <div className="w-full h-64 relative">
        <div className="absolute inset-0 animate-pulse bg-[#e6d3a3] rounded-t-2xl" />
        {imageUrl && (

          <Image
            src={imageUrl}
            alt="Course Image"
            fill
            className="object-cover rounded-t-2xl"
            onLoadingComplete={(img) => {
              img.style.opacity = "1";
            }}
            style={{ opacity: 0, transition: "opacity 0.3s ease" }}
          />



        )}
      </div>
      <div className="p-6 md:p-8 space-y-6 bg-[#e6d3a3]/10 backdrop-blur-md">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#e6d3a3] leading-tight">
          {title}
        </h1>
        <h2 className="text-lg md:text-xl text-[#e6d3a3]/90 leading-relaxed mb-6">
          {description}
        </h2>
        <p className="text-2xl font-bold text-white mb-6">{price}</p>
        <Link href={`/user/courses/${id}`}>
          <button className="w-full px-6 mb-5 py-4 rounded-xl text-xl font-semibold bg-[#e6d3a3] hover:bg-[#d4c38c] text-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 cursor-pointer">
            اشترك الآن
          </button>
        </Link>
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full text-sm font-medium bg-[#e6d3a3]/20 text-[#e6d3a3]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseComp;
