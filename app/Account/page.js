"use client";

import Header from "../Header/page";
import "./page.css";

import { useAccount } from "wagmi";
function Account() {
  const account = useAccount();
  const address = account.address ? account.address : "Loading...";
  return (
    <>
      <Header />
      <div className="account-container p-8 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Account</h1>
        <h1 className="text-2xl font-bold mb-2">Account Details</h1>
        <p className="text-lg">
          <strong>Name:</strong>
        </p>
        <p className="text-lg">
          <strong>Email:</strong>
        </p>
        <p className="text-lg mb-2">
          <strong>Wallet Address:</strong> {address}
        </p>
        <div className="horizontalRule"></div>
        <h1 className="text-2xl font-bold mt-2 mb-2">Security</h1>
        <p className="text-lg">Change Login PIN</p>
      </div>
    </>
  );
}

export default Account;
