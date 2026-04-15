import SideNav from '../../components/SideNav';
import '../../globals.css';
import { Cairo } from 'next/font/google';


const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400', '700'],
});
export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`min-h-screen flex bg-[#0d0d0d] text-white ${cairo.className}`}>
            <SideNav />

            {/* Main content */}
             <main className="flex-1 lg:mr-20 mt-16 lg:mt-0 p-4 lg:max-h-screen lg:overflow-y-scroll">
                {children}
            </main>
        </div>
    )
}