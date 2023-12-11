import { ChainId } from "@certusone/wormhole-sdk";
import axios from "axios";

export async function getForeignAsset(originChain: ChainId, originAddress: string, targetChain: ChainId, targetAddress: string): Promise<string> {

    const res = await axios.get<{address: string}>(`${import.meta.env.VITE_APP_OKAY_RELAY_URL}/foreign-asset`, {
        params: {
            originChain,
            originAddress,
            targetChain,
            targetAddress,
        }
    })
    return res.data.address
}