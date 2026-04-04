"use client"
import React from 'react'
import Image from "next/image";
import { motion } from "framer-motion";

function Footer() {
  return (
    <section className="relative w-full min-h-[60vh] overflow-hidden flex items-center justify-center bg-[#1C1C18]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="https://21uczgvyfz.ufs.sh/f/Rj1B6NAFKq4J5SMArRdGVNl73MPCceKDB8ugaWsx9oiL0qwn"
          alt="Footer Background"
          fill
          className="object-cover object-center opacity-40"
          priority={false}
        />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center text-[#e6d3a3] px-8 max-w-4xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h3 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          منصة السلطان
        </h3>
        <p className="text-xl md:text-2xl font-semibold opacity-90 leading-relaxed">
          © 2024 في مادة التاريخ - جميع الحقوق محفوظة.
        </p>
        <p className="text-lg md:text-xl mt-4 opacity-70">
          شكراً لزيارتكم
        </p>
      </motion.div>
    </section>
  )
}

export default Footer
