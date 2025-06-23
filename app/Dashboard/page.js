"use client";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { useContractRead } from "wagmi";
import { aurikaAbi } from "../constants/aurikaAbi";
import { BigNumber } from "ethers";

import Image from "next/image";
import Header from "../Header/page";
import AurikaGoldCoin from "@/public/AurikaGoldCoin.png";
import EthereumCoin from "@/public/EthereumCoin.png";
import "./page.css";

function Dashboard() {
  const AURIKA_ADDRESS = "0xee0dBD54067691056c51012E71a2cF59EBaAE094";

  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false);
    localStorage.setItem("disclaimerAcknowledged", "true");
  };
  useEffect(() => {
    const disclaimerAcknowledged = localStorage.getItem(
      "disclaimerAcknowledged"
    );
    if (disclaimerAcknowledged) {
      setShowDisclaimer(false);
    }
  }, []);
  const router = useRouter();
  const account = useAccount();

  const { data: userData, isLoading } = useContractRead({
    address: AURIKA_ADDRESS,
    abi: aurikaAbi,
    functionName: "users",
    args: [account.address],
  });
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [grams, setGrams] = useState(0);
  useEffect(() => {
    if (userData && Array.isArray(userData)) {
      const invested = userData[0].toString();
      const grams = userData[1].toString();
      setPortfolioValue(invested);
      setGrams(grams);
      console.log("Invested:", invested);
      console.log("Grams:", grams);
    }
  }, [userData]);

  const [name, setName] = useState("");
  useEffect(() => {
    async function fetchUserData() {
      const res = await fetch(`/api/users?walletAddress=${account.address}`);
      console.log(res);
      if (res.ok) {
        const data = await res.json();
        console.log(data.pin);
        setName(data.name);
      }
    }

    if (account?.address) {
      fetchUserData();
    }
  }, [account?.address]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

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

  const imageStyle = {
    borderRadius: "50%",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    width: "175px",
    height: "auto",
  };

  const [buyButton, setBuyButton] = useState(true);
  const [sellButton, setSellButton] = useState(false);

  function handleBuyButton() {
    setSellButton(false);
    setBuyButton(true);
  }

  function handleSendButton() {
    setBuyButton(false);
    setSellButton(true);
  }

  return (
    <>
      <div className="bg-gray-100">
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
                  This is a demo application for project and educational
                  purposes only. It does not represent a real financial service
                  or product.
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

        <div className="bg-gray-100 pt-3">
          <div className="bg-gray-100 m-auto w-95/100 relative z-10">
            <div className="flex flex-row">
              <h1 className="text-xl font-bold">Welcome back,&nbsp;</h1>
              <h1 className="text-xl">{name}</h1>
            </div>
            <h1 className="text-xl mb-5">
              <strong>Your Portfolio:&nbsp;</strong>
              {grams}&nbsp;gm
            </h1>

            <div className="horizontalRule"></div>
          </div>
        </div>
        {/* <div className="account-container pl-8 pt-8 bg-gray-100">
          <h1 className="text-[24px] font-onest font-bold mb-2">Gold Locker</h1>
          </div> */}
        <div className="flex p-4 pt-8 justify-center bg-gray-100">
          <div className="flex items-center w-95/100 m-auto">
            <Image
              src={EthereumCoin}
              style={imageStyle}
              alt="Ethereum Coin"
              priority
            ></Image>
            <div className="flex justify-center items-center w-40/100">
              <div className="flex items-center w-full ml-7 gap-2 bg-white rounded-full px-3 py-2 shadow-md">
                <h1 className="m-1 text-center bg-neutral-800 text-white p-1 text-lg w-40/100 border rounded-full   ">
                  GWEI
                </h1>
                <input
                  className="mr-1 rounded-full w-60/100 border bg-stone-50 border-2 p-1 pl-3"
                  placeholder="1"
                ></input>
              </div>
            </div>

            <div className="w-20/100 flex justify-center items-center">
              <div className="shadow-md bg-white hover: cursor-pointer rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="40"
                  viewBox="0 -960 960 960"
                  width="40"
                  fill="#141414"
                >
                  <path d="m320-160-56-57 103-103H80v-80h287L264-503l56-57 200 200-200 200Zm320-240L440-600l200-200 56 57-103 103h287v80H593l103 103-56 57Z" />
                </svg>
              </div>
            </div>

            <div className="w-40/100 flex justify-center items-center font-onest">
              <div className="flex items-center w-full mr-7 gap-2 bg-white rounded-full px-3 py-2 shadow-md">
                <input
                  className="ml-1 rounded-full w-60/100 border-2 p-1 pl-3 bg-stone-50"
                  placeholder="1"
                  defaultValue={1}
                ></input>
                <h1 className="m-1 text-center bg-neutral-800 text-white p-1 text-lg w-40/100 border rounded-full hover:cursor-default">
                  GOLD
                </h1>
              </div>
            </div>

            <Image
              src={AurikaGoldCoin}
              style={imageStyle}
              alt="Aurika"
              priority
            ></Image>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleBuyButton}
            className={`pt-1 pb-1 pl-2 pr-2 w-20 rounded-s-md outline-1 outline-violet-400 text-lg mt-8 ${buyButton ? `bg-violet-400` : `bg-transparent`} ${buyButton ? `text-white ` : ` text-violet-400`} hover:cursor-pointer transition-all duration-200 ease-in-out`}
          >
            Buy
          </button>
          <button
            onClick={handleSendButton}
            className={`pt-1 pb-1 pl-2 pr-2 w-20 rounded-e-md outline-1 outline-violet-400 text-lg mt-8 ${sellButton ? `bg-violet-400` : `bg-transparent`} ${sellButton ? `text-white ` : ` text-violet-400`} hover:cursor-pointer transition-all duration-200 ease-in-out`}
          >
            Sell
          </button>
        </div>
        {buyButton ? (
          <div className="w-9/10 mt-4 m-auto bg-white shadow-lg rounded-lg">
            <div className="pl-3 pt-2 pb-2">
              <h1 className="text-xl font-onest">Buying from Aurika</h1>
            </div>
          </div>
        ) : (
          <div className="w-9/10 mt-4 m-auto bg-white shadow-lg rounded-lg">
            <div className="pl-3 pt-2 pb-2">
              <h1 className="text-xl font-onest">Selling from Aurika</h1>
            </div>
          </div>
        )}

        <div className="min-h-screen bg-gray-100"></div>
      </div>
    </>
  );
}

export default Dashboard;
