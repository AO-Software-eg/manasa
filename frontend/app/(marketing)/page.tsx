"use client";
import { useMe } from "../hooks/queries/useMe";
import LandingHome from "../components/LandingHome";
import StudentHome from "../components/StudentHome";
import LoadingComp from "../components/LoadingComp";


export default function Home() {
  const { data: userData, isLoading } = useMe();

  if ( isLoading ) return <LoadingComp />

  return (

    <div>
      { userData ? <StudentHome /> : <LandingHome /> }
    </div>
    
  )
}


