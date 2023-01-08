import { ChainId } from "@certusone/wormhole-sdk";
import { Dispatch } from "@reduxjs/toolkit";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataWrapper } from "../store/helpers";
import { selectRelayerTokenInfo } from "../store/selectors";
import {
  errorRelayerTokenInfo,
  fetchRelayerTokenInfo,
  receiveRelayerTokenInfo,
} from "../store/tokenSlice";
import { RELAYER_INFO_URL } from "../utils/consts";

export type RelayToken = {
  chainId?: ChainId;
  address?: string;
  coingeckoId?: string;
};
export type Relayer = {
  name?: string;
  url?: string;
};
export type FeeScheduleEntryFlat = {
  type: "flat";
  feeUsd: number;
};
export type FeeScheduleEntryPercent = {
  type: "percent";
  feePercent: number;
  gasEstimate: number;
};
export type FeeSchedule = {
  // ChainId as a string
  [key: string]: FeeScheduleEntryFlat | FeeScheduleEntryPercent;
};
export type RelayerTokenInfo = {
  supportedTokens?: RelayToken[];
  relayers?: Relayer[];
  feeSchedule?: FeeSchedule;
};

const useRelayersAvailable = (
  shouldFire: boolean
): DataWrapper<RelayerTokenInfo> => {
  const relayerTokenInfo = useSelector(selectRelayerTokenInfo);
  // console.log("relayerTokenInfo", relayerTokenInfo);
  const dispatch = useDispatch();
  const internalShouldFire =
    shouldFire &&
    (relayerTokenInfo.data === undefined ||
      (relayerTokenInfo.data === null && !relayerTokenInfo.isFetching));

  useEffect(() => {
    if (internalShouldFire) {
      getRelayersAvailable(dispatch);
    }
  }, [internalShouldFire, dispatch]);

  return relayerTokenInfo;
};

const getRelayersAvailable = (dispatch: Dispatch) => {
  dispatch(fetchRelayerTokenInfo());
  dispatch(receiveRelayerTokenInfo({
    "supportedTokens": [
      {
        "chainId": 1,
        "address": "So11111111111111111111111111111111111111112",
        "coingeckoId": "solana"
      },
      {
        "chainId": 2,
        "address": "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
        "coingeckoId": "ethereum"
      },
      {
        "chainId": 2,
        "address": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        "coingeckoId": "usd-coin"
      },
      {
        "chainId": 2,
        "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
        "coingeckoId": "tether"
      },
      {
        "chainId": 2,
        "address": "0xD533a949740bb3306d119CC777fa900bA034cd52",
        "coingeckoId": "curve-dao-token"
      },
      {
        "chainId": 3,
        "address": "uluna",
        "coingeckoId": "terra-luna"
      },
      {
        "chainId": 3,
        "address": "uusd",
        "coingeckoId": "terrausd"
      },
      {
        "chainId": 4,
        "address": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
        "coingeckoId": "binancecoin"
      },
      {
        "chainId": 5,
        "address": "0x9c3c9283d3e44854697cd22d3faa240cfb032889",
        "coingeckoId": "matic-network"
      },
      {
        "chainId": 6,
        "address": "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
        "coingeckoId": "avalanche-2"
      },
      {
        "chainId": 7,
        "address": "0x21C718C22D52d0F3a789b752D4c2fD5908a8A733",
        "coingeckoId": "oasis-network"
      },
      {
        "chainId": 10,
        "address": "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83",
        "coingeckoId": "fantom"
      },
      {
        "chainId": 13,
        "address": "0xe4f05a66ec68b54a58b17c22107b02e0232cc817",
        "coingeckoId": "klay-token"
      },
      {
        "chainId": 14,
        "address": "0x471ece3750da237f93b8e339c536989b8978a438",
        "coingeckoId": "celo"
      },
      {
        "chainId": 15,
        "address": "near",
        "coingeckoId": "near"
      }
    ],
    "relayers": [
      {
        "name": "Okay Relayer",
        "url": "https://wormhole-v2-mainnet-relayer.certus.one"
      }
    ],
    "feeSchedule": {
      "1": {
        "type": "flat",
        "feeUsd": 2
      },
      "2": {
        "type": "percent",
        "feePercent": 1.25,
        "gasEstimate": 280000
      },
      "3": {
        "type": "flat",
        "feeUsd": 2
      },
      "4": {
        "type": "flat",
        "feeUsd": 2
      },
      "5": {
        "type": "flat",
        "feeUsd": 0.5
      },
      "6": {
        "type": "flat",
        "feeUsd": 2
      },
      "7": {
        "type": "flat",
        "feeUsd": 0.5
      },
      "9": {
        "type": "flat",
        "feeUsd": 0.5
      },
      "10": {
        "type": "flat",
        "feeUsd": 0.5
      },
      "13": {
        "type": "flat",
        "feeUsd": 0.5
      },
      "14": {
        "type": "flat",
        "feeUsd": 0.5
      }
    }
  }));
  // axios.get(RELAYER_INFO_URL).then(
  //   (response) => {
  //     dispatch(receiveRelayerTokenInfo(response.data as RelayerTokenInfo));
  //   },
  //   (error) => {
  //     dispatch(
  //       errorRelayerTokenInfo("Failed to retrieve the relayer token info.")
  //     );
  //   }
  // );
};

export default useRelayersAvailable;
