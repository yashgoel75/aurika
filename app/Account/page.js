"use client";

import Header from "../Header/page";
import "./page.css";

import { useAccount } from "wagmi";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function Account() {
  const account = useAccount();
  const address = account.address ? account.address : "Loading...";
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    async function fetchUserData() {
      const res = await fetch(`/api/users?walletAddress=${account.address}`);
      console.log(res);
      if (res.ok) {
        const data = await res.json();
        console.log(data.pin);
        setName(data.name);
        setEmail(data.email);
      }
    }
    if (account?.address) {
      fetchUserData();
    }
  }, [account?.address]);

  return (
    <>
      <Header />
      <div className="account-container p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Account</h1>
        <h1 className="text-2xl font-bold mb-2">Account Details</h1>
        <p className="text-lg">
          <strong>Name:&nbsp;</strong>
          {name}
        </p>
        <p className="text-lg">
          <strong>Email:&nbsp;</strong>
          {email}
        </p>
        <p className="text-lg mb-2">
          <strong>Wallet Address:</strong> {address}
        </p>
        <div className="horizontalRule"></div>
        <h1 className="text-2xl font-bold mt-2 mb-2">Security</h1>
        <p className="text-lg">Change Password</p>
        <p className="text-lg">Change Login PIN</p>
      </div>
    </>
  );
}

export default Account;
