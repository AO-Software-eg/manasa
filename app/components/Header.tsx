"use client";
import Image from "next/image"
import { useState, useRef, useEffect } from "react";
import { Menu, Origami } from "lucide-react"
import Link from "next/link";
import { motion, AnimatePresence, Variants } from 'framer-motion';


const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: -8,
    transformOrigin: "top right",
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.42, 0, 0.58, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    y: -8,
    transition: {
      duration: 0.15,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const listItems = [
  {
    label: "المنتدى",
    href: "/archive",
  },
  {
    label: "الرئيسية",
    href: "/",
  },
  {
    label: "الدروس",
    href: "/lessons",
  },
]

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    if (menuRef.current && !menuRef.current.contains(document.activeElement)) {
      setIsMenuOpen(false);
    }
    else {
      setIsMenuOpen(!isMenuOpen)
    }
  };

  return (
    <header className="relative  fi z-100 w-[70%] mx-auto p-3 mt-9 shadow-2xl border-2 border-[#3b3b34] text-[#e6d3a3] bg-[#1C1C18] rounded-3xl">
      <nav className="flex justify-between items-center">
        <div className="absolute left-5 -top-10 pointer-events-none">
          <Image
            src="https://21uczgvyfz.ufs.sh/f/Rj1B6NAFKq4JJb2A1UOXSAl4qxFGbfIn692juDCZ0W8J3TBH"
            alt="Logo"
            width={50}
            height={50}
          />
        </div>

        <Origami />

        <ul className="md:flex gap-5 hidden ">
          {listItems.map((item, i) => (

            <li className="cursor-pointer hover:opacity-70 transition list-none" key={item.href}>
              <Link href={item.href} >
                {item.label}
              </Link>
            </li>

          ))}
        </ul>

        <button onClick={toggleMenu}>
          <Menu />
        </button>
      </nav>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="dropdown"
            ref={menuRef}
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col text-center gap-3 absolute -left-2 top-20 bg-[#1C1C18] p-3 rounded-lg shadow-lg border-2 border-[#3b3b34] before:absolute before:-top-2 before:left-5 before:w-4 before:h-4 before:bg-[#1C1C18] before:rotate-45 before:border-t-2 before:border-l-2 before:border-[#3b3b34]"
          >



            <div className="md:hidden flex flex-col gap-2">
              {listItems.map((item, i) => (

                <li className="cursor-pointer hover:opacity-70 transition list-none " key={item.href}>
                  <Link href={item.href} >
                    {item.label}
                  </Link>
                </li>

              ))}
            </div>
            <div className="flex gap-2">
              <button className="px-4 cursor-pointer py-2 bg-[#3b3b34] rounded-lg text-sm hover:bg-[#5a5a52] transition">
                تسجيل الدخول
              </button>
              <button className="px-4 cursor-pointer py-2 bg-none border-2 border-[#e6d3a3] box-border rounded-lg text-sm hover:bg-[#5a5a52] transition">
                إنشاء حساب
              </button>
            </div>



          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Header