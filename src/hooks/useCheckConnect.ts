import { useAccount, useConfig } from "wagmi";

export const useCheckConnect = () => {
  const { isConnected, chainId } = useAccount();
  const { chains } = useConfig();

  return isConnected && chains.some((c) => c.id === chainId);
};
