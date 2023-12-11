import {
    CHAIN_ID_ACALA,
    CHAIN_ID_KARURA,
    CHAIN_ID_TERRA,
    hexToNativeAssetString,
    isEVMChain,
    isTerraChain,
  } from "@certusone/wormhole-sdk";
  import {
    Card,
    Checkbox,
    Chip,
    makeStyles,
    Typography,
  } from "@material-ui/core";
  import clsx from "clsx";
  import { parseUnits } from "ethers/lib/utils";
  import { useCallback, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import SmartAddress from "../../components/SmartAddress";
  import { useAcalaRelayerInfo } from "../../hooks/useAcalaRelayerInfo";
  import useRelayerInfo from "../../hooks/useRelayerInfo";
  import {
    selectTransferAmount,
    selectTransferOriginAsset,
    selectTransferOriginChain,
    selectTransferSourceParsedTokenAccount,
    selectTransferTargetChain,
  } from "../../store/selectors";
  import { setRelayerFee, setUseRelayer } from "../../store/transferSlice";
  import { CHAINS_BY_ID, getDefaultNativeCurrencySymbol } from "../../utils/consts";
  
  const useStyles = makeStyles((theme) => ({
    betaLabel: {
      background: "#09146b",
      margin: "0 auto",
      fontSize: "120%",
    },
    root: {
        display: "flex",
      },
  }));
  
  function FeeMethodSelector() {
    const classes = useStyles();
    const originAsset = useSelector(selectTransferOriginAsset);
    const originChain = useSelector(selectTransferOriginChain);
    const targetChain = useSelector(selectTransferTargetChain);
    const transferAmount = useSelector(selectTransferAmount);
    const relayerInfo = useRelayerInfo(originChain, originAsset, targetChain);
    const sourceParsedTokenAccount = useSelector(
      selectTransferSourceParsedTokenAccount
    );
    const sourceDecimals = sourceParsedTokenAccount?.decimals;
    let vaaNormalizedAmount: string | undefined = undefined;
    if (transferAmount && sourceDecimals !== undefined) {
      try {
        vaaNormalizedAmount = parseUnits(
          transferAmount,
          Math.min(sourceDecimals, 8)
        ).toString();
      } catch (e) {}
    }
    const sourceSymbol = sourceParsedTokenAccount?.symbol;
    const acalaRelayerInfo = useAcalaRelayerInfo(
      targetChain,
      vaaNormalizedAmount,
      originChain ? hexToNativeAssetString(originAsset, originChain) : undefined
    );
    const dispatch = useDispatch();

  
    const relayerEligible =
      relayerInfo.data &&
      relayerInfo.data.isRelayable &&
      relayerInfo.data.feeFormatted &&
      relayerInfo.data.feeUsd;
    

  
    const chooseRelayer = useCallback(() => {
      if (relayerEligible) {
        dispatch(setUseRelayer(true));
        dispatch(setRelayerFee(relayerInfo.data?.feeFormatted));
      }
    }, [relayerInfo, dispatch, relayerEligible]);
  
  
    useEffect(() => {
        chooseRelayer();
     
      //If it's undefined / null it's still loading, so no action is taken.
    }, [
      relayerInfo,
      targetChain,
      chooseRelayer,
    ]);
  
    const relayerContent = (
            <div className={classes.root}>
              { sourceSymbol && <Chip label={`Fee: ${parseFloat(relayerInfo.data?.feeFormatted || "0").toFixed(
                    Math.min(sourceParsedTokenAccount?.decimals || 8, 8)
                  )} ${sourceSymbol?.toUpperCase()}`} className={classes.betaLabel} />
              }
            </div>
        
    );
  
    return relayerContent;
  }
  
  export default FeeMethodSelector;
  