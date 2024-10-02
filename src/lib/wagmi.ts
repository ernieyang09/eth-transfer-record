import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "wagmi";
import { scroll, scrollSepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT!,
  chains: [scroll, scrollSepolia],
  transports: {
    [scroll.id]: http(),
    [scrollSepolia.id]: http(),
  },
  ssr: false,
});
