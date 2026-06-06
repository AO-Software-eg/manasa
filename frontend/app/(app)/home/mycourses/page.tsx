"use client";
import { useGetEnrollments } from "@/app/hooks/queries/useEnroll"
import { useMe } from "@/app/hooks/queries/useMe"
import CourseComp from "@/app/components/CourseComp";




function page() {
  const { data: userData } = useMe();
  const { data: enrollments, isLoading, isError } = useGetEnrollments(userData?.id ?? '');


  return (
    <div>
 
      
    </div>
  )
}

export default page
