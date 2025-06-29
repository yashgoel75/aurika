"use client";

import Image from "next/image";
import logo from "@/public/AurikaLogo.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const account = useAccount();
  // function handleDashboardNavigation() {
  //   router.push("/PinAuth");
  // }

  async function handleLogin() {
    try {
      const walletAddress = account.address;
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletAddress: walletAddress,
        }),
      });
      console.log("response",res);
      const data = await res.json();
      console.log("data",data);
    
      localStorage.setItem("token",data.token);
    } catch (err) {
      console.error(err);
    }
  }
  async function handleAccountNavigation() {
    console.log("Account is connected:", account.address);
    const res = await fetch(`/api/users?walletAddress=${account.address}`, {
      headers: {"Authorization": `Bearer ${localStorage.getItem("token")}`}
    });
    const data = await res.json();
    console.log(res);
    if (res.ok && data.exists) {
      router.push("/PinAuth");
    } else {
      router.push("/Registration");
    }
  }
  useEffect(() => {
  const timeout = setTimeout(async () => {
    if (account.isConnected) {
      await handleLogin();
      await handleAccountNavigation();
    }
  }, 500);

  return () => clearTimeout(timeout);
}, [account.isConnected, router]);


  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Image
          src={logo}
          alt="Aurika Logo"
          width={500}
          className="mb-4"
          priority
        />
        <ConnectButton
          label="Continue to Aurika"
          chainStatus="none"
          accountStatus="avatar"
        />
      </div>
    </>
  );
}
