"use client";

import Header from "../Header/page";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import "./page.css";
import Image from "next/image";
import AurikaGoldCoin from "@/public/AurikaGoldCoin.png";
import Footer from "../Footer/page";
import { aurikaAbi } from "../constants/aurikaAbi";
import { useContractRead } from "wagmi";
import { useTheme } from "../context/ThemeContext";

import { parseUnits } from "ethers";
import { getPriceAbi } from "../constants/getPriceAbi";
import { BigNumber, isBigNumber, formatUnits } from "ethers";

function Portfolio() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const account = useAccount();
  const { address, isConnected } = useAccount();

  const imageStyle = {
    borderRadius: "50%",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
    width: "175px",
    height: "auto",
  };

  const AURIKA_ADDRESS = "0x23db61d27894e33657ec690d7447d7c13219aa8a";

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

  const { data: averagePrice } = useContractRead({
    address: AURIKA_ADDRESS,
    abi: aurikaAbi,
    functionName: "getAveragePrice",
  });

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

  // Calculate current portfolio value in USD and ETH
  useEffect(() => {
    if (quantity && averagePrice) {
      try {
        const quantityInMicrograms = Number(quantity) * 1000; // quantity in µg
        const avgPrice = Number(averagePrice); // µg per 1 ETH

        if (avgPrice === 0) return; // avoid divide by zero

        const valueInETH = quantityInMicrograms / avgPrice; // ETH = µg / (µg per ETH)
        setCurrentValueETH(valueInETH.toFixed(6));

        const investedETH = Number(portfolioValue) / 1e18;
        const changePercent = (
          ((valueInETH - investedETH) / investedETH) *
          100
        ).toFixed(2);

        setValueChangePercent(changePercent);
      } catch (error) {
        console.error("Error calculating ETH value:", error);
      }
    }
  }, [quantity, portfolioValue, averagePrice]);

  return (
    <>
      <Header />
      <div
        className={`${theme === "light" ? "bg-gray-50 text-gray-700" : "bg-gray-800 text-gray-300"} min-h-screen`}
      >
        <div
          className={`portfolio-container p-8 w-full md:w-92/100 m-auto ${theme === "light" ? "bg-gray-50 text-gray-700" : "bg-gray-800 text-gray-300"}`}
        >
          <h1 className="text-[38px] font-[550] mb-4">Portfolio</h1>
          <div className="horizontalRule"></div>
          <div className="flex flex-col justify-center items-center m-auto w-full md:7/10 lg:w-6/10">
            <Image
              className="bg-white shadow-lg m-4"
              src={AurikaGoldCoin}
              style={imageStyle}
              alt="Aurika Coin"
              priority
            ></Image>
            <div
              className={`grid grid-cols-1 gap-4 w-full mt-6 ${theme === "light" ? "bg-white text-gray-700" : "bg-gray-700 text-gray-300"} p-6 rounded-lg shadow-lg`}
            >
              <div
                className={`grid grid-cols-1 gap-4 mt-6 ${
                  theme === "light"
                    ? "bg-white text-gray-700"
                    : "bg-gray-700 text-gray-300"
                } p-4 sm:p-6 rounded-lg shadow-lg`}
              >
                {/* Holdings */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="font-semibold text-lg sm:text-lg">
                    Your Holdings:
                  </span>
                  <span className="text-lg sm:text-lg font-medium">
                    {quantity < 1000
                      ? Number(quantity).toFixed(2)
                      : Number(quantity / 1000).toFixed(3)}
                    {portfolioValueUnit ? " gm" : " mg"}
                  </span>
                </div>

                {/* Invested Value */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="font-semibold text-lg sm:text-lg">
                    Invested Value:
                  </span>
                  <span className="text-lg sm:text-lg font-medium">
                    {(Number(portfolioValue) / 1e18).toFixed(4)} SepoliaETH
                  </span>
                </div>

                {/* Current Value */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-0">
                  <span className="font-semibold text-lg sm:text-lg">
                    Current Value (ETH):
                  </span>
                  <span className="text-lg sm:text-lg font-medium">
                    {Number(currentValueETH).toFixed(4)} SepoliaETH
                    {valueChangePercent !== "0" &&
                      !isNaN(Number(valueChangePercent)) && (
                        <span
                          className={`ml-1 ${
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
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 sm:gap-0 mt-1">
                  <span className="font-semibold text-lg sm:text-lg">
                    Net Profit / Loss:
                  </span>
                  <span className="text-lg sm:text-lg font-medium">
                    {(() => {
                      const investedETH = Number(portfolioValue) / 1e18;
                      const currentETH = Number(currentValueETH);
                      const net = currentETH - investedETH;

                      if (isNaN(net)) return "-";

                      const formatted = net.toFixed(4);

                      if (net > 0) {
                        return (
                          <span className="text-green-600">
                            +{formatted} ETH
                          </span>
                        );
                      } else if (net < 0) {
                        return (
                          <span className="text-red-600">{formatted} ETH</span>
                        );
                      } else {
                        return (
                          <span className="text-gray-600">0.0000 ETH</span>
                        );
                      }
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </>
  );
}

export default Portfolio;
