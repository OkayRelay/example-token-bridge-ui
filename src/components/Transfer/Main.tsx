import { makeStyles, Typography } from "@material-ui/core";
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import useIsWalletReady from "../../hooks/useIsWalletReady";
import {
  selectTransferAmount,
  selectTransferIsSendComplete,
  selectTransferShouldLockFields,
  selectTransferSourceBalanceString,
  selectTransferSourceChain,
  selectTransferSourceParsedTokenAccount,
  selectTransferTargetChain,
  selectTransferToken,
} from "../../store/selectors";
import {
  setAmount,
  setSourceChain,
  setTargetChain,
} from "../../store/transferSlice";
import {  CHAIN_ID_TO_INFO,  TOKENS } from "../../utils/consts";
import ChainSelect from "../ChainSelect";
import ChainSelectArrow from "../ChainSelectArrow";
import KeyAndBalance from "../KeyAndBalance";
import LowBalanceWarning from "../LowBalanceWarning";
import NumberTextField from "../NumberTextField";
import { TokenSelector } from "../TokenSelectors/SourceTokenSelector";
import SourceAssetWarning from "./SourceAssetWarning";
import ChainWarningMessage from "../ChainWarningMessage";
import useIsTransferLimited from "../../hooks/useIsTransferLimited";
import TransferLimitedWarning from "./TransferLimitedWarning";
import SendFooter from "./SendFooter";
import ReceiveFooter from "./ReceiveFooter";
import Fee from "./Fee";

const useStyles = makeStyles((theme) => ({
  chainSelectWrapper: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },
  chainSelectContainer: {
    flexBasis: "100%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  chainSelectArrow: {
    position: "relative",
    top: "12px",
    [theme.breakpoints.down("sm")]: { transform: "rotate(90deg)" },
  },
  transferField: {
    marginTop: theme.spacing(5),
  },
}));

function Source() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const sourceChain = useSelector(selectTransferSourceChain);
  const targetChain = useSelector(selectTransferTargetChain);
  const tranfertToken = useSelector(selectTransferToken);
  const targetChainOptions = useMemo(
    () => TOKENS[tranfertToken].targets.map((id) => CHAIN_ID_TO_INFO[id]),
    [tranfertToken]
  );
  const sourceChainOptions = useMemo(
    () => TOKENS[tranfertToken].sources.map((id) => CHAIN_ID_TO_INFO[id]),
    [tranfertToken]
  );
  const parsedTokenAccount = useSelector(
    selectTransferSourceParsedTokenAccount
  );
  const hasParsedTokenAccount = !!parsedTokenAccount;
  const uiAmountString = useSelector(selectTransferSourceBalanceString);
  const amount = useSelector(selectTransferAmount);
  const shouldLockFields = useSelector(selectTransferShouldLockFields);
  const { isReady } = useIsWalletReady(sourceChain);
  const isTransferLimited = useIsTransferLimited();
  const isSendComplete = useSelector(selectTransferIsSendComplete);
  const handleSourceChange = useCallback(
    (event: any) => {
      dispatch(setSourceChain(event.target.value));
    },
    [dispatch]
  );
  const handleTargetChange = useCallback(
    (event: any) => {
      dispatch(setTargetChain(event.target.value));
    },
    [dispatch]
  );
  const handleAmountChange = useCallback(
    (event: any) => {
      dispatch(setAmount(event.target.value));
    },
    [dispatch]
  );
  const handleMaxClick = useCallback(() => {
    if (uiAmountString) {
      dispatch(setAmount(uiAmountString));
    }
  }, [dispatch, uiAmountString]);
  return (
    <>
      <div
        className={classes.chainSelectWrapper}
        style={{ marginBottom: "25px" }}
      >
        <div className={classes.chainSelectContainer}>
          <Typography variant="caption">Source</Typography>
          <ChainSelect
            select
            variant="outlined"
            fullWidth
            value={sourceChain}
            onChange={handleSourceChange}
            disabled={shouldLockFields}
            chains={sourceChainOptions}
          />
        </div>
        <div className={classes.chainSelectArrow}>
          <ChainSelectArrow
            onClick={() => {
              dispatch(setSourceChain(targetChain));
            }}
            disabled={shouldLockFields}
          />
        </div>
        <div className={classes.chainSelectContainer}>
          <Typography variant="caption">Target</Typography>
          <ChainSelect
            variant="outlined"
            select
            fullWidth
            value={targetChain}
            onChange={handleTargetChange}
            disabled={shouldLockFields}
            chains={targetChainOptions}
          />
        </div>
      </div>
      <Fee />
      <KeyAndBalance chainId={sourceChain} />
      {isReady || uiAmountString ? (
        <div className={classes.transferField}>
          <TokenSelector disabled={true} />
        </div>
      ) : null}
      <LowBalanceWarning chainId={sourceChain} />
      <SourceAssetWarning
        sourceChain={sourceChain}
        sourceAsset={parsedTokenAccount?.mintKey}
      />
      {hasParsedTokenAccount ? (
        <NumberTextField
          variant="outlined"
          label="Amount"
          fullWidth
          className={classes.transferField}
          value={amount}
          onChange={handleAmountChange}
          disabled={shouldLockFields}
          onMaxClick={
            uiAmountString && !parsedTokenAccount.isNativeAsset
              ? handleMaxClick
              : undefined
          }
        />
      ) : null}
      <ChainWarningMessage chainId={sourceChain} />
      <ChainWarningMessage chainId={targetChain} />
      <TransferLimitedWarning isTransferLimited={isTransferLimited} />
      {isSendComplete ? <ReceiveFooter /> : <SendFooter /> }
    </>
  );
}

export default Source;
