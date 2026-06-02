"use client";
import { useMe } from "../hooks/queries/useMe";
import LandingHome from "../components/LandingHome";
import StudentHome from "../components/StudentHome";
import LoadingComp from "../components/LoadingComp";
import { useState , useEffect} from "react";


export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  const { data: userData, isLoading } = useMe();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <LoadingComp />;



  return (

    <div>
      {userData ? <StudentHome /> : <LandingHome />}
    </div>

  )
}


