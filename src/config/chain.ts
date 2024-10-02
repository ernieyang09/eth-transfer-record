import { scroll, scrollSepolia } from "wagmi/chains";

type ChainConfig = {
  explorer: string;
  txViewer?: (txId: string) => string;
};

const chainConfig: { [chainId: number]: ChainConfig } = {
  [scroll.id]: {
    explorer: "https://scrollscan.com",
  },
  [scrollSepolia.id]: {
    explorer: "https://sepolia.scrollscan.com",
  },
};

chainConfig[scroll.id].txViewer = (txId: string) =>
  `${chainConfig[scroll.id].explorer}/tx/${txId}`;

chainConfig[scrollSepolia.id].txViewer = (txId: string) =>
  `${chainConfig[scrollSepolia.id].explorer}/tx/${txId}`;

export default chainConfig;
