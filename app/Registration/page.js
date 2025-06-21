"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./page.css";
import Image from "next/image";
import logo from "@/public/AurikaLogo.png";

function Registration() {
  const router = useRouter();
  const account = useAccount();
  const [sendButtonClicked, setSendButtonClicked] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);

  function handleSendOtpClick() {
    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
      const email = emailInput.value;
      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }
      if (email) {
        const otpGenerated = Math.floor(100000 + Math.random() * 900000);
        fetch(`/api/send?email=${email}&otp=${otpGenerated}`)
          .then((response) => response.json())
          .then((data) => {
            if (data.error) {
              console.error("Error sending email:", data.error);
            } else {
              console.log("Email sent successfully:", data.message);
              setOtp(otpGenerated);
              setSendButtonClicked(true);
              makeotpexpired();
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        alert("Please enter a valid email address.");
      }
    }
  }

  function makeotpexpired() {
    setTimeout(
      () => {
        setOtp("");
        setSendButtonClicked(false);
        setOtpVerified(false);
        setOtpError(false);
        setOtpExpired(true);
      },
      10 * 60 * 1000
    );
  }

  function handleVerifyOtpClick() {
    const otpInput = document.querySelector('input[type="password"]#otpInput');
    if (otpExpired) {
      alert("OTP has expired. Please request a new OTP.");
      return;
    }
    if (otpInput) {
      const enteredOtp = otpInput.value;
      if (enteredOtp === otp.toString()) {
        console.log("OTP verified successfully.");
        setOtpVerified(true);
        setOtpError(false);
      } else {
        // console.error("Invalid OTP entered.");
        setOtpError(true);
        setOtpVerified(false);
      }
    } else {
      alert("Please enter the OTP sent to your email.");
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!account.isConnected) {
        router.push("/");
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [account.isConnected]);

  //     useEffect(() => {
  //       if (!account.isConnected) {
  //         router.push("/");
  //       }
  //     }

  // , [account.isConnected]);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <Image
          src={logo}
          alt="Aurika Logo"
          width={250}
          className="mb-4"
          priority
        />
        <h1 className="text-2xl font-bold mb-4">Welcome to Aurika!</h1>
        <div className="bg-white p-8 rounded-lg w-fit opacity-90 shadow-lg">
          <form className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2 flex justify-center items-center">
              Create your account
            </h2>
            <label className="text-sm font-medium mb-1">Enter your Name</label>
            <input
              type="text"
              placeholder="Enter your Name"
              className="p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <label className="text-sm font-medium mb-1 form-control">
              Enter your Email
            </label>
            <div className="w-full flex flex-row">
              <input
                type="email"
                placeholder="Enter your Email"
                className="w-70/100 p-2 mb-4 border border-gray-300 rounded-s focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                className="bg-blue-500 text-white p-2 mb-4 rounded-e hover:bg-blue-600 transition-colors w-30/100 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                id="sendotpButton"
                onClick={handleSendOtpClick}
                disabled={sendButtonClicked}
              >
                Send OTP
              </button>
            </div>

            {sendButtonClicked ? (
              <div className="flex flex-col w-full mr-2">
                <label className="text-sm font-medium mb-1">
                  Enter OTP sent to your email
                </label>
                <div className="w-full flex flex-row">
                  <input
                    type="password"
                    placeholder="6-digit OTP"
                    id="otpInput"
                    className="w-70/100 p-2 mb-4 border border-gray-300 rounded-s focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    className="bg-blue-500 text-white p-2 mb-4 rounded-e hover:bg-blue-600 transition-colors w-30/100 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    id="sendverifyButton"
                    onClick={handleVerifyOtpClick}
                  >
                    Verify OTP
                  </button>
                </div>
              </div>
            ) : null}
            {otpVerified && (
              <div className="font-[segoi-ui] bg-green-400 text-green-900 flex justify-center mb-2 hover:cursor-pointer w-full p-1 rounded m-auto">
                OTP verification successful
              </div>
            )}
            {otpError && (
              <div className="font-[segoi-ui] bg-red-400 text-red-900 flex justify-center mb-2 hover:cursor-pointer w-full p-1 rounded m-auto">
                Invalid OTP
              </div>
            )}

            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col w-full mr-2">
                <label className="text-sm font-medium mb-1">
                  Create a Password
                </label>
                <input
                  type="password"
                  placeholder="Create a Password"
                  className="p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col w-full ml-2">
                <label className="text-sm font-medium mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between mb-4">
              <div className="flex flex-col w-full mr-2">
                <label className="text-sm font-medium mb-1">
                  Create a 6-digit PIN
                </label>
                <input
                  type="password"
                  placeholder="Create a 6-digit PIN"
                  className="p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="flex flex-col w-full ml-2">
                <label className="text-sm font-medium mb-1">Confirm PIN</label>
                <input
                  type="password"
                  placeholder="Confirm PIN"
                  className="p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
              onClick={(e) => {
                e.preventDefault();
                router.push("/PinAuth");
              }}
              disabled={!otpVerified}
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Registration;
