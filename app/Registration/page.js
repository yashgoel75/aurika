'use client';

import Header from "../Header/page";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./page.css";

function Registration() {
  const router = useRouter();
  const account = useAccount();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!account.isConnected) {
        router.push("/");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [account.isConnected, router]);

  return (
    <>
      <Header />
      <div className="registration-container p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Registration</h1>
        <p className="text-lg mb-2">Your portfolio is currently empty.</p>
        <p className="text-lg">Start trading to see your portfolio here.</p>
      </div>
    </>
  );
}

export default Registration;
