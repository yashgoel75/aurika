"use client";

//react/next
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

//wagmi
import { aurikaAbi } from "../constants/aurikaAbi";
import { getPriceAbi } from "../constants/getPriceAbi";
import { BigNumber } from "ethers";

import { useAccount } from "wagmi";
import { useBalance } from "wagmi";
import { useContractRead } from "wagmi";
import { useWriteContract } from "wagmi";

//local imports
import Image from "next/image";
import Header from "../Header/page";
import AurikaGoldCoin from "@/public/AurikaGoldCoin.png";
import EthereumCoin from "@/public/EthereumCoin.png";
import "./page.css";

function Dashboard() {
  //styles
  const imageStyle = {
    borderRadius: "50%",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    width: "140px",
    height: "auto",
  };

  //constants/variables
  const router = useRouter();
  const AURIKA_ADDRESS = "0xee0dBD54067691056c51012E71a2cF59EBaAE094";
  const GETPRICE_ADDRESS = "0x6d2C92EbCCcF6347EbeDef5e8961569914c3e091";
  const { address, isConnected } = useAccount();

  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState("0");
  const [portfolioValueUnit, setPortfolioValueUnit] = useState(true);

  const [quantity, setQuantity] = useState("0");
  const [ethUsdPrice, setEthUsdPrice] = useState("0");
  const [xauUsdPrice, setXauUsdPrice] = useState("0");
  const [name, setName] = useState("");
  const [buyButton, setBuyButton] = useState(true);
  const [sellButton, setSellButton] = useState(false);

  const [ethAmount, setEthAmount] = useState("0.05");
  const [ethUnitType, setEthUnitType] = useState("ETH");
  const [goldUnitType, setGoldUnitType] = useState("GRAM");
  const [convertedGold, setConvertedGold] = useState("");

  const [ethAmounttoBuy, setEthAmounttoBuy] = useState("0.05");
  const [ethUnitTypetoBuy, setEthUnitTypetoBuy] = useState("ETH");
  const [goldUnitTypetoBuy, setGoldUnitTypetoBuy] = useState("MG");
  const [convertedGoldtoBuy, setConvertedGoldtoBuy] = useState("");

  const [goldAmount, setGoldAmount] = useState("1");
  const [convertedEth, setConvertedEth] = useState("");
  const [goldToEthUnitType, setGoldToEthUnitType] = useState("GM"); // or "MG"
  const [ethOutputUnitType, setEthOutputUnitType] = useState("ETH"); // or "GWEI", "WEI"

  const [goldAmounttoSell, setGoldAmounttoSell] = useState("1");
  const [convertedEthtoSell, setConvertedEthtoSell] = useState("");
  const [goldToEthUnitTypetoSell, setGoldToEthUnitTypetoSell] = useState("GM"); // or "MG"
  const [ethOutputUnitTypetoSell, setEthOutputUnitTypetoSell] = useState("ETH"); // or "GWEI", "WEI"

  const { writeContract } = useWriteContract()

  const { data: balance } = useBalance({
    address,
    enabled: !!address,
    unit: "ether",
  });
  console.log(balance);
  //wagmi (contract integration)
  const { data: userData, isLoading } = useContractRead({
    address: AURIKA_ADDRESS,
    abi: aurikaAbi,
    functionName: "users",
    args: [address],
  });

  const { data: ethUsdPriceRaw } = useContractRead({
    address: GETPRICE_ADDRESS,
    abi: getPriceAbi,
    functionName: "getEthUsd",
  });

  const { data: xauUsdPriceRaw } = useContractRead({
    address: GETPRICE_ADDRESS,
    abi: getPriceAbi,
    functionName: "getXauUsd",
  });

  console.log(ethUsdPriceRaw);
  console.log(xauUsdPriceRaw);

  //useEffect

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

  useEffect(() => {
    const inputs = document.querySelectorAll("input[type=number]");
    const preventScroll = (e) => e.preventDefault();

    inputs.forEach((input) => input.addEventListener("wheel", preventScroll));

    return () => {
      inputs.forEach((input) =>
        input.removeEventListener("wheel", preventScroll)
      );
    };
  }, []);

  useEffect(() => {
    async function fetchUserData() {
      const res = await fetch(`/api/users?walletAddress=${address}`);
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
      }
    }

    if (isConnected && address) {
      fetchUserData();
    }
  }, [address, isConnected]);

  useEffect(() => {
    const disclaimerAcknowledged = localStorage.getItem(
      "disclaimerAcknowledged"
    );
    if (disclaimerAcknowledged) {
      setShowDisclaimer(false);
    }
  }, []);

  useEffect(() => {
    if (userData && Array.isArray(userData)) {
      const invested = userData[0].toString();
      const quantity = userData[1].toString();
      setPortfolioValue(invested);
      setQuantity(quantity);
      console.log("Invested:", invested);
      console.log("Quantity:", quantity);
    }
  }, [userData]);

  useEffect(() => {
    if (quantity < 1000) {
      setPortfolioValueUnit(false);
    } else {
      setPortfolioValueUnit(true);
    }
  });

  useEffect(() => {
    if (ethUsdPriceRaw) {
      setEthUsdPrice(Number(ethUsdPriceRaw) / 1e8); // or 1e18 based on your contract's decimal
    }

    if (xauUsdPriceRaw) {
      setXauUsdPrice(Number(xauUsdPriceRaw) / 1e8);
    }
  }, [ethUsdPriceRaw, xauUsdPriceRaw]);

  console.log("ETH/USD Price: ", ethUsdPrice);
  console.log("XAU/USD Price: ", xauUsdPrice);

  useEffect(() => {
    if (!ethAmount || !ethUsdPrice || !xauUsdPrice) {
      setConvertedGold("");
      return;
    }

    let ethInBase;
    switch (ethUnitType) {
      case "WEI":
        ethInBase = Number(ethAmount) / 1e18;
        break;
      case "GWEI":
        ethInBase = Number(ethAmount) / 1e9;
        break;
      case "ETH":
      default:
        ethInBase = Number(ethAmount);
    }

    const usdValue = ethInBase * ethUsdPrice;

    const xauPerGram = xauUsdPrice / 31.1035;
    const goldInGram = usdValue / xauPerGram;

    const finalGoldValue =
      goldUnitType === "MG"
        ? (goldInGram * 1000).toFixed(3)
        : goldInGram.toFixed(6);

    setConvertedGold(finalGoldValue);
  }, [ethAmount, ethUnitType, goldUnitType, ethUsdPrice, xauUsdPrice]);

  useEffect(() => {
    if (!ethAmounttoBuy || !ethUsdPrice || !xauUsdPrice) {
      setConvertedGoldtoBuy("");
      return;
    }

    let ethInBase;
    switch (ethUnitTypetoBuy) {
      case "WEI":
        ethInBase = Number(ethAmounttoBuy) / 1e18;
        break;
      case "GWEI":
        ethInBase = Number(ethAmounttoBuy) / 1e9;
        break;
      case "ETH":
      default:
        ethInBase = Number(ethAmounttoBuy);
    }

    const usdValuetoBuy = ethInBase * ethUsdPrice;

    const xauPerGram = xauUsdPrice / 31.1035;
    const goldInGram = usdValuetoBuy / xauPerGram;

    const finalGoldValuetoBuy =
      goldUnitTypetoBuy === "MG"
        ? (goldInGram * 1000).toFixed(3)
        : goldInGram.toFixed(6);

    setConvertedGoldtoBuy(finalGoldValuetoBuy);
  }, [
    ethAmounttoBuy,
    ethUnitTypetoBuy,
    goldUnitTypetoBuy,
    ethUsdPrice,
    xauUsdPrice,
  ]);

  useEffect(() => {
    if (!goldAmount || !ethUsdPrice || !xauUsdPrice) {
      setConvertedEth("");
      return;
    }

    const xauPerGram = xauUsdPrice / 31.1035;

    const goldInGrams =
      goldToEthUnitType === "MG"
        ? Number(goldAmount) / 1000
        : Number(goldAmount);

    const usdValue = goldInGrams * xauPerGram;

    const ethValue = usdValue / ethUsdPrice;

    let finalEth;
    switch (ethOutputUnitType) {
      case "WEI":
        finalEth = ethValue * 1e18;
        break;
      case "GWEI":
        finalEth = ethValue * 1e9;
        break;
      case "ETH":
      default:
        finalEth = ethValue;
    }

    setConvertedEth(finalEth.toFixed(8));
  }, [
    goldAmount,
    goldToEthUnitType,
    ethOutputUnitType,
    ethUsdPrice,
    xauUsdPrice,
  ]);

  useEffect(() => {
    if (!goldAmounttoSell || !ethUsdPrice || !xauUsdPrice) {
      setConvertedEthtoSell("");
      return;
    }

    const xauPerGram = xauUsdPrice / 31.1035;

    const goldInGramstoSell =
      goldToEthUnitTypetoSell === "MG"
        ? Number(goldAmounttoSell) / 1000
        : Number(goldAmounttoSell);

    const usdValue = goldInGramstoSell * xauPerGram;

    const ethValue = usdValue / ethUsdPrice;

    let finalEth;
    switch (ethOutputUnitTypetoSell) {
      case "WEI":
        finalEth = ethValue * 1e18;
        break;
      case "GWEI":
        finalEth = ethValue * 1e9;
        break;
      case "ETH":
      default:
        finalEth = ethValue;
    }

    setConvertedEthtoSell(finalEth.toFixed(8));
  }, [
    goldAmounttoSell,
    goldToEthUnitTypetoSell,
    ethOutputUnitTypetoSell,
    ethUsdPrice,
    xauUsdPrice,
  ]);

  //functions

  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false);
    localStorage.setItem("disclaimerAcknowledged", "true");
  };

  function handleBuyButton() {
    setSellButton(false);
    setBuyButton(true);
  }

  function handleSellButton() {
    setBuyButton(false);
    setSellButton(true);
  }

  function handleBuyOrder() {

  }

  function handleSellOrder() {

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
              {quantity}&nbsp;{portfolioValueUnit ? "gm" : "mg"}
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
              className="bg-white shadow-lg"
              src={EthereumCoin}
              style={imageStyle}
              alt="Ethereum Coin"
              priority
            ></Image>
            <div className="flex justify-center items-center w-40/100">
              <div className="flex items-center w-full ml-7 gap-2 bg-white rounded-full px-3 py-2 shadow-md">
                <h1 className="m-1 text-center bg-linear-to-bl from-stone-800 to-neutral-500 text-white p-1 text-lg w-40/100 border rounded-full">
                  <select
                    id="ethUnit"
                    className="border-none outline-none focus:ring-0"
                    value={ethUnitType}
                    onChange={(e) => setEthUnitType(e.target.value)}
                  >
                    <option>WEI</option>
                    <option>GWEI</option>
                    <option>ETH</option>
                  </select>
                </h1>
                <input
                  className="mr-1 rounded-full w-60/100 border bg-stone-50 border-2 p-1 pl-3"
                  placeholder="1"
                  type="text"
                  value={ethAmount}
                  onChange={(e) => setEthAmount(e.target.value)}
                />
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
                  placeholder={0}
                  value={Number(convertedGold).toFixed(2)}
                  disabled
                />
                <h1 className="m-1 text-center bg-linear-to-bl from-stone-800 to-neutral-500 text-white p-1 text-lg w-40/100 border rounded-full">
                  <select
                    id="goldUnit"
                    className="border-none outline-none focus:ring-0"
                    value={goldUnitType}
                    onChange={(e) => setGoldUnitType(e.target.value)}
                  >
                    <option>GRAM</option>
                    <option>MG</option>
                  </select>
                </h1>
              </div>
            </div>

            <Image
              className="bg-white shadow-lg"
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
            className={`pt-1 pb-1 pl-2 pr-2 w-20 rounded-s-md outline-1 outline-violet-400 text-lg mt-6 ${buyButton ? `bg-violet-400` : `bg-transparent`} ${buyButton ? `text-white ` : ` text-violet-400`} hover:cursor-pointer transition-all duration-200 ease-in-out`}
          >
            Buy
          </button>
          <button
            onClick={handleSellButton}
            className={`pt-1 pb-1 pl-2 pr-2 w-20 rounded-e-md outline-1 outline-violet-400 text-lg mt-6 ${sellButton ? `bg-violet-400` : `bg-transparent`} ${sellButton ? `text-white ` : ` text-violet-400`} hover:cursor-pointer transition-all duration-200 ease-in-out`}
          >
            Sell
          </button>
        </div>
        {buyButton ? (
          <div className="w-11/12 max-w-2xl mt-6 mx-auto bg-white shadow-xl rounded-xl transition-all duration-300">
            <div className="px-5 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-800 font-onest">
                Buying from Aurika
              </h1>
            </div>

            <div className="flex flex-col items-center gap-4 px-5 py-5">
              <div className="w-full">
                <label className="text-lg font-medium text-gray-700 min-w-max">
                  SepoliaETH
                </label>

                <div className="flex mt-1 w-full rounded-lg overflow-hidden border border-violet-500 focus-within:ring-2 focus-within:ring-violet-400">
                  <input
                    type="text"
                    placeholder="0"
                    className="flex-1 px-4 py-2 text-lg text-gray-800 bg-white outline-none focus:outline-none"
                    value={
                      typeof ethAmounttoBuy === "string" ? ethAmounttoBuy : ""
                    }
                    onChange={(e) => setEthAmounttoBuy(e.target.value || "")}
                  />

                  <select
                    id="currency"
                    className="bg-violet-500 text-white text-lg px-3 py-2 cursor-pointer outline-none focus:ring-0 hover:bg-violet-600 transition"
                    value={ethUnitTypetoBuy}
                    onChange={(e) => setEthUnitTypetoBuy(e.target.value)}
                  >
                    <option>WEI</option>
                    <option>GWEI</option>
                    <option>ETH</option>
                  </select>
                </div>
                <div className="flex mt-1 text-gray-600">
                  <p>
                    {convertedGoldtoBuy
                      ? Number(convertedGoldtoBuy) < 1000
                        ? `${Number(convertedGoldtoBuy).toFixed(2)} mg`
                        : `${(Number(convertedGoldtoBuy) / 1000).toFixed(2)} gm`
                      : "0.00"}
                  </p>
                </div>
                <div className="flex flex-col items-center justify-center py-3 text-gray-600">
                  <p>
                    <strong>Buying Price:&nbsp;</strong>ETH&nbsp;
                    {Number(convertedEth).toFixed(2)}/gm
                  </p>
                  <p>
                    <strong>Wallet Balance:</strong>&nbsp;
                    {Number(balance?.formatted).toFixed(2) ?? "0.00"}{" "}
                    {balance?.symbol ?? ""}
                  </p>
                </div>

                <div className="flex justify-center text-gray-600">
                  <button className="text-lg rounded bg-violet-500 text-white py-1 px-6 hover:cursor-pointer hover:bg-violet-600 transition">
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-11/12 max-w-2xl mt-6 mx-auto bg-white shadow-xl rounded-xl transition-all duration-300">
            <div className="px-5 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-800 font-onest">
                Selling to Aurika
              </h1>
            </div>

            <div className="flex flex-col items-center gap-4 px-5 py-5">
              <div className="w-full">
                <label className="text-lg font-medium text-gray-700 min-w-max">
                  Gold
                </label>

                <div className="mt-1 flex w-full rounded-lg overflow-hidden border border-violet-500 focus-within:ring-2 focus-within:ring-violet-400">
                  <input
                    type="text"
                    placeholder="0"
                    className="flex-1 px-4 py-2 text-lg text-gray-800 bg-white outline-none focus:outline-none"
                    onChange={(e) => setGoldAmounttoSell(e.target.value)}
                  />
                  <select
                    value={goldToEthUnitTypetoSell ?? "GM"}
                    onChange={(e) => setGoldToEthUnitTypetoSell(e.target.value)}
                    id="currency"
                    className="bg-violet-500 text-white text-lg px-3 py-2 cursor-pointer outline-none focus:ring-0 hover:bg-violet-600 transition"
                  >
                    <option>MG</option>
                    <option>GM</option>
                  </select>
                </div>
                <div className="flex mt-1 text-gray-600">
                  <p>{Number(convertedEthtoSell).toFixed(3)}&nbsp;ETH</p>
                </div>
                <div className="flex flex-col items-center justify-center py-3 text-gray-600">
                  <p>
                    <strong>Selling Price:&nbsp;</strong>ETH&nbsp;
                    {Number(convertedEth).toFixed(2)}/gm
                  </p>
                  <p>
                    <strong>Current Aurika Balance:</strong>&nbsp;{quantity}&nbsp;
                    {portfolioValueUnit ? "gm" : "mg"}
                  </p>
                </div>
                <div className="flex justify-center text-gray-600">
                  <button className="text-lg rounded bg-violet-500 text-white py-1 px-6 hover:cursor-pointer hover:bg-violet-600 transition">
                    Sell
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="min-h-screen bg-gray-100"></div>
      </div>
    </>
  );
}

export default Dashboard;
