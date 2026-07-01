'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

function Footer() {
  const path = usePathname();
  const isUserPage = path.startsWith('/home');
  return (
    <>
      {!isUserPage && (
        <section className="relative w-full min-h-[40vh] overflow-hidden flex items-center justify-center bg-card mt-20 rounded-t-3xl border-t border-border">
          {/* Background Image */}
          <div className="absolute inset-0 w-full h-full z-0">
            <Image
              src="https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dp3udS5UFh8G4vUARZfOExnz6iSHVg7sNj5hue"
              alt="Footer Background"
              fill
              className="object-cover object-center opacity-10 dark:opacity-40"
              priority={false}
            />
          </div>

          {/* Content */}
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center text-center text-foreground px-8 max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-primary drop-shadow-md">
              منصة السلطان
            </h3>
            <p className="text-xl md:text-2xl font-semibold opacity-90 leading-relaxed">
              © 2024 في مادة التاريخ - جميع الحقوق محفوظة.
            </p>
            <p className="text-lg md:text-xl mt-4 opacity-70">شكراً لزيارتكم</p>
          </motion.div>
        </section>
      )}
    </>
  );
}

export default Footer;
