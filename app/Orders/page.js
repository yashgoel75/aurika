'use client';

import Header from "../Header/page"

function Portfolio() {
    return (
        <>
            <Header />
            <div className="portfolio-container p-8 bg-gray-100 min-h-screen">
                <h1 className="text-3xl font-bold mb-4">Orders</h1>
                <p className="text-lg mb-2">Your orders are currently empty.</p>
                <p className="text-lg">Start trading to see your orders here.</p>
            </div>
        </>
    )
}

export default Portfolio;