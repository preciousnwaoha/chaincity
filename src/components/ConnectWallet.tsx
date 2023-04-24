import React, {useEffect} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { gameActions} from "@/store/game-slice";
import { contractActions } from "@/store/contract-slice"
import {ethers} from 'ethers';

import { PLAYERS_DUM } from '@/utils/dummy-data'
import { LANDS, LAND_SETS } from '@/utils/monopoly-data'



const ConnectWallet = () => {
    const dispatch = useDispatch();
  const contract = useSelector((state: RootState) => state.contract)
    const {currentAccount, provider, tokenContract} = contract;
    const [connecting, setConnecting] = React.useState(false)

    const getBalance = async (_address :string, _signer: ethers.providers.JsonRpcSigner) => {
      let balance = await tokenContract!.connect(_signer!).balanceOf(_address)
      balance = parseFloat(ethers.utils.formatEther(balance))
      
      return balance
     }
  
  const getSignerData = async () => {
      provider!.send("eth_requestAccounts", [])
      const signer = provider!.getSigner()
      return signer
     }
  
  const handleConnectWallet = async () => {
      if (!window.ethereum) {
        alert("Get MetaMask!");
        return;
      }

      setConnecting(true)
  
      /* ------ get signer ------ */
      const signer = await getSignerData()
      console.log({signer})
  
      /* ------ get signer address ------ */
      const address = await signer.getAddress()
      console.log({address})
      
  
      /* ------ get signer balance ------ */
      const balance =  1 // await getBalance(address, signer)
      
      dispatch(contractActions.stageAccount({currentAccount: address, accounts: [address], signer, tokenBalance: balance}))
      
      setConnecting(false)
  
    }


    
    return <Box sx={{
              display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh"
            }}>
                {connecting ?<Typography>Connecting...</Typography> :<Button onClick={handleConnectWallet} >Connect wallet</Button>}
            </Box>
        
}

export default ConnectWallet