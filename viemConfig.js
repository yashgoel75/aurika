import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://eth-sepolia.g.alchemy.com/v2/XGpKRqmXhARxO7iDkxRAY'),
});

let walletClient;

export const getAccount = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    if (!walletClient) {
      walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });
    }
    const accounts = await walletClient.requestAddresses();
    return accounts[0] || null;
  }
  return null;
};

export const getWalletClient = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    if (!walletClient) {
      walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      });
    }
    return walletClient;
  }
  throw new Error('Wallet client not available');
};