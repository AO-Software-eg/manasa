"use client";
import { useAuth } from "../hooks/useAuth"
import LandingHome from "../components/LandingHome";
import StudentHome from "../components/StudentHome";

export default function Home() {
  const { loggedIn, isLoading } = useAuth();
  return (

    <div>
      { loggedIn ? <StudentHome /> : <LandingHome /> }
    </div>
    
  )
}


