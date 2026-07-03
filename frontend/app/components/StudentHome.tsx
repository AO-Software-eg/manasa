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
            <CardLayout classname="bg-linear-to-r from-card via-card/90 to-secondary border-border flex flex-row justify-between items-center shadow-md">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        أهلاً بعودتك،{" "}
                        <span className="text-primary">
                            {userData?.name || "طالب"}
                        </span>

                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        كمل من حيث توقفت 👇
                    </p>
                </div>
                <button
                    className="px-4 cursor-pointer py-2 text-primary-foreground bg-primary rounded-lg text-sm hover:bg-primary/90 transition shadow-sm"

                >
                    <Link href={'/user'}>اذهب الى التطبيق</Link>
                </button>
            </CardLayout>

   
            <CardLayout>
                <h2 className="text-lg text-foreground font-semibold mb-4">استكمل التعلم</h2>
                <RecentActivityCard title="" />
            </CardLayout>


            <CardLayout>


                
                    <Courses />
                
                 
            </CardLayout>
        </div>
    );
}

export default StudentHome;