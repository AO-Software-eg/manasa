"use client";
import { useAuth } from "../hooks/useAuth"
import LandingHome from "../components/LandingHome";
import StudentHome from "../components/StudentHome";
import LoadingComp from "../components/LoadingComp";

export default function Home() {
  const { loggedIn, isLoading } = useAuth();

  if ( isLoading ) return <LoadingComp />

  return (

    <div>
      { loggedIn ? <StudentHome /> : <LandingHome /> }
    </div>
    
  )
}


