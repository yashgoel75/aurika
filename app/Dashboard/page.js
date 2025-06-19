"use client";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Header from "../Header/page";
import "./page.css";

function Dashboard() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false);
  };
  const router = useRouter();
  const account = useAccount();
  useEffect(() => {
    if (!account.isConnected) {
      router.push("/");
    }
  }, [account.isConnected, router]);

  useEffect(() => {
    if (showDisclaimer) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showDisclaimer]);

  return (
    <>
      <Header />
      {showDisclaimer ? (
        <div className="disclaimer flex flex-col">
          <div className="disclaimer-text  bg-gray-200 p-4 rounded-lg shadow-md m-4">
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-center mb-2">
                <div className="mr-2 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#000000"
                  >
                    <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  </svg>
                  &nbsp;Disclaimer
                </div>
              </h1>
              <p className="text-lg text-center">
                This is a demo application for project and educational purposes
                only. It does not represent a real financial service or product.
              </p>
              <button
                onClick={handleCloseDisclaimer}
                className="mt-5 bg-teal-500 w-fit m-auto flex justify-center pt-1 pb-1 rounded-md text-lg pl-3 pr-3 text-center hover:bg-teal-400 hover:cursor-pointer"
              >
                I acknowledge
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
