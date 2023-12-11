import {
    CHAIN_ID_ACALA,
    CHAIN_ID_KARURA,
    isEVMChain,
  } from "@certusone/wormhole-sdk";
  import {
    CircularProgress,
    makeStyles,
    Typography,
  } from "@material-ui/core";
  import {  useSelector } from "react-redux";
  import useGetIsTransferCompleted from "../../hooks/useGetIsTransferCompleted";
  import useIsWalletReady from "../../hooks/useIsWalletReady";
  import {
    selectTransferTargetChain,
  } from "../../store/selectors";
  import StepDescription from "../StepDescription";
  import RedeemPreview from "./RedeemPreview";
 
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
  