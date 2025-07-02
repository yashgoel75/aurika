"use client";

import Header from "../Header/page";
import "./page.css";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { address, isConnected } from "wagmi";
import { useTheme } from "../context/ThemeContext";

function Account() {
  const account = useAccount();
  const address = account.address ? account.address : "Loading...";
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    async function fetchUserData() {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`/api/users?walletAddress=${account.address}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await res.json();
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    }

    if (account?.address) {
      fetchUserData();
    }
  }, [account?.address]);

  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Header />
      <div className={`${theme === "light" ? "bg-gray-50" : "bg-gray-800"}`}>
        <div
          className={`account-container p-8 ${theme === "light" ? "bg-gray-50 text-gray-700" : "bg-gray-800 text-gray-300"} m-auto w-92/100 min-h-screen`}
        >
          <h1 className="text-[38px] font-[550] mb-4">My Account</h1>
          <div className="horizontalRule"></div>
          <h1 className="text-[26px] font-[550] mt-2 mb-2">Account Details</h1>
          <p className="text-[20px] mb-1">
            <span className="font-semibold">Name:</span>&nbsp;
            <span className="font-thin">{name}</span>
          </p>
          <p className="text-[20px] mb-1">
            <span className="font-semibold">Email:&nbsp;</span>
            <span className="font-thin">{email}</span>
          </p>
          <p className="text-[20px] mb-2">
            <span className="font-semibold">Wallet Address:</span>&nbsp;
            <span className="font-thin">{address}</span>
          </p>
          <div className="horizontalRule"></div>
          <h1 className="text-2xl font-[550] mt-2 mb-2">Security</h1>
          <div className="hover:underline hover:cursor-pointer w-fit flex">
            <div className="text-[20px] flex items-center">
              <div className="mb-1">Change Email&nbsp;</div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="hover:underline hover:cursor-pointer w-fit flex">
            <div className="text-[20px] flex items-center">
              <div className="mb-1">Change Password&nbsp;</div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="hover:underline hover:cursor-pointer w-fit flex">
            <div className="text-[20px] flex items-center">
              <div className="mb-1">Change Login PIN&nbsp;</div>
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="18px"
                  viewBox="0 -960 960 960"
                  width="18px"
                  fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;
