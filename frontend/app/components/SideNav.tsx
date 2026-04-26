'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { api } from '../hooks/api';
import {
  Menu,
  BellRing,
  X,
  Home,
  BookOpen,
  Wallet,
  Clock,
  Headset,
  Settings,
  Share2,
  Globe,
  MessageCircle,
  Mail,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const navGroups = [
  {
    label: 'القائمة الرئيسية',
    items: [
      { name: 'الرئيسية', href: '/user/dashboard', icon: Home },
      { name: 'الدروس', href: '/user/courses', icon: BookOpen , badge: true},
      { name: 'المحفظة', href: '/user/wallet', icon: Wallet },
      { name: 'التاريخ', href: '/user/history', icon: Clock },
    ],
  },
  {
    label: 'الدعم',
    items: [
      { name: 'الدعم الفني', href: '/user/tech-support', icon: Headset },
      { name: 'الإعدادات', href: '/user/settings', icon: Settings },
    ],
  },
];

const socialLinks = [
  { icon: Share2, label: 'مشاركة' },
  { icon: Globe, label: 'الموقع' },
  { icon: MessageCircle, label: 'رسائل' },
  { icon: Mail, label: 'بريد' },
];

function UserAvatar({ name }: { name: string }) {
  const initials = name
    ? name
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
    : '؟';
  return (
    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3d3928] to-[#5a5032] flex items-center justify-center text-[#e6d3a3] text-sm font-bold flex-shrink-0">
      {initials}
    </div>
  );
}

function SideNav({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { loggedIn, userData } = useAuth();
  const path = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => path.startsWith(href);
  const userName = loggedIn && userData ? userData.name : '...';
  const [courses, setCourses] = useState<{ id: number; title: string }[] | null>(null);
  const coursesCount = courses?.length || 0;

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await api.get('/courses');
        setCourses(res.data.data);

      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    }

    fetchCourses();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* ─── Desktop Header ─── */}
      <header className="hidden lg:flex fixed top-0 right-0 left-0 z-50 h-12 bg-[#141412] border-b border-[#1f1f1c] items-center justify-between px-4">
        <span className="text-[#e6d3a3] font-semibold text-sm">
          منصة التعلم
        </span>
        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1c1c18] text-[#9a9080] hover:text-[#e6d3a3] transition-colors">
            <Search size={18} />
          </button>
          <button
            onClick={() => setIsNotifOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1c1c18] text-[#9a9080] hover:text-[#e6d3a3] transition-colors relative"
          >
            <BellRing size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#c4a95a]" />
          </button>
        </div>
      </header>

      {/* ─── Desktop Sidebar ─── */}
      <aside
        className={`relative hidden lg:flex flex-col h-screen  pt-12 bg-[#141412] text-[#e6d3a3] border-l border-[#1f1f1c] transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-[230px]'
          }`}
      >
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -left-3 top-[68px] z-10 w-6 h-6 rounded-full bg-[#141412] border border-[#2e2e27] flex items-center justify-center text-[#9a9080] hover:text-[#e6d3a3] hover:bg-[#1e1e1a] transition-all shadow-sm"
          aria-label={collapsed ? 'توسيع' : 'طي'}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>

        {/* Profile */}
        <div className="p-3 border-b border-[#1f1f1c]">
          <Link href="/user/profile">
            <div
              className={`flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer hover:bg-[#222219] transition-colors ${collapsed ? 'justify-center' : 'bg-[#1c1c18] border border-[#2a2a22] '
                }`}
            >
              <UserAvatar name={userName} />
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#e6d3a3] truncate leading-tight">
                    {userName}
                  </p>
                  <p className="text-[11px] text-[#7a7060] mt-0.5">طالب مميز</p>
                </div>
              )}
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2.5 space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] uppercase tracking-widest text-[#4a4a42] px-2.5 mb-1.5 font-semibold">
                  {group.label}
                </p>
              )}
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ${collapsed ? 'justify-center' : ''
                          } ${active
                            ? 'bg-[#252520] text-[#e6d3a3]'
                            : 'text-[#7a7060] hover:bg-[#1c1c18] hover:text-[#c4b48a]'
                          }`}
                      >
                        {active && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-[#c4a95a] rounded-r-none rounded-l-sm" />
                        )}
                        <Icon
                          size={17}
                          className="flex-shrink-0"
                          strokeWidth={active ? 2.2 : 1.8}
                        />
                        {!collapsed && (
                          <span className="flex-1">{item.name}</span>
                        )}
                        {!collapsed && item.badge && (
                          <span className="bg-[#2a2820] text-[#c4a95a] text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                            {coursesCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer social links */}
        {!collapsed && (
          <div className="p-3 border-t border-[#1f1f1c]">
            <div className="flex justify-center gap-3 p-2.5 bg-[#1a1a16] rounded-xl border border-[#252520]">
              {socialLinks.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  title={label}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#5a5548] hover:bg-[#252520] hover:text-[#c4a95a] transition-all"
                >
                  <Icon size={14} strokeWidth={1.8} />
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* ─── Mobile Top Bar ─── */}
      <div className="lg:hidden fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 py-2.5 bg-[#141412] border-b border-[#1f1f1c]">
        <button
          onClick={() => setIsMenuOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1c1c18] text-[#9a9080] hover:text-[#e6d3a3] transition-colors"
        >
          <Menu size={20} />
        </button>

        <span className="text-[#e6d3a3] font-semibold text-sm">
          منصة التعلم
        </span>

        <div className="flex items-center gap-1">
          <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1c1c18] text-[#9a9080] hover:text-[#e6d3a3] transition-colors">
            <Search size={18} />
          </button>
          <button
            onClick={() => setIsNotifOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#1c1c18] text-[#9a9080] hover:text-[#e6d3a3] transition-colors relative"
          >
            <BellRing size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#c4a95a]" />
          </button>
        </div>
      </div>

      {/* ─── Notification Panel ─── */}
      {isNotifOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center pt-16 backdrop-blur-sm">
          <div
            ref={notifRef}
            className="bg-[#141412] w-[90%] max-w-sm rounded-2xl border border-[#2a2a22] shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f1c]">
              <h2 className="text-[#e6d3a3] font-semibold text-sm">
                الإشعارات
              </h2>
              <button
                onClick={() => setIsNotifOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-[#1c1c18] text-[#7a7060] hover:text-[#e6d3a3] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-center py-10 text-sm text-[#5a5548]">
              لا توجد إشعارات جديدة
            </p>
          </div>
        </div>
      )}

      {/* ─── Mobile Sidebar Backdrop ─── */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* ─── Mobile Sidebar Drawer ─── */}
      <aside
        ref={menuRef}
        className={`fixed top-0 right-0 h-screen w-[80%] max-w-[280px] bg-[#141412] text-[#e6d3a3] z-50 flex flex-col transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          } lg:hidden`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1f1f1c]">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1c1c18] text-[#7a7060] hover:text-[#e6d3a3] transition-colors"
          >
            <X size={18} />
          </button>
          <Link href="/user/profile" onClick={() => setIsMenuOpen(false)}>
            <div className="flex items-center gap-2.5 bg-[#1c1c18] px-3 py-2 rounded-xl border border-[#2a2a22]">
              <UserAvatar name={userName} />
              <div>
                <p className="text-[13px] font-semibold text-[#e6d3a3] leading-tight">
                  {userName}
                </p>
                <p className="text-[11px] text-[#7a7060]">طالب مميز</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Mobile nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] uppercase tracking-widest text-[#4a4a42] px-2 mb-1.5 font-semibold">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${active
                            ? 'bg-[#252520] text-[#e6d3a3]'
                            : 'text-[#7a7060] hover:bg-[#1c1c18] hover:text-[#c4b48a]'
                          }`}
                      >
                        {active && (
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#c4a95a] rounded-r-none rounded-l-sm" />
                        )}
                        <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                        <span className="flex-1">{item.name}</span>
                        { item.badge && coursesCount > 0 && (
                          <span className="bg-[#2a2820] text-[#c4a95a] text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                            {coursesCount}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Mobile drawer footer */}
        <div className="p-3 border-t border-[#1f1f1c]">
          <div className="flex justify-center gap-3 p-2.5 bg-[#1a1a16] rounded-xl border border-[#252520]">
            {socialLinks.map(({ icon: Icon, label }) => (
              <button
                key={label}
                title={label}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#5a5548] hover:bg-[#252520] hover:text-[#c4a95a] transition-all"
              >
                <Icon size={15} strokeWidth={1.8} />
              </button>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

export default SideNav;
