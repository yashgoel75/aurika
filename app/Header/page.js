"use client";

import "./page.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import logo from "@/public/AurikaLogo.png";
import darkModelogo from "@/public/AurikaLogoDark.png";
import { useState } from "react";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useTheme } from "../context/ThemeContext";

function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = unknown
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("LoggedIn");
    setIsLoggedIn(loggedInStatus === "true");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && isLoggedIn === false) {
      router.push("/PinAuth");
    }
  }, [isLoggedIn, loading]);
  console.log(isLoggedIn);
  const account = useAccount();
  const { address, isConnected } = useAccount();
  console.log(address);
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!address) {
        router.push("/");
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [address]);

  const [showNavigationBar, setShowNavigationBar] = useState(false);

  function handleDashboardNavigation() {
    router.push("/Dashboard");
  }
  function handleOrdersNavigation() {
    router.push("/Orders");
  }
  function handlePortfolioNavigation() {
    router.push("/Portfolio");
  }
  function handleAccountNavigation() {
    router.push("/Account");
  }
  function handleSettingsNavigation() {
    router.push("/Settings");
  }
  function logout() {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("LoggedIn");
      router.push("/PinAuth");
    }
  }
  const { theme, toggleTheme } = useTheme();

  function handleNavigationBar() {
    setShowNavigationBar(!showNavigationBar);
  }
  return (
    !loading && (
      <>
        {showNavigationBar ? (
          <div className="navigationOnMobile">
            <div
              className={`flex flex-col w-full justify-center ${theme === "light" ? "bg-stone-50 text-gray-800" : "bg-gray-900 text-gray-300"} shadow-lg text-lg`}
            >
              <div className="flex justify-between items-center hover:cursor-pointer">
                <Image
                  className="ml-3 mt-3"
                  src={theme === "light" ? logo : darkModelogo}
                  alt="Aurika Logo"
                  width={150}
                  onClick={handleDashboardNavigation}
                />
                <svg
                  className="mr-3 mt-3"
                  onClick={handleNavigationBar}
                  xmlns="http://www.w3.org/2000/svg"
                  height="35px"
                  viewBox="0 -960 960 960"
                  width="35px"
                  fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                >
                  <path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z" />
                </svg>
              </div>
              <div>
                <ul className="flex flex-col pl-6 space-y-4 text-lg mt-4 mb-4">
                  <li
                    className="flex flex-row items-center hover:cursor-pointer"
                    onClick={handleDashboardNavigation}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                    >
                      <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
                    </svg>
                    &nbsp;Dashboard
                  </li>
                  <li
                    className="flex flex-row items-center hover:cursor-pointer"
                    onClick={handlePortfolioNavigation}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                    >
                      <path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm178-80h444-444Zm0 0h444L480-830 258-720Z" />
                    </svg>
                    &nbsp;Portfolio
                  </li>
                  <li
                    className="flex flex-row items-center hover:cursor-pointer"
                    onClick={handleOrdersNavigation}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                    >
                      <path d="M120-80v-800l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v800l-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60Zm120-200h480v-80H240v80Zm0-160h480v-80H240v80Zm0-160h480v-80H240v80Zm-40 404h560v-568H200v568Zm0-568v568-568Z" />
                    </svg>
                    &nbsp;Orders
                  </li>
                  <li
                    className="flex flex-row items-center hover:cursor-pointer"
                    onClick={handleAccountNavigation}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                    >
                      <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                    </svg>
                    &nbsp;Account
                  </li>
                  <li
                    className="flex flex-row items-center hover:cursor-pointer"
                    onClick={toggleTheme}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                    >
                      <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z" />
                    </svg>
                    &nbsp;
                    {theme === "light"
                      ? "Switch to Dark Mode"
                      : "Switch to Light Mode"}
                  </li>
                  <li className="mr-4" title="Logout">
                    <a
                      className="flex flex-row items-center hover:cursor-pointer"
                      onClick={logout}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                      >
                        <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                      </svg>
                      &nbsp;Logout
                    </a>
                  </li>

                  <li className="mr-4">
                    <a className="flex flex-row items-center hover:cursor-pointer">
                      <ConnectButton
                        accountStatus="none"
                        chainStatus="none"
                        showBalance={true}
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}
        <div className={`${theme === "light" ? "bg-stone-50" : "bg-gray-800"}`}>
          <div
            className={`flex items-center w-full md:w-11/12 m-auto py-4 justify-between p-4 ${theme === "light" ? "bg-stone-50" : "bg-gray-800"} text-lg text-white`}
          >
            <Image
              className={`${theme === "light" ? "bg-stone-50" : "bg-gray-800"} rounded-full pr-3 md:px-3`}
              src={theme === "light" ? logo : darkModelogo}
              alt="Aurika Logo"
              width={200}
              onClick={handleDashboardNavigation}
            />
            <svg
              onClick={handleNavigationBar}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
              className="lg:hidden block cursor-pointer mr-3"
            >
              <path d="M120-120v-80h720v80H120Zm0-320v-80h720v80H120Zm0-320v-80h720v80H120Z" />
            </svg>
            <div
              className={`flex items-center ${theme === "light" ? "bg-gray-100" : "bg-gray-700"} space-x-4 text-stone-800 lg:block hidden shadow-lg rounded-full pt-2 pl-3`}
            >
              <ul
                className={`flex space-x-4 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
              >
                <li>
                  <a
                    className="flex flex-row items-center justify-center"
                    onClick={handleDashboardNavigation}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                    >
                      <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z" />
                    </svg>
                    &nbsp;Dashboard
                  </a>
                </li>
                <li>
                  <a
                    className="flex flex-row items-center justify-center"
                    onClick={handlePortfolioNavigation}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                    >
                      <path d="M200-280v-280h80v280h-80Zm240 0v-280h80v280h-80ZM80-120v-80h800v80H80Zm600-160v-280h80v280h-80ZM80-640v-80l400-200 400 200v80H80Zm178-80h444-444Zm0 0h444L480-830 258-720Z" />
                    </svg>
                    &nbsp;Portfolio
                  </a>
                </li>
                <li>
                  <a
                    className="flex flex-row items-center justify-center"
                    onClick={handleOrdersNavigation}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                    >
                      <path d="M120-80v-800l60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60 60 60 60-60v800l-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60-60-60-60 60Zm120-200h480v-80H240v80Zm0-160h480v-80H240v80Zm0-160h480v-80H240v80Zm-40 404h560v-568H200v568Zm0-568v568-568Z" />
                    </svg>
                    &nbsp;Orders
                  </a>
                </li>
                <li className="mr-4">
                  <a
                    className="flex flex-row items-center justify-center"
                    onClick={handleAccountNavigation}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                    >
                      <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                    </svg>
                    &nbsp;Account
                  </a>
                </li>
                {/* <li title="Settings">
                  <a
                    className="flex flex-row items-center justify-center"
                    onClick={handleSettingsNavigation}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                    >
                      <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                    </svg>
                  </a>
                </li> */}
                <li
                  title={
                    theme === "light"
                      ? "Switch to Dark Mode"
                      : "Switch to Light Mode"
                  }
                  className="hover:cursor-pointer"
                  onClick={toggleTheme}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                  >
                    <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z" />
                  </svg>
                </li>
                <li className="mr-4" title="Logout">
                  <a
                    className="flex flex-row items-center justify-center"
                    onClick={logout}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                    >
                      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                    </svg>
                    &nbsp;
                  </a>
                </li>
              </ul>
            </div>
            <div className="px-3 hidden lg:block">
              <ConnectButton chainStatus="none" accountStatus="none" />
            </div>
          </div>
        </div>
      </>
    )
  );
}

export default Header;
