import { createPublicClient, createWalletClient, custom, http } from 'viem';
import { sepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: sepolia,
  transport: http('https://eth-sepolia.g.alchemy.com/v2/XGpKRqmXhARxO7iDkxRAY'),
});

export const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(typeof window !== 'undefined' ? window.ethereum : undefined),
});

export const getAccount = async () => {
  if (typeof window !== 'undefined' && window.ethereum) {
    const accounts = await walletClient.requestAddresses();
    return accounts[0] || null;
  }
  return null;
};