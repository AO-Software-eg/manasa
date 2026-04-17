import YearBox from '../../components/YearBox';
import { ScrollArea, ScrollBar } from '../../../ui/scroll-area';

function YearSec() {
  return (
    <section className="w-full relative bg-[#0d0d0d] py-16 md:py-24 ">


      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <h1 className="text-5xl md:text-6xl font-bold text-center mb-16 text-[#e6d3a3] leading-tight">
          السنوات الدراسية
        </h1>

        <ScrollArea className="w-full lg:w-11/12 mx-auto rounded-2xl border border-[#e6d3a3]/20 bg-[#e6d3a3]/10 backdrop-blur-md shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="flex gap-6 md:gap-8 p-6 md:p-8 pb-6 md:pb-8">
            <div className="shrink-0">
              <YearBox year="اولى ثانوي" link='g1' />
            </div>
            <div className="shrink-0">
              <YearBox year="تانية ثانوي" link='g2' />
            </div>
            <div className="shrink-0">
              <YearBox year="ثالثة ثانوي" link='g3' />
            </div>
          </div>
          <ScrollBar
            orientation="horizontal"
            className="[&amp;_track]:bg-[#e6d3a3]/20 [&amp;_thumb]:bg-[#e6d3a3]/70 hover:[&amp;_thumb]:bg-[#e6d3a3]/90 h-2 rounded-full transition-all duration-200"
          />
        </ScrollArea>
      </div>
    </section>
  );
}

export default YearSec;
