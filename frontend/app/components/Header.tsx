'use client';
import { useState, useRef, useEffect } from 'react';
import { Menu, Origami } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useMe } from '../hooks/queries/useMe';
import { api } from '../hooks/api';

const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    y: -8,
    transformOrigin: 'top right',
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
    label: 'الرئيسية',
    href: '/',
  },
  {
    label: 'الدروس',
    href: '/courses',
  },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const isUserPage = path.startsWith('/home');
  const { data: userData, isError } = useMe();


  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    if (menuRef.current && !menuRef.current.contains(document.activeElement)) {
      setIsMenuOpen(false);
    } else {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  return (
    <>
      {!isUserPage && (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[70%] lg:w-[60%] mx-auto p-4 shadow-2xl border border-[#3b3b34] text-[#e6d3a3] bg-[#1C1C18]/90 backdrop-blur-xl rounded-2xl">
          <nav className="flex justify-between items-center">
            <Link href={'/'} className="flex items-center justify-center gap-2">
              <Origami className="text-[#e6d3a3]" />
              <span className="text-xl font-bold">منصة سلسلة</span>
            </Link>

            <ul className="md:flex gap-8 hidden items-center">
              {listItems.map((item, i) => (
                <li
                  className={`cursor-pointer transition list-none ${path !== item.href ? 'text-[#e6d3a3] font-bold' : 'text-[#e6d3a3]/70 hover:text-[#e6d3a3]'}`}
                  key={item.href}
                >
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <div className="flex gap-3 items-center">
                {userData ? (
                  <>
                    <Link href={'/home'} onClick={() => setIsMenuOpen(false)}>
                      <button className="px-5 py-2 bg-[#e6d3a3] text-[#1C1C18] rounded-xl font-semibold hover:bg-[#d4c38c] transition-all duration-300">
                        اذهب إلى التطبيق
                      </button>
                    </Link>
                    <button
                      className="px-4 py-2 bg-transparent border border-[#e6d3a3] text-[#e6d3a3] rounded-xl hover:bg-[#e6d3a3]/10 transition-all duration-300"
                      onClick={() => {
                        api.post('/logout', {}).then(() => {
                          window.location.href = '/';
                        });
                        setIsMenuOpen(false);
                      }}
                    >
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href={'/login'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button className="px-4 py-2 text-sm hover:opacity-80 transition">
                        تسجيل الدخول
                      </button>
                    </Link>
                    <Link
                      href={'/signup'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button className="px-5 py-2 bg-[#e6d3a3] text-[#1C1C18] rounded-xl font-semibold hover:bg-[#d4c38c] transition-all duration-300">
                        إنشاء حساب
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </ul>

            <button onClick={toggleMenu} className="md:hidden">
              <Menu className="text-[#e6d3a3]" />
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
                className="flex flex-col gap-4 mt-4 p-4 rounded-xl bg-[#1C1C18] border border-[#3b3b34]"
              >
                {listItems.map((item, i) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-right py-2 ${path === item.href ? 'text-[#e6d3a3] font-bold' : 'text-[#e6d3a3]/70'}`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-3 border-t border-[#3b3b34]">
                  {userData ? (
                    <>
                      <Link href={'/home'} onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full px-5 py-3 bg-[#e6d3a3] text-[#1C1C18] rounded-xl font-semibold">
                          اذهب إلى التطبيق
                        </button>
                      </Link>
                      <button
                        className="w-full px-4 py-3 border border-[#e6d3a3] text-[#e6d3a3] rounded-xl"
                        onClick={() => {
                          api.post('/logout', {}).then(() => {
                            window.location.href = '/';
                          });
                          setIsMenuOpen(false);
                        }}
                      >
                        تسجيل الخروج
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href={'/login'} onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full px-4 py-3 text-right text-[#e6d3a3]">
                          تسجيل الدخول
                        </button>
                      </Link>
                      <Link href={'/signup'} onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full px-5 py-3 bg-[#e6d3a3] text-[#1C1C18] rounded-xl font-semibold">
                          إنشاء حساب
                        </button>
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </header>
      )}
    </>
  );
}

export default Header;
