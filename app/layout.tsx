import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { Aref_Ruqaa } from "next/font/google"
import Footer from "./sections/Footer";

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"], 
})


export const metadata: Metadata = {
  title: "منصة السلطان التعليمية",
  description: "منصة السلطان التعليمية هي منصة تعليمية شاملة تهدف إلى توفير محتوى تعليمي عالي الجودة ومتنوع للطلاب في جميع المراحل الدراسية. تقدم المنصة مجموعة واسعة من الدروس والمحاضرات والمواد التعليمية في مختلف المواد الدراسية، مما يساعد الطلاب على تحقيق نجاح أكاديمي وتطوير مهاراتهم بشكل فعال.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={` h-full antialiased ${arefRuqaa.className} `}
    >
      
      <body className="min-h-full flex bg-[#1C1C18]  flex-col">
        <Header />
        {children}
        <Footer />
        </body>
    </html>
  );
}
