"use client";

import Header from "../Header/page";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./page.css";
import Image from "next/image";
import AurikaGoldCoin from "@/public/AurikaGoldCoin.png";

import { aurikaAbi } from "../constants/aurikaAbi";
import { useContractRead } from "wagmi";

import { parseUnits } from "ethers";
import { getPriceAbi } from "../constants/getPriceAbi";
import { BigNumber } from "ethers";

function Portfolio() {
  const router = useRouter();
  const account = useAccount();
  const { address, isConnected } = useAccount();

  const imageStyle = {
    borderRadius: "50%",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    width: "175px",
    height: "auto",
  };

  const AURIKA_ADDRESS = "0x26B0E24796a52fd8D6D25E165C69f1D3b78Ec859";
  const GETPRICE_ADDRESS = "0x6d2C92EbCCcF6347EbeDef5e8961569914c3e091";
  const [ethUsdPrice, setEthUsdPrice] = useState("0");
  const [xauUsdPrice, setXauUsdPrice] = useState("0");
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

  const [portfolioValue, setPortfolioValue] = useState("0");
  const [quantity, setQuantity] = useState("0");
  const [portfolioValueUnit, setPortfolioValueUnit] = useState(true);
  const [currentValueUSD, setCurrentValueUSD] = useState("0");
  const [currentValueETH, setCurrentValueETH] = useState("0");
  const [valueChangePercent, setValueChangePercent] = useState("0");

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
  }, [quantity]);

  // Calculate current portfolio value in USD and ETH
  useEffect(() => {
    if (
      quantity &&
      xauUsdPrice &&
      ethUsdPrice &&
      Number(xauUsdPrice) > 0 &&
      Number(ethUsdPrice) > 0
    ) {
      // Convert quantity to grams (assuming quantity is in milligrams)
      const quantityInGrams = Number(quantity) / 1000;
      // Calculate price per gram (XAU/USD price is per troy ounce, 1 troy ounce = 31.1035 grams)
      const xauPerGram = Number(xauUsdPrice) / 31.1035;
      // Calculate total value in USD
      const valueInUSD = (quantityInGrams * xauPerGram).toFixed(2);
      setCurrentValueUSD(valueInUSD);

      // Calculate value in ETH
      const valueInETH = (valueInUSD / Number(ethUsdPrice)).toFixed(4);
      setCurrentValueETH(valueInETH);

      // Calculate percentage change
      const investedETH = Number(portfolioValue) / 1e18;
      const changePercent = (
        ((Number(valueInETH) - investedETH) / investedETH) *
        100
      ).toFixed(2);
      setValueChangePercent(changePercent);
    }
  }, [quantity, xauUsdPrice, ethUsdPrice, portfolioValue]);

  useEffect(() => {
    if (ethUsdPriceRaw) {
      setEthUsdPrice(Number(ethUsdPriceRaw) / 1e8); // Adjust based on contract decimals
    }

    if (xauUsdPriceRaw) {
      setXauUsdPrice(Number(xauUsdPriceRaw) / 1e8);
    }
  }, [ethUsdPriceRaw, xauUsdPriceRaw]);

  console.log("ETH/USD Price: ", ethUsdPrice);
  console.log("XAU/USD Price: ", xauUsdPrice);

  useEffect <
    Event >
    (() => {
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
    },
    [ethAmount, ethUnitType, goldUnitType, ethUsdPrice, xauUsdPrice]);

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

  return (
    <>
      <Header />
      <div className="bg-gray-100 min-h-screen">
        <div className="portfolio-container p-8 w-92/100 m-auto bg-gray-100">
          <h1 className="text-[38px] font-[550] mb-4">Portfolio</h1>
          <div className="flex flex-col justify-center items-center m-auto w-9/10">
            <Image
              className="bg-white shadow-lg mb-4"
              src={AurikaGoldCoin}
              style={imageStyle}
              alt="Aurika Coin"
              priority
            ></Image>
            <div className="grid grid-cols-1 gap-4 max-w-lg w-full mt-6 bg-white p-6 rounded-lg shadow-lg">
              {/* Holdings */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold text-lg">
                  Your Holdings:
                </span>
                <span className="text-lg font-medium ">
                  {quantity < 1000 ? quantity : quantity / 1000}
                  {portfolioValueUnit ? " gm" : " mg"}
                </span>
              </div>

              {/* Invested Value */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold text-lg">
                  Invested Value:
                </span>
                <span className="text-lg font-medium ">
                  {(Number(portfolioValue) / 1e18).toFixed(4)} SepoliaETH
                </span>
              </div>

              {/* Current Value in USD */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold text-lg">
                  Current Value (USD):
                </span>
                <span className="text-lg font-medium ">
                  ${currentValueUSD}
                  {valueChangePercent !== "0" &&
                    !isNaN(Number(valueChangePercent)) && (
                      <span
                        className={`ml-2 ${
                          Number(valueChangePercent) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ({Number(valueChangePercent) >= 0 ? "+" : ""}
                        {valueChangePercent}%)
                      </span>
                    )}
                </span>
              </div>

              {/* Current Value in ETH */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold text-lg">
                  Current Value (ETH):
                </span>
                <span className="text-lg font-medium ">
                  {currentValueETH} SepoliaETH
                  {valueChangePercent !== "0" &&
                    !isNaN(Number(valueChangePercent)) && (
                      <span
                        className={`ml-2 ${
                          Number(valueChangePercent) >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ({Number(valueChangePercent) >= 0 ? "+" : ""}
                        {valueChangePercent}%)
                      </span>
                    )}
                </span>
              </div>

              {/* Net Profit / Loss */}
              <div className="flex justify-between items-center mt-2">
                <span className="text-gray-700 font-semibold text-lg">
                  Net Profit / Loss:
                </span>
                <span className="text-lg font-medium">
                  {(() => {
                    const investedETH = Number(portfolioValue) / 1e18;
                    const currentETH = Number(currentValueETH);
                    const net = currentETH - investedETH;

                    if (isNaN(net)) return "-";

                    const formatted = net.toFixed(4);

                    if (net > 0) {
                      return (
                        <span className="text-green-600">+{formatted} ETH</span>
                      );
                    } else if (net < 0) {
                      return (
                        <span className="text-red-600">{formatted} ETH</span>
                      );
                    } else {
                      return <span className="text-gray-600">0.0000 ETH</span>;
                    }
                  })()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Portfolio;
