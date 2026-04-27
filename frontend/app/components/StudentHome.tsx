"use client";

import { useAuth } from "../hooks/useAuth";
import { useCourses } from "../hooks/useCourses";
import CardLayout from "./CardLayout";
import RecentActivityCard from "./RecentActivityCard";
import CourseComp from "./CourseComp";
import Link from "next/link";

function StudentHome() {
    const { userData, isLoading } = useAuth();
    const { courses, loading } = useCourses();

    if (isLoading) return null;

    return (
        <div className="w-full max-w-6xl mt-26 mx-auto px-4 py-6 space-y-6" dir="rtl">

            {/* 👋 Header نفس ستايل الداشبورد */}
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

            {/* ▶️ Continue Learning */}
            <CardLayout>
                <h2 className="text-lg text-white font-semibold mb-4">استكمل التعلم</h2>
                <RecentActivityCard title="" />
            </CardLayout>

            {/* 📚 Courses */}
            <CardLayout>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg text-white font-semibold">كورساتي</h2>
                </div>

                {loading ? (
                    <p className="text-gray-400">جاري التحميل...</p>
                ) : courses?.length ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {courses.map((course: any) => (
                            <CourseComp
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                description={course.description}
                                price={course.price}
                                imageUrl={course.image_url}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">
                        لم تشترك في أي كورسات بعد
                    </p>
                )}
            </CardLayout>
        </div>
    );
}

export default StudentHome;