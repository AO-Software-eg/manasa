'use client';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { Menu, Origami } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useMe } from '../hooks/queries/useMe';
import { api } from '../hooks/api';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
  const path = usePathname() ?? '';
  const isUserPage = path.startsWith('/home');
  const { data: userData } = useMe();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] md:w-[70%] lg:w-[60%] mx-auto p-4 shadow-xl border border-border text-foreground bg-card/90 backdrop-blur-xl rounded-2xl transition-all duration-300">
          <nav className="flex justify-between items-center">
            <Link href={'/'} className="flex items-center justify-center gap-2">
              <Origami className="text-primary h-6 w-6" />
              <span className="text-xl font-bold font-sans">منصة السلطان</span>
            </Link>

            <ul className="md:flex gap-6 hidden items-center">
              {listItems.map((item) => (
                <li
                  className={`cursor-pointer transition-colors list-none ${path !== item.href ? 'text-foreground font-bold hover:text-primary' : 'text-foreground/70 hover:text-foreground'}`}
                  key={item.href}
                >
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
              <div className="flex gap-3 items-center">
                <ThemeToggle />
                {!isMounted ? (
                  <>
                    <button className="px-4 py-2 text-sm opacity-0 pointer-events-none">تسجيل الدخول</button>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold opacity-0 pointer-events-none">إنشاء حساب</button>
                  </>
                ) : userData ? (
                  <>
                    <Link href={'/home'} onClick={() => setIsMenuOpen(false)}>
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/95 transition-all duration-300 shadow-sm">
                        اذهب إلى التطبيق
                      </button>
                    </Link>
                    <button 
                      className="px-4 py-2 bg-transparent border border-border text-foreground rounded-xl hover:bg-secondary transition-all duration-300"
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
                      <button className="px-4 py-2 text-sm hover:text-primary transition-colors">
                        تسجيل الدخول
                      </button>
                    </Link>
                    <Link
                      href={'/signup'}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/95 transition-all duration-300 shadow-sm">
                        إنشاء حساب
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </ul>

            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <button onClick={toggleMenu} className="p-1" aria-label="Toggle menu">
                <Menu className="text-foreground h-6 w-6" />
              </button>
            </div>
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
                className="flex flex-col gap-4 mt-4 p-4 rounded-xl bg-card border border-border shadow-2xl"
              >
                {listItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`text-right py-2 ${path === item.href ? 'text-primary font-bold' : 'text-foreground/75 hover:text-foreground'}`}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex flex-col gap-3 pt-3 border-t border-border">
                  {!isMounted ? (
                    <>
                      <button className="w-full px-4 py-3 opacity-0 pointer-events-none">تسجيل الدخول</button>
                      <button className="w-full px-5 py-3 opacity-0 pointer-events-none">إنشاء حساب</button>
                    </>
                  ) : userData ? (
                    <>
                      <Link href={'/home'} onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full px-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm">
                          اذهب إلى التطبيق
                        </button>
                      </Link>
                      <button 
                        className="w-full px-4 py-3 border border-border text-foreground rounded-xl hover:bg-secondary transition-colors"
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
                        <button className="w-full px-4 py-3 text-right text-foreground hover:text-primary transition-colors">
                          تسجيل الدخول
                        </button>
                      </Link>
                      <Link href={'/signup'} onClick={() => setIsMenuOpen(false)}>
                        <button className="w-full px-5 py-3 bg-primary text-primary-foreground rounded-xl font-semibold shadow-sm">
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
