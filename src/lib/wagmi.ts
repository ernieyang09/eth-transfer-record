import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { scroll, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT!,
  chains: [scroll, sepolia],
  transports: {
    [scroll.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: false,
});
