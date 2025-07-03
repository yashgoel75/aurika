"use client";

//react/next
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
//wagmi
import config from "../../config";
import { parseUnits } from "ethers";
import { aurikaAbi } from "../constants/aurikaAbi";
import { parseEther } from "viem";
import { useTheme } from "../context/ThemeContext";

import { BigNumber } from "ethers";

import { useAccount } from "wagmi";
import { useBalance } from "wagmi";
import { useContractRead } from "wagmi";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";

//viem
import {
  publicClient,
  walletClient,
  getAccount,
  getWalletClient,
} from "../../viemConfig";

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
  const AURIKA_ADDRESS = '0x23db61d27894e33657ec690d7447d7c13219aa8a';
  const account = useAccount();
  const { address, isConnected } = useAccount();
  const walletAddress = account.address;
  // console.log("Wallet Address: ", walletAddress);
  // console.log(typeof walletAddress);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [portfolioValue, setPortfolioValue] = useState("0");
  const [portfolioValueUnit, setPortfolioValueUnit] = useState(true);

  const [quantity, setQuantity] = useState("0");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [buyButton, setBuyButton] = useState(true);
  const [sellButton, setSellButton] = useState(false);
  const [giftButton, setGiftButton] = useState(false);

  const [ethAmount, setEthAmount] = useState("0.05");
  const [ethUnitType, setEthUnitType] = useState("ETH");
  const [goldUnitType, setGoldUnitType] = useState("GRAM");
  const [convertedGold, setConvertedGold] = useState("");

  const [ethAmounttoBuy, setEthAmounttoBuy] = useState("0.05");
  const [ethUnitTypetoBuy, setEthUnitTypetoBuy] = useState("ETH");
  const [goldUnitTypetoBuy, setGoldUnitTypetoBuy] = useState("MG");
  const [convertedGoldtoBuy, setConvertedGoldtoBuy] = useState("");

  const [ethAmounttoGift, setEthAmounttoGift] = useState("0.05");
  const [ethUnitTypetoGift, setEthUnitTypetoGift] = useState("ETH");
  const [goldUnitTypetoGift, setGoldUnitTypetoGift] = useState("MG");
  const [convertedGoldtoGift, setConvertedGoldtoGift] = useState("");

  const [goldAmount, setGoldAmount] = useState("1");
  const [convertedEth, setConvertedEth] = useState("");
  const [goldToEthUnitType, setGoldToEthUnitType] = useState("GM"); // or "MG"
  const [ethOutputUnitType, setEthOutputUnitType] = useState("ETH"); // or "GWEI", "WEI"

  const [goldAmountBuyingPrice, setGoldAmountBuyingPrice] = useState("1");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [goldToEthUnitTypeBuyingPrice, setGoldToEthUnitTypeBuyingPrice] =
    useState("GM"); // or "MG"
  const [ethOutputUnitTypeBuyingPrice, setEthOutputUnitTypeBuyingPrice] =
    useState("ETH"); // or "GWEI", "WEI"

  const [goldAmounttoSell, setGoldAmounttoSell] = useState("1");
  const [convertedEthtoSell, setConvertedEthtoSell] = useState("");
  const [goldToEthUnitTypetoSell, setGoldToEthUnitTypetoSell] = useState("GM"); // or "MG"
  const [ethOutputUnitTypetoSell, setEthOutputUnitTypetoSell] = useState("ETH"); // or "GWEI", "WEI"

  const [walletAddressToGift, setWalletAddressToGift] = useState("");
  const [isSwapped, setIsSwapped] = useState(false);
  const { writeContract } = useWriteContract();
  const [isVisible, setIsVisible] = useState(false);

  const { theme, toggleTheme } = useTheme();

  const { data: balance, refetch: refetchBalance } = useBalance({
    address,
    enabled: !!address,
    unit: "ether",
  });
  console.log(balance);
  //wagmi (contract integration)
  const {
    data: userData,
    isLoading,
    refetch: refetchUserData,
  } = useContractRead({
    address: AURIKA_ADDRESS,
    abi: aurikaAbi,
    functionName: "users",
    args: [address],
  });

  const { data: averagePrice } = useContractRead({
    address: AURIKA_ADDRESS,
    abi: aurikaAbi,
    functionName: "getAveragePrice",
  });

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
      const res = await fetch(`/api/users?walletAddress=${address}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.ok) {
        const data = await res.json();
        setName(data.name);
        setEmail(data.email);
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

      const quantityInMg = quantity / 1000;
      setQuantity(quantityInMg);

      if (quantityInMg < 1000) {
        setPortfolioValueUnit(false);
      } else {
        setPortfolioValueUnit(true);
      }
    }
  }, [userData]);

  useEffect(() => {
    if (!ethAmount) {
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

    const goldInMgPerEth = Number(averagePrice) / 1000;
    const goldInGramPerEth = Number(goldInMgPerEth) / 1000;
    const goldInGram = goldInGramPerEth * ethInBase;

    const finalGoldValue =
      goldUnitType === "MG"
        ? (goldInGram * 1000).toFixed(3)
        : goldInGram.toFixed(6);

    setConvertedGold(finalGoldValue);
  }, [ethAmount, ethUnitType, goldUnitType, averagePrice]);

  useEffect(() => {
    if (!ethAmounttoBuy) {
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

    const goldInMgPerEth = Number(averagePrice) / 1000;
    const goldInGramPerEth = Number(goldInMgPerEth) / 1000;
    const goldInGram = goldInGramPerEth * ethInBase;

    const finalGoldValuetoBuy =
      goldUnitTypetoBuy === "MG"
        ? (goldInGram * 1000).toFixed(3)
        : goldInGram.toFixed(6);

    setConvertedGoldtoBuy(finalGoldValuetoBuy);
  }, [ethAmounttoBuy, ethUnitTypetoBuy, goldUnitTypetoBuy, averagePrice]);

  useEffect(() => {
    if (!ethAmounttoGift) {
      setConvertedGoldtoGift("");
      return;
    }

    let ethInBase;
    switch (ethUnitTypetoGift) {
      case "WEI":
        ethInBase = Number(ethAmounttoGift) / 1e18;
        break;
      case "GWEI":
        ethInBase = Number(ethAmounttoGift) / 1e9;
        break;
      case "ETH":
      default:
        ethInBase = Number(ethAmounttoGift);
    }

    const goldInMgPerEth = Number(averagePrice) / 1000;
    const goldInGramPerEth = Number(goldInMgPerEth) / 1000;
    const goldInGram = goldInGramPerEth * ethInBase;

    const finalGoldValuetoGift =
      goldUnitTypetoGift === "MG"
        ? (goldInGram * 1000).toFixed(3)
        : goldInGram.toFixed(6);

    setConvertedGoldtoGift(finalGoldValuetoGift);
  }, [ethAmounttoGift, ethUnitTypetoGift, goldUnitTypetoGift, averagePrice]);

  useEffect(() => {
    if (!goldAmount) {
      setConvertedEth("");
      return;
    }

    const goldInGrams =
      goldToEthUnitType === "MG"
        ? Number(goldAmount) / 1000
        : Number(goldAmount);

    const EthPerGram = (1 * 1000 * 1000) / Number(averagePrice);
    const ethValue = EthPerGram * goldInGrams;

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
  }, [goldAmount, goldToEthUnitType, ethOutputUnitType, averagePrice]);

  useEffect(() => {
    if (!goldAmount) {
      setBuyingPrice("");
      return;
    }

    const buyingPrice = (1 * 1000 * 1000) / Number(averagePrice);
    setBuyingPrice(buyingPrice.toFixed(8));
  }, [goldAmount, goldToEthUnitType, ethOutputUnitType, averagePrice]);

  useEffect(() => {
    if (!goldAmounttoSell) {
      setConvertedEthtoSell("");
      return;
    }

    const goldInGramstoSell =
      goldToEthUnitTypetoSell === "MG"
        ? Number(goldAmounttoSell) / 1000
        : Number(goldAmounttoSell);

    const goldToSell = goldInGramstoSell;
    const buyingPrice = (1 * 1000 * 1000) / Number(averagePrice);
    const ethValue = goldToSell * buyingPrice;

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
    averagePrice,
  ]);

  //functions

  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false);
    localStorage.setItem("disclaimerAcknowledged", "true");
  };

  function handleSwap() {
    setIsSwapped(!isSwapped);
  }

  function handleBuyButton() {
    setSellButton(false);
    setGiftButton(false);
    setBuyButton(true);
  }

  function handleSellButton() {
    setBuyButton(false);
    setGiftButton(false);
    setSellButton(true);
  }

  function handleGiftButton() {
    setBuyButton(false);
    setSellButton(false);
    setGiftButton(true);
  }

  function handleImportFromWalbo() {}

  const [walletAddressToGiftVerified, setWalletAddressToGiftVerified] =
    useState(false);
  const [walletAddressToGiftNotVerified, setWalletAddressToGiftNotVerified] =
    useState(false);
  const [
    walletAddressToGiftNotVerifiedYet,
    setWalletAddressToGiftNotVerifiedYet,
  ] = useState(true);

  async function handleWalletAddressToGiftVerification() {
    try {
      const res = await fetch(
        `/api/users?walletAddress=${walletAddressToGift}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const data = await res.json();

      if (res.ok && data.exists) {
        setWalletAddressToGiftNotVerified(false);
        setWalletAddressToGiftNotVerifiedYet(false);
        setWalletAddressToGiftVerified(true);
      } else {
        setWalletAddressToGiftVerified(false);
        setWalletAddressToGiftNotVerified(true);
      }
    } catch (err) {
      console.err(err);
    }
  }
  function getAmoutInWei() {
    const totalEth = ethAmounttoBuy;

    if (!totalEth || isNaN(Number(totalEth))) {
      console.warn("Invalid ETH amount");
      return BigInt(0);
    }

    let amountInWei;

    if (ethUnitTypetoBuy === "ETH") {
      amountInWei = parseUnits(totalEth, 18); // 1 ETH = 10^18 wei
    } else if (ethUnitTypetoBuy === "GWEI") {
      amountInWei = parseUnits(totalEth, 9); // 1 GWEI = 10^9 wei
    } else if (ethUnitTypetoBuy === "WEI") {
      amountInWei = BigInt(totalEth);
    } else {
      console.warn("Unsupported ETH unit type");
      return BigInt(0);
    }

    return amountInWei;
  }

  function getAmoutInWeiToGift() {
    const totalEth = ethAmounttoGift;

    if (!totalEth || isNaN(Number(totalEth))) {
      console.warn("Invalid ETH amount");
      return BigInt(0);
    }

    let amountInWei;

    if (ethUnitTypetoGift === "ETH") {
      amountInWei = parseUnits(totalEth, 18); // 1 ETH = 10^18 wei
    } else if (ethUnitTypetoGift === "GWEI") {
      amountInWei = parseUnits(totalEth, 9); // 1 GWEI = 10^9 wei
    } else if (ethUnitTypetoGift === "WEI") {
      amountInWei = BigInt(totalEth);
    } else {
      console.warn("Unsupported ETH unit type");
      return BigInt(0);
    }

    return amountInWei;
  }

  const [isBuyOrderPending, setIsBuyOrderPending] = useState(false);
  const [isBuyOrderSuccess, setIsBuyOrderSuccess] = useState(false);
  const [isBuyOrderFailed, setIsBuyOrderFailed] = useState(false);
  const [isBuyHashReady, setIsBuyHashReady] = useState(false);
  const [buyOrderHash, setBuyOrderHash] = useState("");

  const handleBuyOrder = async () => {
    try {
      setIsBuyOrderPending(true);
      setIsBuyOrderFailed(false);
      setIsBuyOrderSuccess(false);
      setIsBuyHashReady(false);

      const account = await getAccount();
      if (!account) throw new Error("No wallet connected");

      // Convert gold quantity to milligrams (BigInt)
      const quantityBigInt = BigInt(Math.round(Number(convertedGoldtoBuy))); // in mg
      if (quantityBigInt === BigInt(0))
        throw new Error("Quantity cannot be zero");

      // Get total ETH amount in wei (BigInt)
      const amountInWei = getAmoutInWei();
      if (amountInWei === BigInt(0))
        throw new Error("ETH amount cannot be zero");

      // Calculate average price in wei per mg
      const avgPriceBigInt = amountInWei / quantityBigInt;

      // Execute the contract write
      const walletClient = await getWalletClient();
      const hash = await walletClient.writeContract({
        address: AURIKA_ADDRESS,
        abi: aurikaAbi,
        functionName: "buyOrder",
        args: [],
        account,
        value: amountInWei,
      });

      console.log("Buy order transaction hash:", hash);
      setBuyOrderHash(hash);

      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      setIsBuyHashReady(true);

      setIsBuyOrderPending(false);
      setIsBuyOrderSuccess(true);
      console.log("Buy order transaction receipt:", receipt);

      // Refetch user data
      await refetchUserData();
      await refetchBalance();

      // Send order to backend as strings
      console.log(account.address);
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          action: "addOrder",
          walletAddress: walletAddress,
          order: {
            type: "buy",
            hash: hash,
            avgPrice: avgPriceBigInt.toString(),
            quantity: quantityBigInt.toString(),
            totalValue: amountInWei.toString(),
          },
        }),
      });

      const data = await response.json();
      fetch(
        `api/order/buy?name=${name}&email=${email}&avgPrice=${avgPriceBigInt.toString()}&quantity=${quantityBigInt.toString()}&totalPrice=${amountInWei.toString()}&hash=${hash}`
      );

      console.log(data);
      // if (!response.ok) {
      //   throw new Error(data.error || "Failed to save order");
      // }
    } catch (err) {
      console.error("Buy transaction failed:", err.message);
      setIsBuyOrderPending(false);
      setIsBuyOrderFailed(true);
    }
  };

  const [isSellOrderPending, setIsSellOrderPending] = useState(false);
  const [isSellOrderSuccess, setIsSellOrderSuccess] = useState(false);
  const [isSellOrderFailed, setIsSellOrderFailed] = useState(false);
  const [isSellHashReady, setIsSellHashReady] = useState(false);
  const [sellOrderHash, setSellOrderHash] = useState("");

  const handleSellOrder = async () => {
    try {
      setIsSellOrderPending(true);
      setIsSellOrderSuccess(false);
      setIsSellOrderFailed(false);
      setIsSellHashReady(false);

      const account = await getAccount();
      if (!account) throw new Error("No wallet connected");

      // Convert gold amount to milligrams (BigInt)
      const goldInMg =
        goldToEthUnitTypetoSell === "MG"
          ? BigInt(Math.round(Number(goldAmounttoSell)))
          : BigInt(Math.round(Number(goldAmounttoSell) * 1000));

      if (goldInMg === BigInt(0))
        throw new Error("Gold quantity cannot be zero");

      // Validate user gold balance
      const userGoldBalance = BigInt(userData?.goldBalance || 0); // Fetch from contract/backend
      if (goldInMg > quantity) throw new Error("Insufficient gold balance");

      // Calculate ETH value in wei
      const ethValue = parseUnits(convertedEthtoSell, 18);

      // Calculate average price in wei per mg
      const avgPriceBigInt = ethValue / goldInMg;

      // Execute the contract write
      const walletClient = await getWalletClient();
      const hash = await walletClient.writeContract({
        address: AURIKA_ADDRESS,
        abi: aurikaAbi,
        functionName: "sellOrder",
        args: [Number(goldInMg) * 1000],
        account,
      });

      console.log("Sell order transaction hash:", hash);
      setSellOrderHash(hash);

      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      setIsSellHashReady(true);
      setIsSellOrderPending(false);
      setIsSellOrderSuccess(true);
      console.log("Sell order transaction receipt:", receipt);
      // Refetch user data
      await refetchUserData();
      await refetchBalance();

      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          action: "addOrder",
          walletAddress: walletAddress,
          order: {
            type: "sell",
            hash: hash,
            avgPrice: avgPriceBigInt.toString(),
            quantity: goldInMg.toString(),
            totalValue: (avgPriceBigInt * goldInMg).toString(),
          },
        }),
      });

      const data = await response.json();

      fetch(
        `api/order/sell?name=${name}&email=${email}&avgPrice=${avgPriceBigInt.toString()}&quantity=${goldInMg.toString()}&totalPrice=${(avgPriceBigInt * goldInMg).toString()}&hash=${hash}`
      );
      // if (!response.ok) {
      //   throw new Error(data.error || "Failed to save order");
      // }
    } catch (err) {
      console.error("Sell transaction failed:", err.message);
      setIsSellOrderPending(false);
      setIsSellOrderFailed(true);
    }
  };

  const [isGiftOrderPending, setIsGiftOrderPending] = useState(false);
  const [isGiftOrderSuccess, setIsGiftOrderSuccess] = useState(false);
  const [isGiftOrderFailed, setIsGiftOrderFailed] = useState(false);
  const [isGiftHashReady, setIsGiftHashReady] = useState(false);
  const [GiftOrderHash, setGiftOrderHash] = useState("");

  const handleGiftOrder = async () => {
    try {
      setIsGiftOrderPending(true);
      setIsGiftOrderFailed(false);
      setIsGiftOrderSuccess(false);
      setIsGiftHashReady(false);

      const account = await getAccount();
      if (!account) throw new Error("No wallet connected");

      // Convert gold quantity to milligrams (BigInt)
      const quantityBigInt = BigInt(Math.round(Number(convertedGoldtoGift))); // in mg
      if (quantityBigInt === BigInt(0))
        throw new Error("Quantity cannot be zero");

      // Get total ETH amount in wei (BigInt)
      const amountInWei = getAmoutInWeiToGift();
      if (amountInWei === BigInt(0))
        throw new Error("ETH amount cannot be zero");

      // Calculate average price in wei per mg
      const avgPriceBigInt = amountInWei / quantityBigInt;

      // Execute the contract write
      const walletClient = await getWalletClient();
      const hash = await walletClient.writeContract({
        address: AURIKA_ADDRESS,
        abi: aurikaAbi,
        functionName: "gift",
        args: [walletAddressToGift],
        account,
        value: amountInWei,
      });

      console.log("Gift order transaction hash:", hash);
      setGiftOrderHash(hash);

      // Wait for transaction receipt
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      setIsGiftHashReady(true);

      setIsGiftOrderPending(false);
      setIsGiftOrderSuccess(true);
      console.log("Gift order transaction receipt:", receipt);

      // Refetch user data
      await refetchUserData();
      await refetchBalance();

      // Send order to backend as strings
      console.log(account.address);
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },

        body: JSON.stringify({
          action: "giftOrder",
          walletAddress: walletAddress,
          order: {
            receiverWallet: walletAddressToGift,
            type: "gift-from",
            hash: hash,
            avgPrice: avgPriceBigInt.toString(),
            quantity: quantityBigInt.toString(),
            totalValue: (
              Number(avgPriceBigInt) * Number(quantityBigInt)
            ).toString(),
          },
        }),
      });

      const data = await response.json();
      fetch(
        `api/order/gift?name=${name}&email=${email}&receiversAddress=${walletAddressToGift}&avgPrice=${avgPriceBigInt.toString()}&quantity=${quantityBigInt.toString()}&totalPrice=${amountInWei.toString()}&hash=${hash}`
      );

      console.log(data);
      // if (!response.ok) {
      //   throw new Error(data.error || "Failed to save order");
      // }
    } catch (err) {
      console.error("Buy transaction failed:", err.message);
      setIsGiftOrderPending(false);
      setIsGiftOrderFailed(true);
    }
  };

  return (
    <>
      <div
        className={`${theme === "light" ? "bg-stone-50" : "bg-gray-800"} relative`}
      >
        <div className="sticky top-0 z-20 w-full">
          <Header />
        </div>
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

        <div
          className={`${theme === "light" ? "bg-stone-50" : "bg-gray-800"} pt-3`}
        >
          <div
            className={`${theme === "light" ? "bg-stone-50" : "bg-gray-800"} m-auto w-92/100 px-8 py-4 relative z-10`}
          >
            <div
              className={`${theme === "light" ? "text-gray-800" : "text-gray-50"} flex flex-row`}
            >
              <h1 className={`text-xl font-bold mb-1`}>Welcome back,&nbsp;</h1>
              <h1 className="text-xl">{name}</h1>
            </div>
            <h1
              className={`${theme === "light" ? "text-gray-800" : "text-gray-50"} text-xl mb-5 mt-1 flex items-center`}
            >
              <strong>Your Portfolio:&nbsp;</strong>
              {isVisible ? (
                <>
                  {quantity < 1000
                    ? quantity
                    : Number(quantity / 1000).toFixed(3)}
                  &nbsp;
                  {portfolioValueUnit ? "gm" : "mg"}&nbsp;
                  <svg
                    onClick={() => setIsVisible(false)}
                    className="ml-1"
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill={`${theme === "light" ? "#000000" : "#ffffff"}`}
                  >
                    <path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z" />
                  </svg>
                </>
              ) : (
                <>
                  ••••••
                  <svg
                    className="ml-1"
                    onClick={() => setIsVisible(true)}
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill={`${theme === "light" ? "#000000" : "#ffffff"}`}
                  >
                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z" />
                  </svg>
                </>
              )}
            </h1>

            <div className="horizontalRule"></div>
          </div>
        </div>
        {/* <div className="account-container pl-8 pt-8 bg-gray-100">
          <h1 className="text-[24px] font-onest font-bold mb-2">Gold Locker</h1>
          </div> */}
        <div
          className={`flex p-4 pt-5 w-92/100 m-auto justify-center ${theme === "light" ? "bg-stone-50" : "bg-gray-800"}`}
        >
          <div className="flex items-center w-95/100 m-auto">
            <Image
              className="bg-white shadow-lg"
              src={isSwapped ? AurikaGoldCoin : EthereumCoin}
              style={imageStyle}
              alt={isSwapped ? "Aurika" : "Ethereum Coin"}
              priority
            ></Image>
            <div className="flex justify-center items-center w-40/100">
              {!isSwapped ? (
                <div
                  className={`flex items-center w-full ml-7 gap-2 ${theme === "light" ? "bg-white" : "bg-gray-700"} rounded-full px-3 py-2 shadow-md`}
                >
                  <h1 className="m-1 text-center bg-linear-to-bl from-violet-400 to-purple-700 text-white p-1 text-lg w-40/100 border border-purple-300 rounded-full">
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
                    className={`${isSwapped ? "ml-1" : "mr-1"} ${theme === "light" ? "bg-stone-50" : "bg-gray-800 text-gray-300"} text-lg rounded-full w-60/100 border-violet-400 border-1 p-1 pl-3 shadow-md`}
                    placeholder="1"
                    type="text"
                    value={ethAmount}
                    onChange={(e) => setEthAmount(e.target.value)}
                  />
                </div>
              ) : (
                <div
                  className={`flex items-center w-full ml-7 gap-2 ${theme === "light" ? "bg-white" : "bg-gray-700 text-gray-300"} rounded-full px-3 py-2 shadow-md`}
                >
                  <h1 className="m-1 text-center bg-linear-to-bl from-violet-400 to-purple-700 text-white p-1 text-lg w-40/100 border border-purple-300 rounded-full">
                    <select
                      id="goldUnit"
                      className="border-none outline-none focus:ring-0"
                      value={goldUnitType}
                      onChange={(e) => setGoldToEthUnitType(e.target.value)}
                    >
                      <option>GRAM</option>
                      <option>MG</option>
                    </select>
                  </h1>
                  <input
                    className={`${isSwapped ? "mr-1" : "ml-1"} ${theme === "light" ? "bg-stone-50" : "bg-gray-800 text-gray-300"} rounded-full text-lg w-60/100 border-1 border-violet-400 p-1 pl-3 shadow-md`}
                    placeholder={0}
                    value={goldAmount}
                    onChange={(e) => setGoldAmount(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="w-20/100 flex justify-center items-center">
              <div
                className={`shadow-md  ${theme === "light" ? "bg-white hover:bg-stone-50" : "bg-gray-700 text-gray-300"} hover:shadow-lg cursor-pointer rounded-full p-3`}
              >
                <svg
                  onClick={handleSwap}
                  xmlns="http://www.w3.org/2000/svg"
                  height="40"
                  viewBox="0 -960 960 960"
                  width="40"
                  fill={`${theme === "light" ? "#000000" : "#e0dfde"}`}
                >
                  <path d="m320-160-56-57 103-103H80v-80h287L264-503l56-57 200 200-200 200Zm320-240L440-600l200-200 56 57-103 103h287v80H593l103 103-56 57Z" />
                </svg>
              </div>
            </div>

            <div className="w-40/100 flex justify-center items-center font-onest">
              {!isSwapped ? (
                <div
                  className={`flex items-center w-full mr-7 gap-2 ${theme === "light" ? "bg-white" : "bg-gray-700 text-gray-300"} rounded-full px-3 py-2 shadow-md`}
                >
                  <input
                    className={`${isSwapped ? "mr-1" : "ml-1"} ${theme === "light" ? "bg-stone-50" : "bg-gray-800 text-gray-300"} rounded-full text-lg w-60/100 border-1 border-violet-400 p-1 pl-3 shadow-md`}
                    placeholder={0}
                    value={
                      convertedGold ? Number(convertedGold).toFixed(2) : "0.00"
                    }
                    disabled
                  />
                  <h1 className="m-1 text-center bg-linear-to-bl from-violet-400 to-purple-700 text-white p-1 text-lg w-40/100 border border-purple-300 rounded-full">
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
              ) : (
                <div
                  className={`flex items-center w-full mr-7 gap-2 ${theme === "light" ? "bg-white" : "bg-gray-700 text-gray-300"} rounded-full px-3 py-2 shadow-md`}
                >
                  <input
                    className={`${isSwapped ? "ml-1" : "mr-1"} ${theme === "light" ? "bg-stone-50" : "bg-gray-800 text-gray-300"} text-lg rounded-full w-60/100 border-violet-400 border-1 p-1 pl-3 shadow-md`}
                    placeholder="1"
                    type="text"
                    value={convertedEth}
                    disabled
                  />
                  <h1 className="m-1 text-center bg-linear-to-bl from-violet-400 to-purple-700 text-white p-1 text-lg w-40/100 border border-purple-300 rounded-full">
                    <select
                      id="ethUnit"
                      className="border-none outline-none focus:ring-0"
                      value={ethOutputUnitType}
                      onChange={(e) => setEthOutputUnitType(e.target.value)}
                    >
                      <option>WEI</option>
                      <option>GWEI</option>
                      <option>ETH</option>
                    </select>
                  </h1>
                </div>
              )}
            </div>

            <Image
              className="bg-white shadow-lg"
              src={isSwapped ? EthereumCoin : AurikaGoldCoin}
              style={imageStyle}
              alt={isSwapped ? "Ethereum Coin" : "Aurika"}
              priority
            ></Image>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleBuyButton}
            className={`pt-1 pb-1 pl-2 pr-2 w-20 rounded-s-md outline-1 outline-violet-500 text-lg mt-6 ${buyButton ? `bg-violet-500` : `bg-transparent`} ${buyButton ? `text-white ` : ` text-violet-500`} hover:cursor-pointer hover:bg-violet-600 hover:text-white transition-all duration-200 ease-in-out ${theme === "light" ? null : "text-white"}`}
          >
            Buy
          </button>
          <button
            onClick={handleSellButton}
            className={`pt-1 pb-1 pl-2 pr-2 w-20 outline-1 outline-violet-500 text-lg mt-6 ${sellButton ? `bg-violet-500` : `bg-transparent`} ${sellButton ? `text-white ` : ` text-violet-500`} hover:cursor-pointer hover:bg-violet-600 hover:text-white transition-all duration-200 ease-in-out ${theme === "light" ? null : "text-white"}`}
          >
            Sell
          </button>
          <button
            onClick={handleGiftButton}
            className={`pt-1 pb-1 pl-2 pr-2 w-20 rounded-e-md outline-1 outline-violet-500 text-lg mt-6 ${giftButton ? `bg-violet-500` : `bg-transparent`} ${giftButton ? `text-white ` : ` text-violet-500`} hover:cursor-pointer hover:bg-violet-600 hover:text-white transition-all duration-200 ease-in-out ${theme === "light" ? null : "text-white"}`}
          >
            Gift
          </button>
        </div>

        {buyButton ? (
          <div
            className={`w-11/12 max-w-2xl mt-6 mx-auto ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-700 text-gray-300"} shadow-xl rounded-xl`}
          >
            <div className="px-5 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-semibold font-onest">
                Buying from Aurika
              </h1>
            </div>

            <div className="flex flex-col items-center gap-4 px-5 py-5">
              <div className="w-full">
                <label
                  className={`text-lg font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} min-w-max`}
                >
                  SepoliaETH
                </label>

                <div className="flex mt-1 w-full rounded-lg overflow-hidden border border-violet-500 focus-within:ring-2 focus-within:ring-violet-400">
                  <input
                    type="text"
                    placeholder="0"
                    className={`flex-1 px-4 py-2 text-lg ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-300"} outline-none focus:outline-none`}
                    value={
                      typeof ethAmounttoBuy === "string"
                        ? ethAmounttoBuy
                        : "0.00"
                    }
                    onChange={(e) => setEthAmounttoBuy(e.target.value)}
                  />

                  <select
                    id="currency"
                    className="bg-linear-to-bl from-violet-400 to-purple-700 text-white text-center text-lg px-3 py-2 cursor-pointer outline-none focus:ring-0 hover:bg-violet-600 transition"
                    value={ethUnitTypetoBuy}
                    onChange={(e) => setEthUnitTypetoBuy(e.target.value)}
                  >
                    <option>WEI</option>
                    <option>GWEI</option>
                    <option>ETH</option>
                  </select>
                </div>
                <div
                  className={`flex mt-1 ${isBuyOrderPending || isBuyOrderSuccess || isBuyOrderFailed || isSellOrderPending || isSellOrderSuccess || isSellOrderFailed ? "mb-1" : null} ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                >
                  <p>
                    {convertedGoldtoBuy
                      ? Number(convertedGoldtoBuy) < 1000
                        ? `${Number(convertedGoldtoBuy).toFixed(2)} mg`
                        : `${(Number(convertedGoldtoBuy) / 1000).toFixed(2)} gm`
                      : "0.00"}
                  </p>
                </div>
                {isBuyOrderPending ? (
                  <p className="flex justify-center items-center m-auto m-2 bg-amber-300 text-yellow-600 w-full rounded p-1">
                    <svg
                      className="mr-3 size-5 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-45"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-85"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Transaction Pending...
                  </p>
                ) : null}

                {isBuyOrderSuccess ? (
                  <p className="flex justify-center items-center m-auto m-2 bg-green-500 text-green-900 w-full rounded p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#314D1C"
                      className="mr-2"
                    >
                      <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                    </svg>
                    Transaction Success
                  </p>
                ) : null}

                {isBuyOrderFailed ? (
                  <p className="flex justify-center items-center m-auto m-2 bg-red-400 text-red-800 w-full rounded p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#BB271A"
                      className="mr-2"
                    >
                      <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                    Transaction Failed
                  </p>
                ) : null}

                {isBuyHashReady ? (
                  <p
                    className={`mt-2 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                  >
                    Transaction Hash: {buyOrderHash}&nbsp;
                  </p>
                ) : null}

                <div
                  className={`flex flex-col items-center justify-center py-3 mt-2 ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}
                >
                  <p>
                    <strong>Buying Price:&nbsp;</strong>
                    {Number(buyingPrice).toFixed(4)}&nbsp;ETH/gm
                  </p>
                  <p>
                    <strong>Wallet Balance:</strong>&nbsp;
                    {Number(balance?.formatted).toFixed(2) ?? "0.00"}&nbsp;
                    {balance?.symbol ?? ""}
                  </p>
                </div>

                <div className="flex justify-center text-gray-600">
                  <button
                    onClick={handleBuyOrder}
                    disabled={isBuyOrderPending}
                    className={`${isBuyOrderPending ? "cursor-not-allowed" : "hover:cursor-pointer hover:bg-violet-600"} text-lg rounded bg-violet-500 text-white py-1 px-6 transition`}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {sellButton ? (
          <div
            className={`w-11/12 max-w-2xl mt-6 mx-auto  ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-700 text-gray-300"} shadow-xl rounded-xl`}
          >
            <div className="px-5 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-semibold font-onest">
                Selling to Aurika
              </h1>
            </div>

            <div className="flex flex-col items-center gap-4 px-5 py-5">
              <div className="w-full">
                <label
                  className={`text-lg font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} min-w-max`}
                >
                  Gold
                </label>

                <div className="mt-1 flex w-full rounded-lg overflow-hidden border border-violet-500 focus-within:ring-2 focus-within:ring-violet-400">
                  <input
                    type="text"
                    placeholder="0"
                    className={`flex-1 px-4 py-2 text-lg ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-300"} outline-none focus:outline-none`}
                    value={
                      typeof goldAmounttoSell === "string"
                        ? goldAmounttoSell
                        : "0.00"
                    }
                    onChange={(e) => setGoldAmounttoSell(e.target.value)}
                  />
                  <select
                    value={goldToEthUnitTypetoSell}
                    onChange={(e) => setGoldToEthUnitTypetoSell(e.target.value)}
                    id="quantity"
                    className="bg-linear-to-bl from-violet-400 to-purple-700 text-white text-lg px-3 py-2 cursor-pointer outline-none focus:ring-0 hover:bg-violet-600 transition"
                  >
                    <option>MG</option>
                    <option>GM</option>
                  </select>
                </div>
                <div
                  className={`flex mt-1 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                >
                  <p>
                    {convertedEthtoSell
                      ? Number(convertedEthtoSell).toFixed(3)
                      : "0.00"}
                    &nbsp;ETH
                  </p>
                </div>

                {isSellOrderPending ? (
                  <p className="flex mt-1 justify-center items-center m-auto m-2 bg-amber-300 text-yellow-600 w-full rounded p-1">
                    <svg
                      className="mr-3 size-5 animate-spin"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-45"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-85"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Transaction Pending...
                  </p>
                ) : null}

                {isSellOrderSuccess ? (
                  <p className="flex mt-1 justify-center items-center m-auto m-2 bg-green-500 text-green-900 w-full rounded p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#314D1C"
                      className="mr-2"
                    >
                      <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                    </svg>
                    Transaction Success
                  </p>
                ) : null}

                {isSellOrderFailed ? (
                  <p className="flex mt-1 justify-center items-center m-auto m-2 bg-red-400 text-red-800 w-full rounded p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#BB271A"
                      className="mr-2"
                    >
                      <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                    </svg>
                    Transaction Failed
                  </p>
                ) : null}

                {isSellHashReady ? (
                  <p
                    className={`mt-2 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                  >
                    Transaction Hash: {sellOrderHash}&nbsp;
                  </p>
                ) : null}

                <div
                  className={`flex flex-col items-center justify-center py-3 mt-2 ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}
                >
                  <p>
                    <strong>Selling Price:&nbsp;</strong>
                    {Number(buyingPrice).toFixed(4)}&nbsp;ETH/gm
                  </p>
                  <p>
                    <strong>Current Aurika Balance:</strong>&nbsp;
                    {quantity < 1000
                      ? Number(quantity).toFixed(3)
                      : Number(quantity / 1000).toFixed(3)}
                    &nbsp;
                    {portfolioValueUnit ? "gm" : "mg"}
                  </p>
                </div>
                <div className="flex justify-center text-gray-600">
                  <button
                    onClick={handleSellOrder}
                    className="text-lg rounded bg-violet-500 text-white py-1 px-6 hover:cursor-pointer hover:bg-violet-600 transition"
                  >
                    Sell
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {giftButton ? (
          <div
            className={`w-11/12 max-w-2xl mt-6 mx-auto ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-700 text-gray-300"} shadow-xl rounded-xl`}
          >
            <div className="px-5 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-semibold font-onest">
                Gifting through Aurika
              </h1>
            </div>

            <div className="flex flex-col items-center gap-4 px-5 py-5">
              <div className="w-full">
                <label
                  className={`text-lg font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} min-w-max`}
                >
                  SepoliaETH
                </label>

                <div className="flex mt-1 w-full rounded-lg overflow-hidden border border-violet-500 focus-within:ring-2 focus-within:ring-violet-400">
                  <input
                    type="text"
                    placeholder="0"
                    className={`flex-1 px-4 py-2 text-lg ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-300"} outline-none focus:outline-none`}
                    value={
                      typeof ethAmounttoGift === "string"
                        ? ethAmounttoGift
                        : "0.00"
                    }
                    onChange={(e) => setEthAmounttoGift(e.target.value)}
                  />

                  <select
                    id="currency"
                    className="bg-linear-to-bl from-violet-400 to-purple-700 text-white text-center text-lg px-3 py-2 cursor-pointer outline-none focus:ring-0 hover:bg-violet-600 transition"
                    value={ethUnitTypetoGift}
                    onChange={(e) => setEthUnitTypetoGift(e.target.value)}
                  >
                    <option>WEI</option>
                    <option>GWEI</option>
                    <option>ETH</option>
                  </select>
                </div>
                <div
                  className={`flex mt-1 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}
                >
                  <p>
                    {convertedGoldtoGift
                      ? Number(convertedGoldtoGift) < 1000
                        ? `${Number(convertedGoldtoGift).toFixed(2)} mg`
                        : `${(Number(convertedGoldtoGift) / 1000).toFixed(2)} gm`
                      : "0.00"}
                  </p>
                </div>

                <div className="w-full mt-2">
                  <label
                    className={`text-lg font-medium ${theme === "light" ? "text-gray-700" : "text-gray-300"} min-w-max`}
                  >
                    Wallet Address
                  </label>

                  <div className="flex mt-1 w-full rounded-lg overflow-hidden border border-violet-500 focus-within:ring-2 focus-within:ring-violet-400">
                    <input
                      type="text"
                      placeholder="0x"
                      className={`flex-1 px-4 py-2 text-lg ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-300"} outline-none focus:outline-none`}
                      onChange={(e) => setWalletAddressToGift(e.target.value)}
                    />
                    <button
                      onClick={handleWalletAddressToGiftVerification}
                      className={`px-3 py-1 rounded-sm bg-linear-to-bl from-violet-400 to-purple-700 text-white m-1 hover:cursor-pointer`}
                    >
                      Verify
                    </button>
                  </div>
                  {/* <div
                    onClick={handleImportFromWalbo}
                    className="w-40 text-center px-3 py-1 mt-1 rounded-sm text-white bg-violet-500 hover:cursor-pointer"
                  >
                    Import from Walbo
                  </div> */}
                </div>

                {walletAddressToGiftVerified ? (
                  <div className="mt-2 w-full">
                    <p className="flex justify-center items-center m-auto m-2 bg-green-500 text-green-900 w-full rounded p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#314D1C"
                        className="mr-2"
                      >
                        <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                      </svg>
                      Verified
                    </p>
                  </div>
                ) : null}

                {walletAddressToGiftNotVerified ? (
                  <div className="mt-2 w-full">
                    <p className="flex justify-center items-center m-auto m-2 bg-red-400 text-red-900 w-full rounded p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#BB271A"
                        className="mr-2"
                      >
                        <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </svg>
                      Wallet Address not associated with Aurika
                    </p>
                  </div>
                ) : null}

                {isGiftOrderPending ? (
                  <div className="mt-1">
                    <p className="flex justify-center items-center m-auto m-2 bg-amber-300 text-yellow-600 w-full rounded p-1">
                      <svg
                        className="mr-3 size-5 animate-spin"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-45"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-85"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                      Transaction Pending...
                    </p>
                  </div>
                ) : null}

                {isGiftOrderSuccess ? (
                  <div className="mt-1">
                    <p className="flex justify-center items-center m-auto m-2 bg-green-500 text-green-900 w-full rounded p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#314D1C"
                        className="mr-2"
                      >
                        <path d="m344-60-76-128-144-32 14-148-98-112 98-112-14-148 144-32 76-128 136 58 136-58 76 128 144 32-14 148 98 112-98 112 14 148-144 32-76 128-136-58-136 58Zm34-102 102-44 104 44 56-96 110-26-10-112 74-84-74-86 10-112-110-24-58-96-102 44-104-44-56 96-110 24 10 112-74 86 74 84-10 114 110 24 58 96Zm102-318Zm-42 142 226-226-56-58-170 170-86-84-56 56 142 142Z" />
                      </svg>
                      Transaction Success
                    </p>
                  </div>
                ) : null}

                {isGiftOrderFailed ? (
                  <div className="mt-1">
                    <p className="flex justify-center items-center m-auto m-2 bg-red-400 text-red-800 w-full rounded p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#BB271A"
                        className="mr-2"
                      >
                        <path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                      </svg>
                      Transaction Failed
                    </p>
                  </div>
                ) : null}

                {isGiftHashReady ? (
                  <p
                    className={`mt-2 ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                  >
                    Transaction Hash: {GiftOrderHash}&nbsp;
                  </p>
                ) : null}

                <div
                  className={`flex flex-col items-center justify-center py-3 mt-2 ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}
                >
                  <p>
                    <strong>Buying Price:&nbsp;</strong>
                    {Number(buyingPrice).toFixed(4)}&nbsp;ETH/gm
                  </p>
                  <p>
                    <strong>Wallet Balance:</strong>&nbsp;
                    {Number(balance?.formatted).toFixed(2) ?? "0.00"}&nbsp;
                    {balance?.symbol ?? ""}
                  </p>
                </div>

                <div className="flex justify-center text-gray-600">
                  <button
                    onClick={handleGiftOrder}
                    disabled={
                      isGiftOrderPending ||
                      walletAddressToGiftNotVerified ||
                      walletAddressToGiftNotVerifiedYet
                    }
                    className={`${isGiftOrderPending || walletAddressToGiftNotVerified || walletAddressToGiftNotVerifiedYet ? "cursor-not-allowed opacity-50" : "hover:cursor-pointer hover:bg-violet-600"} text-lg rounded bg-violet-500 text-white py-1 px-6 transition`}
                  >
                    Gift
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div
          className={`min-h-screen ${theme === "light" ? "bg-stone-50" : "bg-gray-800"}`}
        ></div>
      </div>
    </>
  );
}

export default Dashboard;
