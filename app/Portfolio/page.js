'use client';

import Header from "../Header/page"

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import "./page.css";

function Portfolio() {
    const router = useRouter();
    const account = useAccount();
    
    return (
        <>
            <Header />
            <div className="portfolio-container p-8 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-4">Portfolio</h1>
                <p className="text-lg mb-2">Your portfolio is currently empty.</p>
                <p className="text-lg">Start trading to see your portfolio here.</p>
            </div>
        </>
    )
}

export default Portfolio;