'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
    base,
  sepolia
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";


const config = getDefaultConfig({
  appName: 'aurika',
  projectId: 'e7f8475b88d34bc3216a4222b61d2c43',
  chains: [sepolia],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

export default config;