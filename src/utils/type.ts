import { ChainId } from "@certusone/wormhole-sdk";

export interface TokenAddresses {
    testnet: string
    mainnet: string
    decimals: number
}
export interface Token {
    sources: ChainId[],
    targets: ChainId[],
    icon: string,
    name: string,
    id: string,
    addresses:  Record<number, TokenAddresses>
}