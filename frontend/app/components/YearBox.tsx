import React from 'react';
import Link from 'next/link';
type Props = {
  year: string;
  link: string;
};

function YearBox({ year, link }: Props) {
  return (
    <Link href={`/years/${link}`}>
      <div className="w-full sm:w-80 cursor-pointer shrink-0 h-48 md:h-56 bg-card hover:bg-secondary/50 text-foreground hover:text-primary rounded-2xl flex items-center justify-center text-center p-6 md:p-8 border border-border hover:border-primary/40 hover:shadow-md transform hover:scale-102 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden shadow-xs">
        <h4 className="text-xl md:text-2xl lg:text-3xl font-bold mx-auto leading-tight transition-colors duration-300">
          {year}
        </h4>
      </div>
    </Link>
  );
}

export default YearBox;
