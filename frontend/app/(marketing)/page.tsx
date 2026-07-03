"use client";
import { useMe } from "../hooks/queries/useMe";
import LandingHome from "../components/LandingHome";
import LoadingComp from "../components/LoadingComp";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { data: userData, isLoading } = useMe();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isUser = userData ? true : false;

  if (isUser) {
    const router = useRouter();
    router.push("/home");
  }

  if (isLoading || !mounted) {
    return <LoadingComp />;
  }




  return (
    <div>

      <LandingHome />
    </div>
  );

}
