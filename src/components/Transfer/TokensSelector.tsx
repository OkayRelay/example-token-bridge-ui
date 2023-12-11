
import {
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
    TextField,
  } from "@material-ui/core";
  import clsx from "clsx";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {  selectTransferSourceChain, selectTransferSourceParsedTokenAccount, selectTransferTargetChain, selectTransferToken } from "../../store/selectors";
import { setSourceChain, setTargetAddressHex, setTargetAsset, setTargetChain, setTargetParsedTokenAccount, setToken } from "../../store/transferSlice";
import { TOKENS } from "../../utils/consts";
import { Token } from "../../utils/type";
import {
    setSourceParsedTokenAccount as setTransferSourceParsedTokenAccount,
    setSourceWalletAddress as setTransferSourceWalletAddress,
  } from "../../store/transferSlice";
import { useEthereumProvider } from "../../contexts/EthereumProviderContext";
import { createParsedTokenAccount } from "../../hooks/useGetSourceParsedTokenAccounts";
import { ethers } from "ethers";
import useSyncTargetAddress from "../../hooks/useSyncTargetAddress";
import { fetchDataWrapper, receiveDataWrapper } from "../../store/helpers";
import { uint8ArrayToHex } from "@certusone/wormhole-sdk";
import { arrayify, zeroPad } from "ethers/lib/utils";
import { getForeignAsset } from "../../services/okarRelayer";
import useIsWalletReady from "../../hooks/useIsWalletReady";
  const useStyles = makeStyles((theme) => ({
    select: {
      "& .MuiSelect-root": {
        display: "flex",
        alignItems: "center",
      },
    },
    listItemIcon: {
      minWidth: 40,
    },
    icon: {
      height: 24,
      maxWidth: 24,
    },
  }));
  
  const createChainMenuItem = ({ id, name, icon }: Token, classes: any) => (
    <MenuItem key={id} value={id}>
      <ListItemIcon className={classes.listItemIcon}>
        <img src={icon} alt={name} className={classes.icon} />
      </ListItemIcon>
      <ListItemText>{name}</ListItemText>
    </MenuItem>
  );
  
  interface TokenSelectProps {
   
  }
  
  export default function TokenSelect(props: TokenSelectProps) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const token = useSelector(selectTransferToken);
    const {provider, signerAddress} = useEthereumProvider()
    const sourceChain = useSelector(selectTransferSourceChain);
    const sourceParsedTokenAccount = useSelector(selectTransferSourceParsedTokenAccount);
    const targetChain = useSelector(selectTransferTargetChain);
    const handleTokenChange = useCallback(
        (event: any) => {
            const t = event.target.value
            const tokenInfo = TOKENS[t]
          dispatch(setToken(t));
          dispatch(setSourceChain(tokenInfo.sources[0]));
          dispatch(setTargetChain(tokenInfo.targets[0]));

        },
        [dispatch]
      );

      const walletIsReady = useIsWalletReady(sourceChain);
      const setSourceParsedTokenAccount = setTransferSourceParsedTokenAccount;
      const setSourceWalletAddress = setTransferSourceWalletAddress;
      useSyncTargetAddress(false);
      useEffect(() => {
        const tokenInfo = TOKENS[token].addresses[sourceChain]
        if (provider && walletIsReady.walletAddress && tokenInfo) {
                    dispatch(setTargetAsset(fetchDataWrapper()));
                    walletIsReady.walletAddress &&  getForeignAsset(sourceChain, tokenInfo.testnet, targetChain, walletIsReady.walletAddress).then((address) => {
                        walletIsReady.walletAddress && dispatch(setTargetParsedTokenAccount(
                            // TODO: verify accuracy
                             createParsedTokenAccount(
                                walletIsReady.walletAddress,
                                address,
                                "", //amount, in wei
                      tokenInfo.decimals, //Luckily both ETH and WETH have 18 decimals, so this should not be an issue.
                      parseFloat("0.1"), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
                      "0", //This is the actual display field, which has full precision.
                      TOKENS[token].id, //A white lie for display purposes
                      TOKENS[token].name, //A white lie for display purposes
                      TOKENS[token].icon,
                      true 
                            )
                          ))
                        dispatch(setTargetAsset(
                            receiveDataWrapper({
                              doesExist: true,
                              address: address,
                            })
                          ))
                          walletIsReady.walletAddress && dispatch(
                            setTargetAddressHex(
                              uint8ArrayToHex(zeroPad(arrayify(walletIsReady.walletAddress), 32))
                            )
                          );
                    })
            

          }
    },[
        dispatch,
        provider,
        token,
        targetChain,
        walletIsReady,
        sourceParsedTokenAccount,
        sourceChain,
    ])
    useEffect(() => {
        dispatch(setSourceWalletAddress(walletIsReady.walletAddress));
        if (provider && walletIsReady.walletAddress) {
            const tokenInfo = TOKENS[token].addresses[sourceChain]
            provider.getBalance(walletIsReady.walletAddress).then((balanceInWei)=> {
                const balanceInEth = ethers.utils.formatEther(balanceInWei);
                walletIsReady.walletAddress &&  dispatch(setSourceParsedTokenAccount(createParsedTokenAccount(
                    walletIsReady.walletAddress,
                    tokenInfo.testnet,
                    balanceInWei.toString(), //amount, in wei
          tokenInfo.decimals, //Luckily both ETH and WETH have 18 decimals, so this should not be an issue.
          parseFloat(balanceInEth), //This loses precision, but is a limitation of the current datamodel. This field is essentially deprecated
          balanceInEth.toString(), //This is the actual display field, which has full precision.
          TOKENS[token].id, //A white lie for display purposes
          TOKENS[token].name, //A white lie for display purposes
          TOKENS[token].icon,
          true 
                    )));
                  
                    
            })
            

          }
    },[
        dispatch,
        provider,
        token,
        walletIsReady,
        sourceChain,
        setSourceParsedTokenAccount,
        setSourceWalletAddress,
    ])
    return (
      <TextField select fullWidth variant="outlined" value={token} onChange={handleTokenChange} className={clsx(classes.select)}>
        {Object.keys(TOKENS).map((key) => createChainMenuItem(TOKENS[key], classes))}
      </TextField>
    );
  }
  