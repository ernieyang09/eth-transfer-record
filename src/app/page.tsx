"use client";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { WagmiProvider } from "wagmi";

import { Card } from "@/components/ui/card";
import { config } from "@/lib/wagmi";

import TransferForm from "./_components/TransferForm";
import TransferList from "./_components/TransferList";

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

            <div className="flex flex-col items-center">
              <div className="w-full max-w-7xl ">
                <div className="mb-5">
                  <div className="text-lg font-bold mb-2">Transform Form</div>
                  <Card className="p-2">
                    <TransferForm />
                  </Card>
                </div>

                <div>
                  <div className="text-lg font-bold mb-2">Transform Record</div>
                  <Card className="px-2 py-4">
                    <TransferList />
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  ) : null;
}
