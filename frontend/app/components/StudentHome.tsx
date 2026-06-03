"use client";
import { useMe } from "../hooks/queries/useMe";
import { useCourses } from "../hooks/queries/useCourses";
import CardLayout from "./CardLayout";
import RecentActivityCard from "./RecentActivityCard";

import Courses from "../(marketing)/sections/Courses";
import Link from "next/link";


function StudentHome() {
    const { data: userData, isLoading } = useMe();

    if (isLoading) return null;

    return (
        <div className="w-full max-w-6xl mt-26 mx-auto px-4 py-6 space-y-6" dir="rtl">

            {/*  Header نفس ستايل الداشبورد */}
            <CardLayout classname="bg-linear-to-r from-[#1C1C18]/80 via-[#2a2a25]/80 to-[#3b3b34]/80 backdrop-blur-sm border-[#3b3b34]/50 flex flex-row justify-between items-center ">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        أهلاً بعودتك،{" "}
                        <span className="text-[#e6d3a3]">
                            {userData?.name || "طالب"}
                        </span>

                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        كمل من حيث توقفت 👇
                    </p>
                </div>
                <button
                    className="px-4 cursor-pointer py-2 text-white bg-[#e6d3a3]/50 rounded-lg text-sm hover:bg-[#5a5a52] transition"

                >
                    <Link href={'/user'}>اذهب الى التطبيق</Link>
                </button>
            </CardLayout>

   
            <CardLayout>
                <h2 className="text-lg text-white font-semibold mb-4">استكمل التعلم</h2>
                <RecentActivityCard title="" />
            </CardLayout>


            <CardLayout>


                
                    <Courses />
                
                 
            </CardLayout>
        </div>
    );
}

export default StudentHome;