'use client';

import Image from "next/image";
import logo from "@/public/AurikaLogo.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { WalletButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const account = useAccount();
  function handleDashboardNavigation() {
    router.push('/PinAuth');
  }
  useEffect(() => {
    if (account.isConnected) {
      handleDashboardNavigation();
    }
  }, [account.isConnected]);
  
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Image src={logo} alt="Aurika Logo" width={500} className="mb-4" />
        <WalletButton wallet="metamask" />
      </div>
    </>
  );
}
