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

  async function handleAccountNavigation() {
    console.log("Account is connected:", account.address);
    const res = await fetch(`/api/users?walletAddress=${account.address}`);
    const data = await res.json();
    console.log(res);
    if (res.ok && data.exists) {
      router.push("/PinAuth");
    } else {
      router.push("/Registration");
    }
  }
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (account.isConnected) {
        handleAccountNavigation();
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
        <WalletButton wallet="metamask" />
      </div>
    </>
  );
}
