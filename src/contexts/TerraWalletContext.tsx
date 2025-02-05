import { NetworkInfo, WalletProvider } from "@terra-money/wallet-provider";
import {  ReactNode } from "react";

const testnet: NetworkInfo = {
  name: "testnet",
  chainID: "pisco-1",
  lcd: "https://pisco-lcd.terra.dev",
  walletconnectID: 0,
};

const walletConnectChainIds: Record<number, NetworkInfo> = {
  0: testnet,
};

export const TerraWalletProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <WalletProvider
      defaultNetwork={testnet}
      walletConnectChainIds={walletConnectChainIds}
    >
      {children}
    </WalletProvider>
  );
};
