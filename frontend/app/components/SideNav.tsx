"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, BellRing, X, EllipsisVertical, Home, User, BookOpen, Wallet, Clock, Headset, Settings, Share2, Globe, MessageCircle, Phone, Mail } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const navItems = [
    { name: "الرئيسية", href: "/user/dashboard", icon: Home },
    { name: "الدروس", href: "/user/courses", icon: BookOpen },
    { name: "المحفظة", href: "/user/wallet", icon: Wallet },
    { name: "التاريخ", href: "/user/history", icon: Clock },
    { name: "الدعم الفني", href: "/user/tech-support", icon: Headset },
    { name: "الإعدادات", href: "/user/settings", icon: Settings },
];

function SideNav() {
    const path = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    const isActive = (href: string) => path.startsWith(href);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            {/* Desktop sidebar */}
            <aside className="relative  lg:static  lg:block right-0 top-0 w-64 h-screen bg-[#1C1C18] text-[#e6d3a3] p-4 border-2 border-[#3b3b34]/50 hidden  shadow-sm shadow-[#e6d3a3]/20">
                <Link href={'/user/profile'}>
                    <div className="flex justify-between mb-10 cursor-pointer gap-4 py-3 px-6 bg-[#525248] rounded-lg border border-[#3b3b34]/50 items-center">
                        <div className="flex flex-col ">
                            <h1 className="max-w-30 text-nowrap overflow-hidden text-ellipsis ">
                                محمد محمود احمد عبدالرحمن
                            </h1>
                            <h2 className="text-sm text-white max-w-30 text-nowrap overflow-hidden text-ellipsis">
                                مدرس تاريخ
                            </h2>
                        </div>
                        <span className="min-w-10 min-h-10 rounded-full border overflow-hidden ">
                            <Image src={'https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dpNlkL47ap8yEIH9Fkio41AhsfSRzt5p3POKvb'} alt="pfp" width={100} height={100} />
                        </span>
                    </div>
                </Link>
                <nav className="">
                    <ul className="space-y-4 mb-20">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block px-4 py-2 rounded transition ${isActive(item.href) ? "bg-[#3b3b34]" : "hover:bg-[#2a2a25] hover:border-2 hover:border-[#3b3b34]/50"
                                        } flex items-center gap-3`}
                                >
                                    <Icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </ul>
                </nav>
                <footer className="absolute w-fit  bottom-4 left-4 right-4 flex justify-center gap-4 p-3 bg-[#3b3b34] rounded-lg border border-[#3b3b34]/50 shadow-sm shadow-[#e6d3a3]/20">
                    <a href="#" className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 rounded transition">
                        <Share2 size={18} />
                    </a>
                    <a href="#" className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 rounded transition">
                        <Globe size={18} />
                    </a>
                    <a href="#" className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 rounded transition">
                        <MessageCircle size={18} />
                    </a>
                    <a href="#" className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 rounded transition">
                        <Mail size={18} />
                    </a>
                </footer>

            </aside>

            {/* Mobile top bar */}
            <div className="lg:hidden border-b-2 border-[#3b3b34] px-4 py-2 fixed flex items-center justify-between top-0 right-0 z-50 bg-[#1C1C18] shadow-sm shadow-[#e6d3a3]/20 w-full">
                <button onClick={() => setIsMenuOpen(true)} className="text-[#e6d3a3] p-2 rounded">
                    <Menu />
                </button>
                <div>
                    <button onClick={() => setIsNotifOpen(true)} className="text-[#e6d3a3] p-2 rounded">
                        <BellRing />
                    </button>
                    <button className="text-[#e6d3a3] p-2 rounded">
                        <EllipsisVertical />
                    </button>
                </div>
            </div>

            {/* Notification panel */}
            {isNotifOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-16">
                    <div
                        ref={notifRef}
                        className="bg-[#1C1C18] w-[90%] max-w-sm rounded-xl shadow-lg p-4 border-2 border-[#3b3b34]"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-[#e6d3a3] font-semibold text-lg">الإشعارات</h2>
                            <button
                                onClick={() => setIsNotifOpen(false)}
                                className="text-[#e6d3a3]/70 hover:text-[#e6d3a3]"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-[#e6d3a3]/70 text-sm text-center py-6">لا توجد إشعارات جديدة</p>
                    </div>
                </div>
            )}

            {/* Menu backdrop */}
            {isMenuOpen && <div className="fixed inset-0 bg-black/50 z-40" />}

            {/* Mobile sidebar */}
            <aside
                ref={menuRef}
                className={`fixed top-0 right-0 h-screen w-[80%] bg-[#1C1C18] text-[#e6d3a3] p-4 z-50 transform transition-transform duration-300 border-2 border-[#3b3b34]/50 shadow-sm shadow-[#e6d3a3]/20 ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    } lg:hidden`}
            >
                <Link href={'/user/profile'} onClick={() => setIsMenuOpen(false)}>
                    <div className="flex justify-between mb-10 cursor-pointer gap-4 py-3 px-6 bg-[#525248] rounded-lg border border-[#3b3b34]/50 items-center">
                        <div className="flex flex-col ">
                            <h1 className="max-w-30 text-nowrap overflow-hidden text-ellipsis ">
                                محمد محمود احمد عبدالرحمن
                            </h1>
                            <h2 className="text-sm text-white max-w-30 text-nowrap overflow-hidden text-ellipsis">
                                مدرس تاريخ
                            </h2>
                        </div>
                        <span className="min-w-10 min-h-10 rounded-full border overflow-hidden ">
                            <Image src={'https://ytgu3s3xxa.ufs.sh/f/GNGTKtuqz7dpNlkL47ap8yEIH9Fkio41AhsfSRzt5p3POKvb'} alt="pfp" width={100} height={100} />
                        </span>
                    </div>
                </Link>

                <nav>
                    <ul className="space-y-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-4 py-2 rounded transition ${isActive(item.href) ? "bg-[#3b3b34]" : "hover:bg-[#2a2a25] hover:border-2 hover:border-[#3b3b34]/50"
                                        } flex items-center gap-3`}
                                >
                                    <Icon size={20} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </ul>
                </nav>
                <footer className="absolute bottom-0 right-0 flex justify-center gap-4 p-3 bg-[#3b3b34] w-full border-t border-[#3b3b34]/50">
                    <a href="#" className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 rounded transition">
                        <Share2 size={18} />
                    </a>
                    <a href="#" className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 rounded transition">
                        <Globe size={18} />
                    </a>
                    <a href="#" className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 rounded transition">
                        <MessageCircle size={18} />
                    </a>
                    <a href="#" className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 rounded transition">
                        <Phone size={18} />
                    </a>
                    <a href="#" className="text-[#e6d3a3]/70 hover:text-[#e6d3a3] p-2 rounded transition">
                        <Mail size={18} />
                    </a>
                </footer>
            </aside>
        </>
    );
}

export default SideNav;