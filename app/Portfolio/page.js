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
    const investedETH = Number(portfolioValue) / 1e18;

    const valueInETH = Number(quantity) / Number(averagePrice);
    setCurrentValueETH(valueInETH.toFixed(6));

    const changePercent = (
      ((valueInETH - investedETH) / investedETH) *
      100
    ).toFixed(2);
    setValueChangePercent(changePercent);
  }
}, [quantity, portfolioValue, averagePrice]);


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

              {/* Current Value in USD
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
              </div> */}

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
      <Footer></Footer>
    </>
  );
}

export default Portfolio;
