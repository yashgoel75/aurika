"use client";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Header from "./Header/page";

function Dashboard() {
  const router = useRouter();
  const account = useAccount();
  useEffect(() => {
    if (!account.isConnected) {
      router.push("/");
    }
  }, [account.isConnected, router]);
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-40">Welcome to Aurika</h1>
      </div>
    </>
  );
}

export default Dashboard;
