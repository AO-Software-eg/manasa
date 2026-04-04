import Image from "next/image";
import HeroSec from "./sections/HeroSec";
import YearSec from "./sections/YearSec";
import Courses from "./sections/Courses";


export default function Home() {
  return (
    <main className="flex min-h-screen relative overflow-x-clip flex-col items-center justify-between ">
      <HeroSec />
      <YearSec />
      <Courses />
    </main>
  );
}
