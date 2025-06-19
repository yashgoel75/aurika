"use client";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Header from "./Header/page";
import "./page.css";

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
      <div className="disclaimer flex flex-col">
        <div className="disclaimer-text  bg-gray-200 p-4 rounded-lg shadow-md m-4">
          <div className="closeButton flex justify-start mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#000000"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl font-bold text-center">Disclaimer</h1>
            <p className="text-lg text-center">
              This is a demo application for project and educational purposes
              only. It does not represent a real financial service or product.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 min-h-screen pt-3">
        <div className="bg-gray-100 m-auto w-95/100 relative z-10">
          <h1 className="text-xl font-bold">Welcome,</h1>
          <h1 className="text-xl font-bold mb-5">Your Portfolio:</h1>
          <div className="horizontalRule"></div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
