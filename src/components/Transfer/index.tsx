import { ChainId } from "@certusone/wormhole-sdk";
import {
  Container,
  Step,
  StepButton,
  StepContent,
  Stepper,
} from "@material-ui/core";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import useCheckIfWormholeWrapped from "../../hooks/useCheckIfWormholeWrapped";
import useFetchTargetAsset from "../../hooks/useFetchTargetAsset";
import {
  selectTransferActiveStep,
  selectTransferIsRedeemComplete,
  selectTransferIsRedeeming,
  selectTransferIsSendComplete,
  selectTransferIsSending,
} from "../../store/selectors";
import {
  setSourceChain,
  setStep,
  setTargetChain,
} from "../../store/transferSlice";
import { CHAINS_BY_ID } from "../../utils/consts";
import Redeem from "./Redeem";
import RedeemPreview from "./RedeemPreview";
import Send from "./Send";
import Main from "./Main";
import SendPreview from "./SendPreview";
import Source from "./Source";
import SourcePreview from "./SourcePreview";
import Target from "./Target";
import TargetPreview from "./TargetPreview";
import TokenSelect from "./TokensSelector";

function Transfer() {
  useCheckIfWormholeWrapped();
  //useFetchTargetAsset();
  const dispatch = useDispatch();
  const activeStep = useSelector(selectTransferActiveStep);
  const isSending = useSelector(selectTransferIsSending);
  const isSendComplete = useSelector(selectTransferIsSendComplete);
  const isRedeeming = useSelector(selectTransferIsRedeeming);
  const isRedeemComplete = useSelector(selectTransferIsRedeemComplete);
  const preventNavigation =
    (isSending || isSendComplete || isRedeeming) && !isRedeemComplete;

  const { search } = useLocation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const pathSourceChain = query.get("sourceChain");
  const pathTargetChain = query.get("targetChain");

  //This effect initializes the state based on the path params
  useEffect(() => {
    if (!pathSourceChain && !pathTargetChain) {
      return;
    }
    try {
      const sourceChain: ChainId =
        CHAINS_BY_ID[parseFloat(pathSourceChain || "") as ChainId]?.id;
      const targetChain: ChainId =
        CHAINS_BY_ID[parseFloat(pathTargetChain || "") as ChainId]?.id;

      if (sourceChain === targetChain) {
        return;
      }
      if (sourceChain) {
        dispatch(setSourceChain(sourceChain));
      }
      if (targetChain) {
        dispatch(setTargetChain(targetChain));
      }
    } catch (e) {
      console.error("Invalid path params specified.");
    }
  }, [pathSourceChain, pathTargetChain, dispatch]);

  useEffect(() => {
    if (preventNavigation) {
      window.onbeforeunload = () => true;
      return () => {
        window.onbeforeunload = null;
      };
    }
  }, [preventNavigation]);
  return (
    <Container maxWidth="md">
      <TokenSelect />
      <Main />
    </Container>
  );
}

export default Transfer;
