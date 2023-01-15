import {
    CHAIN_ID_ACALA,
    CHAIN_ID_AURORA,
    CHAIN_ID_AVAX,
    CHAIN_ID_BSC,
    CHAIN_ID_ETH,
    CHAIN_ID_FANTOM,
    CHAIN_ID_KARURA,
    CHAIN_ID_KLAYTN,
    CHAIN_ID_NEON,
    CHAIN_ID_OASIS,
    CHAIN_ID_POLYGON,
    CHAIN_ID_SOLANA,
    isEVMChain,
    WSOL_ADDRESS,
  } from "@certusone/wormhole-sdk";
  import {
    Button,
    CircularProgress,
    makeStyles,
    Typography,
  } from "@material-ui/core";
  import { useCallback, useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import useGetIsTransferCompleted from "../../hooks/useGetIsTransferCompleted";
  import { useHandleRedeem } from "../../hooks/useHandleRedeem";
  import useIsWalletReady from "../../hooks/useIsWalletReady";
  import {
    selectTransferIsRecovery,
    selectTransferTargetAsset,
    selectTransferTargetChain,
    selectTransferUseRelayer,
  } from "../../store/selectors";
  import { reset } from "../../store/transferSlice";
  import {
    getHowToAddTokensToWalletUrl,
    WAVAX_ADDRESS,
    WBNB_ADDRESS,
    WETH_ADDRESS,
    WETH_AURORA_ADDRESS,
    WFTM_ADDRESS,
    WKLAY_ADDRESS,
    WMATIC_ADDRESS,
    WNEON_ADDRESS,
    WROSE_ADDRESS,
  } from "../../utils/consts";
  import ButtonWithLoader from "../ButtonWithLoader";
  import KeyAndBalance from "../KeyAndBalance";
  import SmartAddress from "../SmartAddress";
  import { SolanaCreateAssociatedAddressAlternate } from "../SolanaCreateAssociatedAddress";
  import StepDescription from "../StepDescription";
  import TerraFeeDenomPicker from "../TerraFeeDenomPicker";
  import AddToMetamask from "./AddToMetamask";
  import RedeemPreview from "./RedeemPreview";
  import WaitingForWalletMessage from "./WaitingForWalletMessage";
  
  const useStyles = makeStyles((theme) => ({
    alert: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    centered: {
      margin: theme.spacing(4, 0, 2),
      textAlign: "center",
    },
  }));
  
  function Redeem() {
    const useRelayer = useSelector(selectTransferUseRelayer);
    const targetChain = useSelector(selectTransferTargetChain);
    const targetIsAcala =
      targetChain === CHAIN_ID_ACALA || targetChain === CHAIN_ID_KARURA;
    const {  isTransferCompleted } =
      useGetIsTransferCompleted(
        false,
        5000
      );
    const classes = useStyles();
    const { isReady } = useIsWalletReady(targetChain);
    //TODO better check, probably involving a hook & the VAA
  
    const relayerContent = (
      <>
        {!isReady &&
        isEVMChain(targetChain) &&
        !isTransferCompleted &&
        !targetIsAcala ? (
          <Typography className={classes.centered}>
            {"Please connect your wallet to check for transfer completion."}
          </Typography>
        ) : null}
  
        {(!isEVMChain(targetChain) || isReady) &&
        !isTransferCompleted &&
        !targetIsAcala ? (
          <div className={classes.centered}>
            <CircularProgress style={{ marginBottom: 16 }} />
            <Typography>
              {"Waiting for a relayer to process your transfer."}
            </Typography>
          </div>
        ) : null}
  
        {/* TODO: handle recovery */}
  
        {isTransferCompleted ? (
          <RedeemPreview overrideExplainerString="Success! Your transfer is complete." />
        ) : null}
      </>
    );
  
  
    return (
      <>
        <StepDescription>Receive the tokens on the target chain</StepDescription>
        {relayerContent}
      </>
    );
  }
  
  export default Redeem;
  