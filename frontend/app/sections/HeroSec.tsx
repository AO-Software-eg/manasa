"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion } from "framer-motion";

// ✅ Disable SSR for Lottie (important)
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

function HeroSec() {
  return (
    <section className="relative w-full mt-20 min-h-screen overflow-hidden flex items-center justify-center">

      {/* LEFT IMAGE */}
      <motion.div
        initial={{ x: -120, rotate: -12, opacity: 0 }}
        animate={{ x: 0, rotate: -6, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute -left-20 sm:-left-16 lg:-left-10 -top-32 sm:-top-20 lg:-top-10 w-[70%] sm:w-[50%] lg:w-[45%] h-full z-0"
      >
        <Image
          src="https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dp1shd90KwUDA5opdgTfPIL06ybWnh9ZEjYKxQ"
          alt="Left Statue"
          fill
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 45vw"
          className="object-contain object-bottom-left opacity-60 sm:opacity-80"
          priority
        />
      </motion.div>

      {/* RIGHT IMAGE */}
      <motion.div
        initial={{ x: 120, rotate: 12, opacity: 0 }}
        animate={{ x: 0, rotate: 6, opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute -right-20 sm:-right-16 lg:-right-10 -top-32 sm:-top-20 lg:-top-10 w-[70%] sm:w-[50%] lg:w-[45%] h-full z-0"
      >
        <Image
          src="https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dp6oypcPXLHlyXdUMO8LsW2ihoY0mfVAbF6G3j"
          alt="Right Obelisk"
          fill
          sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 45vw"
          className="object-contain object-bottom-right opacity-70 sm:opacity-90"
          priority
        />
      </motion.div>

      {/* CENTER CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-[#e6d3a3] px-4">
        <motion.h1
          className="text-6xl md:text-7xl font-bold mb-4"
          initial={{ filter: "blur(20px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        >
          منصة السلطان
        </motion.h1>

        <motion.h2
          className="text-5xl md:text-6xl font-semibold"
          initial={{ filter: "blur(20px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
        >
          في مادة التاريخ
        </motion.h2>
      </div>

      {/* LOTTIE ANIMATION */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
        <Lottie
          animationData={require("../../public/scrolldown.json")}
          loop
          autoplay
          style={{ width: 50, height: 50 }}
        />
      </div>
    </section>
  );
}

export default HeroSec;