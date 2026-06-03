"use client";
import { useAuth } from "../hooks/useAuth"
import LandingHome from "../components/LandingHome";
import LoadingComp from "../components/LoadingComp";
<<<<<<< Updated upstream

export default function Home() {
  const { loggedIn, isLoading } = useAuth();
=======
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { userData } from "@/types";


export default function Home() {
  const [mounted, setMounted] = useState(false);

  const { data: userData, isLoading } = useMe();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <LoadingComp />;

  const isUser = userData ? true : false;

  if (isUser) {
    redirect("/user/dashboard");
  }

>>>>>>> Stashed changes

  if ( isLoading ) return <LoadingComp />

  return (
    <div>
<<<<<<< Updated upstream
      { loggedIn ? <StudentHome /> : <LandingHome /> }
    </div>
    
  )
=======
      <LandingHome />
    </div>
  );
>>>>>>> Stashed changes
}
