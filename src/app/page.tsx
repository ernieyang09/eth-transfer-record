"use client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { config } from "@/lib/wagmi";

import ETH from "./_components/ETH";

const queryClient = new QueryClient();

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="p-4">
            <div className="mb-5">
              <div className="flex justify-between">
                <div>Token Transfer Record</div>
                <ConnectButton
                  accountStatus={{
                    smallScreen: "avatar",
                    largeScreen: "full",
                  }}
                />
              </div>
            </div>

            <Tabs defaultValue="eth">
              <TabsList>
                <TabsTrigger value="eth">Eth</TabsTrigger>
              </TabsList>
              <TabsContent value="eth">
                <div className="flex flex-col items-center">
                  <div className="w-full max-w-7xl ">
                    <ETH />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  ) : null;
}
